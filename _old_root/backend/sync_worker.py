#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sync Worker - Standalone Supabase Sync Script
Leest Gmail, extraheert Funda listings, en schrijft naar Supabase
"""

import sys
import os
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
from urllib.parse import urlparse
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Import dependencies
try:
    from dotenv import load_dotenv
    from brikx.gmail_client import GmailClient
    from brikx.perplexity_client import PerplexityClient
    import requests
    from bs4 import BeautifulSoup
except ImportError as e:
    logger.error(f"Missing dependency: {e}")
    logger.error("Run: pip install -r requirements.txt")
    sys.exit(1)

# Load environment variables
env_path = backend_dir.parent / '.env'
load_dotenv(env_path)

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("❌ SUPABASE_URL en SUPABASE_KEY moeten ingesteld zijn in .env")
    sys.exit(1)

# Gmail configuration
GMAIL_CREDENTIALS = str(backend_dir / 'secrets' / 'credentials.json')
GMAIL_TOKEN = str(backend_dir / 'secrets' / 'token.json')
GMAIL_QUERY = 'from:notificaties@service.funda.nl subject:"zoekopdracht" newer_than:21d -label:Brikx/Verwerkt'

# Initialize clients (will be initialized in main function)
supabase = None
perplexity_client = None


import hashlib

def extract_listing_id(url: str) -> str:
    """Extract ID from URL (Funda ID or Hash for others)"""
    # Try Funda ID first
    match = re.search(r'/(\d{8})/?', url)
    if match:
        return match.group(1)
    
    # Fallback: Generate 8-digit hash from URL for other sites
    # This ensures the same URL always gets the same ID
    hash_object = hashlib.md5(url.encode())
    # Take first 8 digits of integer representation
    return str(int(hash_object.hexdigest(), 16))[:8]


def scrape_listing_details(url: str) -> Dict[str, Any]:
    """
    DISABLED: Direct scraping to prevent IP blocking.
    Now only returns basic structure, relying on Perplexity for actual data.
    """
    return {
        'source_url': url,
        'adres': None,
        'postcode': None,
        'plaats': None,
        'provincie': None,
        'prijs': None,
        'oppervlakte': None,
        'image_url': None, # We will use the generated map instead
        'lat': None,
        'lon': None,
        'description': ''
    }

    # OUDE SCRAPE LOGICA HIERONDER UITGESCHAKELD
    # try:
    #     headers = { ... }
    #     response = requests.get(url, headers=headers, timeout=10)
    #     ...


def listing_exists(funda_id: str) -> bool:
    """Check if listing already exists in Supabase"""
    try:
        result = supabase.table('listings').select('kavel_id').eq('funda_id', funda_id).execute()
        return len(result.data) > 0
    except Exception as e:
        logger.error(f"Error checking if listing exists: {e}")
        return False


def insert_listing(listing_data: Dict[str, Any]) -> bool:
    """Insert listing into Supabase"""
    try:
        result = supabase.table('listings').insert(listing_data).execute()
        return True
    except Exception as e:
        logger.error(f"Error inserting listing: {e}")
        return False


def process_single_listing(url: str, listing_info: Dict[str, Any] = None) -> bool:
    """Process a single listing URL"""
    global perplexity_client
    
    # Clean URL (remove query parameters like utm_source)
    if '?' in url:
        url = url.split('?')[0]
    
    if not listing_info:
        listing_info = {}
        
    # Extract Listing ID
    funda_id = extract_listing_id(url)
    if not funda_id:
        logger.warning(f"Could not extract ID from {url}")
        return False
    
    # Check if already exists
    if listing_exists(funda_id):
        logger.info(f"Listing {funda_id} already exists, skipping")
        return False
    
    # Scraping is disabled to protect IP - all data comes from Perplexity
    scraped_details = {
        'source_url': url,
        'adres': None,
        'postcode': None,
        'plaats': None,
        'provincie': None,
        'prijs': None,
        'oppervlakte': None,
        'image_url': None,
        'lat': None,
        'lon': None,
        'description': ''
    }
    
    # Perplexity Enrichment (PRIMARY data source)
    pplx_data = {}
    if perplexity_client:
        try:
            logger.info(f"Enriching {funda_id} with Perplexity AI...")
            # Pass the scraped description if available to avoid "read more" issues
            description_text = scraped_details.get('description', '')
            pplx_data = perplexity_client.extract_listing(url, description_text)
            logger.info("Perplexity enrichment successful")
            
            # Check if listing is no longer available
            article = (pplx_data.get('article_nl') or '').lower()
            summary = (pplx_data.get('summary_nl') or '').lower()
            title = (pplx_data.get('title') or '').lower()
            
            unavailable_phrases = [
                'niet meer beschikbaar',
                'niet gevonden',
                'pagina niet gevonden',
                'verkocht',
                'verwijderd',
                'offline gehaald',
                'geen resultaten'
            ]
            
            for phrase in unavailable_phrases:
                if phrase in article or phrase in summary or phrase in title:
                    logger.warning(f"⚠️ Listing {funda_id} appears to be unavailable (found: '{phrase}'). Skipping.")
                    # Mark as skipped in database
                    try:
                        supabase.table('listings').insert({
                            'kavel_id': funda_id,
                            'funda_id': funda_id,
                            'status': 'skipped',
                            'source_url': url,
                            'adres': 'Niet beschikbaar',
                            'plaats': 'Onbekend',
                            'provincie': 'Onbekend',
                            'prijs': 0,
                            'oppervlakte': 0,
                            'seo_summary': f'Deze kavel is niet meer beschikbaar ({phrase})',
                            'created_at': datetime.utcnow().isoformat(),
                            'updated_at': datetime.utcnow().isoformat(),
                        }).execute()
                        logger.info(f"Marked {funda_id} as skipped in database")
                    except Exception as e:
                        logger.error(f"Failed to mark as skipped: {e}")
                    
                    return False
            
        except Exception as e:
            logger.error(f"Perplexity enrichment failed: {e}")

    # DATA MERGING PRIORITY: Perplexity > Gmail > Scraped
    # Perplexity is most reliable for complete and accurate data
    
    # PRICE: Perplexity first
    prijs = None
    pplx_price = None
    if pplx_data.get('price'):
        try:
            p_val = pplx_data['price']
            if isinstance(p_val, (int, float)):
                pplx_price = int(p_val)
            else:
                prijs_match = re.search(r'[\d\.]+', str(p_val).replace('.', '').replace(',', '.'))
                if prijs_match:
                    pplx_price = int(float(prijs_match.group(0)))
        except:
            pass
    
    gmail_price = None
    if listing_info.get('price'):
        try:
            price_str = listing_info['price'].replace('€', '').replace('.', '').replace(',', '.').strip()
            gmail_price = int(float(price_str))
        except:
            pass
    
    # Choose best price: Perplexity > Gmail > Scraped
    prijs = pplx_price or gmail_price or scraped_details.get('prijs')

    # SURFACE: Perplexity first
    oppervlakte = None
    pplx_surface = None
    if pplx_data.get('surface'):
        try:
            s_val = pplx_data['surface']
            if isinstance(s_val, (int, float)):
                pplx_surface = int(s_val)
            else:
                # Handle "1.839 m²" -> 1839
                # Remove dots (thousands separator) and non-digits
                clean_val = str(s_val).replace('.', '')
                opp_match = re.search(r'\d+', clean_val)
                if opp_match:
                    pplx_surface = int(opp_match.group(0))
        except:
            pass
    
    gmail_surface = None
    if listing_info.get('surface'):
        try:
            # Handle "1.839 m²" -> 1839
            clean_val = listing_info['surface'].replace('.', '')
            surf_match = re.search(r'\d+', clean_val)
            if surf_match:
                gmail_surface = int(surf_match.group(0))
        except:
            pass
    
    # Choose best surface: Perplexity > Gmail > Scraped
    oppervlakte = pplx_surface or gmail_surface or scraped_details.get('oppervlakte')

    # PLACE: Gmail first
    plaats = listing_info.get('place') or scraped_details.get('plaats') or pplx_data.get('place')
    
    # ADDRESS: Scraped or Perplexity (Gmail doesn't have this)
    adres = scraped_details.get('adres')
    
    # Check validity of scraped address
    is_scraped_addr_bad = not adres or adres.strip().startswith(',') or (plaats and plaats.lower() in (adres or '').lower() and len(adres or '') < len(plaats) + 10)
    
    if is_scraped_addr_bad:
        logger.info(f"Scraped address '{adres}' seems invalid. Trying Perplexity...")
        # Address is incomplete, try Perplexity
        if pplx_data.get('street'):
            adres = f"{pplx_data.get('street')} {pplx_data.get('house_number', '')}".strip()
        elif pplx_data.get('address'):
            adres = pplx_data['address']
        elif pplx_data.get('title') and plaats:
            # Fallback: try to extract from title if it looks like an address
            title = pplx_data['title']
            if plaats.lower() in title.lower():
                adres = title.replace(plaats, '').strip().strip(',').strip('-').strip()
    
    if not adres:
        logger.warning(f"⚠️ No address found for {funda_id}. Map generation will fail.")
    
    # POSTCODE & PROVINCIE: Scraped or Perplexity
    postcode = scraped_details.get('postcode') or pplx_data.get('postal_code')
    provincie = scraped_details.get('provincie') or pplx_data.get('province')

    # MAP GENERATION
    map_url = None
    lat = scraped_details.get('lat')
    lon = scraped_details.get('lon')
    
    # If no coords, try geocoding the address
    if not lat or not lon:
        if adres and plaats:
            try:
                from brikx.map_fetcher import geocode_address
                geo_addr = f"{adres}, {plaats}"
                coords = geocode_address(geo_addr)
                if coords:
                    lat, lon = coords
                    logger.info(f"Geocoded '{geo_addr}' to ({lat}, {lon})")
            except Exception as e:
                logger.error(f"Geocoding failed: {e}")

    if lat and lon:
        try:
            from brikx.map_fetcher import download_static_map
            map_filename = f"{funda_id}.png"
            map_path = os.path.join("public", "maps", map_filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(map_path), exist_ok=True)
            
            saved_path = download_static_map(lat, lon, out_path=map_path)
            if saved_path:
                # URL relative to server root (served via express.static)
                map_url = f"http://localhost:8765/maps/{map_filename}"
                logger.info(f"Generated map: {map_url}")
        except Exception as e:
            logger.error(f"Failed to generate map: {e}")

    listing_data = {
        'kavel_id': funda_id,
        'funda_id': funda_id,
        'status': 'pending',
        'adres': adres,
        'postcode': postcode,
        'plaats': plaats,
        'provincie': provincie,
        'prijs': prijs,
        'oppervlakte': oppervlakte,
        'source_url': url,
        'image_url': scraped_details.get('image_url') or map_url, # Fallback to map if no image
        'seo_title': pplx_data.get('title') or listing_info.get('title') or adres,
        'seo_summary': pplx_data.get('summary_nl') or pplx_data.get('description_short'),
        'seo_article_html': pplx_data.get('article_nl'),
        'specs': {
            'gmail': {
                'price': listing_info.get('price'),
                'surface': listing_info.get('surface'),
                'place': listing_info.get('place')
            },
            'scraped': scraped_details,
            'perplexity': pplx_data,
            'map_url': map_url,
            'lat': lat,
            'lon': lon
        },
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat(),
    }
    
    # Insert into Supabase
    if insert_listing(listing_data):
        logger.info(f"✅ Inserted listing {funda_id}")
        print(f"[SYNC] New listing: {listing_data.get('adres', 'Unknown')} - {listing_data.get('plaats', 'Unknown')}", flush=True)
        return True
    else:
        return False


def main():
    """Main sync process"""
    global supabase, perplexity_client
    import argparse
    
    parser = argparse.ArgumentParser(description='Sync Funda listings')
    parser.add_argument('--url', help='Process a single Funda URL instead of syncing from Gmail')
    args = parser.parse_args()
    
    try:
        print("[SYNC] Starting Funda sync...", flush=True)
        
        # Import Supabase here to avoid module-level import errors
        from supabase import create_client, Client
        
        # Initialize Supabase client
        logger.info("Initializing Supabase client...")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully")
        
        # Initialize Perplexity client
        if PERPLEXITY_API_KEY:
            logger.info("Initializing Perplexity client...")
            perplexity_client = PerplexityClient(PERPLEXITY_API_KEY)
        else:
            logger.warning("⚠️ Geen PERPLEXITY_API_KEY gevonden in .env - AI verrijking uitgeschakeld")
            
        # If URL provided, process only that URL
        if args.url:
            logger.info(f"Processing single URL: {args.url}")
            success = process_single_listing(args.url)
            if success:
                print(f"[SYNC] Successfully processed URL: {args.url}", flush=True)
                return 0
            else:
                print(f"[SYNC] Failed to process URL: {args.url}", flush=True)
                return 1
        
        # Otherwise, proceed with Gmail sync
        logger.info("Initializing Gmail client...")
        
        # Initialize Gmail client
        gmail = GmailClient(GMAIL_CREDENTIALS, GMAIL_TOKEN)
        
        # Search for Funda emails
        logger.info(f"Searching Gmail with query: {GMAIL_QUERY}")
        messages = gmail.search_messages(query=GMAIL_QUERY, max_results=20)
        logger.info(f"Found {len(messages)} messages")
        
        new_listings_count = 0
        skipped_count = 0
        error_count = 0
        
        # Process each message
        for msg in messages:
            listings = gmail.extract_listings(msg)
            logger.info(f"Extracted {len(listings)} listings from message")
            
            message_processed_successfully = True  # Track if we should archive this message
            
            for listing in listings:
                url = listing.get('url')
                if not url:
                    continue
                
                if process_single_listing(url, listing):
                    new_listings_count += 1
                else:
                    # Check if it was skipped because it exists
                    funda_id = extract_listing_id(url)
                    if funda_id and listing_exists(funda_id):
                        skipped_count += 1
                    else:
                        error_count += 1
                        message_processed_successfully = False
            
            # Archive message after processing all its listings
            if message_processed_successfully:
                try:
                    msg_id = msg.get('id')
                    if msg_id:
                        # Archive the message
                        if gmail.archive_message(msg_id):
                            logger.info(f"📧 Archived processed message {msg_id}")
                        # Add label for tracking
                        if gmail.add_label(msg_id, "Brikx/Verwerkt"):
                            logger.info(f"🏷️ Labeled message as 'Brikx/Verwerkt'")
                except Exception as e:
                    logger.warning(f"Failed to archive/label message: {e}")
        
        # Print summary
        print(f"[SYNC] Sync completed successfully!", flush=True)
        print(f"[SYNC] New listings: {new_listings_count}", flush=True)
        print(f"[SYNC] Skipped (already exist): {skipped_count}", flush=True)
        print(f"[SYNC] Errors: {error_count}", flush=True)
        
        return 0
        
    except Exception as e:
        print(f"[ERROR] Sync failed: {e}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
