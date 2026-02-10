// components/ConceptTooltip.tsx
// Client Component met hover tooltip
// Kopieer dit naar je Next.js project

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getConcept } from '@/lib/kb-concepts'
import type { KBConcept } from '@/lib/supabase'

interface ConceptTooltipProps {
  slug: string
  children: React.ReactNode
  className?: string
}

/**
 * ConceptTooltip component - toont definitie bij hover
 * 
 * Gebruik:
 * <ConceptTooltip slug="faalkosten">
 *   Faalkosten
 * </ConceptTooltip>
 */
export function ConceptTooltip({ slug, children, className = '' }: ConceptTooltipProps) {
  const [concept, setConcept] = useState<KBConcept | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchConcept = async () => {
    if (!concept && !isLoading) {
      setIsLoading(true)
      const data = await getConcept(slug)
      setConcept(data)
      setIsLoading(false)
    }
    setIsOpen(true)
  }

  const handleMouseEnter = () => {
    fetchConcept()
  }

  const handleMouseLeave = () => {
    setIsOpen(false)
  }

  // Mobile: tap to toggle
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isOpen) {
      setIsOpen(false)
    } else {
      fetchConcept()
    }
  }

  if (!concept && !isLoading) {
    // Preload on mount (optional)
    useEffect(() => {
      getConcept(slug).then(setConcept)
    }, [slug])
  }

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span 
        className="underline decoration-dotted cursor-help"
        onClick={handleClick}
      >
        {children}
      </span>
      
      {isOpen && (
        <div 
          className="absolute z-50 w-72 p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl"
          style={{
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          {isLoading ? (
            <div className="text-sm text-gray-500">Laden...</div>
          ) : concept ? (
            <>
              <h4 className="font-semibold text-gray-900 mb-2">
                {concept.term}
              </h4>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {concept.definition_short}
              </p>
              <Link 
                href={concept.canonical_url}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lees meer →
              </Link>
            </>
          ) : (
            <div className="text-sm text-red-600">
              Begrip niet gevonden
            </div>
          )}
        </div>
      )}
    </span>
  )
}

// Alternatief: met Radix UI Tooltip
// npm install @radix-ui/react-tooltip

/*
'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import { getConcept } from '@/lib/kb-concepts'
import type { KBConcept } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function ConceptTooltipRadix({ slug, children }: { slug: string, children: React.ReactNode }) {
  const [concept, setConcept] = useState<KBConcept | null>(null)

  useEffect(() => {
    getConcept(slug).then(setConcept)
  }, [slug])

  if (!concept) return <span>{children}</span>

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="underline decoration-dotted cursor-help">
            {children}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-sm"
            sideOffset={5}
          >
            <h4 className="font-semibold mb-2">{concept.term}</h4>
            <p className="text-sm text-gray-700 mb-3">{concept.definition_short}</p>
            <Link 
              href={concept.canonical_url}
              className="text-sm text-blue-600 hover:underline"
              target="_blank"
            >
              Lees meer →
            </Link>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
*/
