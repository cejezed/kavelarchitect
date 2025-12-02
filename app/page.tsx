'use client'; // Needed for interactive Wizard modal state

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, ShieldCheck, LayoutGrid, BookOpen, User } from 'lucide-react';
import KavelAlertForm from '@/components/KavelAlertForm';
import CTASticky from '@/components/CTASticky';

export default function Home() {
    const [showWizard, setShowWizard] = useState(false);

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
                    <img
                        src="/hero-bg.png"
                        alt="Background Architecture"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white/90"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <div className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-navy-900 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
                            Exclusief voor Zelfbouwers
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-6">
                            Eindeloos zoeken op Funda? <br />
                            <span className="text-navy-900">Vind sneller de juiste kavel.</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                            Wij bewaken dagelijks het aanbod en sturen u direct kavels die passen bij uw regio, budget en woonwensen.
                        </p>
                        <button
                            onClick={() => setShowWizard(true)}
                            className="inline-flex items-center justify-center px-8 py-4 bg-navy-900 text-white font-bold text-lg rounded-xl hover:bg-navy-800 transition-all shadow-xl hover:scale-105"
                        >
                            <Bell size={20} className="mr-3" />
                            Activeer Mijn Gratis KavelAlert
                        </button>
                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                            <ShieldCheck size={14} />
                            <span>Powered by Architectenbureau Zwijsen</span>
                        </div>
                    </div>

                    {/* Mobile Mockup Visual */}
                    <div className="order-1 lg:order-2 flex justify-center">
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
                                <div className="flex-1 bg-slate-50 mt-8 rounded-t-3xl overflow-hidden relative">
                                    <img
                                        src="/phone-villa.png"
                                        alt="House Mockup"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent flex flex-col justify-end p-6">
                                        <div className="w-12 h-1 bg-white/50 rounded-full mx-auto mb-6 absolute top-4 left-1/2 -translate-x-1/2"></div>
                                        <h3 className="text-white font-bold text-xl drop-shadow-lg">Droomvilla Blaricum</h3>
                                        <p className="text-white/90 text-sm drop-shadow">€ 1.250.000 v.o.n.</p>
                                        <button className="mt-4 w-full py-3 bg-white text-navy-900 font-bold rounded-xl text-sm shadow-lg">Bekijk Kavel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOFT ESCAPES */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-center text-sm font-medium text-slate-500 mb-8">Twijfelt u nog? Ontdek eerst onze gidsen:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Link href="/aanbod" className="p-6 rounded-2xl border border-slate-200 hover:border-navy-900 hover:shadow-lg transition-all text-center group">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <LayoutGrid size={20} />
                            </div>
                            <span className="font-bold text-slate-900 block">Bekijk Aanbod</span>
                        </Link>
                        <Link href="/kennisbank" className="p-6 rounded-2xl border border-slate-200 hover:border-navy-900 hover:shadow-lg transition-all text-center group">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <span className="font-bold text-slate-900 block">Kennisbank</span>
                        </Link>
                        <Link href="/over-ons" className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-center col-span-2 md:col-span-1 hover:border-navy-900 hover:shadow-lg transition-all group">
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