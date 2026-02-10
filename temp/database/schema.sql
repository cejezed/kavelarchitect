-- ============================================================================
-- Kennisbank Governance Database Schema
-- Supabase PostgreSQL
-- ============================================================================
-- Versie: 1.0
-- Laatste update: Februari 2025
-- Eigenaar: Jules Zwijsen / Brikx
-- ============================================================================

-- ============================================================================
-- Table: kb_concepts
-- Beschrijving: Centrale tabel voor alle kennisbank begrippen
-- ============================================================================

CREATE TABLE kb_concepts (
  -- Identificatie
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'faalkosten', 'bestemmingsplan', etc.
  term TEXT NOT NULL, -- 'Faalkosten', 'Bestemmingsplan', etc.
  
  -- Eigendom
  owner_site TEXT NOT NULL CHECK (owner_site IN ('abjz', 'kavelarchitect', 'brikx')),
  canonical_url TEXT NOT NULL, -- Volledige URL naar eigenaar-pagina
  
  -- Definities
  definition_short TEXT NOT NULL, -- 1 zin, max 150 karakters (voor tooltips/previews)
  definition_long TEXT, -- Langere definitie (alleen eigenaar gebruikt dit uitgebreid)
  
  -- Gebruikregels per site
  -- JSON structure: 
  -- {
  --   "abjz": {"max_sentences": null, "may_define": true, "h1_allowed": true},
  --   "kavelarchitect": {"max_sentences": 2, "may_define": false, "h1_allowed": false},
  --   "brikx": {"max_sentences": 2, "may_define": false, "h1_allowed": false}
  -- }
  rules_json JSONB DEFAULT '{
    "abjz": {"max_sentences": null, "may_define": true, "h1_allowed": true},
    "kavelarchitect": {"max_sentences": 2, "may_define": false, "h1_allowed": false},
    "brikx": {"max_sentences": 2, "may_define": false, "h1_allowed": false}
  }'::jsonb,
  
  -- Context en categorisatie
  category TEXT, -- 'kosten', 'vergunning', 'kavel', 'proces', 'ontwerp'
  tags TEXT[], -- Array van tags voor filtering/search
  
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT, -- Email/username van creator
  
  -- Optioneel: SEO meta
  meta_description TEXT, -- Custom meta description voor eigenaar-pagina
  
  -- Constraints
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'), -- Alleen lowercase, cijfers, hyphens
  CONSTRAINT term_not_empty CHECK (LENGTH(TRIM(term)) > 0),
  CONSTRAINT definition_short_length CHECK (LENGTH(definition_short) <= 200)
);

-- Indexes voor performance
CREATE INDEX idx_kb_concepts_slug ON kb_concepts(slug);
CREATE INDEX idx_kb_concepts_owner ON kb_concepts(owner_site);
CREATE INDEX idx_kb_concepts_category ON kb_concepts(category);
CREATE INDEX idx_kb_concepts_tags ON kb_concepts USING GIN(tags);

-- Full-text search index
CREATE INDEX idx_kb_concepts_search ON kb_concepts 
USING GIN(to_tsvector('dutch', term || ' ' || COALESCE(definition_short, '') || ' ' || COALESCE(definition_long, '')));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kb_concepts_updated_at 
BEFORE UPDATE ON kb_concepts
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE kb_concepts IS 'Centrale tabel voor alle kennisbank begrippen met eigendomsregistratie';
COMMENT ON COLUMN kb_concepts.slug IS 'URL-vriendelijke identifier (lowercase, hyphens)';
COMMENT ON COLUMN kb_concepts.owner_site IS 'Welke site de hoofddefinitie heeft (abjz/kavelarchitect/brikx)';
COMMENT ON COLUMN kb_concepts.canonical_url IS 'Volledige URL naar de eigenaar-pagina';
COMMENT ON COLUMN kb_concepts.definition_short IS 'Korte definitie (max 200 chars) voor tooltips en previews';
COMMENT ON COLUMN kb_concepts.definition_long IS 'Uitgebreide definitie voor eigenaar-pagina';
COMMENT ON COLUMN kb_concepts.rules_json IS 'Gebruiksregels per site (max zinnen, mag definiëren, H1 toegestaan)';

-- ============================================================================
-- Table: kb_concept_relations
-- Beschrijving: Relaties tussen begrippen (gerelateerd, prerequisite, etc.)
-- ============================================================================

CREATE TABLE kb_concept_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relaties
  concept_id UUID NOT NULL REFERENCES kb_concepts(id) ON DELETE CASCADE,
  related_concept_id UUID NOT NULL REFERENCES kb_concepts(id) ON DELETE CASCADE,
  
  -- Type relatie
  relation_type TEXT NOT NULL CHECK (relation_type IN (
    'see_also',     -- Zie ook (gerelateerd onderwerp)
    'prerequisite', -- Vereiste kennis
    'part_of',      -- Onderdeel van groter geheel
    'opposite',     -- Tegenovergestelde
    'example'       -- Voorbeeld van
  )),
  
  -- Optioneel: beschrijving van de relatie
  description TEXT,
  
  -- Meta
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(concept_id, related_concept_id, relation_type),
  CHECK (concept_id != related_concept_id) -- Geen self-relations
);

-- Indexes
CREATE INDEX idx_kb_relations_concept ON kb_concept_relations(concept_id);
CREATE INDEX idx_kb_relations_related ON kb_concept_relations(related_concept_id);
CREATE INDEX idx_kb_relations_type ON kb_concept_relations(relation_type);

-- Comments
COMMENT ON TABLE kb_concept_relations IS 'Relaties tussen begrippen voor kennisnetwerk';
COMMENT ON COLUMN kb_concept_relations.relation_type IS 'Type relatie: see_also, prerequisite, part_of, opposite, example';

-- ============================================================================
-- Table: kb_page_usage (optioneel - voor QA/analytics)
-- Beschrijving: Tracking waar begrippen gebruikt worden
-- ============================================================================

CREATE TABLE kb_page_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Locatie
  site TEXT NOT NULL CHECK (site IN ('abjz', 'kavelarchitect', 'brikx')),
  page_url TEXT NOT NULL,
  page_title TEXT,
  
  -- Begrip
  concept_slug TEXT NOT NULL REFERENCES kb_concepts(slug) ON DELETE CASCADE,
  
  -- Gebruik type
  usage_type TEXT NOT NULL CHECK (usage_type IN (
    'definition',  -- Dit is de eigenaar-pagina met volledige definitie
    'link',        -- Link naar eigenaar-pagina
    'mention'      -- Genoemd maar niet gelinkt
  )),
  
  -- Validatie
  is_valid BOOLEAN DEFAULT true,
  validation_note TEXT, -- Waarom invalid (bijv. "Te veel zinnen", "Geen link")
  
  -- Meta
  last_checked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(site, page_url, concept_slug)
);

-- Indexes
CREATE INDEX idx_kb_usage_site ON kb_page_usage(site);
CREATE INDEX idx_kb_usage_concept ON kb_page_usage(concept_slug);
CREATE INDEX idx_kb_usage_type ON kb_page_usage(usage_type);
CREATE INDEX idx_kb_usage_valid ON kb_page_usage(is_valid);

-- Comments
COMMENT ON TABLE kb_page_usage IS 'Tracking van begrippen gebruik per pagina voor QA';
COMMENT ON COLUMN kb_page_usage.usage_type IS 'definition = eigenaar-pagina, link = verwijzing, mention = genoemd';
COMMENT ON COLUMN kb_page_usage.is_valid IS 'false als regels overtreden (te veel tekst, geen link, etc.)';

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE kb_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_concept_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_page_usage ENABLE ROW LEVEL SECURITY;

-- Public read access (voor websites)
CREATE POLICY "Public read access on concepts" 
  ON kb_concepts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access on relations" 
  ON kb_concept_relations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access on usage" 
  ON kb_page_usage 
  FOR SELECT 
  USING (true);

-- Write access alleen voor authenticated users
CREATE POLICY "Admin write access on concepts" 
  ON kb_concepts 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin write access on relations" 
  ON kb_concept_relations 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin write access on usage" 
  ON kb_page_usage 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function: Search begrippen (full-text search)
CREATE OR REPLACE FUNCTION search_concepts(search_query TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  term TEXT,
  owner_site TEXT,
  definition_short TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.slug,
    c.term,
    c.owner_site,
    c.definition_short,
    ts_rank(
      to_tsvector('dutch', c.term || ' ' || COALESCE(c.definition_short, '') || ' ' || COALESCE(c.definition_long, '')),
      plainto_tsquery('dutch', search_query)
    ) AS rank
  FROM kb_concepts c
  WHERE to_tsvector('dutch', c.term || ' ' || COALESCE(c.definition_short, '') || ' ' || COALESCE(c.definition_long, '')) 
        @@ plainto_tsquery('dutch', search_query)
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: Get related concepts
CREATE OR REPLACE FUNCTION get_related_concepts(concept_slug_param TEXT)
RETURNS TABLE (
  related_slug TEXT,
  related_term TEXT,
  relation_type TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c2.slug,
    c2.term,
    r.relation_type,
    r.description
  FROM kb_concept_relations r
  JOIN kb_concepts c1 ON r.concept_id = c1.id
  JOIN kb_concepts c2 ON r.related_concept_id = c2.id
  WHERE c1.slug = concept_slug_param
  ORDER BY r.relation_type, c2.term;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Views (voor gemakkelijke queries)
-- ============================================================================

-- View: Concepten met aantal relaties
CREATE OR REPLACE VIEW v_concepts_with_stats AS
SELECT 
  c.id,
  c.slug,
  c.term,
  c.owner_site,
  c.category,
  c.canonical_url,
  COUNT(DISTINCT r.id) as relation_count,
  COUNT(DISTINCT u.id) as usage_count,
  COUNT(DISTINCT CASE WHEN u.is_valid = false THEN u.id END) as invalid_usage_count
FROM kb_concepts c
LEFT JOIN kb_concept_relations r ON c.id = r.concept_id
LEFT JOIN kb_page_usage u ON c.slug = u.concept_slug
GROUP BY c.id, c.slug, c.term, c.owner_site, c.category, c.canonical_url;

COMMENT ON VIEW v_concepts_with_stats IS 'Begrippen met statistieken (aantal relaties, gebruik, validatie)';

-- ============================================================================
-- Grants (indien nodig voor service role)
-- ============================================================================

-- Grant usage on schema
-- GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant access to tables
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant access to sequences
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================================================
-- End of schema
-- ============================================================================
