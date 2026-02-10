import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export type ConceptSite = 'zwijsen' | 'kavelarchitect' | 'brikx';
type RawOwnerSite = ConceptSite | 'abjz';

type ConceptRule = {
  max_sentences: number | null;
  may_define: boolean;
  h1_allowed: boolean;
};

export interface KBConcept {
  id: string;
  slug: string;
  term: string;
  owner_site: RawOwnerSite;
  canonical_url: string;
  definition_short: string;
  definition_long?: string | null;
  category?: string | null;
  tags?: string[] | null;
  rules_json?: Record<string, ConceptRule> | null;
}

let cachedClient: ReturnType<typeof createSupabaseClient> | null = null;

function getClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  cachedClient = createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cachedClient;
}

export function normalizeOwnerSite(site: RawOwnerSite | string | null | undefined): ConceptSite {
  if (site === 'kavelarchitect' || site === 'brikx') return site;
  return 'zwijsen';
}

export function getCurrentConceptSite(): ConceptSite {
  const site = process.env.KB_SITE_MODE || process.env.NEXT_PUBLIC_SITE_MODE || 'zwijsen';
  return normalizeOwnerSite(site);
}

export async function getConcept(slug: string): Promise<KBConcept | null> {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from('kb_concepts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as KBConcept;
}

export async function getAllConcepts(): Promise<KBConcept[]> {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('kb_concepts')
    .select('*')
    .order('term', { ascending: true });

  if (error || !data) return [];
  return data as KBConcept[];
}

export async function getConceptsByOwner(owner: ConceptSite): Promise<KBConcept[]> {
  const concepts = await getAllConcepts();
  return concepts.filter((concept) => normalizeOwnerSite(concept.owner_site) === owner);
}

export function getUsageRules(
  concept: KBConcept,
  site: ConceptSite = getCurrentConceptSite()
): ConceptRule {
  const rules = concept.rules_json || {};
  const siteRules = (rules[site] || rules[site === 'zwijsen' ? 'abjz' : site]) as ConceptRule | undefined;
  return siteRules || {
    max_sentences: 2,
    may_define: false,
    h1_allowed: false,
  };
}

export function isOwner(concept: KBConcept, site: ConceptSite = getCurrentConceptSite()): boolean {
  return normalizeOwnerSite(concept.owner_site) === site;
}
