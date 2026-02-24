import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NIEUWS_CATEGORIES, NIEUWS_ITEMS, getNieuwsBySlug } from '@/lib/news'

export function generateStaticParams() {
  return NIEUWS_ITEMS.map((item) => ({ slug: item.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getNieuwsBySlug(params.slug)
  if (!item) {
    return { title: 'Nieuwsbericht niet gevonden | KavelArchitect' }
  }

  const title = item.seo?.title ?? `${item.title} | KavelArchitect nieuws`
  const description = item.seo?.description ?? item.excerpt

  return {
    title,
    description,
    alternates: {
      canonical: `/nieuws/${item.slug}`
    },
    openGraph: {
      type: 'article',
      url: `https://kavelarchitect.nl/nieuws/${item.slug}`,
      title,
      description,
      images: [
        {
          url: item.seo?.ogImage ?? item.featuredImage.url,
          alt: item.featuredImage.alt
        }
      ]
    }
  }
}

export default function NieuwsDetailPage({ params }: { params: { slug: string } }) {
  const item = getNieuwsBySlug(params.slug)
  if (!item) notFound()

  return (
    <main className="pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-slate-700">Home</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/nieuws" className="hover:text-slate-700">Nieuws</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-slate-700">{item.title}</li>
          </ol>
        </nav>

        <p className="text-xs uppercase tracking-wide text-slate-500">
          {NIEUWS_CATEGORIES[item.category]} • {new Date(item.publishedAt).toLocaleDateString('nl-NL')}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-navy-900">{item.title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-700">{item.excerpt}</p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.featuredImage.url} alt={item.featuredImage.alt} className="h-auto w-full object-cover" />
        </div>

        <div
          className="mt-8 space-y-4 text-base leading-7 text-slate-800 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_li]:list-disc"
          dangerouslySetInnerHTML={{ __html: item.contentHtml }}
        />
      </article>
    </main>
  )
}