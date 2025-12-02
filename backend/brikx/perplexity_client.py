import json
import requests

class PerplexityClient:
    """
    Haalt gestructureerde velden + een SEO-vriendelijk artikel op bij Perplexity.
    Retourneert een dict met o.a.:
      address, street, house_number, postal_code, place, province,
      price, surface, description_short, summary_nl, article_nl,
      goothoogte, nokhoogte, volume, regulations
    """
    def __init__(self, api_key: str, model: str = "sonar-pro", timeout: int = 60):
        self.base = "https://api.perplexity.ai"
        self.model = model
        self.timeout = timeout
        self.s = requests.Session()
        self.s.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        })

    def extract_listing(self, url: str, description_text: str = "") -> dict:
        system = (
            "Je bent een senior SEO-copywriter voor Architectenbureau Jules Zwijsen. "
            "Je schrijft uitgebreide, hoogwaardige 'Pillar Content' over bouwkavels. "
            "Je doel is om organisch verkeer te trekken (SEO) én lezers te converteren naar een afspraak."
        )

        # We vragen om STRIKT JSON – geen extra tekst.
        user = f"""
Bezoek en lees de pagina:
{url}

Hier is de volledige omschrijving van de pagina (gebruik dit als primaire bron voor details):
---
{description_text}
---

Taken:
1) **Analyse & Feiten**: Extraheer alle harde feiten (adres, prijs, m², regels).

2) **SEO Strategie**:
   - Bepaal het beste **Focus Keyword** (bijv. "Bouwkavel [Plaats]", "Huis bouwen [Plaats]" of "Nieuwbouwwoning [Plaats]").
   - Bedenk een **SEO Titel** die begint met het focus keyword en een 'Power Word' bevat (bijv. Unieke, Exclusieve, Prachtige).

3) **Schrijf het Artikel (HTML)**:
   - **Lengte**: Minimaal **600 woorden**. Dit is cruciaal voor 'Pillar Content'.
   - **Structuur**:
     - **Intro**: Gebruik het focus keyword in de eerste zin. Maak het probleem (kavel zoeken) en de oplossing (Jules Zwijsen) direct duidelijk.
     - **Kern**: Gebruik H2 en H3 tussenkopjes. Zorg dat het focus keyword in minimaal 2 tussenkopjes voorkomt.
     - **Inhoud**: Beschrijf de locatie, de mogelijkheden van de kavel, en hoe Jules Zwijsen hier waarde toevoegt (ontwerp, vergunning, bouwbegeleiding).
     - **Dichtheid**: Gebruik het focus keyword natuurlijk door de tekst (ca. 1-2%).
   - **Perspectief**: Wij/Ons (Jules Zwijsen). Professioneel, inspirerend, autoritair.

4) **Output**:
   Retourneer STRIKT JSON.

Retourneer STRIKT JSON met exact deze velden:
{{
  "title": "De geoptimaliseerde SEO titel",
  "focus_keyword": "Het gekozen focus keyword",
  "seo_description": "Meta description met focus keyword (max 155 tekens)",
  "address": string|null,
  "street": string|null,
  "house_number": string|null,
  "postal_code": string|null,
  "place": string|null,
  "province": string|null,
  "price": string|null,
  "surface": string|null,
  "description_short": string|null,
  "summary_nl": string|null,
  "article_nl": "De volledige HTML content (600+ woorden)",
  "goothoogte": number|null,
  "nokhoogte": number|null,
  "volume": number|null,
  "regulations": string|null
}}
"""

        payload = {
            "model": self.model,
            "temperature": 0.3,
            "top_p": 0.9,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user.strip()},
            ],
        }
        r = self.s.post(f"{self.base}/chat/completions", json=payload, timeout=self.timeout)
        r.raise_for_status()
        data = r.json()
        content = (data.get("choices") or [{}])[0].get("message", {}).get("content", "")
        
        # Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
        # Probeer JSON te vinden in de output (ook als er tekst omheen staat)
        import re
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
        elif content and "```" in content:
             # Fallback voor code blocks als regex faalt
             parts = content.split("```")
             for p in parts:
                 if p.strip().startswith("json"):
                     content = p.strip()[4:].strip()
                     break
                 elif p.strip().startswith("{"):
                     content = p.strip()
                     break
        
        try:
            return json.loads(content) if content else {}
        except Exception as e:
            # Fallback: geef ruwe tekst terug in één veld, zodat app niet crasht
            return {"article_nl": content or None, "error": str(e)}
