#!/usr/bin/env python3
"""
Upload existing local map images to Supabase Storage.

This script uploads all PNG files from the public/maps/ directory
to the Supabase 'maps' storage bucket and updates the listings
in the database with the new public URLs.
"""

import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("upload_maps")

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing SUPABASE_URL or SUPABASE_KEY in environment")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_maps_to_supabase():
    """Upload all local map images to Supabase storage."""
    maps_dir = Path("public/maps")

    if not maps_dir.exists():
        logger.warning(f"Maps directory '{maps_dir}' does not exist")
        return

    # Find all PNG files
    map_files = list(maps_dir.glob("*.png"))
    logger.info(f"Found {len(map_files)} map files to upload")

    uploaded_count = 0
    failed_count = 0

    for map_file in map_files:
        try:
            filename = map_file.name
            funda_id = map_file.stem  # filename without extension

            logger.info(f"Processing {filename} (kavel_id: {funda_id})...")

            # Read file bytes
            with open(map_file, 'rb') as f:
                file_bytes = f.read()

            # Upload to Supabase storage
            storage_path = f"maps/{filename}"

            try:
                supabase.storage.from_('maps').upload(
                    storage_path,
                    file_bytes,
                    file_options={"content-type": "image/png", "upsert": "true"}
                )
            except Exception as e:
                # If file exists, try to update it
                if "duplicate" in str(e).lower() or "already exists" in str(e).lower():
                    logger.info(f"  File exists, updating...")
                    supabase.storage.from_('maps').update(
                        storage_path,
                        file_bytes,
                        file_options={"content-type": "image/png"}
                    )
                else:
                    raise

            # Get public URL
            public_url = supabase.storage.from_('maps').get_public_url(storage_path)
            logger.info(f"  Uploaded: {public_url}")

            # Update listing in database if it exists
            try:
                # Check if listing exists
                response = supabase.table('listings').select('kavel_id, specs').eq('kavel_id', funda_id).execute()

                if response.data and len(response.data) > 0:
                    listing = response.data[0]
                    specs = listing.get('specs', {})

                    # Update map_url in specs
                    specs['map_url'] = public_url

                    # Update the listing
                    supabase.table('listings').update({
                        'map_url': public_url,
                        'image_url': public_url,  # Also update image_url if it was using the old local URL
                        'specs': specs
                    }).eq('kavel_id', funda_id).execute()

                    logger.info(f"  Updated listing {funda_id} with new map URL")
                else:
                    logger.warning(f"  No listing found for kavel_id {funda_id}")

            except Exception as db_err:
                logger.warning(f"  Failed to update database for {funda_id}: {db_err}")

            uploaded_count += 1

        except Exception as e:
            logger.error(f"Failed to upload {map_file.name}: {e}")
            failed_count += 1

    logger.info(f"\n✅ Upload complete!")
    logger.info(f"   Uploaded: {uploaded_count}")
    logger.info(f"   Failed: {failed_count}")

if __name__ == "__main__":
    logger.info("Starting map upload to Supabase storage...")
    upload_maps_to_supabase()
