#!/usr/bin/env python3
"""Check recent listings and their prices - simplified version"""

import sys
import os
from pathlib import Path
from datetime import datetime, timedelta

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
from supabase import create_client

load_dotenv(backend_dir.parent / '.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get recent listings
cutoff = (datetime.utcnow() - timedelta(days=3)).isoformat()
result = supabase.table('listings').select(
    'kavel_id, adres, plaats, prijs, source_url, status, specs'
).gte('created_at', cutoff).order('created_at', desc=True).limit(10).execute()

print("\n=== RECENT LISTINGS (Last 3 days) ===\n")

for listing in result.data:
    kavel_id = listing['kavel_id']
    adres = listing.get('adres', 'Unknown')
    plaats = listing.get('plaats', 'Unknown')
    db_price = listing.get('prijs', 0)
    status = listing.get('status', 'unknown')
    url = listing.get('source_url', '')
    
    print(f"ID: {kavel_id}")
    print(f"Location: {adres}, {plaats}")
    print(f"Status: {status}")
    print(f"DB Price: EUR {db_price:,}")
    
    specs = listing.get('specs', {})
    
    # Gmail price
    gmail = specs.get('gmail', {})
    if gmail.get('price'):
        print(f"  Gmail price: {gmail['price']}")
    
    # Perplexity price
    pplx = specs.get('perplexity', {})
    if pplx.get('price'):
        print(f"  Perplexity price: {pplx['price']}")
    
    print(f"URL: {url}")
    print("-" * 60)

print("\n=== PENDING LISTINGS (ready to publish) ===\n")

# Get pending listings
pending = supabase.table('listings').select(
    'kavel_id, adres, plaats, status, prijs'
).eq('status', 'pending').order('created_at', desc=True).limit(5).execute()

if pending.data:
    for listing in pending.data:
        print(f"{listing['kavel_id']}: {listing.get('adres', 'Unknown')} - EUR {listing.get('prijs', 0):,} - Status: {listing['status']}")
else:
    print("No pending listings found")

print("\n")
