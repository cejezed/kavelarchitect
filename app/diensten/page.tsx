import Link from 'next/link';
import { ShieldCheck, Bell, Ruler, Home, FileCheck, ArrowRight, Check, Target, Handshake, Zap } from 'lucide-react';

type Service = {
  id: string;
  icon: any;
  title: string;
  tagline: string;
  description: string;
  fitQuestion: string;
  fitAnswer: string;
  benefits: string[];
  ctaText: string;
  ctaLink: string;
  color: string;
  external?: boolean;
  price?: string;
};

export const metadata = {
  title: 'Diensten | Architectenbegeleiding voor bouwkavels en villabouw',
  description: 'Architectenbegeleiding voor bouwkavels: kavelcheck, zoekservice, intake bestaande woning en kavelstrategie sessies. Van eerste kavel tot vergunning.',
  keywords: ['kavelrapport', 'architectenbegeleiding', 'bouwkavel zoeken', 'bouwkavels te koop', 'zelfbouwkavels', 'villabouw', 'sloop-nieuwbouw']
};

const services: Service[] = [
  {
    id: 'kavelrapport',
    icon: ShieldCheck,
    title: 'KavelRapport',
    tagline: 'De objectieve kavelcheck voor aankoop',
    description: 'Wilt u een bouwkavel kopen? Laat onze architecten binnen 48 uur uw kavel analyseren op bouwpotentie, risico\'s en rendement. Ideaal als u een kavel via Funda, makelaar of gemeente wilt kopen, maar eerst wilt weten wat er mag.',
    fitQuestion: 'Wanneer kiest u voor KavelRapport?',
    fitAnswer: 'Als u snel zekerheid wilt over wat u mag bouwen en welke risico\'s spelen voordat u biedt op een kavel.',
    benefits: [
      'Planologische haalbaarheid (bestemmingsplan, welstand)',
      'Volume- en orientatiestudie (max. m2, verdiepingen)',
      'Risico-scan (bodem, buren, vergunning)',
      'Prijsadvies versus bouwkosten',
      'Levering binnen 48 uur'
    ],
    ctaText: 'Start KavelRapport',
    ctaLink: '/kavelrapport',
    color: 'from-navy-900 to-blue-900',
    price: 'Vanaf EUR39'
  },
  {
    id: 'zoekservice',
    icon: Bell,
    title: 'Zoekservice Bouwkavels',
    tagline: 'Exclusieve leads, ook off-market kavels',
    description: 'Wilt u sneller bouwkavels vinden? Onze zoekservice combineert bouwkavels te koop, off-market leads en zelfbouwkavels in uw voorkeursregio. Wij sturen geselecteerde kavels op basis van architectonische potentie.',
    fitQuestion: 'Voor wie is deze dienst?',
    fitAnswer: 'Voor serieuze zelfbouwers die doorlopend relevant aanbod willen ontvangen zonder dagelijks alle portals te volgen.',
    benefits: [
      'Regio-alerts voor uw zoekgebied',
      'Off-market kavels (2-4 weken eerder dan publieke plaatsing)',
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
    description: 'Na een positieve KavelRapport starten wij het complete traject: van schetsontwerp tot vergunning en uitwerking met Architectenbureau Zwijsen, voor vrijstaande woningen, villas en sloop-nieuwbouwprojecten in Nederland.',
    fitQuestion: 'Wanneer kiest u voor Architectenbegeleiding?',
    fitAnswer: 'Wanneer u na de kavelcheck wilt doorpakken naar ontwerp, vergunning en realisatie met een architect als vast aanspreekpunt.',
    benefits: [
      'Eerste schets (vrijblijvend)',
      'Volume- en lichtstudie',
      'Vergunningsaanvraag en begeleiding',
      'Definitief ontwerp en kostenraming',
      'Transparante offerte en planning'
    ],
    ctaText: 'Start Traject',
    ctaLink: 'https://www.zwijsen.net/contact',
    color: 'from-blue-600 to-blue-700',
    external: true,
    price: 'Meestal vanaf EUR500.000 totaal bouwbudget'
  },
  {
    id: 'bestaande-woning',
    icon: Home,
    title: 'Intake Bestaande Woning',
    tagline: 'Verbouwen of nieuwbouwen?',
    description: 'Heeft u al een huis en wilt u beslissen tussen verbouwen of nieuwbouwen? Wij rekenen verbouwen versus een sloop-nieuwbouw traject door met planologische en financiele analyse, zodat u verantwoord kiest.',
    fitQuestion: 'Voor wie is deze intake?',
    fitAnswer: 'Voor eigenaren die twijfelen tussen verbouw en nieuwbouw en vooraf een objectieve vergelijking willen.',
    benefits: [
      'Vergelijk bouwkosten verbouw versus nieuwbouw',
      'Waardestijging na verbouw of nieuwbouw',
      'Planologische haalbaarheid sloop-nieuwbouw',
      'Tijdsplanning van beide opties',
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
    description: 'Persoonlijk advies van onze architect: regio-selectie, budget, timing en valkuilen. Gericht op particulieren die zelf willen bouwen met architect, meestal met budget vanaf EUR500.000 en hoger.',
    fitQuestion: 'Voor wie is de Kavelstrategie Sessie?',
    fitAnswer: 'Voor serieuze zelfbouwers die vooraf richting willen in budget, regio en stappenplan voordat ze een kavel aankopen.',
    benefits: [
      'Kavelstrategie sessie (90 minuten 1-op-1)',
      'Regio-selectie en budgetplanning',
      'Financiele haalbaarheid en risico-scan',
      'Timing en stappenplan',
      'Valkuilen en kansen in uw zoekgebied'
    ],
    ctaText: 'Boek Sessie',
    ctaLink: 'https://www.zwijsen.net/contact',
    color: 'from-slate-700 to-slate-800',
    external: true,
    price: 'Meestal budget vanaf EUR500.000+'
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
          <li aria-hidden="true">&gt;</li>
          <li className="text-slate-700">Diensten</li>
        </ol>
      </nav>

      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block py-1.5 px-4 rounded-full bg-blue-400/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-400/30">
            Complete kavel-oplossing
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Van kavelcheck tot droomwoning <br />
            <span className="text-blue-400">alles onder een dak</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Als enige platform in Nederland combineren wij een zoekservice voor bouwkavels met gespecialiseerde architectenbegeleiding.
            Van de eerste kavelcheck tot vergunning en ontwerp helpen wij particuliere zelfbouwers, villabouwers en sloop-nieuwbouwklanten.
          </p>
          <p className="text-base text-blue-100 max-w-3xl mx-auto mt-5 leading-relaxed">
            Hier vindt u alle diensten van KavelArchitect: van kavelcheck tot intake bestaande woning en kavelstrategie sessies,
            speciaal voor serieuze zelfbouwers in Nederland.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="space-y-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-12 gap-0 md:gap-8">
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

                  <div className="md:col-span-8 p-6 md:p-10">
                    <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <h3 className="font-bold text-navy-900 mb-2 text-sm md:text-base">{service.fitQuestion}</h3>
                      <p className="text-slate-700 text-sm md:text-base">{service.fitAnswer}</p>
                    </div>

                    {service.id === 'zoekservice' && (
                      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                        Lees ook onze gidsen over <Link href="/kennisbank" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-blue-600">kavel kopen (2026)</Link> en
                        <Link href="/kennisbank" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-blue-600 ml-1">wat mag ik bouwen?</Link> voor extra context per regio.
                      </p>
                    )}

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
                          aria-label={`${service.ctaText} voor ${service.title}`}
                          title={`${service.ctaText} - ${service.title}`}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${service.color} text-white font-bold text-sm md:text-base rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={18} />
                        </a>
                      ) : (
                        <Link
                          href={service.ctaLink}
                          aria-label={`${service.ctaText} voor ${service.title}`}
                          title={`${service.ctaText} - ${service.title}`}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${service.color} text-white font-bold text-sm md:text-base rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={18} />
                        </Link>
                      )}
                      {service.price && (
                        <span className="text-lg md:text-xl font-bold text-navy-900">{service.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Waarom KavelArchitect?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              De complete kavel-oplossing voor bouwkavels, zelfbouw, villabouw en architectenbegeleiding: van zoeken tot bouwen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={28} className="text-blue-700" />
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Lokale Expertise</h3>
              <p className="text-slate-600 leading-relaxed">
                Kennis van 100+ bestemmingsplannen in heel Nederland. Wij weten wat er mogelijk is.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Handshake size={28} className="text-emerald-700" />
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Persoonlijke Begeleiding</h3>
              <p className="text-slate-600 leading-relaxed">
                Van intake tot oplevering. Een aanspreekpunt voor uw complete bouwproject.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-amber-700" />
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Sneller dan de Markt</h3>
              <p className="text-slate-600 leading-relaxed">
                Off-market toegang en architecten-check. Vind de beste kavels voordat ze publiek zijn.
              </p>
            </div>
          </div>
        </div>
      </section>

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
              aria-label="Activeer zoekservice bouwkavels en regio-alert gratis"
              title="Activeer Regio-Alert"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-emerald-700 font-bold text-sm md:text-base rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
            >
              Activeer Regio-Alert (Gratis)
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/kavelrapport"
              aria-label="Start KavelRapport kavelcheck vanaf 39 euro"
              title="Start KavelRapport - kavelcheck vanaf 39 euro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-navy-900 text-white font-bold text-sm md:text-base rounded-xl hover:bg-navy-800 transition-all shadow-lg"
            >
              Bestel KavelRapport (vanaf EUR39)
              <ArrowRight size={18} />
            </Link>
          </div>

          <p className="text-sm text-emerald-100 font-medium">
            Gratis en vrijblijvend | Geen verplichtingen | 100+ regios | Architectengarantie
          </p>
        </div>
      </section>
    </main>
  );
}
