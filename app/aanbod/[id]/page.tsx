

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Ruler, Building2, Star, ExternalLink, XCircle, Bell, Flame } from 'lucide-react';
import { getListing } from '@/lib/api';
import { InlineKavelAlert } from '@/components/InlineKavelAlert';
import { SimilarListings } from '@/components/SimilarListings';
import { KavelRapportTeaser } from '@/components/KavelRapportTeaser';

// 1. Generate SEO Metadata dynamically based on the listing data
export async function generateMetadata({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  if (!listing) return { title: 'Kavel Niet Gevonden' };

  const title = `${listing.seo_title} | KavelArchitect`;
  const description = listing.seo_summary;
  const imageUrl = listing.image_url || listing.map_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef';
  const canonicalUrl = `https://kavelarchitect.nl/aanbod/${params.id}`;
  const priceFormatted = listing.prijs ? `€${listing.prijs.toLocaleString('nl-NL')}` : 'Prijs op aanvraag';

  return {
    title,
    description,
    keywords: [
      'bouwkavel',
      listing.plaats,
      listing.provincie,
      'zelfbouw',
      'kavel te koop',
      'bouwgrond',
      'architect',
      'nieuwbouw',
      `bouwkavel ${listing.plaats}`,
      `kavel ${listing.provincie}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: `${description} | ${priceFormatted} | ${listing.oppervlakte}m²`,
      url: canonicalUrl,
      siteName: 'KavelArchitect',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `Bouwkavel ${listing.adres}, ${listing.plaats}`,
      }],
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `${description} | ${priceFormatted}`,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 2. Server Component for the Page
export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);

  if (!listing) {
    notFound();
  }

  const imageUrl = listing.image_url || listing.map_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef';
  const pricePerSqm = listing.oppervlakte > 0 ? Math.round(listing.prijs / listing.oppervlakte) : 0;

  // 3. Construct Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        'name': listing.seo_title,
        'description': listing.seo_summary,
        'image': [imageUrl],
        'url': `https://kavelarchitect.nl/aanbod/${listing.kavel_id}`,
        'datePosted': new Date().toISOString(),
        'offer': {
          '@type': 'Offer',
          'price': listing.prijs,
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock',
          'category': 'purchase'
        },
        'itemOffered': {
          '@type': 'Place',
          'name': `Bouwkavel ${listing.adres}`,
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': listing.adres,
            'addressLocality': listing.plaats,
            'addressRegion': listing.provincie,
            'addressCountry': 'NL'
          },
          'additionalProperty': [
            {
              '@type': 'PropertyValue',
              'name': 'Perceeloppervlakte',
              'value': listing.oppervlakte,
              'unitCode': 'MTK'
            }
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://kavelarchitect.nl'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Aanbod',
            'item': 'https://kavelarchitect.nl/aanbod'
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': listing.seo_title.substring(0, 30) + '...', // Truncate for cleaner breadcrumb
            'item': `https://kavelarchitect.nl/aanbod/${listing.kavel_id}`
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative h-[60vh] w-full mt-16">
        <Image src={imageUrl} alt={listing.adres} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>

        {/* VERKOCHT Overlay */}
        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-3xl md:text-4xl mb-4 shadow-2xl">
                VERKOCHT
              </div>
              <p className="text-white text-lg md:text-xl">Deze kavel is niet meer beschikbaar</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-7xl mx-auto text-white">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${listing.status === 'sold' ? 'bg-red-600' : 'bg-emerald-600'
            }`}>
            {listing.status === 'sold' ? 'Verkocht' : 'Beschikbaar'}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">{listing.seo_title}</h1>
          <p className="text-xl opacity-90">{listing.adres}, {listing.plaats}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">

          {/* Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Vraagprijs</p>
              <p className="text-2xl font-serif font-bold text-navy-900">
                {listing.prijs ? `€ ${listing.prijs.toLocaleString('nl-NL')}` : 'Op aanvraag'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Oppervlakte</p>
              <p className="text-2xl font-serif font-bold text-navy-900">{listing.oppervlakte} m²</p>
            </div>
            <div className="hidden md:block">
              {listing.prijs && pricePerSqm > 0 && (
                <>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Prijs / m²</p>
                  <p className="text-2xl font-serif font-bold text-blue-600">€ {pricePerSqm.toLocaleString()} / m²</p>
                </>
              )}
            </div>
          </div>

          {/* Market heat indicator removed */}

          {/* Description */}
          <div className="prose prose-lg prose-slate max-w-none">
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">Over deze kavel</h3>
            <div dangerouslySetInnerHTML={{ __html: listing.seo_article_html }} />
          </div>

          {/* Build Specs (if available) */}
          {listing.specs && (listing.specs.volume || listing.specs.nokhoogte || listing.specs.goothoogte || listing.specs.regulations) && (
            <div className="bg-navy-900 text-white rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-serif text-2xl font-bold mb-6 flex items-center">
                  <Ruler className="mr-3 text-blue-400" /> Bouwregels & Mogelijkheden
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  {listing.specs.volume && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Max. Inhoud</p>
                      <p className="text-2xl font-bold">{listing.specs.volume} m³</p>
                    </div>
                  )}
                  {listing.specs.nokhoogte && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Nokhoogte</p>
                      <p className="text-2xl font-bold">{listing.specs.nokhoogte} m</p>
                    </div>
                  )}
                  {listing.specs.goothoogte && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Goothoogte</p>
                      <p className="text-2xl font-bold">{listing.specs.goothoogte} m</p>
                    </div>
                  )}
                </div>
                {listing.specs.regulations && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Bouwregels</p>
                    <p className="text-sm leading-relaxed opacity-90">{listing.specs.regulations}</p>
                  </div>
                )}
              </div>
              <Building2 className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64" />
            </div>
          )}
        </div>

        {/* Sidebar CTA */}
        <div className="lg:col-span-1">
          {/* KavelRapport Teaser - High End Upsell */}
          <KavelRapportTeaser listing={listing} />

          <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-xl shadow-navy-900/5 border border-slate-100">
            {listing.status === 'sold' ? (
              // Sold property - Inline KavelAlert Form
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <XCircle className="text-red-600" size={32} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Kavel Verkocht</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Deze kavel is helaas al verkocht. Maar er komen regelmatig nieuwe kavels beschikbaar!
                  </p>
                </div>

                {/* Inline KavelAlert Form */}
                <InlineKavelAlert
                  provincie={listing.provincie}
                  plaats={listing.plaats}
                  prijs={listing.prijs}
                />
              </>
            ) : (
              // Available property - Normal CTA
              <>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Interesse in deze kavel?</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Bekijk de originele advertentie of laat ons direct een haalbaarheidscheck doen.
                </p>

                {listing.source_url && (
                  <a
                    href={listing.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 mb-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
                  >
                    Bekijk originele advertentie <ExternalLink size={16} className="ml-2" />
                  </a>
                )}

                <InlineKavelAlert
                  provincie={listing.provincie}
                  plaats={listing.plaats}
                  prijs={listing.prijs}
                  buttonText="Kavel Alert Activeren"
                />
              </>
            )}
          </div>
        </div>

      </div>

      {/* Similar Listings Section */}
      <SimilarListings currentListing={listing} />
    </div>
  );
}
