-- ============================================================================
-- Seed Data - Kennisbank Begrippen
-- ============================================================================
-- Beschrijving: Initiële set kernbegrippen voor het kennisbank ecosysteem
-- Versie: 1.0
-- Laatste update: Februari 2025
-- ============================================================================

-- Eerst alle bestaande data verwijderen (alleen voor development!)
-- TRUNCATE TABLE kb_concepts CASCADE;

-- ============================================================================
-- Categorie: Kosten & Budget
-- ============================================================================

INSERT INTO kb_concepts (
  slug, 
  term, 
  owner_site, 
  canonical_url, 
  definition_short, 
  definition_long,
  category, 
  tags,
  created_by
) VALUES 
(
  'faalkosten',
  'Faalkosten',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/wat-zijn-faalkosten',
  'Vermijdbare extra kosten tijdens bouwen door fouten, miscommunicatie of te late keuzes.',
  'Faalkosten zijn vermijdbare extra kosten tijdens bouwen door fouten, miscommunicatie of te late keuzes. In de sector wordt vaak gesproken over 10-15% van het bouwbudget dat verloren gaat aan herstelwerk, meerwerk en vertraging. De belangrijkste oorzaken: onduidelijke afspraken, incomplete tekeningen en materiaalkeuzes die te laat gemaakt worden.',
  'kosten',
  ARRAY['budget', 'planning', 'risico', 'voorbereiding'],
  'jules@brikxai.nl'
),
(
  'meerwerk',
  'Meerwerk',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/wat-is-meerwerk',
  'Werk dat niet in de oorspronkelijke offerte stond en tijdens de bouw wordt toegevoegd - gevraagd of onvoorzien.',
  'Meerwerk is werk dat niet in de oorspronkelijke offerte stond en tijdens de bouw wordt toegevoegd - gevraagd of onvoorzien. Dit kan ontstaan door wijzigingen van de opdrachtgever, onduidelijkheden in de offerte, of onvoorziene omstandigheden tijdens de bouw. Goede voorbereiding en duidelijke afspraken vooraf minimaliseren meerwerk.',
  'kosten',
  ARRAY['budget', 'offerte', 'aannemer', 'contract'],
  'jules@brikxai.nl'
),
(
  'bouwbudget',
  'Bouwbudget',
  'brikx',
  'https://brikxai.nl/kennisbank/hoe-maak-je-realistisch-bouwbudget',
  'Het totale financiële kader voor je bouwproject, inclusief alle zichtbare en verborgen kosten.',
  'Een bouwbudget omvat niet alleen de bouwkosten, maar ook grondprijs, architect, adviseurs, leges, aansluitingen, onvoorzien en alle andere kosten. Een realistisch budget houdt rekening met 10-15% buffer en alle verborgen posten die mensen vaak vergeten.',
  'kosten',
  ARRAY['budget', 'planning', 'financiering'],
  'jules@brikxai.nl'
),
(
  'luxe-villa-kosten',
  'Kosten luxe villa',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/wat-kost-luxe-villa',
  'Een luxe villa in Nederland kost €4.000-€6.000/m² exclusief kavel, afhankelijk van afwerking en locatie.',
  'Voor een luxe villa in Nederland reken je op €4.000-€6.000/m² inclusief afwerking maar exclusief kavel. Factoren die dit beïnvloeden: materiaalkeuze (natuursteen, eikenhouten details), installatiekwaliteit (volledig geïntegreerde domotica), isolatiewaarden, en locatiespecifieke kosten.',
  'kosten',
  ARRAY['nieuwbouw', 'luxe', 'villa', 'maatwerk'],
  'jules@brikxai.nl'
);

-- ============================================================================
-- Categorie: Vergunning & Regelgeving
-- ============================================================================

INSERT INTO kb_concepts (
  slug, 
  term, 
  owner_site, 
  canonical_url, 
  definition_short, 
  definition_long,
  category, 
  tags,
  created_by
) VALUES 
(
  'bestemmingsplan',
  'Bestemmingsplan',
  'kavelarchitect',
  'https://kavelarchitect.nl/kennisbank/hoe-lees-ik-bestemmingsplan',
  'Gemeentelijk document dat bepaalt wat er op jouw kavel mag worden gebouwd: oppervlakte, hoogte, functie en esthetische eisen.',
  'Het bestemmingsplan bepaalt wat er op jouw kavel mag worden gebouwd: maximale oppervlakte, hoogte, functie en vaak ook esthetische eisen. Het wordt vastgesteld door de gemeente en is juridisch bindend. Het interpreteren van een bestemmingsplan vereist expertise door technisch jargon en juridische formuleringen.',
  'vergunning',
  ARRAY['kavel', 'regelgeving', 'gemeente', 'vergunning'],
  'jules@brikxai.nl'
),
(
  'bouwvlak',
  'Bouwvlak',
  'kavelarchitect',
  'https://kavelarchitect.nl/kennisbank/wat-is-bouwvlak',
  'Het gebied op je kavel waar je hoofdgebouw mag staan, vastgelegd in het bestemmingsplan.',
  'Het bouwvlak is het gebied op je kavel waar je hoofdgebouw mag staan, vastgelegd in het bestemmingsplan. Dit bepaalt de positionering en maximale footprint van je woning. Buiten het bouwvlak mogen vaak alleen bijgebouwen of zijn er aanvullende beperkingen.',
  'vergunning',
  ARRAY['kavel', 'bestemmingsplan', 'regelgeving'],
  'jules@brikxai.nl'
),
(
  'omgevingsvergunning',
  'Omgevingsvergunning',
  'kavelarchitect',
  'https://kavelarchitect.nl/kennisbank/wat-is-omgevingsvergunning',
  'Vergunning die je nodig hebt voor bouwen, slopen, afwijken van bestemmingsplan of monumenten wijzigen.',
  'Een omgevingsvergunning is nodig voor het bouwen, slopen, afwijken van het bestemmingsplan, of het wijzigen van monumenten. De gemeente heeft wettelijk 8 weken om te beslissen, in de praktijk vaak 10-14 weken. Voor complexe projecten of afwijkingen kan dit langer duren.',
  'vergunning',
  ARRAY['gemeente', 'regelgeving', 'planning'],
  'jules@brikxai.nl'
);

-- ============================================================================
-- Categorie: Voorbereiding & Planning
-- ============================================================================

INSERT INTO kb_concepts (
  slug, 
  term, 
  owner_site, 
  canonical_url, 
  definition_short, 
  definition_long,
  category, 
  tags,
  created_by
) VALUES 
(
  'programma-van-eisen',
  'Programma van Eisen (PvE)',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/wat-is-programma-van-eisen',
  'Document waarin je beschrijft wat je wil bouwen: wensen, eisen en randvoorwaarden op papier.',
  'Een Programma van Eisen (PvE) is een document waarin je beschrijft wat je wil bouwen of verbouwen - je wensen, eisen en randvoorwaarden op papier. Het dient als basis voor het ontwerp en zorgt dat architect en aannemer precies weten wat je verwacht. Een goed PvE voorkomt misverstanden en verkeerde keuzes.',
  'voorbereiding',
  ARRAY['ontwerp', 'planning', 'communicatie', 'voorbereiding'],
  'jules@brikxai.nl'
),
(
  'keuzetijdlijn',
  'Keuzetijdlijn',
  'brikx',
  'https://brikxai.nl/kennisbank/wanneer-welke-keuzes-maken',
  'Planning van wanneer je welke materiaalkeuzes moet maken tijdens het bouwproces.',
  'Een keuzetijdlijn bepaalt wanneer je welke beslissingen moet nemen: keuken bestellen vóór week 8, tegels kiezen vóór week 12, etc. Te late keuzes veroorzaken vertraging en kosten. Goede planning voorkomt dat de aannemer moet wachten en onderaannemers opnieuw moet inplannen.',
  'planning',
  ARRAY['planning', 'materialen', 'timing', 'proces'],
  'jules@brikxai.nl'
);

-- ============================================================================
-- Categorie: Professionals & Begeleiding
-- ============================================================================

INSERT INTO kb_concepts (
  slug, 
  term, 
  owner_site, 
  canonical_url, 
  definition_short, 
  definition_long,
  category, 
  tags,
  created_by
) VALUES 
(
  'architect-inschakelen',
  'Architect inschakelen',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/wanneer-architect-inhuren',
  'Een architect inhuren die het volledige ontwerpproces begeleidt: van eerste schets tot oplevering.',
  'Een architect inschakelen betekent iemand inhuren die het volledige ontwerpproces begeleidt: van eerste schets tot oplevering. Dit omvat ontwerp, vergunning, coördinatie met adviseurs en bouwbegeleiding. De kosten liggen tussen 6-12% van de bouwsom, maar voorkomen vaak veel meer aan faalkosten.',
  'professionals',
  ARRAY['architect', 'begeleiding', 'ontwerp', 'expertise'],
  'jules@brikxai.nl'
),
(
  'bouwbegeleiding',
  'Bouwbegeleiding',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/wat-is-bouwbegeleiding',
  'Professionele controle tijdens de bouw om kwaliteit te bewaken en fouten te voorkomen.',
  'Bouwbegeleiding betekent dat een professional (architect of bouwkundig adviseur) regelmatig de bouwplaats bezoekt om kwaliteit te controleren, voortgang te bewaken en problemen tijdig te signaleren. Dit voorkomt fouten, meerwerk en teleurstellingen bij oplevering.',
  'professionals',
  ARRAY['architect', 'kwaliteit', 'controle', 'begeleiding'],
  'jules@brikxai.nl'
),
(
  'aannemer-kiezen',
  'Aannemer kiezen',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/hoe-kies-je-betrouwbare-aannemer',
  'Een betrouwbare bouwpartner selecteren op basis van ervaring, referenties en complete offertes.',
  'Een aannemer kiezen doe je niet op laagste prijs, maar op betrouwbaarheid, ervaring met vergelijkbare projecten, referenties en kwaliteit van de offerte. Vraag minimaal 3 offertes, check referenties door ze te bellen, en controleer verzekeringen (CAR en AVB).',
  'professionals',
  ARRAY['aannemer', 'selectie', 'offerte', 'kwaliteit'],
  'jules@brikxai.nl'
);

-- ============================================================================
-- Categorie: Proces & Uitvoering
-- ============================================================================

INSERT INTO kb_concepts (
  slug, 
  term, 
  owner_site, 
  canonical_url, 
  definition_short, 
  definition_long,
  category, 
  tags,
  created_by
) VALUES 
(
  'bouwfasering',
  'Bouwfasering',
  'brikx',
  'https://brikxai.nl/kennisbank/hoe-lang-duurt-bouwproject',
  'De volgorde van stappen in een bouwproject: voorbereiding, vergunning, aanbesteding, uitvoering, oplevering.',
  'Bouwfasering beschrijft de volgorde van alle stappen: schetsontwerp (4-6 weken), definitief ontwerp + vergunning (8-14 weken), aanbesteding (4-6 weken), bouw (6-10 maanden nieuwbouw, 4-8 maanden verbouw). Goede planning houdt rekening met wachttijden tussen fasen en seizoensinvloeden.',
  'proces',
  ARRAY['planning', 'timing', 'proces', 'voorbereiding'],
  'jules@brikxai.nl'
),
(
  'oplevering',
  'Oplevering',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/wat-is-oplevering',
  'Het moment waarop de aannemer het project overdraagt en je samen een puntlijst maakt van restpunten.',
  'Bij oplevering draagt de aannemer het project over. Je loopt samen door het gebouw en maakt een puntlijst van alle gebreken en onafgemaakte zaken. De aannemer heeft daarna 2-4 weken om deze te herstellen. Pas na definitieve oplevering betaal je de laatste termijn.',
  'proces',
  ARRAY['oplevering', 'kwaliteit', 'controle', 'garantie'],
  'jules@brikxai.nl'
);

-- ============================================================================
-- Categorie: Ontwerp & Architectuur
-- ============================================================================

INSERT INTO kb_concepts (
  slug, 
  term, 
  owner_site, 
  canonical_url, 
  definition_short, 
  definition_long,
  category, 
  tags,
  created_by
) VALUES 
(
  'maatwerk-vs-standaard',
  'Maatwerk vs standaard',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/maatwerk-versus-standaard-nieuwbouw',
  'Maatwerk is volledig afgestemd op jouw leven en kavel; standaard nieuwbouw gebruikt vaste plattegronden voor efficiency.',
  'Bij maatwerk wordt de woning volledig ontworpen rondom jouw leven en de kwaliteiten van je kavel. Standaard nieuwbouw werkt met vaste plattegronden en beperkte aanpassingsmogelijkheden voor efficiency. Het kostenverschil is €500-€1.000/m², maar maatwerk voorkomt dat je jarenlang moet aanpassen.',
  'ontwerp',
  ARRAY['ontwerp', 'keuzes', 'nieuwbouw', 'villa'],
  'jules@brikxai.nl'
),
(
  'positionering-kavel',
  'Positionering op kavel',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/hoe-positioneer-je-woning-op-kavel',
  'De plek en oriëntatie van je woning op het perceel, bepalend voor zon, privacy, uitzicht en tuinligging.',
  'Positionering op het kavel bepaalt hoe de woning staat: naar welke kant gericht, hoe ver van de weg, waar de entree komt. Dit beïnvloedt zon-oriëntatie, privacy, uitzicht, tuinligging en routing. Deze keuze maak je in de schetsfase - later aanpassen is onmogelijk.',
  'ontwerp',
  ARRAY['ontwerp', 'kavel', 'zon', 'privacy'],
  'jules@brikxai.nl'
),
(
  'duurzaam-bouwen',
  'Duurzaam bouwen',
  'abjz',
  'https://architectenbureau-jzwijsen.nl/kennisbank/hoe-bouw-je-duurzaam',
  'Bouwen met aandacht voor energie, materialen en toekomstbestendigheid - begint bij slim ontwerp, niet bij installaties.',
  'Duurzaam bouwen begint bij slim ontwerp: optimaal gebruik van zon, natuurlijke ventilatie, compacte vorm. Daarna volgen isolatie (RC >6.0), triple beglazing, warmtepomp (alleen als schil op orde is), en duurzame materialen zoals houtskeletbouw. Installaties zijn pas effectief als de basis goed is.',
  'ontwerp',
  ARRAY['duurzaamheid', 'energie', 'isolatie', 'installaties'],
  'jules@brikxai.nl'
);

-- ============================================================================
-- Categorie: Kavel & Locatie
-- ============================================================================

INSERT INTO kb_concepts (
  slug, 
  term, 
  owner_site, 
  canonical_url, 
  definition_short, 
  definition_long,
  category, 
  tags,
  created_by
) VALUES 
(
  'kavelanalyse',
  'Kavelanalyse',
  'kavelarchitect',
  'https://kavelarchitect.nl/diensten/kavelrapport',
  'Professionele check van wat er op een kavel mag en kan worden gebouwd voordat je koopt.',
  'Een kavelanalyse onderzoekt wat er op een kavel mag (bestemmingsplan, bouwvlak, hoogte) en kan (bodem, aansluitingen, omgeving). Dit voorkomt dat je een kavel koopt waar je droomhuis niet op past. De analyse omvat bestemmingsplan-interpretatie, kansen en beperkingen, en haalbaarheidsinschatting.',
  'kavel',
  ARRAY['kavel', 'analyse', 'bestemmingsplan', 'haalbaarheid'],
  'jules@brikxai.nl'
),
(
  'bouwrijpe-grond',
  'Bouwrijpe grond',
  'kavelarchitect',
  'https://kavelarchitect.nl/kennisbank/wat-is-bouwrijpe-grond',
  'Grond waar alle voorzieningen (riolering, elektra, water) zijn aangesloten en klaar voor bouwen.',
  'Bouwrijpe grond heeft alle voorzieningen aangesloten: riolering, elektriciteit, water, toegangsweg en vaak ook een kavelpaspoort. Niet-bouwrijpe grond lijkt goedkoper maar kost €5-35k extra voor aansluitingen. Ook hypotheekverstrekkers financieren bouwrijpe grond makkelijker.',
  'kavel',
  ARRAY['kavel', 'infrastructuur', 'aansluitingen'],
  'jules@brikxai.nl'
);

-- ============================================================================
-- Relaties tussen begrippen toevoegen
-- ============================================================================

-- Faalkosten gerelateerd aan...
INSERT INTO kb_concept_relations (concept_id, related_concept_id, relation_type, description)
SELECT 
  (SELECT id FROM kb_concepts WHERE slug = 'faalkosten'),
  (SELECT id FROM kb_concepts WHERE slug = 'programma-van-eisen'),
  'prerequisite',
  'Een goed PvE voorkomt faalkosten'
;

INSERT INTO kb_concept_relations (concept_id, related_concept_id, relation_type, description)
SELECT 
  (SELECT id FROM kb_concepts WHERE slug = 'faalkosten'),
  (SELECT id FROM kb_concepts WHERE slug = 'meerwerk'),
  'see_also',
  'Meerwerk is vaak het gevolg van faalkosten'
;

-- Bestemmingsplan gerelateerd aan...
INSERT INTO kb_concept_relations (concept_id, related_concept_id, relation_type, description)
SELECT 
  (SELECT id FROM kb_concepts WHERE slug = 'bestemmingsplan'),
  (SELECT id FROM kb_concepts WHERE slug = 'bouwvlak'),
  'part_of',
  'Bouwvlak staat beschreven in bestemmingsplan'
;

INSERT INTO kb_concept_relations (concept_id, related_concept_id, relation_type, description)
SELECT 
  (SELECT id FROM kb_concepts WHERE slug = 'bestemmingsplan'),
  (SELECT id FROM kb_concepts WHERE slug = 'kavelanalyse'),
  'see_also',
  'Kavelanalyse interpreteert het bestemmingsplan'
;

-- PvE gerelateerd aan...
INSERT INTO kb_concept_relations (concept_id, related_concept_id, relation_type, description)
SELECT 
  (SELECT id FROM kb_concepts WHERE slug = 'programma-van-eisen'),
  (SELECT id FROM kb_concepts WHERE slug = 'architect-inschakelen'),
  'see_also',
  'Architect helpt bij opstellen PvE'
;

-- Architect inschakelen gerelateerd aan...
INSERT INTO kb_concept_relations (concept_id, related_concept_id, relation_type, description)
SELECT 
  (SELECT id FROM kb_concepts WHERE slug = 'architect-inschakelen'),
  (SELECT id FROM kb_concepts WHERE slug = 'bouwbegeleiding'),
  'part_of',
  'Bouwbegeleiding is onderdeel van architect diensten'
;

-- ============================================================================
-- Verificatie queries
-- ============================================================================

-- Count per categorie
-- SELECT category, COUNT(*) 
-- FROM kb_concepts 
-- GROUP BY category 
-- ORDER BY category;

-- Count per eigenaar
-- SELECT owner_site, COUNT(*) 
-- FROM kb_concepts 
-- GROUP BY owner_site 
-- ORDER BY owner_site;

-- Concepten zonder canonical URL (moet 0 zijn!)
-- SELECT slug, term 
-- FROM kb_concepts 
-- WHERE canonical_url IS NULL OR canonical_url = '';

-- ============================================================================
-- End of seed data
-- ============================================================================
