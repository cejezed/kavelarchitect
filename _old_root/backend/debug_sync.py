import os
import sys
import json
from dotenv import load_dotenv
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load env
load_dotenv('.env')

# Add backend to path
sys.path.insert(0, 'backend')

from sync_worker import scrape_listing_details

# Test URL (Huizen)
test_url = "https://www.funda.nl/detail/koop/huizen/nieuwe-bussummerweg-246/43269698/"
print(f"Testing with URL: {test_url}")

import requests
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
r = requests.get(test_url, headers=headers)
print(f"Status Code: {r.status_code}")
if r.status_code != 200:
    print("URL is invalid or blocked")
    exit()

print(f"Page Title: {r.text[r.text.find('<title>')+7 : r.text.find('</title>')]}")
print(f"HTML Snippet: {r.text[:500]}")

# Test scraping
try:
    details = scrape_listing_details(test_url)
    print("Scraped details:", json.dumps(details, indent=2))
except Exception as e:
    print(f"Scraping failed: {e}")
