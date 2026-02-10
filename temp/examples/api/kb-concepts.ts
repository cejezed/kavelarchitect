// lib/kb-concepts.ts
// API helper functies voor kennisbank begrippen
// Kopieer dit naar je Next.js project

import { supabase, KBConcept, KBConceptRelation } from './supabase'

/**
 * Get concept by slug
 */
export async function getConcept(slug: string): Promise<KBConcept | null> {
  try {
    const { data, error } = await supabase
      .from('kb_concepts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error fetching concept:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Exception in getConcept:', error)
    return null
  }
}

/**
 * Get all concepts for a specific owner
 */
export async function getConceptsByOwner(
  owner: 'abjz' | 'kavelarchitect' | 'brikx'
): Promise<KBConcept[]> {
  try {
    const { data, error } = await supabase
      .from('kb_concepts')
      .select('*')
      .eq('owner_site', owner)
      .order('term')
    
    if (error) {
      console.error('Error fetching concepts by owner:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception in getConceptsByOwner:', error)
    return []
  }
}

/**
 * Get concepts by category
 */
export async function getConceptsByCategory(category: string): Promise<KBConcept[]> {
  try {
    const { data, error } = await supabase
      .from('kb_concepts')
      .select('*')
      .eq('category', category)
      .order('term')
    
    if (error) {
      console.error('Error fetching concepts by category:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception in getConceptsByCategory:', error)
    return []
  }
}

/**
 * Search concepts (client-side text search)
 */
export async function searchConcepts(query: string): Promise<KBConcept[]> {
  try {
    const { data, error } = await supabase
      .from('kb_concepts')
      .select('*')
      .or(`term.ilike.%${query}%,definition_short.ilike.%${query}%`)
      .order('term')
    
    if (error) {
      console.error('Error searching concepts:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception in searchConcepts:', error)
    return []
  }
}

/**
 * Search concepts using full-text search (server-side function)
 */
export async function searchConceptsFullText(query: string): Promise<KBConcept[]> {
  try {
    const { data, error } = await supabase
      .rpc('search_concepts', { search_query: query })
    
    if (error) {
      console.error('Error in full-text search:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception in searchConceptsFullText:', error)
    return []
  }
}

/**
 * Get related concepts for a given concept
 */
export async function getRelatedConcepts(slug: string): Promise<{
  slug: string
  term: string
  relation_type: string
  description?: string
}[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_related_concepts', { concept_slug_param: slug })
    
    if (error) {
      console.error('Error fetching related concepts:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception in getRelatedConcepts:', error)
    return []
  }
}

/**
 * Get all concepts (for admin dashboard)
 */
export async function getAllConcepts(): Promise<KBConcept[]> {
  try {
    const { data, error } = await supabase
      .from('kb_concepts')
      .select('*')
      .order('term')
    
    if (error) {
      console.error('Error fetching all concepts:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Exception in getAllConcepts:', error)
    return []
  }
}

/**
 * Check if current site is owner of concept
 */
export function isOwner(
  concept: KBConcept,
  currentSite: 'abjz' | 'kavelarchitect' | 'brikx'
): boolean {
  return concept.owner_site === currentSite
}

/**
 * Get usage rules for current site
 */
export function getUsageRules(
  concept: KBConcept,
  currentSite: 'abjz' | 'kavelarchitect' | 'brikx'
) {
  return concept.rules_json[currentSite] || {
    max_sentences: 2,
    may_define: false,
    h1_allowed: false
  }
}

/**
 * Check if concept usage is valid for current site
 */
export function validateConceptUsage(
  concept: KBConcept,
  currentSite: 'abjz' | 'kavelarchitect' | 'brikx',
  sentenceCount: number,
  hasDefinitionHeader: boolean
): {
  valid: boolean
  message?: string
} {
  // Owner can do anything
  if (isOwner(concept, currentSite)) {
    return { valid: true }
  }
  
  const rules = getUsageRules(concept, currentSite)
  
  // Check H1/H2 restriction
  if (hasDefinitionHeader && !rules.h1_allowed) {
    return {
      valid: false,
      message: `H1/H2 "Wat is..." niet toegestaan voor ${concept.term}. Je bent niet de eigenaar (${concept.owner_site}).`
    }
  }
  
  // Check sentence count
  if (rules.max_sentences && sentenceCount > rules.max_sentences) {
    return {
      valid: false,
      message: `Te veel uitleg over ${concept.term} (${sentenceCount} zinnen). Max ${rules.max_sentences} zinnen toegestaan voor niet-eigenaar sites.`
    }
  }
  
  return { valid: true }
}

/**
 * Log concept usage (for tracking)
 */
export async function logConceptUsage(
  site: 'abjz' | 'kavelarchitect' | 'brikx',
  pageUrl: string,
  conceptSlug: string,
  usageType: 'definition' | 'link' | 'mention',
  pageTitle?: string
): Promise<void> {
  try {
    await supabase.from('kb_page_usage').upsert({
      site,
      page_url: pageUrl,
      page_title: pageTitle,
      concept_slug: conceptSlug,
      usage_type: usageType,
      last_checked: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error logging concept usage:', error)
    // Don't throw - logging failure shouldn't break the page
  }
}
