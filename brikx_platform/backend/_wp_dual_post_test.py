import os
import time
from pathlib import Path

from brikx.wordpress_client import WordPressClient
from brikx.map_fetcher import download_static_map

# -----------------------------
# Helpers
# -----------------------------
def _test_site(name: str, base: str, user: str, app_pass: str) -> None:
    print(f"\n=== Test {name}: {base} ===")
    wp = WordPressClient(base, user, app_pass)

    # 1) whoami
    me = wp.whoami()
    print(f"  ✔ Ingelogd als: {me.get('name') or me.get('slug')} (id={me.get('id')})")

    # 2) categorie 'Bouwgrond' ophalen of aanmaken
    cat_id = wp.ensure_category("Bouwgrond", slug="bouwgrond")
    print(f"  ✔ Categorie 'Bouwgrond' id={cat_id}")

    # 3) testkaart genereren (Amsterdam Dam)
    artifacts = Path("artifacts/maps")
    artifacts.mkdir(parents=True, exist_ok=True)
    map_path = artifacts / f"test_map_{int(time.time())}.png"

    featured_id = None
    map_url = None
    try:
        out = download_static_map(52.3731, 4.8922, "800x500", 15, str(map_path))
        if out and Path(out).exists():
            media = wp.upload_media(out, title="Testkaart – Amsterdam (Dam)")
            featured_id = media.get("id")
            map_url = media.get("source_url")
            print(f"  ✔ Media geüpload: id={featured_id} url={map_url}")
        else:
            print("  ⚠ Kaart overslagen (geen provider of geen bestand).")
    except Exception as e:
        print(f"  ⚠ Kaart upload mislukt: {e}")

    # 4) testpost maken (draft)
    title = f"TEST – Dual post – {int(time.time())}"
    content = []
    content.append("<p>Dit is een <strong>testpost</strong> geplaatst door het Brikx-script.</p>")
    content.append("<p>Doel: inloggen, categorie &quot;Bouwgrond&quot; garanderen, kaart uploaden en als featured image instellen.</p>")
    if map_url:
        content.append(f'<p>Kaart-URL (ter controle): <a href="{map_url}" target="_blank" rel="noopener">open</a></p>')
    content.append('<p><em>Verwijder deze testpost gerust na controle.</em></p>')
    html = "\n".join(content)

    post = wp.create_post(
        title=title,
        content=html,
        status="draft",
        categories=[cat_id],
        featured_media=featured_id
    )
    print(f"  ✔ Post aangemaakt: id={post.get('id')} link={post.get('link')}")

# -----------------------------
# main
# -----------------------------
if __name__ == "__main__":
    # Lees credentials uit env (veilig) — raise als iets mist
    def _env(name: str) -> str:
        v = os.getenv(name)
        if not v:
            raise SystemExit(f"Environment variable {name} ontbreekt")
        return v

    sites = [
        ("Kavelarchitect", _env("WP1_URL"), _env("WP1_USER"), _env("WP1_PASS")),
        ("Zwijsen",        _env("WP2_URL"), _env("WP2_USER"), _env("WP2_PASS")),
    ]

    for s in sites:
        try:
            _test_site(*s)
        except Exception as e:
            print(f"\n✗ Fout bij {s[0]}: {e}\n")