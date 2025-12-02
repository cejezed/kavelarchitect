import os, sys, json
from google_auth_oauthlib.flow import InstalledAppFlow

CREDS = r"secrets/credentials.json"
TOKEN = r"secrets/token.json"
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

if not os.path.exists(CREDS):
    sys.exit(f"credentials.json ontbreekt op {CREDS}")

flow = InstalledAppFlow.from_client_secrets_file(CREDS, SCOPES)

# Print een URL die je zelf opent; Python luistert op localhost en vangt de redirect op
creds = flow.run_local_server(
    host="127.0.0.1",
    port=8765,                # vaste poort; mag je wijzigen als 8765 bezet is
    open_browser=False,
    authorization_prompt_message="\nOpen deze URL in je browser en rond inloggen/toestemming af:\n{url}\n\nLaat dit venster open staan tot je terug gestuurd bent naar 127.0.0.1 (dan is het klaar).\n"
)

os.makedirs(os.path.dirname(TOKEN), exist_ok=True)
with open(TOKEN, "w", encoding="utf-8") as f:
    f.write(creds.to_json())

print("✅ token.json geschreven:", os.path.abspath(TOKEN))