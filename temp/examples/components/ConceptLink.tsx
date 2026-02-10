// components/ConceptLink.tsx
// React Server Component voor concept links
// Kopieer dit naar je Next.js project

import Link from 'next/link'
import { getConcept } from '@/lib/kb-concepts'

interface ConceptLinkProps {
  slug: string
  children?: React.ReactNode
  className?: string
  showTooltip?: boolean
}

/**
 * ConceptLink component - links naar de canonical URL van een begrip
 * 
 * Gebruik:
 * <ConceptLink slug="faalkosten">faalkosten</ConceptLink>
 * <ConceptLink slug="bestemmingsplan">het bestemmingsplan</ConceptLink>
 */
export async function ConceptLink({ 
  slug, 
  children, 
  className = '',
  showTooltip = true 
}: ConceptLinkProps) {
  const concept = await getConcept(slug)
  
  // Fallback als concept niet bestaat
  if (!concept) {
    console.warn(`Concept "${slug}" not found in database`)
    return (
      <span className={`concept-link-missing ${className}`} title="Begrip niet gevonden">
        {children || slug}
      </span>
    )
  }
  
  // Styling classes (pas aan per site)
  const linkClasses = `
    concept-link
    underline decoration-dotted
    hover:decoration-solid
    hover:text-blue-600
    transition-colors
    ${className}
  `.trim()
  
  return (
    <Link 
      href={concept.canonical_url}
      className={linkClasses}
      title={showTooltip ? concept.definition_short : undefined}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children || concept.term}
    </Link>
  )
}

// CSS voor in je globals.css:
/*
.concept-link {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
}

.concept-link:hover {
  text-decoration-style: solid;
}

.concept-link-missing {
  color: #ef4444; 
  text-decoration: underline;
  text-decoration-style: wavy;
}
*/
