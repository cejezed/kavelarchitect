# brikx/publisher.py
import os
import logging
import datetime
from pathlib import Path
from urllib.parse import urlparse, urlparse as _up, urlencode as _urlencode, urlunparse as _urlunparse, parse_qs as _parse_qs

import requests
import yaml

from .gmail_client import GmailClient
from .state_store import StateStore, extract_funda_id, normalize_url
from .wordpress_client import WordPressClient
from .map_fetcher import download_static_map
from .geocode import geocode_place
from .funda_parser import parse_funda

try:
    from .perplexity_client import PerplexityClient
except Exception:
    PerplexityClient = None

log = logging.getLogger("brikx.publisher")

TITLE_PREFIX = "Nieuwe bouwgrond te koop: "


# --------------------------
# Helpers
# --------------------------
def _guess_title_from_url(url: str) -> str | None:
    try:
        path = urlparse(url).path.strip("/").split("/")
        # detail/koop/<plaats>/<slug>/<id>
        if len(path) >= 5 and path[0] == "detail" and path[1] == "koop":
            place = path[2]
            street_slug = path[3]
            if street_slug.startswith("bouwgrond-"):
                street_slug = street_slug[len("bouwgrond-"):]
            street = street_slug.replace("-", " ").strip().title()
            place_t = place.replace("-", " ").strip().title()
            return f"{street}, {place_t}"
        # koop/<plaats>/<slug>/<id>
        if len(path) >= 4 and path[0] == "koop":
            place = path[1]
            street = path[2].replace("-", " ").strip().title()
            place_t = place.replace("-", " ").strip().title()
            return f"{street}, {place_t}"
    except Exception:
        pass
    return None

def _fallback_summary(meta: dict) -> str:
    parts = []
    if meta.get("place") and meta.get("surface"):
        parts.append(f"In {meta['place']} wordt een bouwkavel van circa {meta['surface']} aangeboden.")
    elif meta.get("place"):
        parts.append(f"In {meta['place']} is een bouwkavel beschikbaar.")
    if meta.get("price"):
        parts.append(f"De vraagprijs bedraagt {meta['price']}.")
    parts.append("Klik door voor details en voorwaarden.")
    return " ".join(parts)

def _normalize_geocode_query(q: str) -> str:
    repl = {" ong.": "", " ong": "", "Onbekend,": "", "onbekend,": ""}
    for k, v in repl.items():
        q = q.replace(k, v)
    q = q.replace(" ,", ",").strip()
    q = " ".join(q.split())
    return q

def _apply_utm(u: str | None, content_cfg: dict | None) -> str | None:
    if not u:
        return u
    if not content_cfg or not content_cfg.get("add_utm"):
        return u
    src = content_cfg.get("utm_source", "kavelarchitect")
    med = content_cfg.get("utm_medium", "post")
    camp = content_cfg.get("utm_campaign", "bouwgrond")
    p = _up(u)
    q = _parse_qs(p.query)
    q["utm_source"] = [src]
    q["utm_medium"] = [med]
    q["utm_campaign"] = [camp]
    new_q = _urlencode({k: v[0] for k, v in q.items()})
    return _urlunparse(p._replace(query=new_q))

def _meer_weten_block(funda_url: str) -> str:
    return (
        "<h2>Meer weten?</h2>\n"
        f'Geïnteresseerd in bouwen op deze locatie? Bekijk de <a href="{funda_url}" target="_blank" rel="nofollow noopener">'
        "volledige Funda-pagina</a> of neem vrijblijvend <a href=\"https://www.zwijsen.net/contact-2/\">contact met ons</a> "
        "op voor bouwadvies, begeleiding of een vrijblijvend ontwerpvoorstel.<br/><br/>\n"
        "Het kan natuurlijk ook zo zijn dat de link niet meer werkt omdat de kavel al verkocht is. "
        "Mocht u op zoek zijn naar de mogelijkheid voor bouwen of verbouwen van een woning in een bepaalde regio en prijsklasse, "
        "<a href=\"https://www.zwijsen.net/kavels/\">vul dan hier het formulier in</a> en ik zoek vrijblijvend met u mee.<br/><br/>\n"
        "&nbsp;<br/>[si-contact-form form='3']"
    )

def _render_content(meta: dict, content_cfg: dict | None) -> str:
    blocks = []
    if content_cfg and content_cfg.get("intro_html"):
        blocks.append(content_cfg["intro_html"])
    if meta.get("article_nl"):
        blocks.append(meta["article_nl"])
    elif meta.get("summary_nl"):
        blocks.append(f"<p>{meta['summary_nl']}</p>")
    else:
        blocks.append(f"<p>{_fallback_summary(meta)}</p>")
    lines = []
    if meta.get("price"):
        lines.append(f"<strong>Vraagprijs:</strong> {meta['price']}")
    if meta.get("surface"):
        lines.append(f"<strong>Oppervlakte:</strong> {meta['surface']}")
    if meta.get("address"):
        lines.append(f"<strong>Adres:</strong> {meta['address']}")
    elif meta.get("place"):
        lines.append(f"<strong>Locatie:</strong> {meta['place']}")
    if meta.get("province"):
        lines.append(f"<strong>Provincie:</strong> {meta['province']}")
    if lines:
        blocks.append("<p>" + "<br/>".join(lines) + "</p>")
    funda_link = meta.get("url") or "#"
    if content_cfg:
        funda_link = _apply_utm(funda_link, content_cfg) or funda_link
    blocks.append(
        f'<p><a href="{funda_link}" target="_blank" rel="nofollow noopener">Bekijk aanbod op Funda</a></p>'
    )
    cta_url = (content_cfg or {}).get("cta_url") or "https://www.zwijsen.net/contact-2/"
    cta_text = (content_cfg or {}).get("cta_text") or "Neem contact op"
    blocks.append(
        f'<p><em>Geïnteresseerd? <a href="{cta_url}" target="_blank" rel="nofollow noopener">{cta_text}</a> '
        f'om de mogelijkheden te bespreken.</em></p>'
    )
    blocks.append(_meer_weten_block(funda_link))
    if content_cfg and content_cfg.get("footer_html"):
        blocks.append(content_cfg["footer_html"])
    return "\n".join(blocks)

def _best_geocode_candidate(meta: dict, title_guess: str | None) -> str | None:
    if meta.get("address"):
        return meta["address"]
    if meta.get("street") and (meta.get("house_number") or meta.get("place")):
        hn = f" {meta['house_number']}" if meta.get("house_number") else ""
        pl = f", {meta['place']}" if meta.get("place") else ""
        return f"{meta['street']}{hn}{pl}"
    if title_guess:
        q = title_guess
        if q.startswith(TITLE_PREFIX):
            q = q[len(TITLE_PREFIX):].strip()
        return q
    if meta.get("place"):
        return meta["place"]
    return None

def _load_sites(cfg: dict) -> list[dict]:
    if "wordpress_sites" in cfg and isinstance(cfg["wordpress_sites"], list):
        return cfg["wordpress_sites"]
    if "wordpress" in cfg and isinstance(cfg["wordpress"], dict):
        return [cfg["wordpress"]]
    raise ValueError("Geen geldige WordPress-config (gebruik 'wordpress_sites:' of 'wordpress:').")

def _resolve_categories(wp: WordPressClient, cats):
    if not cats:
        return None
    out = []
    for c in cats:
        if isinstance(c, int):
            out.append(c)
        else:
            out.append(wp.ensure_category(str(c)))
    return out

# --------------------------
# Google Sheet webhook
# --------------------------
def post_to_google_sheet(meta: dict, funda_url: str | None, webhook_cfg: dict | None, status: str = "actief") -> bool:
    if not webhook_cfg or not webhook_cfg.get("url") or not webhook_cfg.get("token"):
        return False
    payload = {
        "type": "kavel",
        "token": webhook_cfg["token"],
        "address": meta.get("address") or "",
        "place": meta.get("place") or "",
        "province": meta.get("province") or "",
        "price": meta.get("price") or "",
        "surface": meta.get("surface") or "",
        "url": funda_url or "",
        "date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "status": status or "actief",
    }
    try:
        r = requests.post(webhook_cfg["url"], json=payload, timeout=10)
        r.raise_for_status()
        data = r.json() if r.headers.get("content-type","").startswith("application/json") else {}
        if isinstance(data, dict) and data.get("success"):
            log.info("Sheets sync OK%s.", " (dup)" if data.get("duplicate") else "")
            return True
        log.warning("Sheets: geen success (status=%s, body=%s)", r.status_code, data)
    except Exception as e:
        log.warning("Sheets: fout bij verzenden: %s", e)
    return False

# --------------------------
# Pipeline
# --------------------------
def run_pipeline(cfg: dict):
    geo_key_cfg = cfg.get("maps", {}).get("geoapify_api_key")
    if geo_key_cfg and not os.getenv("GEOAPIFY_API_KEY"):
        os.environ["GEOAPIFY_API_KEY"] = str(geo_key_cfg)

    artifacts = Path(cfg.get("maps", {}).get("output_dir", "artifacts/maps"))
    state_file = Path(cfg.get("state", {}).get("processed_store", "state/processed.json"))
    artifacts.mkdir(parents=True, exist_ok=True)
    state_file.parent.mkdir(parents=True, exist_ok=True)

    content_cfg = cfg.get("content", {}) or {}
    sites = _load_sites(cfg)
    webhook_cfg = cfg.get("sheets_webhook")

    gm_cfg = cfg["gmail"]
    gmail = GmailClient(gm_cfg["credentials_file"], gm_cfg["token_file"])
    query = gm_cfg.get("query", 'from:notificaties@service.funda.nl subject:"zoekopdracht" newer_than:7d')
    messages = gmail.search_messages(query=query, max_results=10)
    log.info("Gevonden Gmail-berichten: %s", len(messages))

    store = StateStore(str(state_file))

    ppl_cfg = cfg.get("perplexity", {}) or {}
    pplx = None
    if ppl_cfg.get("enabled") and PerplexityClient:
        try:
            pplx = PerplexityClient(api_key=ppl_cfg.get("api_key"), model=ppl_cfg.get("model", "sonar-pro"))
            log.info("Perplexity ingeschakeld met model: %s", pplx.model)
        except Exception as e:
            log.warning("Perplexity uitgeschakeld: %s", e)

    size = cfg.get("maps", {}).get("size", "800x500")
    zoom = int(cfg.get("maps", {}).get("zoom", 15))

    for msg in messages:
        listings = gmail.extract_listings(msg)  # lijst van dicts met minstens 'url'
        log.info("Mail bevat %d listing(s)", len(listings))
        for meta in listings:
            url_raw = meta["url"]
            url = normalize_url(url_raw)
            funda_id = extract_funda_id(url)

            # --------- DEDUPE LAAG 1: lokale StateStore (URL of Funda-ID) ----------
            if store.is_processed_url(url) or (funda_id and store.is_processed_id(funda_id)):
                log.info("Skip (local dedupe): %s%s", url, f" (id={funda_id})" if funda_id else "")
                try:
                    post_to_google_sheet(meta, meta.get("url"), webhook_cfg, status="dupe")
                except Exception:
                    pass
                continue

            # --------- Verrijking (Perplexity of Funda parser) ----------
            enrich = None
            if pplx:
                try:
                    enrich = pplx.extract_listing(url_raw)
                    for k in ("title","street","house_number","postal_code","place","province","address",
                              "price","surface","description_short","summary_nl","article_nl"):
                        if enrich.get(k):
                            meta[k] = enrich[k]
                except Exception as e:
                    log.warning("Perplexity verrijking mislukt voor %s: %s", url_raw, e)

            # Use Funda parser as fallback if Perplexity didn't provide address/province
            if not meta.get("address") or not meta.get("province"):
                try:
                    log.info("Gebruik Funda parser als fallback voor %s", url_raw)
                    funda_data = parse_funda(url_raw)
                    for k in ("title","street","house_number","postal_code","place","province","address","price","surface"):
                        if funda_data.get(k) and not meta.get(k):
                            meta[k] = funda_data[k]
                    log.info("Funda parser: address=%s, province=%s", meta.get("address"), meta.get("province"))
                except Exception as e:
                    log.warning("Funda parser mislukt voor %s: %s", url_raw, e)

            # --------- Titel ----------
            title = None
            if meta.get("address"):
                title = meta["address"]
            elif meta.get("street") and (meta.get("house_number") or meta.get("place")):
                hn = f" {meta['house_number']}" if meta.get("house_number") else ""
                pl = f", {meta['place']}" if meta.get("place") else ""
                title = f"{meta['street']}{hn}{pl}"
            if not title:
                title = _guess_title_from_url(url_raw)
            if not title:
                title = "Bouwgrond" + (f" – {meta['place']}" if meta.get("place") else "")
            title = f"{TITLE_PREFIX}{title}"

            # --------- Coördinaten ----------
            lat = lon = None
            coords = (enrich or {}).get("coordinates") if enrich else None
            if isinstance(coords, dict):
                try:
                    lat = float(coords.get("lat"))
                    lon = float(coords.get("lon"))
                except Exception:
                    lat = lon = None
            if lat is not None and lon is not None and abs(lat) < 1e-6 and abs(lon) < 1e-6:
                lat = lon = None

            if lat is None or lon is None:
                q_guess = _guess_title_from_url(url_raw)
                q = _best_geocode_candidate(meta, title_guess=q_guess)
                if q:
                    q = _normalize_geocode_query(q)
                    try:
                        latlon = geocode_place(q)
                        if latlon:
                            lat, lon = latlon

                    except Exception as e:
                        log.debug("Geocoding mislukt (%s): %s", q, e)

            # --------- Kaart ----------
            featured_media_file = None
            if lat is not None and lon is not None:
                map_path = artifacts / f"map_{lat:.5f}_{lon:.5f}.png"
                try:
                    dl_path = download_static_map(lat, lon, size=size, zoom=zoom, out_path=str(map_path))
                    if dl_path and os.path.exists(dl_path):
                        featured_media_file = dl_path
                        log.info("Kaart gedownload: %s", dl_path)
                    else:
                        log.warning("Kaart download overslagen of mislukt (geen provider/geen bestand).")
                except Exception as e:
                    log.warning("Kaart genereren mislukt: %s", e)

            # --------- Content ----------
            content = _render_content(meta, content_cfg)

            # --------- Publiceren naar sites ----------
            posted_any = False
            for site in sites:
                base = site["base_url"].rstrip("/")
                user = site["username"]
                app_pw = site["application_password"]
                status = site.get("status", "draft")
                wp = WordPressClient(base, user, app_pw)

                try:
                    me = wp.whoami()
                    log.info("[%s] Ingelogd als: %s (id=%s)", base, me.get("name") or me.get("slug"), me.get("id"))
                except Exception as e:
                    log.warning("[%s] Inloggen mislukt, sla site over: %s", base, e)
                    continue

                # --------- DEDUPE LAAG 2: WordPress (DISABLED - meta_query werkt niet betrouwbaar) ----------
                # WordPress meta_query geeft altijd dezelfde post terug ongeacht funda_id
                # We vertrouwen alleen op processed.json voor deduplicatie
                # if funda_id:
                #     try:
                #         existing = wp.find_post_by_funda_id(funda_id)
                #         if existing:
                #             log.info("[%s] Skip: funda_id %s bestaat al (post %s)", base, funda_id, existing.get("id"))
                #             posted_any = True  # we beschouwen dit als 'al aanwezig'
                #             continue
                #     except Exception as e:
                #         log.debug("[%s] WP dedupe check niet gelukt: %s", base, e)

                # Categorieën
                cats_cfg = site.get("category_ids") or site.get("category_names")
                if not cats_cfg:
                    if "zwijsen.net" in base:
                        cats_cfg = ["vrije kavel"]
                    else:
                        cats_cfg = ["Bouwgrond"]
                cats = _resolve_categories(wp, cats_cfg)

                # Media upload
                featured_id = None
                if featured_media_file:
                    try:
                        media = wp.upload_media(featured_media_file, title=f"Kaart – {meta.get('place') or ''}".strip())
                        featured_id = media.get("id")
                        log.info("[%s] Kaart geüpload: media id=%s", base, featured_id)
                    except Exception as e:
                        log.warning("[%s] Upload media mislukt: %s", base, e)

                # Posten
                try:
                    # Als jouw WP meta ondersteunt, geef funda_id mee; anders laat meta weg.
                    post = wp.create_post(
                        title=title,
                        content=content,
                        status=status,
                        categories=cats,
                        featured_media=featured_id,
                        meta={"funda_id": funda_id} if funda_id else None,
                    )
                    log.info("[%s] Post aangemaakt: id=%s link=%s", base, post.get("id"), post.get("link"))
                    posted_any = True
                except Exception as e:
                    log.warning("[%s] Posten mislukt: %s", base, e)

            # --------- Sheet log ----------
            try:
                funda_for_sheet = _apply_utm(meta.get("url"), content_cfg) or meta.get("url")
                post_to_google_sheet(meta, funda_for_sheet, webhook_cfg, status="actief" if posted_any else "mislukt")
            except Exception:
                pass

            # --------- Markeer verwerkt (URL + ID) ----------
            if posted_any:
                store.mark_processed(url, funda_id)
            else:
                log.warning("Publicatie mislukte op alle sites; URL wordt niet als verwerkt gemarkeerd: %s", url)


def _configure_logging(cfg: dict, override_level: str | None = None) -> int:
    """Configure basic logging; reuse existing handlers if already set."""
    level_str = override_level or (cfg.get("logging") or {}).get("level") or "INFO"
    level = getattr(logging, level_str.upper(), logging.INFO)
    root = logging.getLogger()
    if not root.handlers:
        logging.basicConfig(level=level, format="%(levelname)s %(name)s: %(message)s")
    else:
        root.setLevel(level)
    return level


def run_sync(config_path: str | os.PathLike | None = None, log_level: str | None = None):
    """
    Convenience entry point used by the Node sync worker.

    Loads the YAML config (default: backend/config.yaml) and runs the pipeline.
    """
    cfg_path = Path(config_path) if config_path else Path(__file__).resolve().parent.parent / "config.yaml"
    if not cfg_path.exists():
        raise FileNotFoundError(f"Configbestand niet gevonden: {cfg_path}")

    with cfg_path.open("r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f) or {}

    cfg_dir = cfg_path.parent.resolve()

    def _resolve_path(p: str | os.PathLike | None) -> str | None:
        if not p:
            return None
        pth = Path(p)
        return str(pth if pth.is_absolute() else (cfg_dir / pth).resolve())

    # Normaliseer paden zodat run_sync vanaf elke cwd werkt
    gm_cfg = cfg.get("gmail") or {}
    gm_cfg["credentials_file"] = _resolve_path(gm_cfg.get("credentials_file")) or gm_cfg.get("credentials_file")
    gm_cfg["token_file"] = _resolve_path(gm_cfg.get("token_file")) or gm_cfg.get("token_file")
    cfg["gmail"] = gm_cfg

    maps_cfg = cfg.get("maps") or {}
    if maps_cfg.get("output_dir"):
        maps_cfg["output_dir"] = _resolve_path(maps_cfg["output_dir"])
        cfg["maps"] = maps_cfg

    state_cfg = cfg.get("state") or {}
    if state_cfg.get("processed_store"):
        state_cfg["processed_store"] = _resolve_path(state_cfg["processed_store"])
        cfg["state"] = state_cfg

    level = _configure_logging(cfg, override_level=log_level)
    log.info("Brikx sync gestart (level=%s)", logging.getLevelName(level))
    run_pipeline(cfg)
