import type { NieuwsCategory, NieuwsItem } from './types'

export const NIEUWS_CATEGORIES: Record<NieuwsCategory, string> = {
  markt: 'Markt',
  regelgeving: 'Regelgeving',
  project: 'Projecten',
  bedrijf: 'KavelArchitect updates'
}

// Nieuwe items worden door het SEO dashboard bovenaan toegevoegd.
export const NIEUWS_ITEMS: NieuwsItem[] = []

export function getNieuwsBySlug(slug: string) {
  return NIEUWS_ITEMS.find((item) => item.slug === slug)
}