# Implementatie Stappenplan

**Doel:** Kennisbank governance systeem volledig implementeren  
**Tijdsinschatting:** 4-6 weken (afhankelijk van beschikbaarheid)  
**Prioriteit:** Hoog - fundament voor lange-termijn SEO en AI-citaties

---

## Overzicht fases

| Fase | Duur | Deliverables | Status |
|------|------|--------------|--------|
| 1. Database setup | 3 dagen | Supabase project + schema + seed data | ⏳ Te doen |
| 2. API integratie | 5 dagen | Helper functies + types in alle 3 repos | ⏳ Te doen |
| 3. UI components | 5 dagen | ConceptLink, ConceptTooltip components | ⏳ Te doen |
| 4. Content migratie | 10 dagen | Eerste 20 begrippen + bestaande content updaten | ⏳ Te doen |
| 5. Validatie | 3 dagen | QA dashboard + validatie scripts | ⏳ Te doen |
| 6. Documentatie | 2 dagen | Team training + procedures | ⏳ Te doen |

**Totaal: 28 dagen (±6 weken)**

---

## Fase 1: Database Setup (3 dagen)

### Dag 1: Supabase project opzetten

**Taken:**
- [ ] Maak Supabase account (supabase.com)
- [ ] Creëer nieuw project "kennisbank-governance"
- [ ] Kies regio (Amsterdam voor beste latency naar NL)
- [ ] Noteer credentials:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY` (alleen voor admin)

**Output:**
- Supabase project draait
- Credentials opgeslagen in wachtwoord manager

---

### Dag 2: Schema implementeren

**Taken:**
- [ ] Open Supabase SQL Editor
- [ ] Run `database/schema.sql` volledig
- [ ] Verifieer tabellen aangemaakt:
  ```sql
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```
- [ ] Check RLS policies actief:
  ```sql
  SELECT * FROM pg_policies 
  WHERE schemaname = 'public';
  ```
- [ ] Test read access (geen auth nodig):
  ```sql
  SELECT * FROM kb_concepts LIMIT 1;
  ```

**Output:**
- Alle tabellen aanwezig
- RLS policies actief
- Public read access werkt

---

### Dag 3: Seed data laden

**Taken:**
- [ ] Run `database/seed-data.sql`
- [ ] Verifieer data:
  ```sql
  SELECT owner_site, COUNT(*) 
  FROM kb_concepts 
  GROUP BY owner_site;
  ```
- [ ] Check relaties:
  ```sql
  SELECT COUNT(*) FROM kb_concept_relations;
  ```
- [ ] Test full-text search:
  ```sql
  SELECT * FROM search_concepts('faalkosten');
  ```

**Output:**
- ~20 begrippen aanwezig
- Relaties geladen
- Search functie werkt

---

## Fase 2: API Integratie (5 dagen)

### Dag 4-5: Setup in ABJZ repo

**Taken:**
- [ ] Installeer Supabase client:
  ```bash
  npm install @supabase/supabase-js
  ```
- [ ] Maak `lib/supabase.ts`:
  ```typescript
  import { createClient } from '@supabase/supabase-js'
  
  export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  ```
- [ ] Kopieer `examples/api/kb-concepts.ts` naar `lib/kb-concepts.ts`
- [ ] Voeg environment variables toe aan `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
  ```
- [ ] Test API call:
  ```typescript
  import { getConcept } from '@/lib/kb-concepts'
  const concept = await getConcept('faalkosten')
  console.log(concept)
  ```

**Output:**
- Supabase client configured
- API helpers beschikbaar
- Test succesvol

---

### Dag 6: Setup in KavelArchitect repo

**Taken:**
- [ ] Herhaal stappen van dag 4-5
- [ ] Check dat dezelfde data wordt opgehaald
- [ ] Test met KavelArchitect-owned concept ("bestemmingsplan")

**Output:**
- KavelArchitect kan database lezen
- Consistency check OK

---

### Dag 7: Setup in Brikx repo

**Taken:**
- [ ] Herhaal stappen van dag 4-5
- [ ] Check met Brikx-owned concept ("bouwbudget")

**Output:**
- Alle 3 repos kunnen database lezen
- Single source of truth gevalideerd

---

### Dag 8: TypeScript types genereren

**Taken:**
- [ ] Genereer types uit Supabase:
  ```bash
  npx supabase gen types typescript --project-id xxx > lib/database.types.ts
  ```
- [ ] Update `kb-concepts.ts` om types te gebruiken
- [ ] Test type safety

**Output:**
- Type-safe API calls
- IntelliSense werkt

---

## Fase 3: UI Components (5 dagen)

### Dag 9-10: ConceptLink component

**Taken:**
- [ ] Kopieer `examples/components/ConceptLink.tsx` naar elk project
- [ ] Test in development:
  ```tsx
  <ConceptLink slug="faalkosten">faalkosten</ConceptLink>
  ```
- [ ] Style aanpassen per site:
  - ABJZ: professionele blue underline
  - KavelArchitect: groene accent
  - Brikx: warme purple accent
- [ ] Test met niet-bestaand begrip (graceful fallback)

**Output:**
- ConceptLink werkt in alle 3 sites
- Styling past bij brand
- Error handling OK

---

### Dag 11-12: ConceptTooltip component

**Taken:**
- [ ] Kopieer `examples/components/ConceptTooltip.tsx`
- [ ] Implementeer tooltip styling (Tailwind/Radix)
- [ ] Test hover behavior
- [ ] Test mobile (tap to show)
- [ ] Add loading state

**Output:**
- Tooltip toont definitie on hover
- Mobile werkt
- Loading spinner tijdens fetch

---

### Dag 13: Admin dashboard (basis)

**Taken:**
- [ ] Maak `app/admin/concepts/page.tsx` in één repo (ABJZ)
- [ ] Toon alle begrippen in tabel
- [ ] Highlight issues:
  - Geen canonical URL
  - Geen definition_short
  - Geen eigenaar
- [ ] Maak beveiligd met auth

**Output:**
- Overzicht van alle begrippen
- Issues zichtbaar
- Alleen toegankelijk voor admin

---

## Fase 4: Content Migratie (10 dagen)

### Dag 14-16: Bestaande content inventariseren

**Taken:**
- [ ] Lijst alle FAQ's per site:
  - ABJZ: 20 FAQ's
  - KavelArchitect: 20 FAQ's
  - Brikx: 20 FAQ's (die we hebben gemaakt)
- [ ] Identificeer welke begrippen gebruikt worden
- [ ] Check of ze al in database staan
- [ ] Voeg ontbrekende begrippen toe

**Output:**
- Spreadsheet: pagina → begrippen → status
- Ontbrekende begrippen toegevoegd aan database

---

### Dag 17-19: Links toevoegen

**Taken:**
- [ ] Per pagina: vervang begrip-mentions door `<ConceptLink>`
- [ ] Check dat eigenaar-pagina's wel mogen definiëren
- [ ] Check dat niet-eigenaar pagina's max 2 zinnen + link hebben
- [ ] Update H1/H2 waar nodig (geen "Wat is..." als niet eigenaar)

**Prioriteit:**
1. Eerst ABJZ (meeste autoriteit)
2. Dan KavelArchitect
3. Dan Brikx

**Output:**
- Eerste 30 pagina's geüpdatet met correcte links
- Consistentie gevalideerd

---

### Dag 20-23: Interne linking versterken

**Taken:**
- [ ] Per pagina: voeg minimaal 2 interne links toe (sectie 10)
- [ ] Voeg cross-site links toe (sectie 11) waar relevant:
  - ABJZ → KavelArchitect (bij kavelkeuzes)
  - ABJZ → Brikx (bij proces)
  - KavelArchitect → ABJZ (bij ontwerp)
  - Brikx → beide (bij autoriteit + analyse)
- [ ] Check dat geen pagina "wees" is (0 links)

**Output:**
- Kennisnetwerk compleet
- Elke pagina minimaal 2 interne links
- Cross-site links logisch geplaatst

---

## Fase 5: Validatie (3 dagen)

### Dag 24: Build-time validatie

**Taken:**
- [ ] Maak validatie script `scripts/validate-concepts.ts`:
  ```typescript
  // Check voor elke pagina:
  // - Gebruikt begrip zonder link?
  // - Te veel tekst over niet-owned begrip?
  // - H1 "Wat is..." als niet eigenaar?
  ```
- [ ] Integreer in build process
- [ ] Fix gevonden issues

**Output:**
- Validatie script werkend
- Alle issues opgelost

---

### Dag 25: QA dashboard uitbreiden

**Taken:**
- [ ] Voeg charts toe:
  - Begrippen per eigenaar
  - Begrippen per categorie
  - Meest gelinkte begrippen
- [ ] Voeg search toe
- [ ] Voeg filter toe (per site, categorie, eigenaar)

**Output:**
- Dashboard volledig
- Easy troubleshooting

---

### Dag 26: Usage tracking implementeren

**Taken:**
- [ ] Voeg tracking toe aan ConceptLink:
  ```typescript
  // Bij eerste render: log usage naar kb_page_usage
  await supabase.from('kb_page_usage').upsert({
    site: 'abjz',
    page_url: window.location.pathname,
    concept_slug: slug,
    usage_type: 'link'
  })
  ```
- [ ] Run validation check (is_valid)
- [ ] Toon invalid usage in dashboard

**Output:**
- Usage tracking actief
- Validation automatisch

---

## Fase 6: Documentatie & Training (2 dagen)

### Dag 27: Team documentatie

**Taken:**
- [ ] Schrijf quick-start guide voor nieuwe content creators
- [ ] Maak video walkthrough (10 min):
  - Hoe check ik of begrip bestaat?
  - Hoe voeg ik ConceptLink toe?
  - Hoe voeg ik nieuw begrip toe?
- [ ] Update ABJZ/KavelArchitect/Brikx README.md

**Output:**
- Quick-start guide
- Video tutorial
- Updated README's

---

### Dag 28: Procedures vastleggen

**Taken:**
- [ ] Schrijf procedure: "Nieuw begrip toevoegen"
- [ ] Schrijf procedure: "Content review checklist"
- [ ] Schrijf procedure: "Kwartaal governance audit"
- [ ] Plan eerste audit (over 3 maanden)

**Output:**
- Procedures gedocumenteerd
- Audit ingepland
- Team getraind

---

## Post-implementatie (continu)

### Wekelijks
- [ ] Check dashboard voor nieuwe invalid usages
- [ ] Fix issues binnen 48 uur

### Maandelijks
- [ ] Review nieuwe begrippen (zijn ze consistent?)
- [ ] Check broken links
- [ ] Update begrippen-eigendom-matrix.md

### Per kwartaal
- [ ] Voledige governance audit:
  - Zijn alle begrippen nog actueel?
  - Zijn definities nog correct?
  - Zijn er wees-pagina's?
  - Zijn er begrippen zonder eigenaar?
- [ ] Review kennisbank-standaard.md (updates nodig?)
- [ ] Team feedback session

---

## Risico's en mitigatie

| Risico | Impact | Kans | Mitigatie |
|--------|--------|------|-----------|
| Supabase downtime | Hoog | Laag | Fallback: toon begrip zonder link, log error |
| Te veel begrippen (100+) | Medium | Medium | Start met top 30, breid uit per kwartaal |
| Team volgt regels niet | Hoog | Medium | Validatie in build, auto-reject bij issues |
| Canonical URLs veranderen | Medium | Laag | 301 redirects, update in database |
| Dubbele definities ontstaan | Hoog | Medium | Maandelijkse audit, validation script |

---

## Success metrics

### Na 1 maand:
- [ ] 30 begrippen in database
- [ ] 50+ pagina's met ConceptLinks
- [ ] 0 validation errors

### Na 3 maanden:
- [ ] 50 begrippen in database
- [ ] 100+ pagina's met ConceptLinks
- [ ] Kennisnetwerk volledig (alle pagina's gelinkt)
- [ ] First citatie in ChatGPT/Perplexity

### Na 6 maanden:
- [ ] 75 begrippen in database
- [ ] Alle content heeft minimaal 2 interne links
- [ ] Meetbare stijging in AI-citaties
- [ ] Verbeterde SEO rankings (top 3 voor kernbegrippen)

---

## Contact en support

**Vragen tijdens implementatie:**
- Email: jules@brikxai.nl
- Issues: Open in GitHub/GitLab repo

**Escalatie:**
- Technische blocker: pause, debug, documenteer
- Conceptuele vraag: check kennisbank-standaard.md eerst
- Onduidelijkheid: update documentatie na oplossing

---

**Start datum:** [In te vullen]  
**Deadline:** [In te vullen]  
**Owner:** Jules Zwijsen  
**Status:** Planning fase
