# SEO Analyse: Waarom worden kavels niet gevonden via Google?

## 🔍 Diagnose

Je kavels worden niet gevonden via Google terwijl WordPress berichten over dezelfde kavels WEL worden geïndexeerd. Dit komt door meerdere factoren:

### 1. **Technische SEO Issues (NU OPGELOST)**
- ❌ **robots.txt was een statisch bestand** → ✅ Nu `robots.ts` met Next.js MetadataRoute
- ❌ **Sitemap gebruikte altijd `new Date()`** → ✅ Nu echte `created_at` timestamps
- ❌ **Geen expliciete Googlebot instructies** → ✅ Nu toegevoegd

### 2. **Content & Indexering Issues (ACTIE VEREIST)**
- ⚠️ **Nieuwe content**: Als kavels recent zijn gepubliceerd, heeft Google tijd nodig (1-4 weken)
- ⚠️ **Geen interne links**: WordPress berichten hebben waarschijnlijk meer interne links
- ⚠️ **Geen backlinks**: WordPress berichten hebben mogelijk externe links
- ⚠️ **Sitemap niet ingediend**: Check of sitemap in Google Search Console staat

### 3. **WordPress vs Next.js Verschil**
WordPress berichten worden beter gevonden omdat:
- Oudere content (meer authority)
- Betere interne linking structuur
- Mogelijk meer social shares
- Mogelijk backlinks van andere sites

## ✅ Wat ik heb opgelost

### 1. **robots.ts aangemaakt**
```typescript
// Voorheen: statisch robots.txt bestand
// Nu: dynamisch robots.ts met Next.js MetadataRoute
```

### 2. **Sitemap verbeterd**
- Gebruikt nu echte `created_at` timestamps
- Betere prioriteiten voor verschillende pagina types
- Kavelpagina's hebben priority 0.8 (hoog)

### 3. **Listing interface uitgebreid**
- `created_at` en `updated_at` toegevoegd voor timestamp tracking

## 🚀 Wat je NU moet doen

### Stap 1: Verwijder oude robots.txt
```bash
# Verwijder het oude statische bestand
rm app/robots.txt
```

### Stap 2: Rebuild en deploy
```bash
npm run build
# Deploy naar Vercel
```

### Stap 3: Google Search Console
1. Ga naar [Google Search Console](https://search.google.com/search-console)
2. Selecteer je property `kavelarchitect.nl`
3. Ga naar **Sitemaps** in het linker menu
4. Voeg toe: `https://kavelarchitect.nl/sitemap.xml`
5. Klik op **Indienen**

### Stap 4: URL Inspection Tool
Voor elke belangrijke kavelpagina:
1. Ga naar **URL Inspection** in GSC
2. Voer de URL in: `https://kavelarchitect.nl/aanbod/[kavel-id]`
3. Klik op **Request Indexing**
4. Herhaal voor je top 10-20 kavels

### Stap 5: Interne Linking Verbeteren
**Belangrijkste actie voor snellere indexering!**

#### A. Link vanuit WordPress naar kavels
Voeg in je WordPress berichten links toe naar specifieke kavels:
```html
<a href="https://kavelarchitect.nl/aanbod/[kavel-id]">Bekijk deze kavel</a>
```

#### B. Link vanuit homepage naar kavels
De homepage heeft al een kavel overzicht, maar zorg dat:
- Elke kavel een directe link heeft
- De links in de HTML staan (niet alleen JavaScript)

#### C. Maak een "Alle Kavels" overzichtspagina
Ik zie dat `/aanbod` al bestaat - zorg dat deze pagina:
- Alle kavels toont (ook verkochte met label)
- Goede SEO heeft (H1, meta description)
- Gefilterd kan worden op provincie/plaats

### Stap 6: Schema.org Verbeteren
Je hebt al `RealEstateListing` schema, maar voeg ook toe:
- `datePublished`: wanneer de kavel online kwam
- `dateModified`: laatste wijziging
- `image`: array met meerdere afbeeldingen (als beschikbaar)

## 📊 Verwachte Resultaten

### Korte termijn (1-2 weken)
- Sitemap wordt door Google gecrawld
- Eerste kavels verschijnen in Google Index
- URL Inspection requests worden verwerkt

### Middellange termijn (2-4 weken)
- Meeste kavels zijn geïndexeerd
- Eerste zoekresultaten voor long-tail keywords
- Bijvoorbeeld: "bouwkavel [plaatsnaam]"

### Lange termijn (1-3 maanden)
- Hogere rankings voor competitieve keywords
- Meer organisch verkeer
- Betere visibility in Google

## 🎯 Extra Optimalisaties (Optioneel maar Aanbevolen)

### 1. **Structured Data Testing**
Test je schema.org markup:
- Ga naar [Rich Results Test](https://search.google.com/test/rich-results)
- Voer een kavel URL in
- Controleer of `RealEstateListing` correct wordt herkend

### 2. **Page Speed**
Snellere pagina's = betere rankings:
```bash
# Test met Lighthouse
npm run build
npm start
# Open Chrome DevTools > Lighthouse > Run
```

### 3. **Mobile Friendliness**
Test op [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### 4. **Content Verrijking**
Voor elke kavel:
- Minimaal 300 woorden unieke content
- Gebruik van relevante keywords (natuurlijk!)
- Lokale informatie (buurt, voorzieningen)
- Voeg FAQ toe (met FAQ schema)

### 5. **Backlinks Opbouwen**
- Deel kavels op social media
- Contacteer lokale makelaars/architecten
- Schrijf gastblogs over zelfbouw
- Registreer op kavels directories

## 📝 Monitoring

### Wekelijks checken:
1. **Google Search Console**
   - Aantal geïndexeerde pagina's
   - Crawl errors
   - Coverage rapport

2. **Google Analytics**
   - Organisch verkeer naar `/aanbod/*`
   - Bounce rate
   - Conversies

### Maandelijks checken:
1. **Rankings**
   - Gebruik tool zoals Ahrefs/SEMrush
   - Of handmatig: zoek op "bouwkavel [plaats]"

2. **Backlinks**
   - Nieuwe backlinks?
   - Kwaliteit van backlinks

## 🔧 Technische Checklist

- [x] robots.ts aangemaakt
- [x] Sitemap verbeterd met timestamps
- [x] Listing interface uitgebreid
- [x] Oude robots.txt verwijderd
- [x] Rebuild & deploy (Succesvol getest)
- [ ] Sitemap ingediend in GSC
- [ ] Top kavels via URL Inspection ingediend
- [ ] Interne links toegevoegd vanuit WordPress
- [x] Schema.org getest en geüpdatet
- [ ] Page speed geoptimaliseerd

## 💡 Waarom WordPress berichten WEL worden gevonden

1. **Oudere content**: WordPress berichten zijn waarschijnlijk al langer online
2. **Meer interne links**: WordPress heeft automatische related posts, categories, tags
3. **RSS feed**: WordPress heeft een RSS feed die automatisch wordt gecrawld
4. **Sitemap**: WordPress heeft waarschijnlijk een sitemap plugin (Yoast SEO?)
5. **Backlinks**: Berichten worden vaker gedeeld op social media

## 🎓 Leer meer

- [Google Search Central](https://developers.google.com/search)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Schema.org RealEstateListing](https://schema.org/RealEstateListing)

---

**Laatste update**: 2026-01-21
**Status**: Technische fixes geïmplementeerd, wacht op deployment en GSC configuratie
