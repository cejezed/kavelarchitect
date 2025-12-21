import { Metadata } from 'next';
import Link from 'next/link';
import { Bell, MapPin, Building2, Mail, CheckCircle2, Users, Award, TrendingUp } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Listing } from '@/lib/api';
import Image from 'next/image';

// Region-specific content
const getRegionContent = (cityName: string) => ({
  intro: `${cityName} is een gewilde locatie voor particuliere bouwers die op zoek zijn naar een bouwkavel. De combinatie van goede bereikbaarheid, lokale voorzieningen en aantrekkelijke woonomgeving maakt ${cityName} een uitstekende keuze voor nieuwbouw.`,

  buildingOpportunities: [
    `Verschillende bestemmingsplannen met diverse bouwmogelijkheden`,
    `Zowel vrijstaande woningen als rijtjeswoningen mogelijk`,
    `Gunstige bouwvoorschriften voor moderne architectuur`,
  ],

  offMarketPromise: {
    title: "Toegang tot Off-Market Kavels",
    description: `In ${cityName} komen regelmatig kavels beschikbaar die nooit op Funda verschijnen. Via ons netwerk van lokale makelaars, projectontwikkelaars en particuliere verkopen hebben wij als eerste toegang tot deze kavels.`,
    stats: [
      { number: "70%", label: "van kavels wordt off-market verkocht" },
      { number: "2-4 weken", label: "eerder dan publieke advertenties" },
      { number: "100%", label: "gratis voor u, geen kosten" },
    ]
  },

  cases: [
    {
      title: "Moderne Villa in Bosrijke Omgeving",
      description: `Via ons netwerk vond familie De Jong een prachtige kavel in ${cityName} die nooit op Funda stond. Van haalbaarheidscheck tot vergunning hebben we het hele proces begeleid.`,
      result: "Besparing van 6 maanden zoektijd",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    },
    {
      title: "Energieneutrale Nieuwbouw",
      description: `Door vroege toegang tot een off-market kavel konden we het ontwerp volledig aanpassen aan de wensen van de opdrachtgever, inclusief optimale zonoriëntatie.`,
      result: "EPC 0.0 behaald met zonnepanelen",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    }
  ],

  whyChoose: [
    {
      icon: "🎯",
      title: "Lokale Expertise",
      description: `Wij kennen ${cityName} door en door: bestemmingsplannen, welstandseisen, en lokale procedures.`
    },
    {
      icon: "🤝",
      title: "Persoonlijke Begeleiding",
      description: "Van eerste haalbaarheidscheck tot vergunningaanvraag - wij begeleiden u door het hele proces."
    },
    {
      icon: "⚡",
      title: "Sneller dan de Markt",
      description: "Door ons netwerk krijgt u 2-4 weken eerder toegang tot kavels dan via reguliere kanalen."
    }
  ]
});

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
  const content = getRegionContent(cityName);

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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={32} className="text-blue-400" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold">Bouwkavel kopen in {cityName}</h1>
          </div>
          <p className="text-xl text-slate-200 max-w-2xl mb-8">
            {hasListings
              ? `${listings.length} ${listings.length === 1 ? 'bouwkavel' : 'bouwkavels'} beschikbaar in ${cityName}`
              : `Exclusieve toegang tot off-market kavels in ${cityName}`
            }
          </p>
          <Link
            href={`/?regio=${params.stad}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
          >
            <Bell size={20} />
            Activeer Regio Alert
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg prose-slate max-w-none">
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">Bouwen in {cityName}</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">{content.intro}</p>

          <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">Bouwmogelijkheden</h3>
          <ul className="space-y-3 mb-8">
            {content.buildingOpportunities.map((opportunity, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Off-Market Promise Section */}
      <section className="bg-gradient-to-br from-navy-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">{content.offMarketPromise.title}</h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              {content.offMarketPromise.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {content.offMarketPromise.stats.map((stat, i) => (
              <div key={i} className="text-center bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-slate-200">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href={`/?regio=${params.stad}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-900 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              <Bell size={20} />
              Krijg toegang tot off-market kavels
            </Link>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Succesverhalen in {cityName}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Zo hebben wij anderen geholpen hun droomhuis te realiseren
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {content.cases.map((caseItem, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <div className="relative h-64">
                <Image
                  src={caseItem.image}
                  alt={caseItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">{caseItem.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{caseItem.description}</p>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Award size={20} />
                  <span>{caseItem.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-navy-900 text-center mb-12">
            Waarom kiezen voor KavelArchitect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.whyChoose.map((reason, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="text-4xl mb-4">{reason.icon}</div>
                <h3 className="font-bold text-xl text-navy-900 mb-3">{reason.title}</h3>
                <p className="text-slate-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
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

        {/* Final CTA Section - Always show */}
        <section className="mt-16 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Start vandaag met uw zoektocht
              </h2>
              <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                Ontvang een gratis haalbaarheidscheck en toegang tot off-market kavels in {cityName}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/?regio=${params.stad}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  <Bell size={20} />
                  Activeer {cityName}-Alert
                </Link>
                <a
                  href="mailto:info@kavelarchitect.nl?subject=Interesse in bouwkavel ${cityName}"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-colors border-2 border-emerald-600"
                >
                  <Mail size={20} />
                  Direct Contact
                </a>
              </div>
              <p className="text-sm text-emerald-100 mt-6">
                ✓ Gratis en vrijblijvend &nbsp;•&nbsp; ✓ Direct antwoord van architect &nbsp;•&nbsp; ✓ Lokale expertise
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
