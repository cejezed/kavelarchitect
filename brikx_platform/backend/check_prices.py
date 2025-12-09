#!/usr/bin/env python3
"""Check recent listings and their prices from Supabase"""

import sys
import os
from pathlib import Path
from datetime import datetime, timedelta

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
from supabase import create_client

# Load environment
load_dotenv(backend_dir.parent / '.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Initialize Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 80)
print("RECENT LISTINGS - PRICE CHECK")
print("=" * 80)
print()

# Get listings from the last 7 days
cutoff = (datetime.utcnow() - timedelta(days=7)).isoformat()
result = supabase.table('listings').select(
    'kavel_id, funda_id, adres, plaats, prijs, source_url, status, specs, created_at'
).gte('created_at', cutoff).order('created_at', desc=True).execute()

listings = result.data

print(f"Found {len(listings)} listings from the last 7 days")
print()

for listing in listings:
    print(f"ID: {listing['kavel_id']}")
    print(f"  Adres: {listing['adres']}, {listing['plaats']}")
    print(f"  Status: {listing['status']}")
    print(f"  Database Price: €{listing['prijs']:,}" if listing['prijs'] else "  Database Price: None")
    print(f"  Created: {listing['created_at']}")
    print(f"  Funda URL: {listing['source_url']}")
    
    # Check specs for price sources
    specs = listing.get('specs', {})
    if specs:
        print("  Price Sources:")
        
        # Gmail price
        gmail_data = specs.get('gmail', {})
        if gmail_data.get('price'):
            print(f"    Gmail: {gmail_data['price']}")
        
        # Perplexity price
        pplx_data = specs.get('perplexity', {})
        if pplx_data.get('price'):
            print(f"    Perplexity: {pplx_data['price']}")
        
        # Scraped price
        scraped_data = specs.get('scraped', {})
        if scraped_data.get('prijs'):
            print(f"    Scraped: {scraped_data['prijs']}")
    
    print()

print("=" * 80)
print("DIAGNOSTIC TIPS:")
print("1. Check if Gmail extracted price correctly from email")
print("2. Check if Perplexity returned correct price")
print("3. Manually verify prices on Funda website")
print("=" * 80)
