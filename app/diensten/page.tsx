import Link from 'next/link';
import { ShieldCheck, Bell, Ruler, Home, FileCheck, ArrowRight, Check, Target, Users, Zap } from 'lucide-react';

type Service = {
  id: string;
  icon: any;
  title: string;
  tagline: string;
  description: string;
  miniQuestion: string;
  miniAnswer: string;
  benefits: string[];
  ctaText: string;
  ctaLink: string;
  ctaTitle: string;
  ctaAriaLabel: string;
  color: string;
  external?: boolean;
  price?: string;
};

export const metadata = {
  title: 'Diensten | Architectenbegeleiding voor bouwkavels en villabouw',
  description:
    'Architectenbegeleiding voor bouwkavels: kavelcheck, zoekservice, intake bestaande woning en kavelstrategie sessies. Van eerste kavel tot vergunning.',
  keywords: [
    'kavelrapport',
    'architectenbegeleiding',
    'bouwkavel kopen',
    'bouwkavels vinden',
    'bouwkavels te koop',
    'zelfbouwkavels',
    'villabouw',
    'sloop-nieuwbouw',
    'bestemmingsplan check',
  ],
};

const services: Service[] = [
  {
    id: 'kavelrapport',
    icon: ShieldCheck,
    title: 'KavelRapport',
    tagline: 'De objectieve kavelcheck voor aankoop',
    description:
      'Laat onze architecten binnen 48 uur uw bouwkavel analyseren voordat u een kavel koopt. Ideaal als u via Funda, een makelaar of rechtstreeks van de gemeente wilt kopen, maar eerst wilt weten wat er mag.',
    miniQuestion: 'Wanneer kiest u voor KavelRapport?',
    miniAnswer:
      'Kies deze dienst zodra u serieus een kavel wilt kopen en vooraf zekerheid wilt over bouwmogelijkheden, risico\'s en planologische haalbaarheid.',
    benefits: [
      'Check op ontbindende voorwaarden en kooprisico\'s',
      'Planologische haalbaarheid (bestemmingsplan, welstand)',
      'Volume- en orientatiestudie (max. m2, verdiepingen)',
      'Risico-scan (bodem, buren, vergunning)',
      'Prijsadvies versus bouwkosten',
      'Levering binnen 48 uur',
    ],
    ctaText: 'Start KavelRapport',
    ctaLink: '/kavelrapport',
    ctaTitle: 'Start KavelRapport - kavelcheck vanaf EUR39',
    ctaAriaLabel: 'Start KavelRapport voor kavelcheck vanaf EUR39',
    color: 'from-navy-900 to-blue-900',
    price: 'Vanaf EUR39',
  },
  {
    id: 'zoekservice',
    icon: Bell,
    title: 'Zoekservice Bouwkavels',
    tagline: 'Bouwkavels vinden, ook off-market',
    description:
      'Zoekt u bouwkavels te koop of zelfbouwkavels buiten het publieke aanbod? Wij combineren marktdata en netwerktoegang om u sneller de juiste kavels te laten vinden.',
    miniQuestion: 'Voor wie is deze dienst?',
    miniAnswer:
      'Voor zelfbouwers die gericht bouwkavels willen vinden op basis van regio, budget en woonwensen, inclusief off-market kansen.',
    benefits: [
      'Regio-alerts voor uw zoekgebied',
      'Off-market kavels (2-4 weken eerder dan Funda)',
      'Geselecteerd op architectonische potentie',
      'Inclusief eerste haalbaarheidscheck',
      'Gratis voor serieuze kopers',
    ],
    ctaText: 'Activeer Regio-Alert',
    ctaLink: '/',
    ctaTitle: 'Activeer Regio-Alert voor bouwkavels te koop',
    ctaAriaLabel: 'Activeer Regio-Alert en ontvang bouwkavels te koop',
    color: 'from-emerald-600 to-emerald-700',
    price: 'Gratis',
  },
  {
    id: 'architectenbegeleiding',
    icon: Ruler,
    title: 'Architectenbegeleiding',
    tagline: 'Van kavel naar sleutel-klaar ontwerp',
    description:
      'Na een positieve kavelcheck starten wij het complete traject: van schetsontwerp tot vergunning en uitwerking. Voor vrijstaande woningen, villa\'s en sloop-nieuwbouwprojecten in Nederland.',
    miniQuestion: 'Wanneer kiest u voor architectenbegeleiding?',
    miniAnswer:
      'Wanneer u van een kansrijke kavel door wilt naar een haalbaar ontwerp en vergunningstraject, met vaste afstemming over planning, budget en uitvoerbaarheid.',
    benefits: [
      'Programma van eisen en projectkaders scherpstellen',
      'Eerste schets (vrijblijvend)',
      'Volume- en lichtstudie',
      'Vooroverleg gemeente en participatie-aanpak met omwonenden',
      'Vergunningsaanvraag en -begeleiding',
      'Afstemming met kwaliteitsborger (Wkb) en dossieropbouw',
      'Definitief ontwerp plus kostenraming',
      'Transparante offerte en planning',
    ],
    ctaText: 'Start Traject',
    ctaLink: 'https://www.zwijsen.net/contact',
    ctaTitle: 'Start architectenbegeleiding voor zelfbouw en villabouw',
    ctaAriaLabel: 'Start architectenbegeleiding voor zelfbouw en villabouw',
    color: 'from-blue-600 to-blue-700',
    external: true,
    price: 'Meestal budget vanaf EUR500.000',
  },
  {
    id: 'bestaande-woning',
    icon: Home,
    title: 'Intake Bestaande Woning',
    tagline: 'Verbouwen of nieuwbouwen?',
    description:
      'Twijfelt u tussen verbouwen of nieuwbouwen? Wij brengen een sloop-nieuwbouw traject en verbouwscenario naast elkaar zodat u onderbouwd kunt beslissen tussen verbouw en nieuwbouw.',
    miniQuestion: 'Voor wie is deze intake bedoeld?',
    miniAnswer:
      'Voor huiseigenaren die eerst scherp willen krijgen of verbouwen of nieuwbouwen financieel en planologisch beter past.',
    benefits: [
      'Vergelijk bouwkosten verbouw versus nieuwbouw',
      'Inzicht in stichtingskosten en verborgen kosten (leges, onderzoeken)',
      'Waardestijging na verbouw of nieuwbouw',
      'Planologische haalbaarheid sloop-nieuwbouw',
      'Scenario hergebruik bestaande woning versus volledige nieuwbouw',
      'Tijdsplanning van beide opties',
      'Risico-inventarisatie voor aankoop',
    ],
    ctaText: 'Start Intake',
    ctaLink: '/kavelrapport/intake',
    ctaTitle: 'Start intake voor verbouwen of nieuwbouwen',
    ctaAriaLabel: 'Start intake om te beslissen tussen verbouwen of nieuwbouwen',
    color: 'from-amber-600 to-orange-600',
    price: 'Op aanvraag',
  },
  {
    id: 'advies',
    icon: FileCheck,
    title: 'Kavelstrategie Sessie',
    tagline: '90 minuten 1-op-1 advies',
    description:
      'Persoonlijk advies over regio-selectie, budget, timing en valkuilen voor particulieren die zelf willen bouwen met architect.',
    miniQuestion: 'Voor wie is de Kavelstrategie Sessie?',
    miniAnswer:
      'Voor serieuze zelfbouwers en villabouwers, meestal met een budget vanaf EUR500.000, die sneller de juiste kavelkeuze willen maken.',
    benefits: [
      'Kavelstrategie sessie (90 minuten 1-op-1)',
      'Programma van eisen vertalen naar realistische keuzes',
      'Regio-selectie en budgetplanning',
      'Eerste opzet stichtingskostenbegroting',
      'Financiele haalbaarheid en risico-scan',
      'Stelposten en meerwerk-risico vroeg herkennen',
      'Timing en stappenplan',
      'Valkuilen en kansen in uw zoekgebied',
    ],
    ctaText: 'Boek Sessie',
    ctaLink: 'https://www.zwijsen.net/contact',
    ctaTitle: 'Boek Kavelstrategie Sessie vanaf budget EUR500.000',
    ctaAriaLabel: 'Boek Kavelstrategie Sessie voor zelfbouwers vanaf budget EUR500.000',
    color: 'from-slate-700 to-slate-800',
    price: 'Budgetindicatie vanaf EUR500.000',
    external: true,
  },
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
        item: 'https://kavelarchitect.nl',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Diensten',
        item: 'https://kavelarchitect.nl/diensten',
      },
    ],
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
            <Link href="/" className="hover:text-slate-700">
              Home
            </Link>
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
          <p className="text-sm md:text-base text-blue-200 mb-4">
            U bent hier in het proces: stap 3 van 4 (kavelcheck en begeleiding)
          </p>
          <p className="text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
            KavelArchitect is de zoekservice voor bouwkavels met architecten-check.
          </p>
          <p className="text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed mt-4">
            Als enige platform in Nederland combineren wij zoekservice voor bouwkavels met gespecialiseerde architectenbegeleiding.
            Van de eerste kavelcheck tot vergunning en sleutel-klaar ontwerp helpen wij particuliere zelfbouwers, villabouwers en sloop-nieuwbouwklanten.
          </p>
          <p className="text-base md:text-lg text-slate-300 max-w-4xl mx-auto mt-5 leading-relaxed">
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
              <article
                key={service.id}
                className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-12 gap-0 md:gap-8">
                  <div className={`md:col-span-4 bg-gradient-to-br ${service.color} text-white p-6 md:p-10 flex flex-col justify-center`}>
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm">
                      <Icon size={28} className="text-white md:w-8 md:h-8" />
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 md:mb-3">{service.title}</h2>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">{service.tagline}</p>
                  </div>

                  <div className="md:col-span-8 p-6 md:p-10">
                    <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">{service.description}</p>

                    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-navy-900 mb-1">{service.miniQuestion}</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{service.miniAnswer}</p>
                    </div>

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
                          title={service.ctaTitle}
                          aria-label={service.ctaAriaLabel}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${service.color} text-white font-bold text-sm md:text-base rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={18} />
                        </a>
                      ) : (
                        <Link
                          href={service.ctaLink}
                          title={service.ctaTitle}
                          aria-label={service.ctaAriaLabel}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r ${service.color} text-white font-bold text-sm md:text-base rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={18} />
                        </Link>
                      )}
                      {service.price && <span className="text-xl md:text-2xl font-bold text-navy-900">{service.price}</span>}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pb-8 max-w-7xl mx-auto px-6">
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <h2 className="font-serif text-2xl text-navy-900 mb-3">Wat wij vaak onderschat zien</h2>
          <ul className="space-y-2 text-slate-700 text-sm md:text-base">
            <li>- Te optimistische stelposten en daardoor onverwacht meerwerk</li>
            <li>- Verborgen kosten zoals leges, onderzoeken en Wkb-kosten</li>
            <li>- Te laat starten met vooroverleg, participatie en vergunningsstrategie</li>
            <li>- Starten zonder helder programma van eisen, budget en locatiekaders</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-serif text-2xl text-navy-900 mb-3">Lees ook de pijlergidsen</h2>
          <p className="text-slate-600 mb-4">Wilt u beter beslissen bij kavelkeuze en bouwmogelijkheden? Start met deze gidsen.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm font-semibold">
            <Link href="/gids/kavel-kopen" className="text-navy-900 hover:text-blue-700">
              Kavel kopen (2026)
            </Link>
            <Link href="/gids/wat-mag-ik-bouwen" className="text-navy-900 hover:text-blue-700">
              Wat mag ik bouwen?
            </Link>
            <Link href="/gids/faalkosten-voorkomen" className="text-navy-900 hover:text-blue-700">
              Faalkosten voorkomen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">Waarom KavelArchitect?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              De complete kavel-oplossing voor bouwkavels, zelfbouw, villabouw en architectenbegeleiding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={30} className="text-blue-700" />
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Lokale Expertise</h3>
              <p className="text-slate-600 leading-relaxed">
                Kennis van 100+ bestemmingsplannen in heel Nederland. Wij weten wat er mogelijk is.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={30} className="text-emerald-700" />
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Persoonlijke Begeleiding</h3>
              <p className="text-slate-600 leading-relaxed">Van intake tot oplevering. Een aanspreekpunt voor uw complete bouwproject.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={30} className="text-amber-700" />
              </div>
              <h3 className="font-bold text-navy-900 mb-3">Sneller dan de Markt</h3>
              <p className="text-slate-600 leading-relaxed">
                Off-market toegang plus architecten-check. Vind de beste kavels voordat ze publiek zijn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Klaar voor uw droomkavel?</h2>
          <p className="text-lg text-emerald-50 mb-8">Start vandaag met een gratis regio-alert of bestel direct een KavelRapport.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-emerald-700 font-bold text-sm md:text-base rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
            >
              Activeer Regio-Alert (gratis)
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/kavelrapport"
              title="Bestel KavelRapport - kavelcheck vanaf EUR39"
              aria-label="Bestel KavelRapport - kavelcheck vanaf EUR39"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-navy-900 text-white font-bold text-sm md:text-base rounded-xl hover:bg-navy-800 transition-all shadow-lg"
            >
              Bestel KavelRapport (vanaf EUR39)
              <ArrowRight size={18} />
            </Link>
          </div>

          <p className="text-sm text-emerald-100 font-medium">Gratis en vrijblijvend | Geen verplichtingen | 100+ regio's | Architectengarantie</p>
        </div>
      </section>
    </main>
  );
}
