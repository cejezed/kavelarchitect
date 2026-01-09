'use client'; // Needed for interactive Wizard modal state

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import posthog from 'posthog-js';
import { Bell, ShieldCheck, LayoutGrid, BookOpen, User, Check, ArrowRight } from 'lucide-react';
import KavelAlertForm from '@/components/KavelAlertForm';
import CTASticky from '@/components/CTASticky';
import { trackKavelAlertClick } from '@/lib/analytics';

export default function Home() {
    const [showWizard, setShowWizard] = useState(false);
    const [ctaVariant, setCtaVariant] = useState<'alert' | 'rapport'>('alert');

    useEffect(() => {
        const stored = window.localStorage.getItem('cta_variant');
        const variant = stored === 'alert' || stored === 'rapport'
            ? stored
            : Math.random() < 0.5
                ? 'alert'
                : 'rapport';

        if (!stored) {
            window.localStorage.setItem('cta_variant', variant);
        }

        setCtaVariant(variant);
        posthog?.capture?.('cta_ab_variant_exposed', { variant });
    }, []);

    return (
        <main className="min-h-screen bg-white">
            {/* Wizard Modal */}
            {showWizard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
                    <KavelAlertForm onClose={() => setShowWizard(false)} />
                </div>
            )}

            {/* HERO */}
            <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden border-b border-slate-200">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-bg.jpg"
                        alt="Luxe vrijstaande woning en architectuur voorbeeld"
                        fill
                        priority
                        className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-white/90"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    <div className="order-1 lg:order-1 text-center lg:text-left">
                        <div className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-navy-900 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
                            Exclusief voor Zelfbouwers
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-6">
                            Bouwkavels Nederland <br />
                            <span className="text-navy-900">met Architectenbegeleiding</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                            Vind bouwgrond en bouwkavels te koop in heel Nederland. Wij bewaken dagelijks het kavelaanbod
                            en helpen u met professioneel architectenadvies bij het zoeken, beoordelen en kopen van uw ideale bouwkavel.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            {ctaVariant === 'rapport' ? (
                                <>
                                    <Link
                                        href="/kavelrapport"
                                        onClick={() => posthog?.capture?.('cta_kavelrapport_ab_click', { variant: 'rapport' })}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-navy-900 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-navy-800 transition-all shadow-xl hover:scale-105"
                                    >
                                        Bekijk KavelRapport
                                        <ArrowRight size={18} className="ml-2" />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            posthog?.capture?.('cta_kavelalert_hero_click', { variant: 'rapport' });
                                            trackKavelAlertClick('home_hero');
                                            setShowWizard(true);
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-navy-900 text-navy-900 font-bold text-base sm:text-lg rounded-xl hover:bg-navy-50 transition-all shadow-sm"
                                    >
                                        <Bell size={20} className="mr-2 sm:mr-3" />
                                        Activeer Mijn Gratis KavelAlert
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            posthog?.capture?.('cta_kavelalert_hero_click', { variant: 'alert' });
                                            trackKavelAlertClick('home_hero');
                                            setShowWizard(true);
                                        }}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-navy-900 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-navy-800 transition-all shadow-xl hover:scale-105"
                                    >
                                        <Bell size={20} className="mr-2 sm:mr-3" />
                                        Activeer Mijn Gratis KavelAlert
                                    </button>
                                    <Link
                                        href="/kavelrapport"
                                        onClick={() => posthog?.capture?.('cta_kavelrapport_hero_click', { variant: 'alert' })}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-navy-900 text-navy-900 font-bold text-base sm:text-lg rounded-xl hover:bg-navy-50 transition-all shadow-sm"
                                    >
                                        Bekijk KavelRapport
                                        <ArrowRight size={18} className="ml-2" />
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="mt-6 text-center lg:text-left">
                            <p className="text-sm text-slate-600 font-medium mb-2">
                                ✓ Gratis & vrijblijvend • Geen verplichtingen • Direct opzegbaar
                            </p>
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                                <ShieldCheck size={14} />
                                <span>Powered by Architectenbureau Zwijsen</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Mockup Visual */}
                    <div className="order-2 lg:order-2 flex justify-center">
                        <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[40px] border-[8px] border-slate-900 shadow-2xl overflow-hidden">
                            {/* Phone Screen Content */}
                            <div className="absolute inset-0 bg-white flex flex-col pt-12 relative">
                                {/* Notification */}
                                <div className="absolute top-12 left-4 right-4 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-slate-100 flex gap-3 animate-pulse">
                                    <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-white shrink-0">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Nieuwe Match!</p>
                                        <p className="text-xs text-slate-500">Bouwkavel Blaricum - € 1.2m</p>
                                    </div>
                                </div>

                                {/* App Interface Mockup */}
                                <div className="flex-1 bg-white mt-8 rounded-t-3xl overflow-hidden relative">
                                    {/* App Header */}
                                    <div className="bg-navy-900 px-4 py-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                                    <Bell size={16} className="text-navy-900" />
                                                </div>
                                                <span className="text-white font-bold text-sm">KavelAlert</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                                <span className="text-white/70 text-xs">3 nieuwe</span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Zoek in Noord-Holland..."
                                                className="w-full bg-white/10 text-white placeholder-white/50 px-3 py-2 rounded-lg text-xs"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Scrollable Content Area */}
                                    <div className="bg-gradient-to-b from-slate-50 to-slate-100 p-4 h-full overflow-hidden">
                                        {/* Section Title */}
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Voor jou geselecteerd</h4>
                                            <span className="text-xs text-emerald-600 font-medium">3 matches</span>
                                        </div>

                                        {/* Mock Kavel Card */}
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                        {/* Card Image with gradient */}
                                        <div className="relative h-40 bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600">
                                            <Image
                                                src="/hero-bg.jpg"
                                                alt=""
                                                fill
                                                loading="lazy"
                                                sizes="(max-width: 768px) 60vw, 240px"
                                                className="object-cover opacity-20"
                                                aria-hidden="true"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-navy-900">
                                                Nieuw
                                            </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                                                    <p className="text-white text-xs font-medium mb-1">Blaricum, Noord-Holland</p>
                                                    <h3 className="text-white font-bold text-lg">Villapark Oost</h3>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-4">
                                                <div className="flex items-baseline gap-2 mb-3">
                                                    <span className="text-2xl font-bold text-navy-900">€ 1.250.000</span>
                                                    <span className="text-sm text-slate-500">v.o.n.</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                        </svg>
                                                        <span>1.400 m²</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        <span>Max. 850 m³</span>
                                                    </div>
                                                </div>
                                                <button className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl text-sm hover:bg-navy-800 transition-colors">
                                                    Bekijk Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICE SHOWCASE: KavelRapport */}
            <section className="py-20 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest rounded-full border border-yellow-200 mb-6">
                                <ShieldCheck size={14} />
                                Zekerheid vóór aankoop
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl text-navy-900 leading-tight mb-6">
                                Bouwkavel beoordelen <br />
                                <span className="text-blue-600">vóór u een bod doet</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Een bouwkavel kopen zonder professionele beoordeling is risicovol. Mag uw droomhuis er wel staan?
                                Wat zijn de bouwmogelijkheden? Met ons KavelRapport krijgt u als architect direct inzicht in
                                bestemmingsplan, bouwregels en financiële haalbaarheid voordat u koopt.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 mr-3 shrink-0">
                                        <Check size={14} />
                                    </div>
                                    <p className="text-slate-700"><strong>Bouwvolume check:</strong> Hoeveel m³ en m² mag u écht bouwen?</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 mr-3 shrink-0">
                                        <Check size={14} />
                                    </div>
                                    <p className="text-slate-700"><strong>Kostenraming:</strong> Realistisch budget voor grond + huis + bijkomende kosten.</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5 mr-3 shrink-0">
                                        <Check size={14} />
                                    </div>
                                    <p className="text-slate-700"><strong>Architectenadvies:</strong> Is de zonligging en privacy optimaal?</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/aanbod"
                                    className="inline-flex items-center text-navy-900 font-bold border-b-2 border-navy-900 hover:text-blue-600 hover:border-blue-600 transition-colors pb-1"
                                >
                                    Vind uw kavel en vraag rapport aan <ArrowRight size={18} className="ml-2" />
                                </Link>
                                <Link
                                    href="/kavelrapport"
                                    onClick={() => posthog?.capture?.('cta_kavelrapport_showcase_click')}
                                    className="inline-flex items-center text-blue-600 font-bold border-b-2 border-blue-600 hover:text-blue-700 hover:border-blue-700 transition-colors pb-1"
                                >
                                    Bekijk voorbeelden rapporten <ArrowRight size={18} className="ml-2" />
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            {/* Visual representation of the report - Abstract */}
                            <div className="aspect-[4/5] md:aspect-square bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 relative overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>

                                <div className="relative z-10 border-b-2 border-slate-100 pb-6 mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center text-white">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                            Positief Advies
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-2xl text-navy-900 font-bold">KavelRapport™</h3>
                                    <p className="text-slate-500 text-sm">Locatie: Villapark Weg 1, Blaricum</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Max. Bouwvolume</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-navy-900">1.250 m³</span>
                                            <span className="text-sm text-emerald-600 mb-1">Ruim voldoende</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Totale Investering</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-navy-900">€ 1.85m</span>
                                            <span className="text-sm text-slate-500 mb-1">incl. grond & bouw</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex -space-x-2 mb-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-400">Reeds 50+ rapporten uitgegeven deze maand</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO SECTION - Regional Targeting */}
            <section className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                            Bouwkavels in heel Nederland
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Of u nu op zoek bent naar een bouwkavel in Noord-Holland, Utrecht, Zuid-Holland of Noord-Brabant -
                            wij helpen u met deskundig architectenadvies bij het vinden en beoordelen van uw ideale kavel.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-navy-900 mb-3">Bouwkavel kopen met architect</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Professionele begeleiding bij het vinden en beoordelen van bouwgrond,
                                met inzicht in bestemmingsplannen en bouwmogelijkheden.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-navy-900 mb-3">Bouwgrond in gewilde regio's</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Exclusieve toegang tot off-market kavels in populaire gemeenten
                                zoals Blaricum, Heemstede, Zeist en omstreken.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-navy-900 mb-3">Kavel met architectenbegeleiding</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Van haalbaarheidscheck tot vergunningaanvraag -
                                één aanspreekpunt voor uw bouwproject.
                            </p>
                        </div>
                    </div>
                    <div className="text-center mt-12">
                        <Link
                            href="/diensten"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
                        >
                            Bekijk alle diensten
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SOFT ESCAPES */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-center text-sm font-medium text-slate-500 mb-8">Meer informatie nodig?</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/aanbod" className="p-6 rounded-2xl border border-slate-200 hover:border-navy-900 hover:shadow-lg transition-all text-center group">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <LayoutGrid size={20} />
                            </div>
                            <span className="font-bold text-slate-900 block">Kavels</span>
                        </Link>
                        <Link href="/diensten" className="p-6 rounded-2xl border border-slate-200 hover:border-navy-900 hover:shadow-lg transition-all text-center group">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="font-bold text-slate-900 block">Diensten</span>
                        </Link>
                        <Link href="/kennisbank" className="p-6 rounded-2xl border border-slate-200 hover:border-navy-900 hover:shadow-lg transition-all text-center group">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <span className="font-bold text-slate-900 block">Kennisbank</span>
                        </Link>
                        <Link href="/over-ons" className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-center hover:border-navy-900 hover:shadow-lg transition-all group">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <User size={20} />
                            </div>
                            <span className="font-bold text-slate-900 block">Over Ons</span>
                        </Link>
                    </div>
                </div>
            </section>

            <CTASticky onOpen={() => setShowWizard(true)} />
        </main>
    );
}
