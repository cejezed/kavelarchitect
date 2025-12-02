import re
import requests
from bs4 import BeautifulSoup

UA = {"User-Agent": "Mozilla/5.0 (compatible; BrikxBot/0.1)"}

PRICE_RE = re.compile(r"€\s?[\d\.\,]+")
SURF_RE = re.compile(r"(\d{2,5})\s?m²", re.IGNORECASE)

def parse_funda(url: str) -> dict:
    r = requests.get(url, headers=UA, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")

    title = soup.find("title").get_text(strip=True) if soup.title else url

    # heuristics
    text = soup.get_text(" ", strip=True)
    price = None
    m = PRICE_RE.search(text)
    if m:
        price = m.group(0)

    surface = None
    ms = SURF_RE.search(text)
    if ms:
        surface = ms.group(1) + " m²"

    # plaatsnaam soms in breadcrumbs of H1
    place = None
    h1 = soup.find("h1")
    if h1:
        s = h1.get_text(" ", strip=True)
        # vaak "Bouwgrond te koop: Plaats - Straat"
        if " - " in s:
            place = s.split(" - ", 1)[0]
        elif ":" in s:
            place = s.split(":", 1)[-1].strip()

    # Extract address and province from URL path or page content
    address = None
    province = None
    street = None
    house_number = None
    postal_code = None

    # Try to parse from URL structure: /detail/koop/<plaats>/<straat-huisnummer>/<id>/
    try:
        from urllib.parse import urlparse
        path_parts = urlparse(url).path.strip("/").split("/")

        # Try formats: detail/koop/<plaats>/<straat>/<id> or koop/<plaats>/<straat>/<id>
        if len(path_parts) >= 4:
            idx = 0
            if path_parts[0] == "detail":
                idx = 1
            if path_parts[idx] == "koop" and len(path_parts) > idx + 2:
                place_slug = path_parts[idx + 1]
                street_slug = path_parts[idx + 2]

                # Parse place from URL
                if not place:
                    place = place_slug.replace("-", " ").title()

                # Parse street from URL (remove "bouwgrond-" prefix if present)
                street_part = street_slug
                if street_part.startswith("bouwgrond-"):
                    street_part = street_part[len("bouwgrond-"):]

                # Try to extract house number from street part
                num_match = re.search(r"(\d+[-\w]*)\/?$", street_part)
                if num_match:
                    house_number = num_match.group(1)
                    street_part = street_part[:num_match.start()].rstrip("-")

                street = street_part.replace("-", " ").title()

                if street and place:
                    if house_number:
                        address = f"{street} {house_number}, {place}"
                    else:
                        address = f"{street}, {place}"
    except Exception:
        pass

    # Try to find postal code in page text
    postal_match = re.search(r"\b(\d{4}\s?[A-Z]{2})\b", text)
    if postal_match:
        postal_code = postal_match.group(1)

    # Map postal code prefixes to provinces
    postal_code_province_map = {
        "10": "Noord-Holland", "11": "Zuid-Holland", "12": "Zuid-Holland",
        "13": "Noord-Holland", "14": "Noord-Holland", "15": "Noord-Holland",
        "16": "Noord-Holland", "17": "Noord-Holland", "18": "Noord-Holland",
        "19": "Noord-Holland", "20": "Zuid-Holland", "21": "Zuid-Holland",
        "22": "Zuid-Holland", "23": "Zuid-Holland", "24": "Zuid-Holland",
        "25": "Zuid-Holland", "26": "Zuid-Holland", "27": "Zuid-Holland",
        "28": "Zuid-Holland", "29": "Zuid-Holland", "30": "Utrecht",
        "31": "Utrecht", "32": "Utrecht", "33": "Utrecht", "34": "Utrecht",
        "35": "Utrecht", "36": "Utrecht", "37": "Utrecht", "38": "Gelderland",
        "39": "Gelderland", "40": "Gelderland", "41": "Gelderland",
        "42": "Gelderland", "43": "Gelderland", "44": "Gelderland",
        "50": "Limburg", "51": "Limburg", "52": "Limburg", "53": "Limburg",
        "54": "Limburg", "55": "Limburg", "56": "Limburg", "57": "Limburg",
        "58": "Limburg", "59": "Limburg", "60": "Limburg", "61": "Limburg",
        "62": "Limburg", "63": "Limburg", "64": "Limburg", "65": "Limburg",
        "66": "Limburg", "70": "Noord-Brabant", "71": "Noord-Brabant",
        "72": "Noord-Brabant", "73": "Noord-Brabant", "74": "Noord-Brabant",
        "75": "Noord-Brabant", "76": "Noord-Brabant", "77": "Noord-Brabant",
        "78": "Zeeland", "79": "Zeeland", "80": "Overijssel", "81": "Overijssel",
        "82": "Drenthe", "83": "Drenthe", "84": "Friesland", "85": "Friesland",
        "86": "Friesland", "87": "Friesland", "88": "Friesland",
        "89": "Friesland", "90": "Groningen", "91": "Groningen",
        "92": "Groningen", "93": "Groningen", "94": "Drenthe",
        "95": "Flevoland", "96": "Overijssel", "97": "Overijssel"
    }

    if postal_code and not province:
        prefix = postal_code[:2]
        province = postal_code_province_map.get(prefix)

    # Fallback: map common place names to provinces
    place_province_map = {
        # Noord-Holland
        "amsterdam": "Noord-Holland", "haarlem": "Noord-Holland", "zaandam": "Noord-Holland",
        "alkmaar": "Noord-Holland", "hoorn": "Noord-Holland", "purmerend": "Noord-Holland",
        "heerhugowaard": "Noord-Holland", "beverwijk": "Noord-Holland", "enkhuizen": "Noord-Holland",
        "spanbroek": "Noord-Holland", "andijk": "Noord-Holland", "wervershoof": "Noord-Holland",
        # Zuid-Holland
        "rotterdam": "Zuid-Holland", "den haag": "Zuid-Holland", "leiden": "Zuid-Holland",
        "dordrecht": "Zuid-Holland", "zoetermeer": "Zuid-Holland", "delft": "Zuid-Holland",
        "gouda": "Zuid-Holland", "schiedam": "Zuid-Holland", "alphen aan den rijn": "Zuid-Holland",
        # Utrecht
        "utrecht": "Utrecht", "amersfoort": "Utrecht", "veenendaal": "Utrecht",
        "nieuwegein": "Utrecht", "zeist": "Utrecht", "woerden": "Utrecht",
        "bilthoven": "Utrecht", "soest": "Utrecht", "bunnik": "Utrecht",
        # Gelderland
        "arnhem": "Gelderland", "nijmegen": "Gelderland", "apeldoorn": "Gelderland",
        "ede": "Gelderland", "doetinchem": "Gelderland", "zutphen": "Gelderland",
        # Noord-Brabant
        "eindhoven": "Noord-Brabant", "tilburg": "Noord-Brabant", "breda": "Noord-Brabant",
        "den bosch": "Noord-Brabant", "'s-hertogenbosch": "Noord-Brabant", "helmond": "Noord-Brabant",
        # Limburg
        "maastricht": "Limburg", "venlo": "Limburg", "sittard": "Limburg",
        "heerlen": "Limburg", "roermond": "Limburg", "weert": "Limburg",
        # Zeeland
        "middelburg": "Zeeland", "vlissingen": "Zeeland", "terneuzen": "Zeeland",
        "goes": "Zeeland",
        # Friesland
        "leeuwarden": "Friesland", "sneek": "Friesland", "heerenveen": "Friesland",
        # Groningen
        "groningen": "Groningen", "hoogezand": "Groningen", "veendam": "Groningen",
        # Drenthe
        "assen": "Drenthe", "emmen": "Drenthe", "hoogeveen": "Drenthe",
        # Overijssel
        "zwolle": "Overijssel", "enschede": "Overijssel", "hengelo": "Overijssel",
        "almelo": "Overijssel", "deventer": "Overijssel",
        # Flevoland
        "almere": "Flevoland", "lelystad": "Flevoland", "dronten": "Flevoland",
    }

    if not province and place:
        province = place_province_map.get(place.lower())

    return {
        "url": url,
        "title": title,
        "price": price,
        "surface": surface,
        "place": place,
        "address": address,
        "province": province,
        "street": street,
        "house_number": house_number,
        "postal_code": postal_code,
    }
