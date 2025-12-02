
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Ruler, BrainCircuit, Users } from 'lucide-react';

export const metadata = {
    title: 'Over Ons | Architectenbureau Zwijsen',
    description: 'Wij combineren data-analyse met architectonisch inzicht om uw droomkavel te vinden en te valideren.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 h-16 flex items-center px-6">
                <Link href="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-navy-900">
                    <ArrowLeft size={18} className="mr-2" /> Terug naar Home
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Onze Filosofie</span>
                        <h1 className="font-serif text-4xl md:text-6xl text-slate-900 leading-tight mb-8">
                            Wij zien geen grasveld.<br />
                            <span className="text-navy-900">Wij zien uw villa.</span>
                        </h1>
                        <div className="prose prose-lg text-slate-600">
                            <p>
                                Het vinden van een kavel is in Nederland topsport. Het aanbod is schaars, de regels zijn complex en de snelheid ligt hoog.
                            </p>
                            <p>
                                De traditionele route – Funda in de gaten houden en hopen op geluk – werkt niet meer voor de kritische zelfbouwer. U vist achter het net, of koopt grond waar uw droomhuis juridisch niet op mag staan.
                            </p>
                            <p>
                                Daarom hebben wij <strong>KavelArchitect</strong> opgericht.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-[600px] bg-slate-100 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Placeholder voor foto van Jules aan het werk / maquette */}
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

            {/* The Founder / Authority */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-8 overflow-hidden border-4 border-white shadow-lg relative">
                        {/* Placeholder portret */}
                        <Image
                            src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                            alt="Jules Zwijsen"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">Jules Zwijsen</h2>
                    <p className="text-slate-500 font-medium uppercase tracking-wider text-sm mb-8">Architect & Oprichter</p>

                    <p className="text-xl text-slate-700 font-light leading-relaxed mb-12">
                        "Als architect zag ik te vaak cliënten met een pas aangekochte kavel binnenlopen, om er vervolgens achter te komen dat hun woonwensen juridisch onmogelijk waren op die specifieke plek. Dat moest anders. Met KavelArchitect draaien we het proces om: we valideren éérst de bouwmogelijkheden, en matchen dan pas de kavel."
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-12">
                        <div>
                            <p className="text-4xl font-serif font-bold text-navy-900">15+</p>
                            <p className="text-xs text-slate-500 uppercase mt-2">Jaar Ervaring</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-navy-900">200+</p>
                            <p className="text-xs text-slate-500 uppercase mt-2">Projecten Gerealiseerd</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-navy-900">24/7</p>
                            <p className="text-xs text-slate-500 uppercase mt-2">Kavel Monitoring</p>
                        </div>
                        <div>
                            <p className="text-4xl font-serif font-bold text-navy-900">100%</p>
                            <p className="text-xs text-slate-500 uppercase mt-2">Onafhankelijk</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Tech (Why Brikx?) */}
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
                                    <p className="text-slate-600 text-sm">Onze systemen scannen 's nachts de markt en analyseren bestemmingsplannen razendsnel.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg mr-4">
                                    <Ruler size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">Architect Check</h3>
                                    <p className="text-slate-600 text-sm">Geen algoritme beslist alleen. Elke match wordt gevalideerd door een architect op haalbaarheid.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg mr-4">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">Exclusief Netwerk</h3>
                                    <p className="text-slate-600 text-sm">Wij hebben toegang tot off-market aanbod via ons netwerk van grondeigenaren en makelaars.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Onze Methode</span>
                        <h2 className="font-serif text-4xl font-bold text-slate-900 mb-6">Technologie in dienst van Esthetiek</h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            Wij geloven niet in "u vraagt, wij draaien". Wij geloven in regie. Door technologie te gebruiken voor het zoekwerk, houden wij tijd over voor waar we goed in zijn: <strong>ontwerpen</strong>.
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Wanneer u via KavelArchitect een kavel vindt, koopt u niet alleen grond. U koopt de zekerheid dat uw woonwens daar gerealiseerd kan worden.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-24 bg-navy-900 text-white text-center px-6">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Start met zekerheid.</h2>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                    Laat ons de markt voor u scannen en ontvang alleen kavels die passen bij uw architectonische ambitie.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-white text-navy-900 font-bold text-lg rounded-xl hover:bg-blue-50 transition-colors"
                >
                    Activeer KavelAlert™
                </Link>
            </section>
        </div>
    );
}
