# brikx/wordpress_client.py
import os
import mimetypes
import requests

class WordPressClient:
    def __init__(self, base_url: str, username: str, application_password: str):
        self.base = base_url.rstrip("/")
        self.s = requests.Session()
        self.s.auth = (username, application_password)
        self.s.headers.update({"User-Agent": "BrikxBot/0.1 (+contact)"})

    # -----------------------
    # Low-level helpers
    # -----------------------
    def _get(self, path: str, **kwargs) -> requests.Response:
        r = self.s.get(f"{self.base}{path}", timeout=kwargs.pop("timeout", 30), **kwargs)
        self._raise_for_status(r)
        return r

    def _post(self, path: str, **kwargs) -> requests.Response:
        r = self.s.post(f"{self.base}{path}", timeout=kwargs.pop("timeout", 60), **kwargs)
        self._raise_for_status(r)
        return r

    @staticmethod
    def _raise_for_status(r: requests.Response) -> None:
        try:
            r.raise_for_status()
        except requests.HTTPError as e:
            try:
                data = r.json()
            except Exception:
                data = r.text
            raise requests.HTTPError(f"{e}; response={data}") from None

    # -----------------------
    # Users
    # -----------------------
    def whoami(self) -> dict:
        return self._get("/wp-json/wp/v2/users/me").json()

    # -----------------------
    # Categories
    # -----------------------
    def ensure_category(self, name: str, slug: str | None = None) -> int:
        params = {"per_page": 100}
        if slug:
            params["slug"] = slug
        r = self._get("/wp-json/wp/v2/categories", params=params)
        items = r.json()
        if slug and items:
            return items[0]["id"]
        if not slug:
            for it in items:
                if it.get("name", "").casefold() == name.casefold():
                    return it["id"]
        payload = {"name": name}
        if slug:
            payload["slug"] = slug
        
        try:
            r = self._post("/wp-json/wp/v2/categories", json=payload)
            return r.json()["id"]
        except requests.HTTPError as e:
            # If category already exists, extract the term_id from the error response
            if "term_exists" in str(e):
                try:
                    import re
                    match = re.search(r"'term_id':\s*(\d+)", str(e))
                    if match:
                        return int(match.group(1))
                except:
                    pass
            raise

    def ensure_categories(self, names: list[str]) -> list[int]:
        ids: list[int] = []
        for n in names or []:
            ids.append(self.ensure_category(n))
        return ids

    # -----------------------
    # Tags
    # -----------------------
    def ensure_tag(self, name: str, slug: str | None = None) -> int:
        params = {"per_page": 100}
        if slug:
            params["slug"] = slug
        r = self._get("/wp-json/wp/v2/tags", params=params)
        items = r.json()
        if slug and items:
            return items[0]["id"]
        if not slug:
            for it in items:
                if it.get("name", "").casefold() == name.casefold():
                    return it["id"]
        payload = {"name": name}
        if slug:
            payload["slug"] = slug
        
        try:
            r = self._post("/wp-json/wp/v2/tags", json=payload)
            return r.json()["id"]
        except requests.HTTPError as e:
            # If tag already exists, extract the term_id from the error response
            if "term_exists" in str(e):
                try:
                    # Extract term_id from error message
                    import re
                    match = re.search(r"'term_id':\s*(\d+)", str(e))
                    if match:
                        return int(match.group(1))
                except:
                    pass
            raise

    def ensure_tags(self, names: list[str]) -> list[int]:
        ids: list[int] = []
        for n in names or []:
            ids.append(self.ensure_tag(n))
        return ids

    # -----------------------
    # Media
    # -----------------------
    def upload_media(
        self,
        file_path: str,
        title: str | None = None,
        alt_text: str | None = None,
        caption: str | None = None,
    ) -> dict:
        url = "/wp-json/wp/v2/media"
        filename = os.path.basename(file_path)
        mime, _ = mimetypes.guess_type(filename)
        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
        with open(file_path, "rb") as fh:
            files = {"file": (filename, fh, mime or "application/octet-stream")}
            data = {}
            if title: data["title"] = title
            if alt_text: data["alt_text"] = alt_text
            if caption: data["caption"] = caption
            r = self._post(url, headers=headers, files=files, data=data)
        return r.json()

    # -----------------------
    # Posts
    # -----------------------
    def create_post(
        self,
        title: str,
        content: str,
        status: str = "draft",
        categories: list[int] | None = None,
        tags: list[int] | None = None,
        featured_media: int | None = None,
        excerpt: str | None = None,
        slug: str | None = None,
        meta: dict | None = None,  # <-- toegevoegd: meta doorgeven als je WP daarvoor ingericht is
    ) -> dict:
        payload: dict = {"title": title, "content": content, "status": status}
        if categories: payload["categories"] = categories
        if tags: payload["tags"] = tags
        if featured_media: payload["featured_media"] = featured_media
        if excerpt: payload["excerpt"] = excerpt
        if slug: payload["slug"] = slug
        if meta: payload["meta"] = meta  # werkt als meta key via register_post_meta 'show_in_rest' is aangezet
        r = self._post("/wp-json/wp/v2/posts", json=payload)
        return r.json()

    # -----------------------
    # Dedupe helpers
    # -----------------------
    def find_post_by_funda_id(self, funda_id: str):
        """
        Zoek naar een bestaande post met meta_key=funda_id.
        Vereist dat de WP-site meta-query via REST toestaat (custom endpoint of plugin).
        Valt terug op search als meta-query niet werkt.
        """
        try:
            # Probeer meta-query (indien ondersteund)
            r = self._get(
                "/wp-json/wp/v2/posts",
                params={"meta_key": "funda_id", "meta_value": funda_id, "per_page": 1},
            )
            items = r.json()
            if isinstance(items, list) and items:
                return items[0]
        except Exception:
            pass
        # Fallback: zoekterm
        try:
            r = self._get("/wp-json/wp/v2/posts", params={"search": funda_id, "per_page": 1})
            items = r.json()
            if isinstance(items, list) and items:
                return items[0]
        except Exception:
            pass
        return None
