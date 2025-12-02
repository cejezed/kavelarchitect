# brikx/gmail_client.py
import base64
import re
from typing import List, Dict, Any, Optional
from email.header import decode_header, make_header
from html import unescape
from urllib.parse import urlparse

from bs4 import BeautifulSoup
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    # "https://www.googleapis.com/auth/gmail.modify"  # Temporarily disabled - needs Google Cloud Console update
]

# Detail-URL’s (met ID) – pakt /detail/koop/.../<id>/ en /koop/.../<id>/
DETAIL_URL_RE = re.compile(
    r"https?://(?:www\.)?funda\.nl/(?:detail/koop|koop)/[^\s\"'()>]+/\d+/?",
    re.IGNORECASE,
)
PRICE_RE = re.compile(r"€\s?[\d\.\,]+")
# ook 'm2' naast 'm²'
SURF_RE  = re.compile(r"(\d{2,5})\s?m(?:²|2)\b", re.IGNORECASE)

def _canonical(url: str) -> str:
    url = url.split("?", 1)[0].split("#", 1)[0]
    return url.rstrip("/").rstrip(").,]>")

def _decode_subject(message: Dict[str, Any]) -> str:
    headers = message.get("payload", {}).get("headers", [])
    subj_raw = next((h.get("value") for h in headers if h.get("name") == "Subject"), "")
    if not subj_raw:
        return ""
    try:
        return str(make_header(decode_header(subj_raw)))
    except Exception:
        return subj_raw

def _collect_parts_text(payload: Dict[str, Any]) -> str:
    chunks: List[str] = []

    def _decode_data(data: Optional[str]) -> str:
        if not data:
            return ""
        try:
            return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
        except Exception:
            return ""

    def _walk(p: Dict[str, Any]):
        mime = (p.get("mimeType") or "").lower()
        body = p.get("body", {})
        data = body.get("data")
        text = _decode_data(data)

        if "text/html" in mime and text:
            soup = BeautifulSoup(text, "lxml")
            text = soup.get_text(" ", strip=True)
        elif "text/plain" in mime and text:
            text = unescape(text)

        if text:
            chunks.append(text)

        for sp in (p.get("parts") or []):
            _walk(sp)

    if payload.get("parts"):
        for part in payload["parts"]:
            _walk(part)
    else:
        _walk(payload)

    return "\n".join(chunks)

class GmailClient:
    """
    Gebruik:
      gm = GmailClient("secrets/credentials.json", "secrets/token.json")
      msgs = gm.search_messages('from:notificaties@service.funda.nl subject:"zoekopdracht" newer_than:7d')
      listings = gm.extract_listings(msgs[0])
      gm.archive_message(msgs[0]['id'])  # Archive after processing
    """
    def __init__(self, credentials_file: str, token_file: str, user_id: str = "me", oauth_port: int = 8765):
        self.credentials_file = credentials_file
        self.token_file = token_file
        self.user_id = user_id
        self.oauth_port = oauth_port
        self.creds: Optional[Credentials] = None
        self._ensure_creds()

    def _ensure_creds(self):
        try:
            self.creds = Credentials.from_authorized_user_file(self.token_file, SCOPES)
        except Exception:
            self.creds = None

        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                from google.auth.transport.requests import Request
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_file, SCOPES)
                self.creds = flow.run_local_server(port=self.oauth_port, open_browser=True)
            with open(self.token_file, "w", encoding="utf-8") as f:
                f.write(self.creds.to_json())

    def _service(self):
        return build("gmail", "v1", credentials=self.creds)

    def search_messages(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        service = self._service()
        resp = service.users().messages().list(
            userId=self.user_id, q=query, maxResults=max_results
        ).execute()
        ids = resp.get("messages", []) or []
        out: List[Dict[str, Any]] = []
        for m in ids:
            msg = service.users().messages().get(
                userId=self.user_id, id=m["id"], format="full"
            ).execute()
            out.append(msg)
        return out

    # Backwards compat: lijst van detail-URL's
    def extract_funda_urls(self, message: Dict[str, Any]) -> List[str]:
        subject = _decode_subject(message)
        body = _collect_parts_text(message.get("payload", {}))
        blob = f"{subject}\n{body}"
        urls = { _canonical(m.group(0)) for m in DETAIL_URL_RE.finditer(blob) }
        return list(urls)

    # Voorkeur: lijst van listings (meerdere per mail mogelijk)
    def extract_listings(self, message: Dict[str, Any], use_subject_as_title: bool = False) -> List[Dict[str, str]]:
        subject = _decode_subject(message)
        body = _collect_parts_text(message.get("payload", {}))
        blob = f"{subject}\n{body}"

        urls = { _canonical(m.group(0)) for m in DETAIL_URL_RE.finditer(blob) }
        price   = PRICE_RE.search(blob).group(0) if PRICE_RE.search(blob) else None
        surface = (SURF_RE.search(blob).group(1) + " m²") if SURF_RE.search(blob) else None

        # plaats uit mailtekst…
        place_from_text = None
        for pat in [r"\bin\s+([A-Z][\wÀ-ÿ\-\s]+)", r"\bte\s+([A-Z][\wÀ-ÿ\-\s]+)"]:
            m = re.search(pat, blob)
            if m:
                place_from_text = m.group(1).strip().split("\n")[0]
                break

        title = subject.strip() if (use_subject_as_title and subject.strip()) else None

        listings: List[Dict[str, str]] = []
        for url in urls:
            # …of uit de URL (detail/koop/<plaats>/<slug>/<id>)
            place_from_url = None
            try:
                parts = urlparse(url).path.strip("/").split("/")
                # b.v. ['detail','koop','landsmeer','bouwgrond-noordeinde-6','43107703']
                if len(parts) >= 5 and parts[0] in ("detail",) and parts[1] == "koop":
                    place_from_url = parts[2].replace("-", " ").title()
                elif len(parts) >= 4 and parts[0] == "koop":
                    place_from_url = parts[1].replace("-", " ").title()
            except Exception:
                pass

            listings.append({
                "url": url,
                "price": price,
                "surface": surface,
                "place": place_from_text or place_from_url,
                "title": title
            })
        return listings

    # New functions for message management
    def archive_message(self, message_id: str) -> bool:
        """Remove INBOX label to archive the message"""
        try:
            service = self._service()
            service.users().messages().modify(
                userId=self.user_id,
                id=message_id,
                body={'removeLabelIds': ['INBOX']}
            ).execute()
            return True
        except Exception as e:
            print(f"Failed to archive message {message_id}: {e}")
            return False

    def add_label(self, message_id: str, label_name: str) -> bool:
        """Add a label to a message (creates label if it doesn't exist)"""
        try:
            service = self._service()
            
            # Get or create label
            labels = service.users().labels().list(userId=self.user_id).execute()
            label_id = None
            for label in labels.get('labels', []):
                if label['name'] == label_name:
                    label_id = label['id']
                    break
            
            if not label_id:
                # Create label
                label_obj = service.users().labels().create(
                    userId=self.user_id,
                    body={'name': label_name, 'labelListVisibility': 'labelShow', 'messageListVisibility': 'show'}
                ).execute()
                label_id = label_obj['id']
            
            # Add label to message
            service.users().messages().modify(
                userId=self.user_id,
                id=message_id,
                body={'addLabelIds': [label_id]}
            ).execute()
            return True
        except Exception as e:
            print(f"Failed to add label to message {message_id}: {e}")
            return False

    def trash_message(self, message_id: str) -> bool:
        """Move message to trash"""
        try:
            service = self._service()
            service.users().messages().trash(
                userId=self.user_id,
                id=message_id
            ).execute()
            return True
        except Exception as e:
            print(f"Failed to trash message {message_id}: {e}")
            return False
