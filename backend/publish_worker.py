import os
import sys
import argparse
import logging
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv
from supabase import create_client

# Add backend to path to import brikx modules
sys.path.append(os.path.join(os.path.dirname(__file__)))
from brikx.wordpress_client import WordPressClient

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load env
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def publish_listing(listing_id):
    # 1. Connect to Supabase
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    if not supabase_url or not supabase_key:
        logger.error("Supabase credentials missing")
        return False
    
    supabase = create_client(supabase_url, supabase_key)
    
    # 2. Fetch listing
    res = supabase.table('listings').select('*').eq('kavel_id', listing_id).execute()
    if not res.data:
        logger.error(f"Listing {listing_id} not found")
        return False
    
    listing = res.data[0]
    logger.info(f"Processing listing: {listing.get('adres')}")
    
    # 3. Connect to WordPress
    wp_url = os.getenv('WP_ZWIJSEN_URL')
    wp_user = os.getenv('WP_ZWIJSEN_USER')
    wp_pass = os.getenv('WP_ZWIJSEN_PASS')
    
    if not wp_url or not wp_user or not wp_pass:
        logger.error("WordPress credentials missing")
        return False
        
    wp = WordPressClient(wp_url, wp_user, wp_pass)
    
    # 4. Prepare Content
    title = listing.get('seo_title') or f"Bouwkavel te koop: {listing.get('adres')}, {listing.get('plaats')}"
    
    # Get base content
    base_content = listing.get('seo_article_html') or listing.get('seo_summary') or "Geen beschrijving beschikbaar."
    
    # Get specs early (needed for source URL)
    specs = listing.get('specs') or {}
    
    # Get source URL from specs or listing
    source_url = listing.get('source_url') or specs.get('url') or specs.get('source_url')
    
    # Add UTM parameters to source URL
    if source_url:
        utm_params = "?utm_source=kavelarchitect&utm_medium=post&utm_campaign=bouwgrond"
        if '?' in source_url:
            source_url = source_url + '&' + utm_params[1:]
        else:
            source_url = source_url + utm_params
    
    # Build full content with intro, main content, Funda link, CTA, and footer
    content_parts = []
    
    # Add intro
    intro_html = "<p>Ontwerp je droomwoning met Architectenbureau Jules Zwijsen. We helpen van schets tot vergunning en oplevering van uw nieuwe thuis.</p>"
    content_parts.append(intro_html)
    content_parts.append('<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">')
    
    # Add main content
    content_parts.append(base_content)
    
    # Add Funda link if available
    if source_url:
        content_parts.append(f'''
<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
<h3>Meer informatie</h3>
<p><strong>Bekijk deze kavel op Funda:</strong><br/>
<a href="{source_url}" target="_blank" rel="noopener noreferrer">{source_url.split('?')[0]}</a></p>
<p><em>Het kan natuurlijk ook zo zijn dat de link niet meer werkt omdat de kavel al verkocht is.... Mocht u op zoek zijn naar de mogelijkheid voor bouwen of verbouwen van een woning in een bepaalde regio en prijsklasse, <a href="https://www.zwijsen.net/kavels/">vul dan hier het formulier in</a> en ik zoek vrijblijvend met u mee.</em></p>
''')
    
    # Add CTA
    cta_url = "https://www.zwijsen.net/contact-2/?utm_source=kavelarchitect&utm_medium=post&utm_campaign=bouwgrond"
    cta_text = "Neem contact op"
    content_parts.append(f'''
<hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
<div style="text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px;">
    <h3>Interesse in deze kavel?</h3>
    <p>Wilt u meer weten over deze bouwkavel of een vrijblijvende offerte ontvangen voor uw droomhuis?</p>
    <p><a href="{cta_url}" style="display: inline-block; background: #0F2B46; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">{cta_text}</a></p>
</div>
''')
    
    # Add footer
    footer_html = "<p><strong>Tip:</strong> Bekijk ook onze <a href='https://www.zwijsen.net/projecten/'>nieuwbouwprojecten</a>.</p>"
    content_parts.append(footer_html)
    
    # Combine all content
    content = '\n'.join(content_parts)
    
    # Extract SEO data from specs (Perplexity)
    pplx_data = specs.get('perplexity') or {}
    focus_keyword = pplx_data.get('focus_keyword')
    seo_description = pplx_data.get('seo_description')
    
    # 5. Handle Map Image
    featured_media_id = None
    map_url = specs.get('map_url')
    
    if map_url:
        # Convert localhost URL to file path
        try:
            parsed = urlparse(map_url)
            filename = os.path.basename(parsed.path)
            local_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'maps', filename)
            
            if os.path.exists(local_path):
                logger.info(f"Uploading map: {local_path}")
                # Use focus keyword in alt text if available
                alt_text = focus_keyword if focus_keyword else f"Kaart {listing.get('adres')}"
                media = wp.upload_media(local_path, title=f"Kaart {listing.get('adres')}", caption=alt_text)
                featured_media_id = media.get('id')
                logger.info(f"Map uploaded, ID: {featured_media_id}")
            else:
                logger.warning(f"Map file not found at {local_path}")
        except Exception as e:
            logger.error(f"Failed to upload map: {e}")

    # 6. Create Post
    try:
        logger.info("Ensuring category 'Vrije kavel'...")
        # Ensure category "Vrije kavel"
        cat_id = wp.ensure_category("Vrije kavel", slug="vrije-kavel")
        logger.info(f"Category ID: {cat_id}")
        
        # Ensure tags from config
        logger.info("Ensuring tags...")
        default_tags = ["bouwgrond", "bouwkavel", "nieuwbouwwoning", "architect", "vergunning"]
        tag_ids = wp.ensure_tags(default_tags)
        logger.info(f"Tag IDs: {tag_ids}")
        
        # Prepare meta fields
        meta_fields = {
            'funda_id': str(listing_id),
            'prijs': str(listing.get('prijs')),
            'oppervlakte': str(listing.get('oppervlakte')),
            'adres': listing.get('adres'),
            'plaats': listing.get('plaats')
        }
        
        # Add SEO meta if available (RankMath & Yoast)
        if focus_keyword:
            meta_fields['rank_math_focus_keyword'] = focus_keyword
            meta_fields['_yoast_wpseo_focuskw'] = focus_keyword
            
        if seo_description:
            meta_fields['rank_math_description'] = seo_description
            meta_fields['_yoast_wpseo_metadesc'] = seo_description
        
        logger.info("Creating WordPress post...")
        post = wp.create_post(
            title=title,
            content=content,
            status='publish',
            categories=[cat_id],
            tags=tag_ids,
            featured_media=featured_media_id,
            meta=meta_fields
        )
        
        post_link = post.get('link')
        logger.info(f"Post created: {post_link}")
        
        # 7. Update Supabase
        logger.info("Updating Supabase status...")
        res = supabase.table('listings').update({
            'status': 'published',
            'published_url': post_link
        }).eq('kavel_id', listing_id).execute()
        logger.info(f"Supabase updated: {res}")
        
        return True
        
    except Exception as e:
        if 'PGRST204' in str(e):
            logger.info("Supabase update returned 204 (Success)")
            return True
            
        logger.error(f"Failed in step 6/7: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('listing_id', help="The Funda/Kavel ID of the listing to publish")
    args = parser.parse_args()
    
    success = publish_listing(args.listing_id)
    if success:
        sys.exit(0)
    else:
        sys.exit(1)
