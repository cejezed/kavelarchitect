# brikx/state_store.py
import json
import os
import re
from typing import Set, Optional
from urllib.parse import urlparse, urlunparse

# --- helpers die publisher.py nu importeert ---
FUNDA_ID_RE = re.compile(r"/(\d{6,})/?$")

def extract_funda_id(url: str) -> Optional[str]:
    """
    Haal Funda objectnummer (meestal 7-8 cijfers) uit de URL.
    Voorbeeld:
      .../bouwgrond-noordeinde-6/43107703 -> "43107703"
    """
    m = FUNDA_ID_RE.search(url.strip())
    return m.group(1) if m else None

def normalize_url(u: str) -> str:
    """
    Normaliseer URL om duplicates te voorkomen:
    - verwijder querystring en fragment (UTM’s etc.)
    - strip trailing slash
    """
    p = urlparse(u.strip())
    p2 = p._replace(query="", fragment="")
    out = urlunparse(p2)
    return out[:-1] if out.endswith("/") else out

# --- JSON store (backwards compatible) ---
class StateStore:
    """
    JSON-gebaseerde store.
    - Bewaart genormaliseerde URL's in 'processed_urls'
    - (Nieuw) Bewaart Funda-ID's in 'processed_ids' (optioneel)
    - Backwards compat: is_processed(url) en mark_processed(url)
    """
    def __init__(self, path: str):
        self.path = path
        self._data = {"processed_urls": [], "processed_ids": []}
        self._load()

    def _load(self):
        if os.path.exists(self.path):
            try:
                self._data = json.load(open(self.path, "r", encoding="utf-8"))
                if "processed_ids" not in self._data:
                    self._data["processed_ids"] = []
            except Exception:
                self._data = {"processed_urls": [], "processed_ids": []}

    def _save(self):
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(self._data, f, ensure_ascii=False, indent=2)

    # ---- URL-based ----
    def is_processed_url(self, url: str) -> bool:
        norm = normalize_url(url)
        return norm in set(self._data.get("processed_urls", []))

    def mark_processed_url(self, url: str):
        norm = normalize_url(url)
        s: Set[str] = set(self._data.get("processed_urls", []))
        s.add(norm)
        self._data["processed_urls"] = sorted(s)

    # ---- ID-based (Funda) ----
    def is_processed_id(self, listing_id: Optional[str]) -> bool:
        if not listing_id:
            return False
        return listing_id in set(self._data.get("processed_ids", []))

    def mark_processed_id(self, listing_id: Optional[str]):
        if not listing_id:
            return
        s: Set[str] = set(self._data.get("processed_ids", []))
        s.add(listing_id)
        self._data["processed_ids"] = sorted(s)

    # ---- Backwards compatible API ----
    def is_processed(self, url: str) -> bool:
        # oude methode: check alleen op URL
        return self.is_processed_url(url)

    def mark_processed(self, url: str, listing_id: Optional[str] = None):
        # oude methode + uitbreiding: markeer URL én optioneel Funda-ID
        self.mark_processed_url(url)
        if listing_id:
            self.mark_processed_id(listing_id)
        self._save()
