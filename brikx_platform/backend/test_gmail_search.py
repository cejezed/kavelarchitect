#!/usr/bin/env python3
"""Quick script to test different Gmail queries"""

import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
from brikx.gmail_client import GmailClient

# Load environment
load_dotenv(backend_dir.parent / '.env')

GMAIL_CREDENTIALS = str(backend_dir / 'secrets' / 'credentials.json')
GMAIL_TOKEN = str(backend_dir / 'secrets' / 'token.json')

queries = [
    'from:notificaties@service.funda.nl newer_than:7d',  # All Funda emails in last week
]

print("Testing Gmail queries for Funda emails...")
print()
gmail = GmailClient(GMAIL_CREDENTIALS, GMAIL_TOKEN)

for query in queries:
    print(f"Query: {query}")
    print("-" * 80)
    
    messages = gmail.search_messages(query=query, max_results=5)
    print(f"TOTAL MESSAGES FOUND: {len(messages)}")
    print()
    
    for i, msg in enumerate(messages, 1):
        # Extract subject
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
        
        # Extract date
        date = next((h['value'] for h in headers if h['name'] == 'Date'), 'No Date')
        
        print(f"MESSAGE {i}:")
        print(f"  Subject: {subject}")
        print(f"  Date: {date[:50]}")
        
        # Extract listings
        listings = gmail.extract_listings(msg)
        print(f"  URLs found: {len(listings)}")
        
        if listings:
            for j, listing in enumerate(listings, 1):
                print(f"    {j}. {listing['url']}")
                print(f"       Place: {listing.get('place', 'Unknown')}")
                print(f"       Price: {listing.get('price', 'Unknown')}")
        else:
            print("    (No listing URLs found in this email)")
        print()

print("-" * 80)
print("DIAGNOSTIC COMPLETE!")
print()
print("Next step: Check if these URLs already exist in the database")
