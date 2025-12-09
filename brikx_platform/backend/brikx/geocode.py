# brikx/geocode.py
import requests

def geocode_place(place: str, countrycodes: str = "nl", language: str = "nl"):
    """
    Geocodeer een plaatsnaam met Nominatim.
    Retourneert (lat, lon) als floats of None als niets gevonden is.
    """
    if not place:
        return None

    params = {
        "q": place,
        "format": "json",
        "limit": 1,
        "addressdetails": 0,
        "countrycodes": countrycodes,
        "accept-language": language,
    }

    headers = {"User-Agent": "BrikxBot/0.1 (+contact)"}

    r = requests.get("https://nominatim.openstreetmap.org/search", params=params, headers=headers, timeout=20)
    r.raise_for_status()
    data = r.json()
    if not data:
        return None

    try:
        lat = float(data[0]["lat"])
        lon = float(data[0]["lon"])
        return lat, lon
    except Exception:
        return None
