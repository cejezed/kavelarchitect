import os
from dotenv import load_dotenv

load_dotenv()

print("Environment Keys:")
for key in os.environ:
    if "WP_" in key:
        print(key)
