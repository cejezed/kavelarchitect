// lib/supabase.ts
// Kopieer dit naar je Next.js project

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface KBConcept {
  id: string
  slug: string
  term: string
  owner_site: 'abjz' | 'kavelarchitect' | 'brikx'
  canonical_url: string
  definition_short: string
  definition_long?: string
  rules_json: {
    [site: string]: {
      max_sentences: number | null
      may_define: boolean
      h1_allowed: boolean
    }
  }
  category?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface KBConceptRelation {
  id: string
  concept_id: string
  related_concept_id: string
  relation_type: 'see_also' | 'prerequisite' | 'part_of' | 'opposite' | 'example'
  description?: string
}

export interface KBPageUsage {
  id: string
  site: 'abjz' | 'kavelarchitect' | 'brikx'
  page_url: string
  page_title?: string
  concept_slug: string
  usage_type: 'definition' | 'link' | 'mention'
  is_valid: boolean
  validation_note?: string
  last_checked: string
}
