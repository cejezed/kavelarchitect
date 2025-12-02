# _wp_both_test.py
import argparse
from pathlib import Path
import yaml

from brikx.wordpress_client import WordPressClient

def _load_yaml(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}

def _load_sites(cfg: dict) -> list[dict]:
    """
    Ondersteunt:
      wordpress_sites: [ { base_url, username, application_password, status, category_ids|category_names }, ... ]
    of een enkelvoudige:
      wordpress: { ... }
    """
    if "wordpress_sites" in cfg and isinstance(cfg["wordpress_sites"], list):
        return cfg["wordpress_sites"]
    if "wordpress" in cfg and isinstance(cfg["wordpress"], dict):
        return [cfg["wordpress"]]
    raise ValueError("Geen geldige WordPress-config (gebruik 'wordpress_sites:' of 'wordpress:').")

def _resolve_categories(wp: WordPressClient, cats):
    """
    Accepteert lijst met ints of strings.
    Strings (categorienamen) worden omgezet naar ID's (en aangemaakt als ze niet bestaan).
    """
    if not cats:
        return None
    out = []
    for c in cats:
        if isinstance(c, int):
            out.append(c)
        else:
            out.append(wp.ensure_category(str(c)))
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    args = ap.parse_args()

    cfg = _load_yaml(args.config)
    sites = _load_sites(cfg)

    # Testpayload
    title = "Testpost – via _wp_both_test.py"
    content = (
        "<p>Dit is een testbericht dat tegelijk op beide sites wordt geplaatst.</p>"
        "<p><em>Je ziet deze alleen om te testen dat inloggen, media upload en categorieën werken.</em></p>"
    )
    status_default = "draft"

    # Optioneel: test-afbeelding als featured image (pas pad aan als je iets anders wilt)
    media_path = Path("artifacts/maps/smoke_dam.png")

    for site in sites:
        base = site["base_url"].rstrip("/")
        user = site["username"]
        app_pw = site["application_password"]
        status = site.get("status", status_default)

        print(f"[{base}] inloggen…")
        wp = WordPressClient(base, user, app_pw)
        me = wp.whoami()
        print(f"[{base}] ingelogd als {me.get('name') or me.get('slug')} (id={me.get('id')})")

        featured_id = None
        if media_path.exists():
            media = wp.upload_media(str(media_path), title="Testkaart")
            featured_id = media.get("id")
            print(f"[{base}] media geüpload id={featured_id}")
        else:
            print(f"[{base}] geen media gevonden op {media_path}, sla featured image over")

        # categorieën: support zowel numerieke ID's als namen
        cats_cfg = site.get("category_ids") or site.get("category_names")
        cats = _resolve_categories(wp, cats_cfg)

        post = wp.create_post(
            title=title,
            content=content,
            status=status,
            categories=cats,
            featured_media=featured_id,
        )
        print(f"[{base}] post gemaakt: id={post.get('id')} link={post.get('link')}")

if __name__ == "__main__":
    main()
