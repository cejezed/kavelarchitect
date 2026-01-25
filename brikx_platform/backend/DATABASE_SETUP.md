# Supabase Database Setup

## Instructies

Voordat je de sync kunt draaien, moet je eerst de database tabellen aanmaken in Supabase.

### Stap 1: Open Supabase SQL Editor

1. Ga naar [https://supabase.com](https://supabase.com)
2. Log in en open je project: **ymwwydpywichbotrqwsy**
3. Klik in het linker menu op **SQL Editor**
4. Klik op **New Query**

### Stap 2: Maak de `listings` tabel aan

Kopieer en plak het volgende SQL script en klik op **Run**:

```sql
create table listings (
  id uuid default gen_random_uuid() primary key,
  kavel_id text unique not null,
  funda_id text,
  status text default 'pending',
  adres text,
  postcode text,
  plaats text,
  provincie text,
  prijs numeric,
  oppervlakte numeric,
  source_url text,
  image_url text,
  map_url text,
  lat numeric,
  lon numeric,
  seo_title text,
  seo_summary text,
  seo_article_html text,
  seo_title_ka text,
  seo_summary_ka text,
  seo_article_html_ka text,
  seo_title_zw text,
  seo_summary_zw text,
  seo_article_html_zw text,
  specs jsonb default '{}'::jsonb,
  published_sites text[], 
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Stap 3: Maak de `customers` tabel aan

Kopieer en plak het volgende SQL script en klik op **Run**:

```sql
create table customers (
  id uuid default gen_random_uuid() primary key,
  klant_id text unique not null,
  email text not null,
  naam text,
  telefoonnummer text,
  status text default 'actief',
  provincies text[],
  min_prijs numeric,
  max_prijs numeric,
  min_oppervlakte numeric,
  bouwstijl text,
  tijdslijn text,
  bouwbudget text,
  kavel_type text,
  dienstverlening text,
  early_access_rapport boolean default false,
  opmerkingen text,
  created_at timestamp with time zone default now()
);
```

### Stap 4: Verifieer de tabellen

1. Klik in het linker menu op **Table Editor**
2. Je zou nu twee nieuwe tabellen moeten zien: `listings` en `customers`

## Volgende Stappen

Na het aanmaken van de tabellen kun je:

1. Dependencies installeren:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. De sync draaien via het dashboard:
   ```bash
   npm start
   ```
   En klik op de **"Check Funda"** knop.

3. Of handmatig de sync draaien:
   ```bash
   python backend/sync_worker.py
   ```

## Verwachte Output

Als de sync succesvol is, zie je output zoals:

```
[SYNC] Starting Funda sync...
INFO __main__: Initializing Gmail client...
INFO __main__: Searching Gmail with query: from:notificaties@service.funda.nl subject:"zoekopdracht" newer_than:7d
INFO __main__: Found 5 messages
INFO __main__: Extracted 3 listings from message
INFO __main__: Scraping details for 12345678...
INFO __main__: ✅ Inserted listing 12345678
[SYNC] New listing: Bouwgrond Noordeinde 6 - Landsmeer
[SYNC] Sync completed successfully!
[SYNC] New listings: 3
[SYNC] Skipped (already exist): 0
[SYNC] Errors: 0
```

## Troubleshooting

### "Module not found" error
- Zorg dat je `pip install -r backend/requirements.txt` hebt gedraaid

### "SUPABASE_URL en SUPABASE_KEY moeten ingesteld zijn"
- Controleer of je `.env` bestand de volgende variabelen bevat:
  - `SUPABASE_URL`
  - `SUPABASE_KEY`

### "relation 'listings' does not exist"
- Je hebt de database tabellen nog niet aangemaakt
- Volg Stap 2 en 3 hierboven
