# Kennisbank Governance Systeem

**Versie:** 1.0  
**Laatste update:** Februari 2025  
**Eigenaar:** Jules Zwijsen - Architectenbureau Jules Zwijsen / KavelArchitect / Brikx

---

## Overzicht

Dit repository bevat de volledige governance structuur voor het drie-site kennisbank ecosysteem:

- **ABJZ** (architectenbureau-jzwijsen.nl) - Autoriteitsbron, expertise, praktijk
- **KavelArchitect** (kavelarchitect.nl) - Analyse & zekerheid vóór aankoop
- **Brikx** (brikxai.nl) - Begeleiding & rust tijdens het proces

Het systeem is ontworpen om:
1. **Consistente content** te garanderen over alle sites
2. **AI-citaties** te optimaliseren (ChatGPT, Perplexity, Google AI)
3. **SEO** te versterken door gestructureerde interne linking
4. **Autoriteit** te behouden via duidelijke begrippen-eigendom

---

## Documentatie structuur

```
kennisbank-governance/
├── README.md                          # Dit bestand
├── docs/
│   ├── kennisbank-standaard.md        # Volledige content richtlijnen
│   ├── implementatie-stappenplan.md   # Praktische implementatie
│   └── begrippen-eigendom-matrix.md   # Overzicht kernbegrippen
├── database/
│   ├── schema.sql                     # Supabase database schema
│   ├── seed-data.sql                  # Voorbeeld begrippen
│   └── migrations/                    # Database migraties
└── examples/
    ├── components/                    # React/Next.js componenten
    ├── api/                          # API helper functies
    └── validation/                   # Content validatie scripts
```

---

## Quick start

### 1. Lees de kennisbank standaard

Start met [`docs/kennisbank-standaard.md`](docs/kennisbank-standaard.md) - dit bevat:
- Content richtlijnen per site (toon, structuur, CTAs)
- Vaste definities voor kernbegrippen
- Interne verweving regels
- Cross-site linking strategie
- Begrippen eigendom governance

### 2. Setup database

```bash
# 1. Maak Supabase project aan op supabase.com
# 2. Run database schema
psql -h [your-project].supabase.co -U postgres < database/schema.sql

# 3. (Optioneel) Load seed data
psql -h [your-project].supabase.co -U postgres < database/seed-data.sql
```

### 3. Integreer in je websites

```bash
# In je Next.js project
npm install @supabase/supabase-js

# Kopieer helper functies
cp examples/api/kb-concepts.ts [your-project]/lib/
cp examples/components/ConceptLink.tsx [your-project]/components/

# Configureer environment variables
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Gebruik in content

```typescript
import { ConceptLink } from '@/components/ConceptLink'

// In je MDX/content
<ConceptLink slug="faalkosten">faalkosten</ConceptLink>
```

---

## Kernprincipes

### 1. Één begrip = Één eigenaar

Elk kernbegrip heeft exact één thuisbasis waar de volledige definitie staat. Andere sites linken daarheen.

**Voorbeeld:**
- "Faalkosten" → eigenaar: **ABJZ**
- Brikx: "Zoals we uitleggen bij **[faalkosten](link naar ABJZ)**..."
- KavelArchitect: "**[Faalkosten](link naar ABJZ)** spelen al vroeg..."

### 2. Autoriteit stroomt van boven naar beneden

```
ABJZ (bron)
  ↓ mag linken naar
KavelArchitect (analyse) ← linkt terug
  ↓ mag linken naar
Brikx (begeleiding) ← linkt terug naar beide
```

### 3. Links zijn inhoudelijk, nooit promotioneel

✅ Goed: "**[Faalkosten](link)** ontstaan door..."  
❌ Fout: "Bekijk onze diensten op..."

### 4. Consistentie via database

Alle begrippen worden beheerd in Supabase. Websites lezen dezelfde data = geen divergentie mogelijk.

---

## Implementatie status

- [x] Kennisbank standaard gedocumenteerd
- [x] Database schema ontworpen
- [ ] Supabase project opgezet
- [ ] Seed data compleet
- [ ] React componenten getest
- [ ] Eerste 20 begrippen gemigreerd
- [ ] QA dashboard gebouwd
- [ ] Validatie scripts geïmplementeerd

---

## Belangrijke documenten

| Document | Doel | Voor wie |
|----------|------|----------|
| [Kennisbank standaard](docs/kennisbank-standaard.md) | Content richtlijnen | Content creators |
| [Implementatie stappenplan](docs/implementatie-stappenplan.md) | Technische setup | Developers |
| [Database schema](database/schema.sql) | Database structuur | Developers |
| [Begrippen eigendom matrix](docs/begrippen-eigendom-matrix.md) | Welk begrip waar | Content creators |

---

## Veelgestelde vragen

### Waarom drie aparte sites?

Elke site heeft een andere doelgroep en rol:
- **ABJZ**: Professionals en serieuze particulieren die een architect zoeken
- **KavelArchitect**: Mensen die een kavel overwegen te kopen
- **Brikx**: Onzekere (ver)bouwers die begeleiding nodig hebben

### Waarom niet alles op één site?

De toon, diepte en focus per doelgroep verschilt te veel. Een empathische Brikx-toon past niet bij ABJZ's expertautoriteit.

### Hoe voorkom je duplicatie?

Via de begrippen-eigendom database. Elk begrip heeft één thuisbasis. Andere sites linken ernaar.

### Wat als ik een nieuw begrip wil toevoegen?

1. Check of het al bestaat in database
2. Zo nee: voeg toe met eigenaar + canonical URL
3. Gebruik het begrip via `<ConceptLink>` component
4. Component haalt definitie automatisch op

### Hoe valideer ik of ik de regels volg?

```bash
# Run validatie script (TODO: bouwen)
npm run validate-concepts

# Of check het QA dashboard
npm run dev
# Ga naar localhost:3000/admin/concepts
```

---

## Bijdragen

### Nieuwe content toevoegen

1. Lees eerst de [kennisbank standaard](docs/kennisbank-standaard.md)
2. Check begrippen in database (is er al een eigenaar?)
3. Volg de template voor jouw site (ABJZ/KavelArchitect/Brikx)
4. Voeg minimaal 2 interne links toe
5. Run validatie voor publicatie

### Nieuwe begrippen definiëren

1. Bepaal welke site de eigenaar moet zijn
2. Voeg toe aan database via admin interface
3. Schrijf volledige definitie op eigenaar-site
4. Update begrippen-eigendom-matrix.md

### Bug reports

Open een issue met:
- Welk begrip/pagina
- Wat is het probleem (duplicatie? verkeerde link? onduidelijk?)
- Voorgestelde fix

---

## Contact

**Eigenaar:** Jules Zwijsen  
**Email:** jules@brikxai.nl  
**Websites:**
- https://architectenbureau-jzwijsen.nl
- https://kavelarchitect.nl  
- https://brikxai.nl

---

## Licentie

Intern document - niet voor externe distributie
© 2025 Jules Zwijsen / Brikx
