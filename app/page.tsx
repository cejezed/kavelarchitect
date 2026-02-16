'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import posthog from 'posthog-js';
import {
  Bell,
  ShieldCheck,
  BookOpen,
  User,
  Check,
  ArrowRight,
  FileText,
  MapPin,
  SearchCheck,
} from 'lucide-react';
import KavelAlertForm from '@/components/KavelAlertForm';
import CTASticky from '@/components/CTASticky';
import { trackKavelAlertClick } from '@/lib/analytics';

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <KavelAlertForm onClose={() => setShowWizard(false)} />
        </div>
      )}

      <section className="relative pt-20 pb-20 md:pt-28 md:pb-24 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Bouwkavel met moderne woning als inspiratie"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-white/95" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-navy-900 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
            Exclusief voor zelfbouwers
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-6">
            Vind uw droomkavel en laat hem checken door een architect.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            KavelAlert helpt u sneller de juiste bouwkavel te vinden. KavelRapport geeft u binnen korte tijd
            helder inzicht in mogelijkheden, risico&apos;s en vervolgstappen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                posthog?.capture?.('cta_kavelalert_hero_click');
                trackKavelAlertClick('home_hero');
                setShowWizard(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-navy-900 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-navy-800 transition-all shadow-xl hover:scale-105"
            >
              <Bell size={20} className="mr-2 sm:mr-3" />
              Activeer KavelAlert (gratis)
            </button>
            <Link
              href="/kavelrapport"
              onClick={() => posthog?.capture?.('cta_kavelrapport_hero_click')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-navy-900 text-navy-900 font-bold text-base sm:text-lg rounded-xl hover:bg-navy-50 transition-all shadow-sm"
            >
              Bestel KavelRapport
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-600 font-medium mb-2">
              Gratis en vrijblijvend. Geen verplichtingen. Direct opzegbaar.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              <span>Powered by Architectenbureau Zwijsen</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-3">Kies uw startpunt</h2>
            <p className="text-slate-600">Twee duidelijke routes: eerst vinden, daarna beoordelen.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-navy-900 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100 mb-4">
                <Bell size={14} />
                KavelAlert
              </div>
              <h3 className="font-serif text-2xl text-navy-900 mb-3">Nieuwe kavels die echt passen</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-slate-700">
                  <Check size={16} className="text-emerald-600 mt-1 shrink-0" />
                  Dagelijkse matching op regio, budget en wensen
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check size={16} className="text-emerald-600 mt-1 shrink-0" />
                  Alleen relevante kavels in uw inbox
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check size={16} className="text-emerald-600 mt-1 shrink-0" />
                  Gratis starten, direct weer opzegbaar
                </li>
              </ul>
              <p className="text-xs text-slate-500 mb-5">Binnen 2 minuten geactiveerd. Geen abonnementskosten.</p>
              <button
                onClick={() => {
                  posthog?.capture?.('cta_kavelalert_productcard_click');
                  trackKavelAlertClick('home_product_card');
                  setShowWizard(true);
                }}
                className="inline-flex items-center justify-center px-5 py-3 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors"
              >
                Activeer KavelAlert (gratis)
              </button>
            </article>

            <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-full border border-yellow-200 mb-4">
                <FileText size={14} />
                KavelRapport
              </div>
              <h3 className="font-serif text-2xl text-navy-900 mb-3">Zekerheid voor u een bod doet</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-slate-700">
                  <Check size={16} className="text-emerald-600 mt-1 shrink-0" />
                  Bouwregels en mogelijkheden in duidelijke taal
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check size={16} className="text-emerald-600 mt-1 shrink-0" />
                  Risico&apos;s en aandachtspunten per locatie
                </li>
                <li className="flex items-start gap-2 text-slate-700">
                  <Check size={16} className="text-emerald-600 mt-1 shrink-0" />
                  Persoonlijk beoordeeld door een architect
                </li>
              </ul>
              <p className="text-xs text-slate-500 mb-5">U weet vooraf of de kavel bij uw plannen past.</p>
              <Link
                href="/kavelrapport"
                onClick={() => posthog?.capture?.('cta_kavelrapport_productcard_click')}
                className="inline-flex items-center justify-center px-5 py-3 border-2 border-navy-900 text-navy-900 font-semibold rounded-xl hover:bg-navy-50 transition-colors"
              >
                Bestel KavelRapport
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 md:p-8 md:flex md:items-center md:gap-8">
            <div className="w-28 h-28 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-white shadow-md mx-auto md:mx-0 mb-6 md:mb-0 shrink-0">
              <Image src="/jules-zwijsen.jpg" alt="Architect Jules Zwijsen" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Wie beoordeelt mijn kavel?</p>
              <h2 className="font-serif text-3xl text-navy-900 mb-3">Jules Zwijsen, architect</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Elk KavelRapport wordt inhoudelijk beoordeeld vanuit praktijkervaring in villabouw en planologische haalbaarheid.
                U krijgt dus geen generieke output, maar onderbouwd advies dat helpt bij een echte aankoopbeslissing.
              </p>
              <Link
                href="/over-ons"
                className="inline-flex items-center text-navy-900 font-semibold hover:text-blue-600 transition-colors"
              >
                Bekijk achtergrond en aanpak <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-3">Hoe het werkt in 3 stappen</h2>
            <p className="text-slate-600">Een simpele flow voor zoeken en beoordelen.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <article className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-navy-900 mb-4">KavelAlert flow</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-slate-700">Activeer uw zoekprofiel met regio en voorkeuren.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-slate-700">Ontvang alleen relevante nieuwe kavels per e-mail.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-slate-700">Interessante kavel gevonden? Vraag direct KavelRapport aan.</p>
                </div>
              </div>
            </article>

            <article className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-navy-900 mb-4">KavelRapport flow</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-slate-700">Stuur kavelgegevens in via intake of vanuit het aanbod.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-slate-700">Wij analyseren bouwregels, risico&apos;s en haalbaarheid.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-slate-700">U ontvangt een helder advies voor uw aankoopbeslissing.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Bouwkavels in heel Nederland
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Van orientatie tot aankoop: zoek op regio en ontdek waar kansen liggen voor uw bouwproject.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <MapPin className="text-navy-900 mb-3" size={18} />
              <h3 className="font-bold text-navy-900 mb-2">Populaire regio&apos;s</h3>
              <p className="text-sm text-slate-600">Bekijk aanbod en context per provincie of gemeente.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <SearchCheck className="text-navy-900 mb-3" size={18} />
              <h3 className="font-bold text-navy-900 mb-2">Gefilterd aanbod</h3>
              <p className="text-sm text-slate-600">Vind sneller kavels die passen bij uw budget en wensen.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <ShieldCheck className="text-navy-900 mb-3" size={18} />
              <h3 className="font-bold text-navy-900 mb-2">Met architectenbegeleiding</h3>
              <p className="text-sm text-slate-600">Ga van kansrijke match naar onderbouwde beslissing.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/regio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
            >
              Bekijk regio&apos;s
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-slate-500 mb-8">Meer verdieping</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/kennisbank" className="p-6 rounded-2xl border border-slate-200 hover:border-navy-900 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Kennisbank</h3>
              <p className="text-sm text-slate-600">Praktische uitleg over bestemmingsplan, bouwregels en aankoopkeuzes.</p>
            </Link>
            <Link href="/over-ons" className="p-6 rounded-2xl border border-slate-200 hover:border-navy-900 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                <User size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Over ons</h3>
              <p className="text-sm text-slate-600">Lees hoe wij als architectenbureau zelfbouwers begeleiden van kavel tot plan.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-2xl bg-navy-900 text-white px-6 py-8 md:px-10 md:py-10 text-center">
            <h2 className="font-serif text-3xl mb-3">Klaar voor de volgende stap?</h2>
            <p className="text-slate-300 mb-6">Start gratis met KavelAlert of vraag direct een KavelRapport aan.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => {
                  posthog?.capture?.('cta_kavelalert_bottom_click');
                  trackKavelAlertClick('home_bottom');
                  setShowWizard(true);
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-navy-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Activeer KavelAlert (gratis)
              </button>
              <Link
                href="/kavelrapport"
                onClick={() => posthog?.capture?.('cta_kavelrapport_bottom_click')}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Bestel KavelRapport
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASticky onOpen={() => setShowWizard(true)} />
    </main>
  );
}
