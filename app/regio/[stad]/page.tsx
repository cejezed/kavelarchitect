import { Metadata } from 'next';
import Link from 'next/link';
import { Bell, MapPin, Building2, Mail, CheckCircle2, Users, Award, TrendingUp, ShieldCheck, Ruler, Check, ArrowRight } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Listing } from '@/lib/api';
import Image from 'next/image';
import StickyCTA from '@/components/StickyCTA';
import FAQAccordion from '@/components/FAQAccordion';
import RegioAnalytics from '@/components/RegioAnalytics';
import { getRegionFAQs, generateFAQSchema } from '@/lib/region-faq-data';

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
      { number: "Exclusieve", label: "leads uit ons netwerk van makelaars" },
      { number: "2-4 weken", label: "eerder dan publieke advertenties" },
      { number: "100%", label: "gratis voor u, geen kosten" },
    ]
  },

  services: [
    {
      icon: ShieldCheck,
      title: "KavelRapport™",
      description: `Laat uw kavel in ${cityName} professioneel beoordelen voordat u koopt. Wij analyseren het bestemmingsplan, bouwmogelijkheden en risico's binnen 48 uur.`,
      features: ["Bestemmingsplan analyse", "Bouwvolume check", "Risico-inventarisatie", "Financiële haalbaarheid"],
      link: "/kavelrapport",
      linkText: "Meer over KavelRapport"
    },
    {
      icon: Bell,
      title: "Regio-Alert voor ${cityName}",
      description: `Ontvang direct een notificatie zodra er een nieuwe kavel beschikbaar komt in ${cityName}. Ook voor off-market kavels die niet op Funda verschijnen.`,
      features: ["Exclusieve off-market toegang", "Direct bericht bij nieuwe kavels", "Gratis haalbaarheidscheck", "Persoonlijke matching"],
      link: `/?regio=${cityName.toLowerCase().replace(/\s+/g, '-')}`,
      linkText: "Activeer Alert"
    },
    {
      icon: Ruler,
      title: "Architectenbegeleiding",
      description: `Van schetsontwerp tot vergunningaanvraag - volledige begeleiding door Architectenbureau Zwijsen bij het bouwen van uw droomhuis in ${cityName}.`,
      features: ["Schetsontwerp en haalbaarheid", "Vergunningsaanvraag", "Definitief ontwerp", "Kostenraming en planning"],
      link: "https://www.zwijsen.net/contact",
      linkText: "Start Traject",
      external: true
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
  let listings: any[] | null = [];
  try {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('plaats')
      .eq('status', 'published');
    listings = data;
  } catch (error) {
    console.error('generateStaticParams fetch failed:', error);
    return [];
  }

  if (!listings) return [];

  // Get unique cities
  const uniqueCities = new Set<string>();
  listings.forEach((l: any) => uniqueCities.add(l.plaats));
  const cities = Array.from(uniqueCities);

  return cities.map((stad) => ({
    stad: stad.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// Generate SEO metadata - Yoast-optimized
export async function generateMetadata({ params }: { params: { stad: string } }): Promise<Metadata> {
  const cityName = params.stad.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Determine region for better targeting
  const isVechtstreek = ['Loenen aan de Vecht', 'Breukelen', 'Maarssen', 'Nieuwersluis'].includes(cityName);
  const isGooi = ['Hilversum', 'Laren', 'Blaricum', 'Bussum'].includes(cityName);

  let regionSuffix = '';
  if (isVechtstreek) regionSuffix = ' Vechtstreek';
  else if (isGooi) regionSuffix = ' Het Gooi';

  // Optimized title: <60 chars, keyword-rich, compelling
  const title = `Architect ${cityName} | Nieuwbouw Verbouw${regionSuffix}`;

  // Optimized description: <160 chars, call-to-action, keyword-rich
  const description = `Architect ${cityName}: bouwkavels + ontwerpbegeleiding. Off-market toegang, welstandsadvies${regionSuffix}. Gratis haalbaarheidscheck →`;

  const canonicalUrl = `https://kavelarchitect.nl/regio/${params.stad}`;

  return {
    title,
    description,
    keywords: [
      `architect ${cityName}`,
      `bouwkavel ${cityName}`,
      `nieuwbouw ${cityName}`,
      `verbouw ${cityName}`,
      `kavel kopen ${cityName}`,
      `bouwgrond ${cityName}`,
      `zelfbouw ${cityName}`,
      'architectenbureau',
      'welstandsadvies',
      'off-market kavels',
      ...(isVechtstreek ? ['architect Vechtstreek', 'nieuwbouw Vechtstreek'] : []),
      ...(isGooi ? ['architect Het Gooi', 'nieuwbouw Het Gooi'] : []),
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
      images: [{
        url: 'https://kavelarchitect.nl/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: `Architect ${cityName} - Nieuwbouw en Verbouw`
      }]
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
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'last-modified': '2026-01-07', // Freshness signal
    }
  };
}

export default async function RegioPage({ params }: { params: { stad: string } }) {
  const cityName = params.stad.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const content = getRegionContent(cityName);

  // Fetch listings for this city
  let listings: Listing[] = [];
  try {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('*')
      .eq('status', 'published')
      .ilike('plaats', cityName)
      .order('created_at', { ascending: false });
    listings = (data as Listing[]) || [];
  } catch (error) {
    console.error(`RegioPage fetch failed for ${cityName}:`, error);
  }

  const hasListings = listings.length > 0;

  // Get FAQ data for this region
  const faqs = getRegionFAQs(cityName);

  // Schema.org structured data - Enhanced for rich snippets
  const schemaWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': `Architect ${cityName} | Nieuwbouw Verbouw`,
    'description': `Architect ${cityName}: bouwkavels + ontwerpbegeleiding. Off-market toegang, welstandsadvies. Gratis haalbaarheidscheck.`,
    'url': `https://kavelarchitect.nl/regio/${params.stad}`,
    'inLanguage': 'nl-NL',
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'KavelArchitect',
      'url': 'https://kavelarchitect.nl'
    },
    'breadcrumb': {
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
          'name': 'Kavels',
          'item': 'https://kavelarchitect.nl/aanbod'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': 'Regio\'s',
          'item': 'https://kavelarchitect.nl/regio'
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': cityName,
          'item': `https://kavelarchitect.nl/regio/${params.stad}`
        }
      ]
    },
    'about': {
      '@type': 'Service',
      'serviceType': 'Architectuur en Bouwkavel Bemiddeling',
      'provider': {
        '@type': 'ProfessionalService',
        'name': 'KavelArchitect',
        'url': 'https://kavelarchitect.nl'
      },
      'areaServed': {
        '@type': 'City',
        'name': cityName,
        'addressCountry': 'NL'
      }
    },
    'lastReviewed': '2026-01-07',
    'dateModified': '2026-01-07'
  };

  const schemaLocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `KavelArchitect ${cityName}`,
    'image': 'https://kavelarchitect.nl/hero-bg.jpg',
    'description': `Architectenbureau gespecialiseerd in nieuwbouw en bouwkavels in ${cityName}. Exclusieve toegang tot off-market kavels en volledige ontwerpbegeleiding.`,
    'url': `https://kavelarchitect.nl/regio/${params.stad}`,
    'telephone': '+31-6-12345678',
    'email': 'info@kavelarchitect.nl',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': cityName,
      'addressCountry': 'NL'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'addressCountry': 'NL'
    },
    'areaServed': {
      '@type': 'City',
      'name': cityName
    },
    'priceRange': '€€€',
    'serviceType': ['Architectuur', 'Bouwkavel Bemiddeling', 'Nieuwbouw Begeleiding', 'Welstandsadvies'],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Diensten',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'KavelRapport',
            'description': 'Professionele beoordeling van bouwkavels'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Off-Market Toegang',
            'description': 'Exclusieve toegang tot niet-publieke bouwkavels'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Architectenbegeleiding',
            'description': 'Volledige ontwerpbegeleiding van schets tot vergunning'
          }
        }
      ]
    }
  };

  // FAQ Schema for rich snippets
  const schemaFAQ = generateFAQSchema(cityName);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Structured Data - Enhanced for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLocalBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />

      {/* Analytics Tracking */}
      <RegioAnalytics cityName={cityName} />

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 pt-6 text-xs text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-700">Home</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/aanbod" className="hover:text-slate-700">Kavels</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-slate-700">Regio's</li>
        </ol>
      </nav>

      {/* Hero Section - H1 optimized for SEO */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* H1 at top of viewport for SEO */}
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            <MapPin size={24} className="text-blue-400 md:w-8 md:h-8 inline-block mr-2 md:mr-3 align-middle" />
            Architect {cityName} | Nieuwbouw & Verbouw
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mb-6 md:mb-8">
            {hasListings
              ? `${listings.length} ${listings.length === 1 ? 'bouwkavel' : 'bouwkavels'} beschikbaar • Off-market toegang • Welstandsadvies`
              : `Exclusieve toegang tot off-market kavels • Gratis haalbaarheidscheck • Lokale expertise`
            }
          </p>
          <Link
            href={`/?regio=${params.stad}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-navy-900 font-bold text-sm md:text-base rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
          >
            <Bell size={20} />
            Gratis Haalbaarheidscheck
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
      <section className="bg-gradient-to-br from-navy-900 to-blue-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-2xl md:text-4xl font-bold mb-3 md:mb-4">{content.offMarketPromise.title}</h2>
            <p className="text-base md:text-xl text-slate-200 max-w-3xl mx-auto">
              {content.offMarketPromise.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
            {content.offMarketPromise.stats.map((stat, i) => (
              <div key={i} className="text-center bg-white/10 rounded-xl md:rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <div className="text-3xl md:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-slate-200">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href={`/?regio=${params.stad}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-navy-900 font-bold text-sm md:text-base rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              <Bell size={20} />
              Krijg toegang tot off-market kavels
            </Link>
            <p className="text-xs md:text-sm text-slate-300 mt-4">
              Gratis & vrijblijvend • Geen verplichtingen • Direct opzegbaar
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-navy-900 mb-3 md:mb-4">
            Onze diensten voor {cityName}
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Complete ondersteuning bij het zoeken, beoordelen en bouwen op uw kavel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {content.services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={i} className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-navy-900 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <Icon size={24} className="text-white md:w-7 md:h-7" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-navy-900 mb-2 md:mb-3">{service.title}</h3>
                <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed">{service.description}</p>

                <ul className="space-y-2 mb-4 md:mb-6">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs md:text-sm text-slate-700">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5 md:w-4 md:h-4" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {service.external ? (
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm md:text-base text-navy-900 font-bold hover:text-emerald-600 transition-colors"
                  >
                    {service.linkText}
                    <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                  </a>
                ) : (
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 text-sm md:text-base text-navy-900 font-bold hover:text-emerald-600 transition-colors"
                  >
                    {service.linkText}
                    <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                  </Link>
                )}
              </div>
            );
          })}
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
                const price = typeof listing.prijs === 'number' ? listing.prijs : null;
                const oppervlakte = typeof listing.oppervlakte === 'number' ? listing.oppervlakte : null;
                const pricePerSqm = price && oppervlakte && oppervlakte > 0 ? Math.round(price / oppervlakte) : 0;

                return (
                  <Link
                    key={listing.kavel_id}
                    href={`/aanbod/${listing.kavel_id}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-slate-100 group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={imageUrl}
                        alt={`Architect ${cityName} - Bouwkavel ${listing.adres} - ${oppervlakte ?? 'onbekend'}m² nieuwbouw project`}
                        fill
                        loading="lazy"
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
                          {price ? `€ ${price.toLocaleString('nl-NL')}` : 'Prijs op aanvraag'}
                        </span>
                        <span className="text-sm text-slate-500">{oppervlakte ? `${oppervlakte} m²` : 'Oppervlakte onbekend'}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {pricePerSqm > 0 && (
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

        {/* FAQ Section - For Rich Snippets */}
        <FAQAccordion faqs={faqs} cityName={cityName} />

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

      {/* Sticky CTA - appears after 50% scroll */}
      <StickyCTA cityName={cityName} citySlug={params.stad} />
    </div>
  );
}
