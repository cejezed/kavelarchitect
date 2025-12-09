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
            "Jules Zwijsen is een ervaren architect die particuliere bouwers begeleidt van de eerste schets tot de sleuteloverdracht. "
            "Je schrijft uitgebreide, hoogwaardige 'Pillar Content' over bouwkavels die de lezer informeert én motiveert om contact op te nemen. "
            "Je doel is om organisch verkeer te trekken (SEO) én vertrouwen te wekken door de rol van Jules Zwijsen als begeleider centraal te stellen."
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
1) **Analyse & Feiten**: Extraheer alle harde feiten (adres, prijs, m², bouwregels, bestemmingsplan details).

2) **SEO Strategie**:
   - Bepaal het beste **Focus Keyword** (bijv. "Bouwkavel [Plaats]", "Villa bouwen [Plaats]" of "Architect bouwkavel [Plaats]").
   - Bedenk een **SEO Titel** die begint met het focus keyword en vertrouwen wekt (bijv. "Architect Begeleidt u bij...", "Van Kavel tot Droomhuis in...").

3) **Schrijf het Artikel (HTML)** - FOCUS OP BEGELEIDING DOOR JULES ZWIJSEN:
   - **Lengte**: Minimaal **800 woorden** voor autoriteit en SEO.
   - **Structuur**:
     - **Intro (100 woorden)**:
       * Gebruik focus keyword in eerste zin
       * Benoem direct het probleem: "Een bouwkavel kopen is complex - bestemmingsplannen, vergunningen, risico's"
       * Bied de oplossing: "Jules Zwijsen neemt dit uit handen en begeleidt u persoonlijk"

     - **Hoofdstuk 1: De Kavel (150 woorden)**:
       * H2: "De [Focus Keyword]: Locatie en Mogelijkheden"
       * Beschrijf locatie, oppervlakte, prijs per m², omgeving
       * Benoem unieke kenmerken van deze specifieke kavel

     - **Hoofdstuk 2: Bouwmogelijkheden (150 woorden)**:
       * H2: "Wat Kunt U Bouwen op Deze [Focus Keyword]?"
       * Bestemmingsplan details, goothoogte, nokhoogte, volume
       * Voorbeelden: "Jules Zwijsen heeft ervaring met [type woningen] op vergelijkbare kavels"

     - **Hoofdstuk 3: DE ROL VAN JULES ZWIJSEN (300 woorden) - MEEST BELANGRIJK**:
       * H2: "Hoe Jules Zwijsen U Begeleidt bij de Realisatie van Uw Droomhuis"
       * H3: "Stap 1: Eerste Kennismaking en Haalbaarheidscheck"
         - "Ik analyseer samen met u het bestemmingsplan en de mogelijkheden"
         - "We bespreken uw wensen, budget en tijdlijn"
         - "U krijgt direct duidelijkheid over wat wel en niet kan"
       * H3: "Stap 2: Ontwerp op Maat"
         - "Ik vertaal uw wensen naar een concreet architectonisch ontwerp"
         - "3D-visualisaties zodat u precies ziet hoe uw huis eruit komt te zien"
         - "Rekening houdend met zonligging, privacy en toekomstige waarde"
       * H3: "Stap 3: Vergunningen en Ontzorgen"
         - "Ik regel alle bouwvergunningen en communicatie met de gemeente"
         - "U hoeft zich geen zorgen te maken over complexe regelgeving"
         - "Ervaring met welstandscommissies en bestemmingsplanprocedures"
       * H3: "Stap 4: Bouwbegeleiding"
         - "Van fundering tot oplevering blijf ik betrokken"
         - "Kwaliteitscontrole en voortgangsbewaking"
         - "Uw vertrouwde aanspreekpunt gedurende het hele traject"

     - **Hoofdstuk 4: Waarom Particuliere Bouwers Kiezen voor Jules Zwijsen (100 woorden)**:
       * "Persoonlijke aandacht - geen groot bureau waar u een nummer bent"
       * "Lokale kennis van [provincie/regio] en de lokale regelgeving"
       * "Bewezen track record met particuliere nieuwbouw"
       * "Transparante communicatie en kostenbewaking"

     - **Afsluiting met Call-to-Action (50 woorden)**:
       * "Geïnteresseerd in deze [Focus Keyword]? Neem contact op voor een vrijblijvend gesprek"
       * "Ik bekijk graag samen met u de mogelijkheden en begeleid u van kavel naar droomhuis"

   - **Toon**: Persoonlijk (ik/mijn), toegankelijk, deskundig maar niet afstandelijk
   - **Keyword Dichtheid**: Focus keyword 8-12 keer (natuurlijk verwerkt)
   - **Extra Keywords**: "architect bouwkavel", "begeleiding nieuwbouw", "bouwvergunning", "bestemmingsplan"

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
  "article_nl": "De volledige HTML content (800+ woorden, met hoofdstuk over begeleiding door Jules Zwijsen)",
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
