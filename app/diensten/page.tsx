import Link from 'next/link';
import { ShieldCheck, Bell, Ruler, Home, FileCheck, ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Diensten | Architectenbegeleiding voor bouwkavels',
  description: 'Van KavelRapport tot complete architectenbegeleiding. Professionele diensten voor het zoeken, beoordelen en bebouwen van bouwkavels in Nederland.',
  keywords: ['kavelrapport', 'architectenbegeleiding', 'bouwkavel zoeken', 'bestemmingsplan check', 'architect bouwkavel']
};

const services = [
  {
    id: 'kavelrapport',
    icon: ShieldCheck,
    title: 'KavelRapport™',
    tagline: 'Planologische check & risico-analyse vóór aankoop',
    description: 'Objectieve analyse van bestemmingsplan, bouwmogelijkheden en risico\'s voordat u een bouwkavel koopt.',
    benefits: [
      'Bestemmingsplan vertaald naar begrijpelijke conclusies',
      'Inzicht in bouwvolume, goothoogte en nokhoogte',
      'Risicoanalyse en financiële haalbaarheid',
      'Duidelijk advies: geschikt, opletten of afwijzen',
      'Levering binnen 24 uur op werkdagen'
    ],
    ctaText: 'Start KavelRapport',
    ctaLink: '/kavelrapport',
    color: 'from-navy-900 to-blue-900'
  },
  {
    id: 'zoekservice',
    icon: Bell,
    title: 'Zoekservice Bouwkavels',
    tagline: 'Exclusieve toegang tot off-market kavels met regio-alerts',
    description: 'Wij bewaken dagelijks het kavelaanbod inclusief off-market kavels die nooit op Funda verschijnen.',
    benefits: [
      'Automatische notificaties bij nieuw aanbod in uw regio',
      '2-4 weken eerder toegang dan publieke advertenties',
      'Persoonlijke matching op basis van uw wensen',
      'Inclusief eerste haalbaarheidscheck per kavel',
      '100% gratis, geen verborgen kosten'
    ],
    ctaText: 'Activeer Kavel Alert',
    ctaLink: '/',
    color: 'from-emerald-600 to-emerald-700'
  },
  {
    id: 'architectenbegeleiding',
    icon: Ruler,
    title: 'Architectenbegeleiding',
    tagline: 'Van kavel naar droomhuis met Architectenbureau Zwijsen',
    description: 'Compleet traject van eerste schets en haalbaarheid tot definitief ontwerp en vergunningaanvraag.',
    benefits: [
      'Volledige begeleiding door ervaren architect',
      'Van schetsontwerp tot bouwvergunning',
      'Optimale benutting van bouwmogelijkheden',
      'Transparante offerte en planning',
      'Lokale expertise in bestemmingsplannen'
    ],
    ctaText: 'Kennismaken',
    ctaLink: 'https://www.zwijsen.net/contact',
    color: 'from-blue-600 to-blue-700',
    external: true
  },
  {
    id: 'bestaande-woning',
    icon: Home,
    title: 'Intake Bestaande Woning',
    tagline: 'Verbouwen, verduurzamen of vervangen door nieuwbouw?',
    description: 'Planologische en financiële analyse bij aankoop van bestaande woningen met verbouw- of nieuwbouwplannen.',
    benefits: [
      'Is ingrijpende verbouwing toegestaan?',
      'Mag vervangende nieuwbouw op deze locatie?',
      'Realistische investeringsbandbreedte',
      'Risico-inventarisatie voor aankoop',
      'Advies over beste strategie'
    ],
    ctaText: 'Start Intake',
    ctaLink: '/kavelrapport/intake',
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'advies',
    icon: FileCheck,
    title: 'Kennis & Adviespakketten',
    tagline: 'Strategische begeleiding en financiële scans',
    description: 'Compacte adviestrajecten voor specifieke vraagstukken rond bouwkavels en nieuwbouw.',
    benefits: [
      'Kavelstrategie sessie (90 minuten)',
      'Financiële en risico-scan specifieke kavel',
      'Bestemmingsplan interpretatie',
      'Welstandsadvies en architectonische haalbaarheid',
      'Gekoppeld aan kennisbank artikelen'
    ],
    ctaText: 'Meer informatie',
    ctaLink: '/kennisbank',
    color: 'from-slate-700 to-slate-800'
  }
];

export default function DienstenPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Onze Diensten
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Van bouwkavel zoeken tot complete architectenbegeleiding.
            Professionele diensten voor elke fase van uw bouwproject.
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
                <div className="grid md:grid-cols-12 gap-8">
                  {/* Left: Icon & Title */}
                  <div className={`md:col-span-4 bg-gradient-to-br ${service.color} text-white p-8 md:p-10 flex flex-col justify-center`}>
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold mb-3">
                      {service.title}
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Right: Description & Benefits */}
                  <div className="md:col-span-8 p-8 md:p-10">
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-8">
                      <h3 className="font-bold text-navy-900 mb-4">Wat u krijgt:</h3>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-slate-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      {service.external ? (
                        <a
                          href={service.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${service.color} text-white font-bold rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={20} />
                        </a>
                      ) : (
                        <Link
                          href={service.ctaLink}
                          className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${service.color} text-white font-bold rounded-xl hover:shadow-lg transition-all`}
                        >
                          {service.ctaText}
                          <ArrowRight size={20} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            Niet zeker welke dienst u nodig heeft?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Plan een gratis kennismakingsgesprek en wij helpen u op weg.
          </p>
          <a
            href="mailto:info@kavelarchitect.nl?subject=Kennismakingsgesprek"
            className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
          >
            Neem contact op
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </main>
  );
}
