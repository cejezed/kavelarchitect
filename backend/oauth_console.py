import os
from google_auth_oauthlib.flow import InstalledAppFlow

CREDS = r"secrets/credentials.json"
TOKEN = r"secrets/token.json"
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

assert os.path.exists(CREDS), f"credentials.json ontbreekt op {CREDS}"
os.makedirs(os.path.dirname(TOKEN), exist_ok=True)

flow = InstalledAppFlow.from_client_secrets_file(CREDS, SCOPES)
print("\nOpen de URL hieronder in je browser, log in en kopieer de verificatiecode terug in deze terminal.\n")
creds = flow.run_console()  # geen localhost callback, werkt altijd

with open(TOKEN, "w", encoding="utf-8") as f:
    f.write(creds.to_json())

print("\n✅ token.json geschreven:", os.path.abspath(TOKEN))