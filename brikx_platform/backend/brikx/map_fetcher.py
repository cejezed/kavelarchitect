import os
import time
import logging
import requests
from urllib.parse import quote

log = logging.getLogger("brikx.map")

def _parse_size(size: str) -> tuple[int, int]:
    try:
        w, h = size.lower().split("x")
        return int(w), int(h)
    except Exception:
        return 800, 500

def _download_url(url: str, out_path: str) -> str | None:
    headers = {
        "User-Agent": "BrikxBot/0.1 (+contact)",
        "Accept": "image/png,image/*;q=0.8,*/*;q=0.5",
    }
    r = requests.get(url, headers=headers, timeout=30)
    if r.status_code != 200:
        try:
            log.debug("Geoapify response text: %s", r.text[:500])
        except Exception:
            pass
    r.raise_for_status()
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(r.content)
    return out_path

def download_static_map(
    lat: float,
    lon: float,
    size: str = "800x500",
    zoom: int = 15,
    out_path: str = "map.png",
) -> str | None:
    """
    Maakt een statische kaart via Geoapify met een marker.
    
    - API key via env: GEOAPIFY_API_KEY
    - Gebruikt marker parameter (eenvoudiger en betrouwbaarder dan geometry)
    - Fallback naar kaart zonder marker als marker faalt
    
    Retourneert pad naar het PNG-bestand of None als er geen coords zijn.
    """
    if lat is None or lon is None:
        log.debug("Geen lat/lon → sla kaart over.")
        return None
    if abs(lat) < 1e-6 and abs(lon) < 1e-6:
        log.debug("lat/lon zijn (0,0) → sla kaart over.")
        return None

    api_key = os.getenv("GEOAPIFY_API_KEY")
    if not api_key:
        log.warning("Geen kaartprovider (GEOAPIFY_API_KEY niet gezet). Kaart wordt overgeslagen.")
        return None

    w, h = _parse_size(size)
    style = "osm-bright"
    base = "https://maps.geoapify.com/v1/staticmap"
    
    # Optie 1: Probeer met marker parameter (eenvoudigste methode)
    marker_url = (
        f"{base}?style={style}"
        f"&width={w}&height={h}"
        f"&center=lonlat:{lon},{lat}&zoom={zoom}"
        f"&marker=lonlat:{lon},{lat};color:%23ff6f00;size:medium"
        f"&format=png"
        f"&apiKey={api_key}"
    )
    
    # Optie 2: Fallback zonder marker
    fallback_url = (
        f"{base}?style={style}"
        f"&width={w}&height={h}"
        f"&center=lonlat:{lon},{lat}&zoom={zoom}"
        f"&format=png"
        f"&apiKey={api_key}"
    )
    
    # Probeer eerst met marker
    for attempt, (url, desc) in enumerate([
        (marker_url, "met marker"),
        (fallback_url, "zonder marker (fallback)")
    ]):
        try:
            log.debug(f"Download map via Geoapify {desc}: {url}")
            return _download_url(url, out_path)
        except Exception as e:
            log.warning(f"Poging {attempt + 1} {desc} gefaald: {e}")
            if attempt == 0:
                time.sleep(0.5)
                continue
            else:
                # Laatste poging ook gefaald
                raise

    return None

def geocode_address(address: str) -> tuple[float, float] | None:
    """
    Zoekt coördinaten bij een adres via Geoapify.
    """
    api_key = os.getenv("GEOAPIFY_API_KEY")
    if not api_key:
        log.warning("Geen GEOAPIFY_API_KEY, kan niet geocoden.")
        return None
        
    try:
        url = "https://api.geoapify.com/v1/geocode/search"
        params = {
            "text": address,
            "apiKey": api_key,
            "limit": 1
        }
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        
        if data.get("features"):
            props = data["features"][0]["properties"]
            return props.get("lat"), props.get("lon")
    except Exception as e:
        log.error(f"Geocoding failed for '{address}': {e}")
        
    return None
