import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Ruler, BrainCircuit, Users } from 'lucide-react';

export const metadata = {
  title: 'Over Ons | Architectenbureau Zwijsen',
  description: 'Wij combineren data-analyse met architectonisch inzicht om uw droomkavel te vinden en te valideren.',
};

export default function AboutPage() {
  const faqItems = [
    {
      q: 'Werken jullie door heel Nederland?',
      a: 'Ja. Wij begeleiden kavelzoekers en zelfbouwers in heel Nederland, zowel in stedelijke als landelijke regio\'s.',
    },
    {
      q: 'Verdienen jullie aan de grondprijs of courtage?',
      a: 'Nee. Wij werken vanuit onafhankelijke architectenbegeleiding en analyse, zodat het advies niet afhankelijk is van de grondprijs.',
    },
    {
      q: 'Wanneer stap ik in: voor of na kavelaankoop?',
      a: 'Het liefst voor kavelaankoop. Dan kunnen we risico\'s, bouwmogelijkheden en kosten toetsen voordat u tekent.',
    },
    {
      q: 'Wat is de eerste stap als ik nog orienteer?',
      a: 'Start met een korte intake of een KavelRapport, afhankelijk van hoe concreet uw kavelkeuze al is.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

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
        name: 'Over Ons',
        item: 'https://kavelarchitect.nl/over-ons',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 pt-20 text-xs text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-slate-700">Home</Link>
          </li>
          <li aria-hidden="true">&gt;</li>
          <li className="text-slate-700">Over Ons</li>
        </ol>
      </nav>

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="font-serif text-3xl md:text-5xl text-slate-900 leading-tight mb-6">
              Over KavelArchitect - Architectenbureau voor bouwkavels en zelfbouw
            </h1>
            <h2 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-8">
              Wij zien geen grasveld.<br />
              <span className="text-navy-900">Wij zien uw villa.</span>
            </h2>
            <div className="prose prose-lg text-slate-600">
              <p>
                <strong>KavelArchitect is de zoekservice voor bouwkavels met architecten-check.</strong>
              </p>
              <p>
                Wij helpen particulieren met bouwkavels, zelfbouw en villabouw, inclusief architectenbegeleiding bij kavels.
                Het aanbod is schaars, regels zijn complex en snelheid ligt hoog.
              </p>
              <p>
                De traditionele route - Funda volgen en hopen op geluk - werkt niet meer voor de kritische zelfbouwer.
                U vist achter het net, of koopt grond waar uw droomhuis juridisch niet op mag staan.
              </p>
              <p>
                Daarom hebben wij <strong>KavelArchitect</strong> opgericht.
              </p>
              <div className="not-prose mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h3 className="font-bold text-navy-900 mb-2">Wat we doen</h3>
                <p className="text-slate-700 text-sm md:text-base">
                  We combineren zoekservice voor bouwkavels met architecten-check, kavelstrategie en begeleiding richting ontwerp en vergunning.
                  Zo gaat u van orientatie naar een onderbouwde aankoopbeslissing en een uitvoerbaar plan.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 not-prose mt-6">
                <Link href="/kavelrapport" className="inline-flex items-center justify-center px-4 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors">
                  Bekijk KavelRapport
                </Link>
                <Link href="/" className="inline-flex items-center justify-center px-4 py-3 bg-white border border-slate-300 text-slate-800 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Start Zoekservice
                </Link>
                <Link href="/diensten" className="inline-flex items-center justify-center px-4 py-3 bg-white border border-slate-300 text-slate-800 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Kavelstrategie
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-[600px] bg-slate-100 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Architect aan het werk"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8 text-white">
              <p className="font-serif text-xl italic">"Een kavel is pas waardevol als je weet wat de bouwpotentie is."</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-50 h-50 md:w-40 md:h-40 bg-white rounded-full mx-auto mb-8 overflow-hidden border-4 border-white shadow-lg relative">
            <Image
              src="/jules-zwijsen.jpg"
              alt="Jules Zwijsen, Architect en Oprichter"
              fill
              className="object-cover object-center"
            />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">Jules Zwijsen</h2>
          <p className="text-slate-500 font-medium uppercase tracking-wider text-sm mb-8">Architect en Oprichter</p>

          <p className="text-xl text-slate-700 font-light leading-relaxed mb-12">
            "Als architect zag ik te vaak clienten met een pas aangekochte kavel binnenlopen,
            om er vervolgens achter te komen dat hun woonwensen juridisch onmogelijk waren op die plek.
            Dat moest anders. Met KavelArchitect draaien we het proces om: eerst bouwmogelijkheden valideren,
            daarna pas de kavel kiezen."
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-12">
            <div>
              <p className="text-4xl font-serif font-bold text-navy-900">25+</p>
              <p className="text-xs text-slate-500 uppercase mt-2">Jaar Ervaring</p>
              <p className="text-xs text-slate-500 mt-2">Ervaring met particuliere woningbouw en villaprojecten.</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-navy-900">100+</p>
              <p className="text-xs text-slate-500 uppercase mt-2">Projecten Gerealiseerd</p>
              <p className="text-xs text-slate-500 mt-2">Van kavelcheck tot ontwerp- en vergunningstraject.</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-navy-900">24/7</p>
              <p className="text-xs text-slate-500 uppercase mt-2">Kavel Monitoring</p>
              <p className="text-xs text-slate-500 mt-2">Doorlopende monitoring van nieuw aanbod en off-market kansen.</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-navy-900">100%</p>
              <p className="text-xs text-slate-500 uppercase mt-2">Onafhankelijk</p>
              <p className="text-xs text-slate-500 mt-2">Advies op haalbaarheid, niet op courtage of verkoopbelang.</p>
            </div>
          </div>

          <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 text-left">
            <h3 className="font-serif text-2xl text-navy-900 mb-2">Plan een orienterend gesprek met Jules</h3>
            <p className="text-slate-600 mb-4">
              Bespreek uw situatie, budget en kavelwensen in een kort eerste gesprek.
            </p>
            <Link
              href="/kavelrapport/intake"
              className="inline-flex items-center justify-center px-5 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
            >
              Plan een orienterend gesprek
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">AI-Gedreven Analyse</h3>
                  <p className="text-slate-600 text-sm">Onze systemen scannen de markt en analyseren omgevingsplannen razendsnel. De interpretatie en het advies komen altijd van een ervaren architect.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg mr-4">
                  <Ruler size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Architect Check</h3>
                  <p className="text-slate-600 text-sm">Geen algoritme beslist alleen. Elke match wordt gevalideerd door een architect.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Exclusief Netwerk</h3>
                  <p className="text-slate-600 text-sm">Toegang tot off-market aanbod via ons netwerk van grondeigenaren en makelaars.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Onze Methode</span>
            <h2 className="font-serif text-4xl font-bold text-slate-900 mb-6">Technologie in dienst van ontwerpkwaliteit</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Door technologie het zoekwerk te laten doen, houden wij tijd over voor waar we het verschil maken: ontwerpen en beoordelen.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Wanneer u via KavelArchitect een kavel vindt, koopt u niet alleen grond. U koopt de zekerheid dat uw woonwens daar kan worden gerealiseerd.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-navy-900 mb-6 text-center">Veelgestelde vragen over KavelArchitect</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.q} className="bg-white border border-slate-200 rounded-xl p-4">
                <summary className="font-bold text-navy-900 cursor-pointer">{item.q}</summary>
                <p className="text-slate-600 mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-navy-900 text-white text-center px-6">
        <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Start met zekerheid.</h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
          Kies direct uw volgende stap: zoeken, checken of begeleiden.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/kavelrapport/intake"
            className="inline-block px-8 py-4 bg-white text-navy-900 font-bold text-lg rounded-xl hover:bg-blue-50 transition-colors"
          >
            Plan orienterend gesprek
          </Link>
          <Link
            href="/kavelrapport"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-colors"
          >
            Bestel KavelRapport
          </Link>
          <Link
            href="/diensten"
            className="inline-block px-8 py-4 border border-white/50 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-colors"
          >
            Bekijk alle diensten
          </Link>
        </div>
      </section>
    </div>
  );
}
