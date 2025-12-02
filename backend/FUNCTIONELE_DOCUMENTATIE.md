# Brikx - Functionele Documentatie

## Overzicht

**Brikx** is een automatiserings-pipeline die Funda bouwgrond notificaties uit Gmail haalt, verrijkt met AI, en automatisch publiceert naar meerdere WordPress websites met kaarten en gestructureerde data naar Google Sheets.

---

## 1. Architectuur & Data Flow

```
┌─────────────┐
│   Gmail     │ → Email notificaties van Funda
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  Gmail Client (OAuth2)                                  │
│  - Authenticatie via Google OAuth                       │
│  - Query emails met filters                             │
│  - Extractie van Funda URLs uit email body              │
│  - Parsing van basis metadata (prijs, m², plaats)       │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  State Store (Deduplicatie Laag 1)                     │
│  - JSON bestand met verwerkte URLs en Funda IDs        │
│  - Voorkomt dubbele verwerking                         │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  Data Verrijking (Parallelle Flows)                    │
│                                                          │
│  Flow A: Perplexity AI (Primair)                       │
│  ├─ Bezoekt Funda pagina                               │
│  ├─ Extraheert: adres, postcode, provincie             │
│  ├─ Genereert SEO artikel (Nederlands)                 │
│  └─ Retourneert gestructureerde JSON                   │
│                                                          │
│  Flow B: Funda Parser (Fallback)                       │
│  ├─ Scrapet Funda HTML direct                          │
│  ├─ Extraheert data uit URL structuur                  │
│  ├─ Postcode → Provincie mapping                       │
│  └─ Plaats → Provincie mapping (100+ steden)           │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  Geocoding & Kaart Generatie                           │
│  - Geocode adres → lat/lon (Geoapify API)              │
│  - Download statische kaart (OpenStreetMap)            │
│  - Opslag in artifacts/maps/                           │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  Content Rendering                                      │
│  - Combineer intro tekst (configureerbaar)             │
│  - AI artikel of fallback summary                      │
│  - Metadata tabel (prijs, m², adres, provincie)        │
│  - CTA buttons met UTM tracking                        │
│  - Footer tekst (configureerbaar)                      │
│  - Contact formulier embed                             │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  Multi-Site WordPress Publishing                       │
│                                                          │
│  Voor elke geconfigureerde WordPress site:             │
│  ├─ Authenticatie (Application Password)               │
│  ├─ Deduplicatie check (custom meta: funda_id)        │
│  ├─ Upload featured image (kaart)                      │
│  ├─ Resolve/create categorieën                         │
│  ├─ Create post met status (publish/draft)            │
│  └─ Retourneer post URL en ID                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  Google Sheets Webhook                                  │
│  - POST JSON naar Google Apps Script                   │
│  - Logt alle verwerkte kavels (ook dupes)             │
│  - Status tracking: actief/dupe/mislukt                │
└──────┬──────────────────────────────────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────┐
│  State Update                                           │
│  - Markeer URL als processed                           │
│  - Markeer Funda ID als processed                      │
│  - Schrijf naar state/processed.json                   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Module Documentatie

### 2.1 Gmail Client (`gmail_client.py`)

**Doel:** Ophalen en parsen van Funda notificatie emails via Gmail API.

#### Functionaliteit:
- **OAuth2 Authenticatie:**
  - Gebruikt `credentials.json` (Google Cloud project)
  - Genereert/refresh `token.json` voor gebruiker
  - Automatische token refresh bij expiratie
  - Lokale webserver voor OAuth flow (poort 8765)

- **Email Zoeken:**
  ```python
  search_messages(query: str, max_results: int = 10) -> List[Dict]
  ```
  - Ondersteunt volledige Gmail query syntax
  - Haalt volledige message data op (headers + body)
  - Decode MIME parts (multipart, base64)

- **URL Extractie:**
  - Regex pattern voor Funda detail URLs
  - Patterns: `/detail/koop/.../<id>/` en `/koop/.../<id>/`
  - Canonicalisatie (strip query params, trailing slashes)

- **Metadata Extractie:**
  ```python
  extract_listings(message: Dict) -> List[Dict[str, str]]
  ```
  - **Prijs:** Regex `€ [\d\.\,]+`
  - **Oppervlak:** Regex `(\d{2,5})\s?m²`
  - **Plaats:** Uit URL path of email tekst (patronen: "in <Plaats>", "te <Plaats>")
  - **Adres:** Gesplitst uit subject indien mogelijk

**Dependencies:**
- `google-api-python-client`
- `google-auth-oauthlib`
- `beautifulsoup4` (HTML parsing)

---

### 2.2 Funda Parser (`funda_parser.py`)

**Doel:** Direct scrapen van Funda pagina's als fallback/aanvulling op Perplexity.

#### Functionaliteit:
- **Web Scraping:**
  - HTTP GET met custom User-Agent
  - BeautifulSoup (lxml parser)
  - Timeout: 30 seconden

- **Data Extractie:**
  1. **Basis:**
     - Title van `<title>` tag
     - Prijs via regex in volledige page text
     - Oppervlak via regex (m² of m2)

  2. **Adres uit URL:**
     ```
     URL: /detail/koop/spanbroek/bouwgrond-houtduif-1-a/89501903
     → plaats: "Spanbroek"
     → straat: "Houtduif"
     → nummer: "1-a"
     → adres: "Houtduif 1-a, Spanbroek"
     ```

  3. **Postcode Extractie:**
     - Regex: `\b(\d{4}\s?[A-Z]{2})\b`
     - Eerste match wordt gebruikt

  4. **Provincie Bepaling:**
     - **Methode 1:** Postcode prefix mapping
       ```python
       "10"-"19" → Noord-Holland
       "20"-"29" → Zuid-Holland
       "30"-"37" → Utrecht
       "38"-"44" → Gelderland
       etc.
       ```

     - **Methode 2:** Plaatsnaam mapping (100+ steden)
       ```python
       "amsterdam" → "Noord-Holland"
       "bilthoven" → "Utrecht"
       "spanbroek" → "Noord-Holland"
       etc.
       ```

**Return Data:**
```python
{
    "url": str,
    "title": str,
    "price": str,           # "€ 150.000"
    "surface": str,         # "500 m²"
    "place": str,           # "Amsterdam"
    "address": str,         # "Teststraat 123, Amsterdam"
    "province": str,        # "Noord-Holland"
    "street": str,          # "Teststraat"
    "house_number": str,    # "123"
    "postal_code": str      # "1234 AB"
}
```

---

### 2.3 Perplexity Client (`perplexity_client.py`)

**Doel:** AI-powered data extractie en content generatie via Perplexity API.

#### Functionaliteit:
- **API Configuratie:**
  - Base URL: `https://api.perplexity.ai`
  - Model: `sonar-pro` (configureerbaar)
  - Temperature: 0.3 (consistentie)
  - Timeout: 60 seconden

- **Prompt Engineering:**
  ```
  System Prompt:
  - Rol: Nederlandstalige redacteur/analist
  - Taak: Feiten ophalen + SEO artikel schrijven
  - Output: Strikt JSON

  User Prompt:
  1. Bezoek Funda URL
  2. Extraheer feiten: adres, postcode, plaats, provincie, prijs, m²
  3. Schrijf 180-280 woord artikel met:
     - Doel: Architectenbureau Jules Zwijsen
     - Tone: Professioneel, informatief
     - Keywords: bouwkavel, bouwgrond, nieuwbouwwoning, architect
     - Structuur: <h2> tussenkopjes
  ```

- **Output Schema:**
  ```json
  {
    "title": "string|null",
    "address": "string|null",
    "street": "string|null",
    "house_number": "string|null",
    "postal_code": "string|null",
    "place": "string|null",
    "province": "string|null",
    "price": "string|null",
    "surface": "string|null",
    "description_short": "string|null",
    "summary_nl": "string|null",
    "article_nl": "string|null"
  }
  ```

- **Error Handling:**
  - JSON parse failures → Fallback: raw content in `article_nl`
  - HTTP errors → Exception propagation
  - Rate limits → Niet gehandled (crashes)

---

### 2.4 Map Fetcher (`map_fetcher.py`)

**Doel:** Genereren van statische kaart afbeeldingen voor featured images.

#### Functionaliteit:
- **Provider: OpenStreetMap via Geoapify**
  ```python
  download_static_map(
      lat: float,
      lon: float,
      size: str = "800x500",
      zoom: int = 15,
      out_path: str
  ) -> str
  ```

- **API Configuratie:**
  - Base URL: `https://maps.geoapify.com/v1/staticmap`
  - API key: Via environment var `GEOAPIFY_API_KEY` of config
  - Style: `osm-bright`
  - Marker: Rode pin op locatie

- **Output:**
  - PNG bestand
  - Naamgeving: `map_{lat:.5f}_{lon:.5f}.png`
  - Opslag: `artifacts/maps/`

---

### 2.5 Geocoding (`geocode.py`)

**Doel:** Converteer adres/plaatsnaam naar GPS coördinaten.

#### Functionaliteit:
- **Provider: Geoapify Geocoding API**
  ```python
  geocode_place(query: str) -> Tuple[float, float] | None
  ```

- **Query Preprocessing:**
  - Strip "ong." (ongeveer)
  - Strip "Onbekend"
  - Normaliseer whitespace
  - Lowercase matching

- **API Response:**
  - Kiest eerste result
  - Retourneert `(lat, lon)` of `None`

---

### 2.6 WordPress Client (`wordpress_client.py`)

**Doel:** Communicatie met WordPress REST API v2.

#### Functionaliteit:

**Authenticatie:**
```python
WordPressClient(base_url: str, username: str, app_password: str)
```
- HTTP Basic Auth met Application Password
- Sessie met persistent headers

**Core Methods:**

1. **`whoami()` → Dict**
   - GET `/wp-json/wp/v2/users/me`
   - Retourneert gebruikersinfo
   - Test connectie

2. **`find_post_by_funda_id(funda_id: str) → Dict | None`**
   - GET `/wp-json/wp/v2/posts?meta_key=funda_id&meta_value={id}`
   - Deduplicatie check
   - Retourneert eerste match of None

3. **`ensure_category(name: str) → int`**
   - Zoekt category by slug/name
   - Maakt aan indien niet bestaat
   - Retourneert category ID

4. **`upload_media(file_path: str, title: str) → Dict`**
   - POST `/wp-json/wp/v2/media`
   - Upload binary file
   - Content-Disposition header met filename
   - Retourneert media object (incl. ID)

5. **`create_post(...) → Dict`**
   ```python
   create_post(
       title: str,
       content: str,
       status: str = "draft",
       categories: List[int] = None,
       tags: List[int] = None,
       featured_media: int = None,
       meta: Dict = None
   ) → Dict
   ```
   - POST `/wp-json/wp/v2/posts`
   - Retourneert volledige post data (ID, link, etc.)

**Custom Meta:**
- `funda_id` → Voor deduplicatie
- Vereist WordPress plugin/theme support

---

### 2.7 State Store (`state_store.py`)

**Doel:** Persistent opslaan van verwerkte URLs/IDs voor deduplicatie.

#### Functionaliteit:

**Data Structuur:**
```json
{
  "processed_urls": [
    "https://www.funda.nl/detail/koop/.../12345",
    "https://www.funda.nl/detail/koop/.../67890"
  ],
  "processed_ids": [
    "12345",
    "67890"
  ]
}
```

**Methods:**
```python
StateStore(file_path: str)

# Check of URL/ID al verwerkt is
is_processed_url(url: str) -> bool
is_processed_id(funda_id: str) -> bool

# Markeer als verwerkt
mark_processed(url: str, funda_id: str = None) -> None
```

**Helpers:**
```python
extract_funda_id(url: str) -> str | None
# Regex: /(\d+)/?$ → Laatste cijferreeks in URL

normalize_url(url: str) -> str
# Strip query params en fragments
```

---

### 2.8 Publisher (Hoofdpipeline - `publisher.py`)

**Doel:** Orkestreren van volledige workflow.

#### Pipeline Stappen:

**1. Initialisatie:**
- Laad config YAML
- Setup directories (`artifacts/maps/`, `state/`)
- Initialize clients (Gmail, Perplexity, WordPress)

**2. Gmail Fetch:**
```python
messages = gmail.search_messages(query, max_results=10)
for message in messages:
    listings = gmail.extract_listings(message)
```

**3. Per Listing Loop:**

**3a. Deduplicatie (Laag 1 - Local State):**
```python
if state.is_processed_url(url) or state.is_processed_id(funda_id):
    log("Skip (local dedupe)")
    post_to_google_sheet(meta, url, webhook_cfg, status="dupe")
    continue
```

**3b. Data Verrijking:**
```python
# Primair: Perplexity
if pplx:
    enrich = pplx.extract_listing(url)
    meta.update(enrich)

# Fallback: Funda Parser
if not meta.get("address") or not meta.get("province"):
    funda_data = parse_funda(url)
    meta.update(funda_data)
```

**3c. Titel Generatie:**
```python
# Prioriteit:
1. meta["address"]                    # "Teststraat 123, Amsterdam"
2. f"{street} {nr}, {place}"         # Gecombineerd
3. URL parsing                        # Uit path
4. f"Bouwgrond - {place}"            # Fallback
→ Prepend: "Nieuwe bouwgrond te koop: "
```

**3d. Geocoding:**
```python
# Prioriteit voor geocode query:
1. meta["address"]
2. f"{street} {nr}, {place}"
3. Titel guess uit URL
4. meta["place"]

lat, lon = geocode_place(query)
```

**3e. Kaart Generatie:**
```python
if lat and lon:
    map_path = f"map_{lat:.5f}_{lon:.5f}.png"
    download_static_map(lat, lon, size, zoom, map_path)
```

**3f. Content Rendering:**
```python
content = _render_content(meta, content_cfg)

# Structuur:
# 1. Intro HTML (config)
# 2. AI artikel OF summary OR fallback
# 3. Metadata tabel (prijs, m², adres, provincie)
# 4. Funda link (met UTM)
# 5. CTA button (config)
# 6. "Meer weten?" sectie (hardcoded)
# 7. Contact formulier embed
# 8. Footer HTML (config)
```

**3g. Multi-Site Publishing:**
```python
for site in wordpress_sites:
    wp = WordPressClient(base_url, user, app_pw)

    # Deduplicatie Laag 2
    if wp.find_post_by_funda_id(funda_id):
        continue

    # Categorieën
    cats = [wp.ensure_category(name) for name in category_names]

    # Media upload
    featured_id = wp.upload_media(map_path, title)

    # Post
    post = wp.create_post(
        title=title,
        content=content,
        status=status,
        categories=cats,
        featured_media=featured_id,
        meta={"funda_id": funda_id}
    )
```

**3h. Google Sheets Logging:**
```python
status = "actief" if posted_any else "mislukt"
post_to_google_sheet(meta, funda_url, webhook_cfg, status)
```

**3i. State Update:**
```python
if posted_any:
    state.mark_processed(url, funda_id)
```

---

## 3. Configuratie (`config.yaml`)

### Volledige Schema:

```yaml
# Gmail API
gmail:
  credentials_file: "secrets/credentials.json"
  token_file: "secrets/token.json"
  query: 'from:notificaties@service.funda.nl newer_than:7d'

# WordPress Sites (Multi-site support)
wordpress_sites:
  - name: "kavelarchitect"
    base_url: "https://kavelarchitect.nl"
    username: "n8n-bot"
    application_password: "xxxx xxxx xxxx xxxx"
    status: "publish"                      # draft | publish | pending
    category_names: ["Bouwgrond"]          # Tekst (wordt opgezocht/aangemaakt)
    # OF:
    category_ids: [1, 2]                   # Directe IDs

  - name: "zwijsen"
    base_url: "https://www.zwijsen.net"
    username: "jules"
    application_password: "xxxx xxxx xxxx xxxx"
    status: "publish"
    category_names: ["vrije kavel"]

# Kaarten
maps:
  output_dir: "artifacts/maps"
  provider: "osm"                           # Altijd OSM via Geoapify
  zoom: 15                                  # 1-20
  size: "800x500"                           # WxH pixels
  geoapify_api_key: "your-key-here"

# State Management
state:
  processed_store: "state/processed.json"

# Logging
logging:
  level: "INFO"                             # DEBUG | INFO | WARNING | ERROR

# Perplexity AI
perplexity:
  enabled: true
  api_key: "pplx-xxxxxxxxx"
  model: "sonar-pro"                        # sonar | sonar-pro

# Content Templating
content:
  intro_html: "<p>Intro tekst...</p>"
  footer_html: "<p>Footer tekst...</p>"
  cta_url: "https://www.zwijsen.net/contact-2/"
  cta_text: "Neem contact op"

  # UTM Tracking
  add_utm: true
  utm_source: "kavelarchitect"
  utm_medium: "post"
  utm_campaign: "bouwgrond"

  # Tags (alleen ondersteund als WP API het toestaat)
  default_tags:
    - "bouwgrond"
    - "bouwkavel"
    - "nieuwbouwwoning"
    - "architect"
    - "vergunning"

# Google Sheets Webhook
sheets_webhook:
  url: "https://script.google.com/macros/s/.../exec"
  token: "your-secret-token"
```

---

## 4. Google Sheets Integratie

### Webhook Payload:

```json
{
  "type": "kavel",
  "token": "secret-token-for-auth",
  "address": "Teststraat 123, Amsterdam",
  "place": "Amsterdam",
  "province": "Noord-Holland",
  "price": "€ 150.000",
  "surface": "500 m²",
  "url": "https://www.funda.nl/detail/.../12345?utm_source=...",
  "date": "2025-11-15",
  "status": "actief"           // actief | dupe | mislukt | test
}
```

### Expected Response:

```json
{
  "success": true,
  "type": "kavel",
  "duplicate": false,          // Optioneel
  "row": 42                    // Optioneel
}
```

### Google Apps Script (Server-side):

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Kavels");
  const data = JSON.parse(e.postData.contents);

  // Validatie
  if (data.token !== "your-secret-token") {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Invalid token"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Required fields check
  const required = ["address", "province"];
  for (let field of required) {
    if (!data[field]) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing fields for kavel",
        fields: [field]
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Check duplicate
  const urlCol = 7; // URL column
  const existingUrls = sheet.getRange(2, urlCol, sheet.getLastRow()).getValues();
  const isDuplicate = existingUrls.some(row => row[0] === data.url);

  // Append row
  sheet.appendRow([
    data.address,
    data.place,
    data.province,
    data.price,
    data.surface,
    data.url,
    data.date,
    data.status
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    type: data.type,
    duplicate: isDuplicate,
    row: sheet.getLastRow()
  })).setMimeType(ContentService.MimeType.JSON);
}
```

---

## 5. Automatisering

### Windows Task Scheduler:

**Taak 1: Dagelijks om 8:00**
```xml
Trigger: Daily at 08:00
Action: Run "E:\Funda Wordpress\run_funda_sync.bat"
Settings:
  - Run whether user is logged on or not
  - Wake computer to run
  - Run with highest privileges
```

**Taak 2: Bij opstarten (1x per dag)**
```xml
Trigger: At startup
Delay: 2 minutes
Action: Run "E:\Funda Wordpress\run_funda_sync.bat"
Conditions:
  - Only if network available
  - Start only if computer is on AC power: No
```

### Installatie Scripts:

**`INSTALLEER_AUTOMATISCHE_TAAK_MET_OPSTARTEN.bat`:**
```batch
schtasks /create /tn "BrikxFundaSync_Daily" /tr "..." /sc daily /st 08:00 /ru "%USERNAME%" /f
schtasks /create /tn "BrikxFundaSync_OnStartup" /tr "..." /sc onstart /delay 0002:00 /ru "%USERNAME%" /f
```

---

## 6. Dashboard (`dashboard.html` + `dashboard_server.py`)

### Frontend (HTML/CSS/JS):

**Features:**
- **Statistics Cards:**
  - Totaal verwerkte URLs
  - Unieke Funda IDs
  - Laatste update tijd

- **Actions:**
  - ▶️ Start Sync Nu → API call naar `/api/run-sync`
  - 🔄 Ververs Data → Reload state.json
  - 📄 Open State Bestand → Open JSON in nieuwe tab
  - ⚙️ Open Configuratie → Open config.yaml

- **URL List:**
  - Genummerde lijst met alle verwerkte URLs
  - Klikbare links naar Funda
  - Funda ID badges
  - Zoekfunctie (filter op plaats/straat/ID)

- **Auto-refresh:** Elke 30 seconden

### Backend (Python HTTP Server):

**Endpoints:**

1. **`GET /api/state`**
   ```python
   # Response:
   {
     "processed_urls": [...],
     "processed_ids": [...]
   }
   ```

2. **`POST /api/run-sync`**
   ```python
   # Actie: subprocess.Popen(['cmd', '/c', 'start', 'cmd', '/k', 'run_funda_sync.bat'])
   # Response:
   {
     "success": true,
     "message": "Sync gestart in nieuw venster"
   }
   ```

3. **`GET /` of `GET /dashboard.html`**
   - Serve static HTML

**Server Start:**
```bash
python dashboard_server.py
# → http://localhost:8765
```

---

## 7. Error Handling & Logging

### Logging Levels:

```python
# Config: logging.level = "INFO"

DEBUG:
  - Gmail API requests
  - WordPress API calls
  - Geocoding queries
  - State reads/writes

INFO:
  - Pipeline start/stop
  - Messages found count
  - Listings per mail
  - WordPress login success
  - Post creation success
  - Sheets sync success

WARNING:
  - Perplexity failures (met fallback)
  - Map download failures
  - WordPress dedupe skips
  - Sheets sync failures

ERROR:
  - Gmail auth failures
  - Config errors
  - Unrecoverable errors
```

### Exception Handling:

**Gmail Auth:**
- Token expired → Auto refresh
- No token → OAuth flow in browser

**WordPress:**
- Auth failure → Skip site, continue with others
- Dedupe found → Log + continue
- Post creation fail → Log warning, don't mark processed

**Perplexity:**
- API failure → Fallback naar Funda parser
- JSON parse error → Use raw text in `article_nl`

**Geocoding/Maps:**
- Geocode fail → No map, continue without
- Map download fail → No featured image

**Google Sheets:**
- Webhook fail → Log warning, don't block pipeline
- Missing fields → Log fields, continue

---

## 8. Dependencies

### Python Packages (`setup.cfg`):

```ini
[options]
python_requires = >=3.11
install_requires =
    requests>=2.32.0
    PyYAML>=6.0.1
    beautifulsoup4>=4.12.0
    lxml>=5.3.0
    google-api-python-client>=2.147.0
    google-auth-httplib2>=0.2.0
    google-auth-oauthlib>=1.2.0
    python-dateutil>=2.9.0.post0
    pillow>=10.4.0
```

### External Services:

1. **Gmail API**
   - Requires: Google Cloud project
   - OAuth 2.0 credentials
   - Scopes: `gmail.readonly`

2. **Perplexity API**
   - Requires: API key van perplexity.ai
   - Pricing: Per token usage

3. **Geoapify API**
   - Requires: API key
   - Free tier: 3000 requests/day

4. **WordPress REST API v2**
   - Requires: WordPress 5.0+
   - Application Password per user
   - REST API enabled

5. **Google Sheets (via Apps Script)**
   - Requires: Deployed web app
   - Public access or token auth

---

## 9. Security Overwegingen

### Credentials Storage:

**❌ NIET DOEN:**
- Credentials in git committen
- API keys hardcoded in code
- Plaintext passwords in config (tenzij local only)

**✅ BESTE PRACTICES:**
- `secrets/` directory in `.gitignore`
- Environment variables voor API keys
- Application Passwords (WordPress)
- OAuth tokens (Gmail)

### API Key Rotatie:

- Perplexity: Maandelijks roteren aanbevolen
- Geoapify: Jaarlijks of bij breach
- WordPress App Passwords: Per user, revoke bij inactiviteit

### Google Sheets Webhook:

- Token-based authenticatie
- HTTPS only
- Rate limiting op server-side
- Input validatie (schema check)

---

## 10. Uitbreidingsmogelijkheden

### Potentiële Features:

1. **Multi-Platform Support:**
   - Andere makelaars (Pararius, Jaap.nl)
   - Andere notification sources (RSS, webhooks)

2. **Advanced Filtering:**
   - Prijs range filters
   - Oppervlak minimums
   - Geografische grenzen (bounding box)

3. **Image Processing:**
   - Download Funda fotos
   - Watermark toevoeging
   - Resize/optimize voor web

4. **Content Templates:**
   - Per-site templates
   - Jinja2/Liquid templating
   - A/B testing variants

5. **Analytics:**
   - Post performance tracking
   - Click-through rates (UTM)
   - Conversion tracking

6. **Notifications:**
   - Email bij nieuwe posts
   - Slack/Discord webhooks
   - SMS alerts

7. **Database Backend:**
   - SQLite voor state (ipv JSON)
   - Full audit log
   - Retention policies

8. **Web UI voor Config:**
   - WYSIWYG template editor
   - Live preview
   - Multi-user support

---

## 11. Testing Strategy

### Unit Tests:

```python
# test_gmail_client.py
def test_extract_funda_id():
    url = "https://funda.nl/detail/koop/amsterdam/123"
    assert extract_funda_id(url) == "123"

def test_canonical_url():
    url = "https://funda.nl/detail/koop/test/123?foo=bar#hash"
    assert _canonical(url) == "https://funda.nl/detail/koop/test/123"

# test_funda_parser.py
def test_province_from_postcode():
    assert get_province("1012 AB") == "Noord-Holland"
    assert get_province("3000 AA") == "Utrecht"

# test_wordpress_client.py (mocked)
@patch('requests.Session.post')
def test_create_post(mock_post):
    mock_post.return_value.json.return_value = {"id": 123}
    wp = WordPressClient("https://test.com", "user", "pass")
    post = wp.create_post("Title", "Content")
    assert post["id"] == 123
```

### Integration Tests:

```python
# _test_gmail_query.py (existing)
# _test_google_sheets.py (existing)

# test_full_pipeline.py
def test_single_listing_flow():
    """Test complete flow met mock data"""
    # Mock Gmail response
    # Mock Perplexity response
    # Mock WordPress API
    # Assert state file updated
    # Assert sheets webhook called
```

### Manual Testing:

```bash
# Test individuele modules
python _map_test.py
python _wp_smoke_test.py
python _test_gmail_query.py
python _test_google_sheets.py

# Test volledige pipeline (dry-run)
python -m brikx --config config.yaml --log-level DEBUG --dry-run
```

---

## 12. Deployment Checklist

### Eerste Keer Setup:

- [ ] Python 3.11+ geïnstalleerd
- [ ] Git clone repository
- [ ] `pip install -e .`
- [ ] Google Cloud project aangemaakt
- [ ] Gmail API credentials gedownload → `secrets/credentials.json`
- [ ] OAuth flow doorlopen → `secrets/token.json`
- [ ] Perplexity API key verkregen
- [ ] Geoapify API key verkregen
- [ ] WordPress Application Passwords aangemaakt
- [ ] Google Sheets webhook deployed
- [ ] `config.yaml` ingevuld (alle placeholders vervangen)
- [ ] Directories aangemaakt: `artifacts/maps/`, `state/`
- [ ] Test run: `python -m brikx --config config.yaml`
- [ ] Windows Task Scheduler taken aangemaakt
- [ ] Dashboard server getest

### Onderhoud:

- [ ] Wekelijks: Check logs voor errors
- [ ] Maandelijks: Review processed URLs
- [ ] Kwartaal: API key rotatie
- [ ] Jaarlijks: Dependency updates (`pip list --outdated`)

---

## 13. Troubleshooting

### Veelvoorkomende Problemen:

**"No module named 'brikx'"**
```bash
pip install -e .
```

**"Gmail API: invalid_grant"**
```bash
rm secrets/token.json
python -m brikx --config config.yaml  # Triggers OAuth
```

**"Perplexity: 401 Unauthorized"**
- Check API key in config
- Verify balance op perplexity.ai

**"WordPress: 403 Forbidden"**
- Verify Application Password correct
- Check REST API enabled: `/wp-json/` toegankelijk?

**"No URLs found in Gmail"**
- Check Gmail query syntax
- Test met simpelere query: `from:notificaties@service.funda.nl`
- Verify emails aanwezig in Gmail

**"Sheets: Missing fields"**
- Check Perplexity/Funda parser output
- Verify `address` en `province` gevuld
- Add plaats naar provincie mapping indien nodig

---

## 14. Code Structuur

```
E:\Funda Wordpress\
├── brikx/                          # Main package
│   ├── __init__.py
│   ├── __main__.py                 # Entry point
│   ├── cli.py                      # Argument parsing
│   ├── gmail_client.py             # Gmail API
│   ├── funda_parser.py             # Web scraping
│   ├── perplexity_client.py        # AI API
│   ├── wordpress_client.py         # WordPress REST API
│   ├── map_fetcher.py              # Static maps
│   ├── geocode.py                  # Address → GPS
│   ├── state_store.py              # Deduplication
│   └── publisher.py                # Main orchestration
│
├── secrets/                        # Git ignored
│   ├── credentials.json            # Gmail OAuth
│   └── token.json                  # Gmail access token
│
├── state/
│   └── processed.json              # Persistent state
│
├── artifacts/
│   └── maps/                       # Generated map images
│       ├── map_52.12345_4.56789.png
│       └── ...
│
├── config.yaml                     # Main configuration
├── setup.py                        # Package setup
├── setup.cfg                       # Dependencies
│
├── run_funda_sync.bat              # Run script
├── run-brikx.cmd                   # Alt run script
├── START_DASHBOARD.bat             # Dashboard launcher
│
├── INSTALLEER_AUTOMATISCHE_TAAK.bat
├── INSTALLEER_AUTOMATISCHE_TAAK_MET_OPSTARTEN.bat
│
├── dashboard.html                  # Web dashboard
├── dashboard_server.py             # HTTP server
│
├── _test_gmail_query.py            # Test scripts
├── _test_google_sheets.py
├── _map_test.py
├── _wp_smoke_test.py
└── ...
```

---

## 15. Performance & Schaalbaarheid

### Huidige Bottlenecks:

1. **Perplexity API:**
   - ~30-60 sec per URL
   - Rate limits: afhankelijk van plan
   - **Oplossing:** Parallelle requests (asyncio)

2. **WordPress REST API:**
   - Sequentieel per site
   - ~5-10 sec per post
   - **Oplossing:** Multi-threading

3. **Geocoding:**
   - Rate limits: 3000/dag (free tier)
   - **Oplossing:** Cache lat/lon per plaats

### Optimalisaties:

**Voor 100+ listings/dag:**
- Async HTTP client (aiohttp)
- Connection pooling
- Local cache (Redis/SQLite)
- Bulk WordPress operations
- CDN voor kaarten

**Voor 1000+ listings/dag:**
- Queue systeem (RabbitMQ/SQS)
- Worker pool
- Database backend (PostgreSQL)
- Distributed cache
- Load balancing

---

## 16. Compliance & Privacy

### GDPR:

- Gmail data: Alleen notificaties, geen persoonlijke emails
- State file: Alleen URLs, geen persoonsgegevens
- Google Sheets: Adressen van kavels (publieke info)

### Data Retention:

- State file: Onbeperkt (geen PII)
- Logs: 30 dagen rotatie aanbevolen
- Maps: Opschonen oudere dan 90 dagen

### API Terms of Service:

- **Funda:** Web scraping toegestaan? Check ToS
- **Perplexity:** Commercial use toegestaan
- **WordPress.org:** No restrictions
- **Geoapify:** Attribution required (check plan)

---

Dit document bevat alle functionele details om een vergelijkbare applicatie te bouwen in een andere technologie stack of met andere data sources.
