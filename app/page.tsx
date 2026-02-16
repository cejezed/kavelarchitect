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

      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden border-b border-slate-200">
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

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
            <div className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-navy-900 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
              Exclusief voor zelfbouwers
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-4">
              Vind uw droomkavel en laat hem checken door een architect.
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Twee routes, één doel: de juiste kavel, met zekerheid.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <article className="relative bg-gradient-to-br from-navy-900 to-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-navy-900/30 flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />
              <div className="relative z-10 flex flex-col flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6 self-start border border-white/10">
                  <Bell size={14} />
                  KavelAlert
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">Nieuwe kavels die echt passen</h2>
                <p className="text-slate-300 mb-6">Gratis zoekprofiel, dagelijks matches in uw inbox.</p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-emerald-400" />
                    </span>
                    Dagelijkse matching op regio, budget en wensen
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-emerald-400" />
                    </span>
                    Alleen relevante kavels in uw inbox
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <span className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-emerald-400" />
                    </span>
                    Gratis starten, direct weer opzegbaar
                  </li>
                </ul>
                <p className="text-xs text-slate-400 mb-5">Binnen 2 minuten geactiveerd. Geen abonnementskosten.</p>
                <button
                  onClick={() => {
                    posthog?.capture?.('cta_kavelalert_productcard_click');
                    trackKavelAlertClick('home_product_card');
                    setShowWizard(true);
                  }}
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-white text-navy-900 font-bold text-lg rounded-xl hover:bg-emerald-50 hover:shadow-lg transition-all duration-200 shadow-md group-hover:shadow-lg"
                >
                  <Bell size={20} className="mr-2" />
                  Activeer KavelAlert (gratis)
                </button>
              </div>
            </article>

            <article className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border-2 border-orange-200/80 p-8 md:p-10 shadow-2xl shadow-orange-500/10 flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />
              <div className="relative z-10 flex flex-col flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6 self-start shadow-sm shadow-orange-500/30">
                  <FileText size={14} />
                  KavelRapport
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-slate-900 mb-3">Zekerheid voor u een bod doet</h2>
                <p className="text-slate-600 mb-6">Persoonlijke analyse van bouwregels, risico&apos;s en haalbaarheid.</p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-orange-500" />
                    </span>
                    Bouwregels en mogelijkheden in duidelijke taal
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-orange-500" />
                    </span>
                    Risico&apos;s en aandachtspunten per locatie
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-orange-500" />
                    </span>
                    Persoonlijk beoordeeld door een architect
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mb-5">U weet vooraf of de kavel bij uw plannen past.</p>
                <Link
                  href="/kavelrapport"
                  onClick={() => posthog?.capture?.('cta_kavelrapport_productcard_click')}
                  className="inline-flex items-center justify-center w-full px-6 py-4 bg-orange-500 text-white font-bold text-lg rounded-xl hover:bg-orange-600 hover:shadow-lg transition-all duration-200 shadow-md shadow-orange-500/20 group-hover:shadow-lg"
                >
                  Bestel KavelRapport
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </div>
            </article>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-8">
            <ShieldCheck size={14} />
            <span>Powered by Architectenbureau Zwijsen</span>
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

      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-serif text-3xl md:text-4xl text-navy-900 mb-3">Hoe het werkt</h2>
            <p className="text-lg text-slate-600">Van zoeken naar zekerheid in een paar stappen.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <article className="relative bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-navy-900 to-blue-600" />
              <div className="flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center">
                  <Bell size={20} />
                </span>
                <h3 className="font-bold text-xl text-navy-900">KavelAlert</h3>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                    <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                  </div>
                  <div className="pb-2">
                    <p className="font-semibold text-slate-900 mb-1">Stel uw zoekprofiel in</p>
                    <p className="text-sm text-slate-500">Regio, budget, oppervlakte en type bouwgrond. Duurt 2 minuten.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-navy-900 text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                    <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                  </div>
                  <div className="pb-2">
                    <p className="font-semibold text-slate-900 mb-1">Ontvang dagelijks matches</p>
                    <p className="text-sm text-slate-500">Alleen kavels die passen bij uw wensen, direct in uw inbox.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      <Check size={16} />
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Kavel gevonden? Ga verder</p>
                    <p className="text-sm text-slate-500">Vraag een KavelRapport aan voor een onderbouwde beoordeling.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  posthog?.capture?.('cta_kavelalert_flow_click');
                  trackKavelAlertClick('home_flow');
                  setShowWizard(true);
                }}
                className="mt-8 inline-flex items-center text-navy-900 font-semibold hover:text-blue-600 transition-colors"
              >
                Start gratis <ArrowRight size={16} className="ml-2" />
              </button>
            </article>

            <article className="relative bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-amber-500" />
              <div className="flex items-center gap-3 mb-8">
                <span className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                  <FileText size={20} />
                </span>
                <h3 className="font-bold text-xl text-navy-900">KavelRapport</h3>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                    <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                  </div>
                  <div className="pb-2">
                    <p className="font-semibold text-slate-900 mb-1">Stuur de kavelgegevens in</p>
                    <p className="text-sm text-slate-500">Via het intakeformulier of direct vanuit een kavel in het aanbod.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                    <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                  </div>
                  <div className="pb-2">
                    <p className="font-semibold text-slate-900 mb-1">Architect analyseert de kavel</p>
                    <p className="text-sm text-slate-500">Bouwregels, bestemmingsplan, risico&apos;s en haalbaarheid worden beoordeeld.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      <Check size={16} />
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">U weet waar u aan toe bent</p>
                    <p className="text-sm text-slate-500">Helder rapport met advies, zodat u met vertrouwen een beslissing neemt.</p>
                  </div>
                </div>
              </div>
              <Link
                href="/kavelrapport"
                onClick={() => posthog?.capture?.('cta_kavelrapport_flow_click')}
                className="mt-8 inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
              >
                Bekijk KavelRapport <ArrowRight size={16} className="ml-2" />
              </Link>
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
