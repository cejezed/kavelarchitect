import type { Metadata } from 'next'
import NieuwsOverzichtClient from './NieuwsOverzichtClient'
import { NIEUWS_ITEMS } from '@/lib/news'

export const metadata: Metadata = {
  title: 'Nieuws | KavelArchitect',
  description: 'Actueel nieuws over bouwgrond, kavels, planologische regels en marktontwikkelingen.',
  alternates: {
    canonical: '/nieuws'
  }
}

export default function NieuwsPage() {
  return (
    <main className="pt-24">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
          <ol className="flex items-center gap-2">
            <li>Home</li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">Nieuws</li>
          </ol>
        </nav>

        <h1 className="mt-4 font-serif text-4xl font-bold text-navy-900">Nieuws van KavelArchitect</h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Hier vindt u updates over kavels, regelgeving en projecten die relevant zijn voor zelfbouwers.
        </p>
      </section>

      <NieuwsOverzichtClient items={NIEUWS_ITEMS} />
    </main>
  )
}