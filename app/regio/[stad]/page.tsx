import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Bell, MapPin, Building2, Mail } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Listing } from '@/lib/api';
import Image from 'next/image';

// Generate static params for all cities with listings
export async function generateStaticParams() {
  const { data: listings } = await supabaseAdmin
    .from('listings')
    .select('plaats')
    .eq('status', 'published');

  if (!listings) return [];

  // Get unique cities
  const uniqueCities = new Set<string>();
  listings.forEach(l => uniqueCities.add(l.plaats));
  const cities = Array.from(uniqueCities);

  return cities.map((stad) => ({
    stad: stad.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// Generate SEO metadata
export async function generateMetadata({ params }: { params: { stad: string } }): Promise<Metadata> {
  const cityName = params.stad.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const title = `Bouwkavel kopen ${cityName} | KavelArchitect`;
  const description = `Bouwkavels te koop in ${cityName}. Actueel overzicht van beschikbare kavels en exclusieve off-market mogelijkheden. Expert begeleiding van Architectenbureau Zwijsen.`;
  const canonicalUrl = `https://kavelarchitect.nl/regio/${params.stad}`;

  return {
    title,
    description,
    keywords: [
      `bouwkavel ${cityName}`,
      `kavel kopen ${cityName}`,
      `bouwgrond ${cityName}`,
      `zelfbouw ${cityName}`,
      'bouwkavel te koop',
      'architect',
      'nieuwbouw',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'KavelArchitect',
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RegioPage({ params }: { params: { stad: string } }) {
  const cityName = params.stad.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch listings for this city
  const { data: listings } = await supabaseAdmin
    .from('listings')
    .select('*')
    .eq('status', 'published')
    .ilike('plaats', cityName)
    .order('created_at', { ascending: false });

  const hasListings = listings && listings.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link href="/aanbod" className="flex items-center text-sm font-medium text-slate-500 hover:text-navy-900">
            <ArrowLeft size={18} className="mr-2" /> Terug naar overzicht
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={32} className="text-blue-400" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold">Bouwkavel kopen in {cityName}</h1>
          </div>
          <p className="text-xl text-slate-200 max-w-2xl">
            {hasListings
              ? `${listings.length} ${listings.length === 1 ? 'bouwkavel' : 'bouwkavels'} beschikbaar in ${cityName}`
              : `Exclusieve toegang tot off-market kavels in ${cityName}`
            }
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {hasListings ? (
          // Scenario A: Show available listings
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">Beschikbare kavels in {cityName}</h2>
              <p className="text-slate-600">Direct contact opnemen of aanmelden voor nieuwe kavels</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {listings.map((listing: Listing) => {
                const imageUrl = listing.image_url || listing.map_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef';
                const pricePerSqm = listing.oppervlakte > 0 ? Math.round(listing.prijs / listing.oppervlakte) : 0;

                return (
                  <Link
                    key={listing.kavel_id}
                    href={`/aanbod/${listing.kavel_id}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-slate-100 group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={imageUrl}
                        alt={listing.adres}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Beschikbaar
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">{listing.adres}</h3>
                      <p className="text-slate-600 text-sm mb-4">{listing.plaats}</p>
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-2xl font-bold text-navy-900">
                          {listing.prijs ? `€ ${listing.prijs.toLocaleString('nl-NL')}` : 'Prijs op aanvraag'}
                        </span>
                        <span className="text-sm text-slate-500">{listing.oppervlakte} m²</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {listing.prijs && pricePerSqm > 0 && (
                          <span className="font-medium">€ {pricePerSqm.toLocaleString('nl-NL')} / m²</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          // Scenario B: "Conversion Trap" - No listings available
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-6">
                <Building2 className="text-blue-600" size={32} />
              </div>

              <h2 className="font-serif text-3xl font-bold text-navy-900 text-center mb-4">
                Geen kavels op Funda in {cityName}?
              </h2>

              <p className="text-lg text-slate-600 text-center mb-8">
                Dat betekent niet dat er niets is. Veel kavels worden <strong>off-market</strong> aangeboden,
                nog voordat ze online komen. Wij hebben daar exclusieve toegang toe.
              </p>

              <div className="bg-gradient-to-br from-navy-900 to-blue-900 text-white rounded-2xl p-8 mb-8">
                <h3 className="font-serif text-2xl font-bold mb-4 flex items-center">
                  <Bell className="mr-3" /> {cityName}-Alert
                </h3>
                <p className="text-slate-200 mb-6">
                  Meld u aan en ontvang direct een notificatie zodra er een kavel beschikbaar komt in {cityName}.
                  Ook voor off-market kavels die nooit op Funda verschijnen.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span className="text-sm">Exclusieve toegang tot off-market kavels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span className="text-sm">Direct bericht bij nieuwe kavels in {cityName}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    <span className="text-sm">Gratis haalbaarheidscheck door architect Jules Zwijsen</span>
                  </li>
                </ul>
                <Link
                  href={`/?regio=${params.stad}`}
                  className="block w-full text-center py-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Activeer {cityName}-Alert
                </Link>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="font-bold text-navy-900 mb-4">Waarom werken met KavelArchitect?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sm text-navy-900 mb-2">🏗️ Architectuur expertise</h4>
                    <p className="text-sm text-slate-600">
                      Direct advies van Architectenbureau Zwijsen over haalbaarheid en bouwmogelijkheden
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-navy-900 mb-2">🎯 Off-market toegang</h4>
                    <p className="text-sm text-slate-600">
                      Kavels die nooit publiek worden, via ons netwerk van makelaars en projectontwikkelaars
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-navy-900 mb-2">⚡ Real-time alerts</h4>
                    <p className="text-sm text-slate-600">
                      Ontvang direct een notificatie, nog voordat kavels online komen
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-navy-900 mb-2">📊 Bestemmingsplan check</h4>
                    <p className="text-sm text-slate-600">
                      Wij controleren vooraf wat er gebouwd mag worden, zodat u geen tijd verliest
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 mb-4">Of neem direct contact op:</p>
                <a
                  href="mailto:info@kavelarchitect.nl?subject=Interesse in bouwkavel ${cityName}"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <Mail size={18} />
                  info@kavelarchitect.nl
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
