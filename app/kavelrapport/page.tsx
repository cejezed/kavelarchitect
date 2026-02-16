import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Check, CheckCircle2, Crown, ArrowRight, HelpCircle, X, Scale, AlertTriangle, Search } from 'lucide-react';
import PricingSelector from './PricingSelector';

export const metadata = {
  title: 'KavelRapport | Zekerheid voor aankoop van een bouwkavel',
  description:
    'Weet wat u koopt voordat u een bod doet. Objectieve bestemmingsplan- en risicoanalyse van bouwkavels in begrijpelijke taal.'
};

export default function KavelRapportPage() {
  const faqs = [
    {
      q: 'Wat kost KavelRapport?',
      a: 'De prijs hangt af van het type rapport (KavelCheck, KavelRapport of Premium Review). Bekijk de actuele tarieven op deze pagina voor de meest recente prijzen.'
    },
    {
      q: 'Hoe snel ontvang ik het rapport?',
      a: 'Na betaling gaan wij direct aan de slag. Voor een KavelCheck en KavelRapport streven we naar levering binnen 24 uur (op werkdagen). De Premium Review plannen we in overleg.'
    },
    {
      q: 'Wat als de kavel onbebouwbaar blijkt?',
      a: 'Dat is waardevolle informatie! Het rapport behoedt u dan voor een miskoop. U krijgt in dat geval een negatief bouwadvies, helder onderbouwd.'
    },
    {
      q: 'Is het KavelRapport ook geschikt voor bestaande woningen?',
      a: 'Ja. Het KavelRapport is geschikt bij de aankoop van een bestaande woning waarbij u een ingrijpende verbouwing, verduurzaming of vervangende nieuwbouw overweegt. Wij analyseren de planologische mogelijkheden, beperkingen en risico’s van het object — niet de technische detaillering van de bouwkundige staat. Voor technische inspecties adviseren wij gespecialiseerde partijen.'
    },
    {
      q: 'Ik heb zelf een kavel gevonden (niet op jullie site), kunnen jullie helpen?',
      a: 'Absoluut. Start de intake voor een eigen kavel of stuur een e-mail naar info@kavelarchitect.nl voor een maatwerk analyse.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

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
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'KavelRapport',
        item: 'https://kavelarchitect.nl/kavelrapport'
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
          <li>
            <Link href="/diensten" className="hover:text-slate-700">Diensten</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-slate-700">KavelRapport</li>
        </ol>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900 to-blue-900/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center lg:items-stretch">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-widest rounded-full border border-yellow-500/50 mb-6">
              <ShieldCheck size={14} />
              Zekerheid voor aankoop
            </div>

            <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6">
              Bouwkavel beoordeling <br />
              <span className="text-blue-400">door ervaren architect</span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              Voorkom kostbare fouten bij het kopen van bouwgrond. Ons KavelRapport beoordeelt
              bestemmingsplan, bouwmogelijkheden en financiële haalbaarheid, zodat u precies weet
              wat u kunt bouwen voordat u een bouwkavel koopt.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/aanbod"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-white text-navy-900 font-bold text-base md:text-lg rounded-xl hover:bg-slate-100 transition-all shadow-lg"
              >
                Check een kavel uit ons aanbod <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                href="/kavelrapport/intake"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-slate-400 text-white font-bold text-base md:text-lg rounded-xl hover:bg-white/10 transition-all"
              >
                Ik heb al een kavel/woning
              </Link>
            </div>
          </div>

          <div className="w-full h-full">
            <div className="relative mx-auto lg:mx-0 max-w-2xl h-full min-h-[320px] lg:min-h-[520px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src="/images/rapporten/kavelarchitect-rapport-kavel-analyse.webp"
                alt="Voorbeeld van KavelRapport analyse"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEEM STELLING */}
      <section className="py-10 md:py-14 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-4 md:mb-6">Waarom kavels vaak duurder uitpakken dan gedacht</h3>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {[
              { text: 'Bouwregels worden verkeerd geïnterpreteerd', icon: Scale },
              { text: 'Vergunningsvrij blijkt toch niet zo vrij', icon: AlertTriangle },
              { text: 'Risico\'s komen pas na aankoop boven tafel', icon: Search },
            ].map(({ text, icon: Icon }) => (
              <div key={text} className="bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-start gap-2 md:gap-3">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm font-semibold text-navy-900">
            Het KavelRapport voorkomt deze verrassingen — voordat u beslist.
          </p>
        </div>
      </section>

      {/* WAT U KRIJGT / WAT HET NIET IS */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">
              Wat u krijgt bij een bouwkavel beoordeling
            </h2>

            <ul className="space-y-4">
              {[
                {
                  title: 'Planologische vertaalslag',
                  desc: 'Bestemmingsplanregels vertaald naar begrijpelijke conclusies: wat mag hier wel en wat niet?'
                },
                {
                  title: 'Indicatieve investeringsbandbreedte',
                  desc: 'Een realistische kosteninschatting (bandbreedte) van grond, bouw en bijkomende kosten.'
                },
                {
                  title: 'Risicoanalyse',
                  desc: 'De belangrijkste juridische, ruimtelijke en procesmatige risico’s overzichtelijk op een rij.'
                },
                {
                  title: 'Heldere conclusie',
                  desc: 'Geschikt, opletten of niet passend — met onderbouwing en logische vervolgstappen.'
                }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle2 size={22} className="text-emerald-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-navy-900">{item.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200">
            <h2 className="font-serif text-3xl font-bold text-slate-500 mb-6">
              Wat het <span className="line-through text-red-400">niet</span> is
            </h2>

            <ul className="space-y-6">
              {[
                {
                  title: 'Geen woningontwerp',
                  desc: 'Het KavelRapport geeft inzicht in mogelijkheden, maar bevat geen plattegronden of ontwerpen.'
                },
                {
                  title: 'Geen vergunninggarantie',
                  desc: 'De gemeente beslist altijd bij een vergunningaanvraag; dit rapport is een onderbouwde bureaustudie.'
                },
                {
                  title: 'Geen taxatie of bodemonderzoek',
                  desc: 'Specialistische onderzoeken en officiele taxaties vallen buiten deze analyse.'
                }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 opacity-80">
                  <X size={22} className="text-red-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-700">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* EXISTING PROPERTY USE CASE */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12">
          <div className="md:flex md:items-start md:justify-between gap-10">
            <div className="md:w-2/3">
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">
                Kavel met bestaande woning kopen
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Ook bij bestaande woningen met een slecht energielabel of een matige bouwkundige staat is zekerheid voor aankoop cruciaal.
                Het KavelRapport helpt u niet bij hoe u moet verbouwen, maar bij de vraag: is dit object planologisch en financieel geschikt om hier serieus in te investeren?
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Wat mag er planologisch met deze woning?',
                  'Is ingrijpende verbouwing of vervangende nieuwbouw toegestaan of kansrijk?',
                  'Welke investeringsbandbreedte is realistisch voordat u koopt?',
                  'Waar zitten de grootste risico’s bij aankoop?'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <Check size={18} className="text-emerald-600 mt-1 shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-500 text-sm">
                Het KavelRapport vervangt geen bouwkundige keuring, maar voorkomt dat u een object koopt dat planologisch of financieel niet past bij uw plannen.
              </p>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 h-full flex flex-col">
                <h3 className="font-bold text-navy-900 text-lg mb-3">Direct intake starten</h3>
                <p className="text-slate-600 text-sm mb-4 flex-1">
                  Heeft u al een kavel of bestaande woning op het oog? Start de intake en ontvang een voorstel.
                </p>
                <Link
                  href="/kavelrapport/intake"
                  className="inline-flex items-center justify-center px-4 py-3 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors"
                >
                  Naar intake <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarieven" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-navy-900 mb-4">
              Kies uw niveau van zekerheid
            </h2>
            <p className="text-slate-600">
              Van een snelle orientatie tot volledige zekerheid voor aankoop.
            </p>
          </div>

          <PricingSelector />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-12 text-center">
            Veelgestelde vragen
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h4 className="font-bold text-navy-900 flex items-start gap-3">
                  <HelpCircle size={20} className="text-slate-300 shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-slate-600 mt-2 ml-8 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-navy-900 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
          Twijfel niet achteraf.
        </h2>
        <p className="text-slate-300 mb-8 text-lg">
          Begin met zekerheid voordat u een bod uitbrengt.
        </p>
        <Link
          href="/aanbod"
          className="inline-flex items-center justify-center px-10 py-4 bg-white text-navy-900 font-bold text-lg rounded-xl"
        >
          Bekijk kavels <ArrowRight size={20} className="ml-2" />
        </Link>
      </section>

    </main>
  );
}
