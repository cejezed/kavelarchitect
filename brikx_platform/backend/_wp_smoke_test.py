from brikx.wordpress_client import WordPressClient
from brikx.map_fetcher import download_static_map
import os, pathlib

# Zet je key inline als je niet via config werkt:
os.environ.setdefault("GEOAPIFY_API_KEY", "68e7239a06964ebd84ae2d37a4f937d4")

# ----> VUL AAN MET JOUW WP GEGEVENS <----
BASE = "https://kavelarchitect.nl"
USER = "n8n-bot"
APP  = " mWbs zVRh gsys IFAF ecBL Wtuf"

wp = WordPressClient(BASE, USER, APP)

# maak testkaart (Dam, Amsterdam)
out = pathlib.Path("artifacts/maps/wp_smoke_test.png")
out.parent.mkdir(parents=True, exist_ok=True)
path = download_static_map(52.3731, 4.8922, "800x500", 15, str(out))
assert path and os.path.exists(path), "Kaart niet gegenereerd!"

media = wp.upload_media(path, title="WP Smoke Test Kaart")
print("MEDIA:", media.get("id"), media.get("source_url"))

post = wp.create_post(
    title="Test: kaart als featured image",
    content=f'<figure><img src="{media.get("source_url")}" style="max-width:100%"/></figure><p>Smoke test.</p>',
    status="draft",
    featured_media=media.get("id"),
)
print("POST:", post.get("id"), post.get("link"))
