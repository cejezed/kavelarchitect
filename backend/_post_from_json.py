# _post_from_json.py
import argparse, json, os, sys, datetime
from pathlib import Path

import requests
import yaml

from brikx.wordpress_client import WordPressClient
from brikx.map_fetcher import download_static_map
from brikx.geocode import geocode_place

TITLE_PREFIX = "Nieuwe bouwgrond te koop: "

# === Google Sheet webhook configuratie ===
GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzsP-JxO0U7oZnnQHcxXr6sJ2WLrstPcU6IDBi1JIpbsnxnBqhFa_XDQfEAeswx12KV/exec'
GOOGLE_SHEET_WEBHOOK_TOKEN = 'my_super_secret_funda_webhook_token_12345_xyz_abc'

def ensure_bouwgrond_category_id(wp: WordPressClient) -> int:
    # zoekt/maakt "Bouwgrond"
    return wp.ensure_category(name="Bouwgrond", slug="bouwgrond")

def build_title(meta: dict) -> str:
    if meta.get("address"):
        base = meta["address"]
    elif meta.get("street") and meta.get("place"):
        base = f"{meta['street']}, {meta['place']}"
    elif meta.get("place"):
        base = f"Bouwgrond – {meta['place']}"
    else:
        base = "Bouwgrond"
    return f"{TITLE_PREFIX}{base}"

def build_body(meta: dict, funda_url: str | None = None) -> str:
    blocks = []
    # lange tekst heeft prioriteit
    if meta.get("article_nl"):
        blocks.append(meta["article_nl"])
    elif meta.get("summary_nl"):
        blocks.append(f"<p>{meta['summary_nl']}</p>")

    # kerngegevens
    lines = []
    if meta.get("price"):      lines.append(f"<strong>Vraagprijs:</strong> {meta['price']}")
    if meta.get("surface"):    lines.append(f"<strong>Oppervlakte:</strong> {meta['surface']}")
    if meta.get("address"):    lines.append(f"<strong>Adres:</strong> {meta['address']}")
    elif meta.get("place"):    lines.append(f"<strong>Locatie:</strong> {meta['place']}")
    if meta.get("province"):   lines.append(f"<strong>Provincie:</strong> {meta['province']}")
    if lines:
        blocks.append("<p>" + "<br/>".join(lines) + "</p>")

    # Funda-link (als je 'm hebt)
    if funda_url:
        blocks.append(
            f'<p><a href="{funda_url}" target="_blank" rel="nofollow noopener">Bekijk aanbod op Funda</a></p>'
        )

    # jouw vaste afsluiter
    blocks.append(
        '<h2>Meer weten?</h2>'
        'Geïnteresseerd in bouwen op deze locatie? Bekijk de '
        f'<a href="{funda_url or "#"}" target="_blank" rel="nofollow noopener">volledige Funda-pagina</a> of neem vrijblijvend '
        '<a href="https://www.zwijsen.net/contact-2/">contact met ons</a> op voor bouwadvies, begeleiding of een vrijblijvend ontwerpvoorstel.<br/><br/>'
        'Het kan natuurlijk ook zo zijn dat de link niet meer werkt omdat de kavel al verkocht is. '
        'Mocht u op zoek zijn naar de mogelijkheid voor bouwen of verbouwen van een woning in een bepaalde regio en prijsklasse, '
        '<a href="https://www.zwijsen.net/kavels/">vul dan hier het formulier in</a> en ik zoek vrijblijvend met u mee.<br/><br/>'
        '&nbsp;<br/>[si-contact-form form=\'3\']'
    )

    # CTA
    blocks.append(
        '<p><em>Geïnteresseerd? '
        '<a href="https://www.zwijsen.net/contact-2/" target="_blank" rel="nofollow noopener">Neem contact op</a> '
        'om de mogelijkheden te bespreken.</em></p>'
    )
    return "\n".join(blocks)

def load_config(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def post_to_google_sheet(meta: dict, funda_url: str | None = None, status: str = "actief") -> bool:
    """
    Stuurt Funda-aanbod naar Google Sheet via webhook
    """
    
    if not GOOGLE_SHEET_WEBHOOK_URL or 'YOUR_DEPLOYMENT_ID' in GOOGLE_SHEET_WEBHOOK_URL:
        print("⚠ Google Sheet webhook niet geconfigureerd - sla over")
        return False
    
    # Extract data uit meta
    payload = {
        'type': 'kavel',
        'token': GOOGLE_SHEET_WEBHOOK_TOKEN,
        'address': meta.get('address') or '',
        'place': meta.get('place') or '',
        'province': meta.get('province') or '',
        'price': meta.get('price') or '',
        'surface': meta.get('surface') or '',
        'url': funda_url or '',
        'date': datetime.datetime.now().strftime('%Y-%m-%d'),
        'status': status or 'actief'
    }
    
    # DEBUG: Print wat we gaan versturen
    print(f"\nDEBUG: Payload voor Google Sheet:")
    print(json.dumps(payload, indent=2))
    print(f"DEBUG: URL: {GOOGLE_SHEET_WEBHOOK_URL}\n")
    
    try:
        response = requests.post(
            GOOGLE_SHEET_WEBHOOK_URL,
            json=payload,
            timeout=10
        )
        
        resp_json = response.json()
        
        print(f"DEBUG: Response status: {response.status_code}")
        print(f"DEBUG: Response body: {resp_json}\n")
        
        if response.status_code == 200 and resp_json.get('success'):
            if resp_json.get('duplicate'):
                print(f"⚠ Google Sheet: aanbod bestaat al ({meta.get('address')} – {meta.get('place')})")
            else:
                print(f"✓ Google Sheet: {meta.get('address') or meta.get('place')} toegevoegd")
            return True
        else:
            error_msg = resp_json.get('error', 'onbekende fout')
            print(f"✗ Google Sheet error: {response.status_code} – {error_msg}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"✗ Google Sheet webhook mislukt: {e}")
        return False
    except Exception as e:
        print(f"✗ Google Sheet fout: {e}")
        return False

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    ap.add_argument("--json", required=True, help="Pad naar sample_meta.json")
    ap.add_argument("--funda-url", default="", help="Optioneel: Funda-detail URL")
    ap.add_argument("--status", default="draft")
    args = ap.parse_args()

    cfg = load_config(args.config)
    with open(args.json, "r", encoding="utf-8") as f:
        meta = json.load(f)

    title = build_title(meta)
    content = build_body(meta, funda_url=args.funda_url or None)

    # coordinates → geocode
    q = meta.get("address") or (f"{meta.get('street','')} {meta.get('postal_code','')} {meta.get('place','')}".strip())
    latlon = geocode_place(q) if q else None

    map_path = None
    featured_id = None

    sites = cfg.get("wordpress_sites")
    if not sites:
        wp_cfg = cfg.get("wordpress")
        if not wp_cfg:
            print("Geen WordPress-config in config.yaml", file=sys.stderr)
            sys.exit(1)
        sites = [wp_cfg]

    for site in sites:
        base = site["base_url"]
        print(f"\n==> Post naar {base}")
        wp = WordPressClient(base, site["username"], site["application_password"])
        me = wp.whoami()
        print("Logged in als:", me.get("name") or me.get("slug"))

        # categorie "Bouwgrond"
        cat_id = ensure_bouwgrond_category_id(wp)

        # kaart genereren + uploaden
        featured_id = None
        if latlon:
            from pathlib import Path
            lat, lon = latlon
            Path("artifacts/maps").mkdir(parents=True, exist_ok=True)
            map_path = f"artifacts/maps/map_{lat:.5f}_{lon:.5f}.png"
            try:
                dl = download_static_map(lat, lon, "800x500", 15, map_path)
                if dl:
                    media = wp.upload_media(dl, title=f"Kaart – {meta.get('place') or ''}".strip())
                    featured_id = media.get("id")
                    print(f"Media geüpload id={featured_id}")
            except Exception as e:
                print("Kaart upload mislukt:", e)

        post = wp.create_post(
            title=title,
            content=content,
            status=args.status or site.get("status", "draft"),
            categories=[cat_id],
            featured_media=featured_id
        )
        print("Post aangemaakt:", post.get("link"))

    # Stuur ook naar Google Sheet
    print(f"\n==> Google Sheet sync")
    post_to_google_sheet(meta, funda_url=args.funda_url or None, status="actief")

if __name__ == "__main__":
    main()