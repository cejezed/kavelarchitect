import os
from dotenv import load_dotenv

load_dotenv()

wp_url = os.getenv('WP_ZWIJSEN_URL')
wp_user = os.getenv('WP_ZWIJSEN_USER')
wp_pass = os.getenv('WP_ZWIJSEN_PASS')

print(f"URL present: {bool(wp_url)}")
print(f"User present: {bool(wp_user)}")
print(f"Pass present: {bool(wp_pass)}")

if wp_url:
    print(f"URL: {wp_url}")
if wp_user:
    print(f"User: {wp_user}")
# Do NOT print the password
