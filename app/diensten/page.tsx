import Link from 'next/link';
import { ShieldCheck, Bell, Ruler, Home, FileCheck, ArrowRight, Check } from 'lucide-react';

type Service = {
  id: string;
  icon: any;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  ctaText: string;
  ctaLink: string;
  color: string;
  external?: boolean;
  price?: string;
};

export const metadata = {
  title: 'Diensten | Architectenbegeleiding voor bouwkavels',
  description: 'Van KavelRapport tot complete architectenbegeleiding. Professionele diensten voor het zoeken, beoordelen en bebouwen van bouwkavels in Nederland.',
  keywords: ['kavelrapport', 'architectenbegeleiding', 'bouwkavel zoeken', 'bestemmingsplan check', 'architect bouwkavel']
};

const services: Service[] = [
  {
    id: 'kavelrapport',
    icon: ShieldCheck,
    title: 'KavelRapport™',
    tagline: 'De enige objectieve kavelcheck vóór aankoop',
    description: 'Laat onze architecten binnen 48 uur uw kavel analyseren op bouwpotentie, risico\'s en rendement. Zekerheid voor elke bouwkavel.',
    benefits: [
      'Planologische haalbaarheid (bestemmingsplan, welstand)',
      'Volume- en oriëntatiestudie (max. m², verdiepingen)',
      'Risico-scan (bodem, buren, vergunning)',
      'Prijsadvies vs. bouwkosten',
      'Levering binnen 48 uur'
    ],
    ctaText: 'Start KavelRapport',
    ctaLink: '/kavelrapport',
    color: 'from-navy-900 to-blue-900',
    price: 'Vanaf €39'
  },
  {
    id: 'zoekservice',
    icon: Bell,
    title: 'Zoekservice Bouwkavels',
    tagline: 'Exclusieve leads – ook off-market kavels',
    description: '70% van de beste kavels wordt off-market verkocht. Wij hebben toegang tot dit netwerk en sturen u geselecteerde kavels op basis van architectonische potentie.',
    benefits: [
      'Regio-alerts voor uw zoekgebied',
      'Off-market kavels (2-4 weken eerder dan Funda)',
      'Geselecteerd op architectonische potentie',
      'Inclusief eerste haalbaarheidscheck',
      'Gratis voor serieuze kopers'
    ],
    ctaText: 'Activeer Regio-Alert',
    ctaLink: '/',
    color: 'from-emerald-600 to-emerald-700',
    price: 'Gratis'
  },
  {
    id: 'architectenbegeleiding',
    icon: Ruler,
    title: 'Architectenbegeleiding',
    tagline: 'Van kavel naar sleutel-klaar ontwerp',
    description: 'Na een positieve KavelRapport starten wij het complete traject: van schetsontwerp tot vergunning en uitwerking met Architectenbureau Zwijsen.',
    benefits: [
      'Eerste schets (vrijblijvend)',
      'Volume- en lichtstudie',
      'Vergunningsaanvraag en -begeleiding',
      'Definitief ontwerp + kostenraming',
      'Transparante offerte en planning'
    ],
    ctaText: 'Start Traject',
    ctaLink: 'https://www.zwijsen.net/contact',
    color: 'from-blue-600 to-blue-700',
    external: true,
    price: 'Op aanvraag'
  },
  {
    id: 'bestaande-woning',
    icon: Home,
    title: 'Intake Bestaande Woning',
    tagline: 'Verbouwen of nieuwbouwen?',
    description: 'Heb je al een huis maar twijfel je over verbouwen vs. nieuwbouw? Wij rekenen het voor je uit met een planologische en financiële analyse.',
    benefits: [
      'Vergelijk bouwkosten verbouw vs. nieuwbouw',
      'Waardestijging na verbouw/nieuwbouw',
      'Planologische haalbaarheid sloop-nieuwbouw',
      'Tijdsplanning beide opties',
      'Risico-inventarisatie voor aankoop'
    ],
    ctaText: 'Start Intake',
    ctaLink: '/kavelrapport/intake',
    color: 'from-amber-600 to-orange-600',
    price: 'Op aanvraag'
  },
  {
    id: 'advies',
    icon: FileCheck,
    title: 'Kavelstrategie Sessie',
    tagline: '90 minuten 1-op-1 advies',
    description: 'Persoonlijk advies van onze architect: regio-selectie, budget, timing en valkuilen. Perfect voor budget €500k+ en serieuze zelfbouwers.',
    benefits: [
      'Kavelstrategie sessie (90 minuten 1-op-1)',
      'Regio-selectie en budgetplanning',
      'Financiële haalbaarheid en risico-scan',
      'Timing en stappenplan',
      'Valkuilen en kansen in uw zoekgebied'
    ],
    ctaText: 'Boek Sessie',
    ctaLink: 'https://www.zwijsen.net/contact',
    color: 'from-slate-700 to-slate-800',
    price: 'Op aanvraag'
  }
];

export default function DienstenPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://kavelarchitect.nl'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Diensten',
        item: 'https://kavelarchitect.nl/diensten'
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 pt-20 text-xs text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-700">Home</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-slate-700">Diensten</li>
        </ol>
      </nav>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block py-1.5 px-4 rounded-full bg-blue-400/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-400/30">
            Complete kavel-oplossing
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Van kavelcheck tot droomwoning <br />
            <span className="text-blue-400">alles onder één dak</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Als enige platform in Nederland combineren wij kavelzoekservice met architectenexpertise.
            Samen selecteren, valideren en begeleiden wij u van de juiste bouwkavel tot vergunning en ontwerp.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="space-y-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-12 gap-0 md:gap-8">
                  {/* Left: Icon & Title */}
                  <div className={`md:col-span-4 bg-gradient-to-br ${service.color} text-white p-6 md:p-10 flex flex-col justify-center`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm">
                      <Icon size={28} className="text-white md:w-8 md:h-8" />
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 md:mb-3">
                      {service.title}
                    </h2>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Right: Description & Benefits */}
                  <div className="md:col-span-8 p-6 md:p-10">
                    <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-6 md:mb-8">
                      <h3 className="font-bold text-navy-900 mb-3 md:mb-4 text-sm md:text-base">Wat u krijgt:</h3>
                      <ul className="space-y-2 md:space-y-3">
                        {service.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 md:gap-3">
                            <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-slate-700 text-sm md:text-base">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {service.external ? (
                        <a
                          href={service.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${service.color} text-white font-bold text-sm md:text-base rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={18} />
                        </a>
                      ) : (
                        <Link
                          href={service.ctaLink}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${service.color} text-white font-bold text-sm md:text-base rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={18} />
                        </Link>
                      )}
                      {service.price && (
                        <span className="text-xl md:text-2xl font-bold text-navy-900">{service.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Waarom KavelArchitect */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Waarom KavelArchitect?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              De complete kavel-oplossing: van zoeken tot bouwen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Lokale Expertise</h3>
              <p className="text-slate-600 leading-relaxed">
                Kennis van 100+ bestemmingsplannen in heel Nederland. Wij weten wat er mogelijk is.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Persoonlijke Begeleiding</h3>
              <p className="text-slate-600 leading-relaxed">
                Van intake tot oplevering. Eén aanspreekpunt voor uw complete bouwproject.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Sneller dan de Markt</h3>
              <p className="text-slate-600 leading-relaxed">
                Off-market toegang + architecten-check. Vind de beste kavels voordat ze publiek zijn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Klaar voor uw droomkavel?
          </h2>
          <p className="text-lg text-emerald-50 mb-8">
            Start vandaag met een gratis regio-alert of bestel direct een KavelRapport
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-emerald-700 font-bold text-sm md:text-base rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
            >
              Activeer Regio-Alert (Gratis)
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/kavelrapport"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-navy-900 text-white font-bold text-sm md:text-base rounded-xl hover:bg-navy-800 transition-all shadow-lg"
            >
              Bestel KavelRapport (vanaf €39)
              <ArrowRight size={18} />
            </Link>
          </div>

          <p className="text-sm text-emerald-100 font-medium">
            Gratis & vrijblijvend • Geen verplichtingen • 100+ regio's • Architectengarantie
          </p>
        </div>
      </section>
    </main>
  );
}
