import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Check, CheckCircle2, FileText, Crown, ArrowRight, HelpCircle, X } from 'lucide-react';
import { PurchaseModal, ReportTier } from '@/components/PurchaseModal'; // We might re-use this if we want direct purchase from here, but usually it's per-listing. 
// For this general sales page, the CTA should probably lead to "Aanbod" to select a plot, OR an "Intake" form if they have their own plot.
// The user says: CTA underaan: "Start" (die leidt naar kavel kiezen of intake).

export const metadata = {
    title: 'KavelRapport™ | Zekerheid voor uw droomhuis',
    description: 'Weet wat u koopt vóór u een bod doet. Juridische en financiële analyse van bouwkavels in duidelijke taal.'
};

export default function KavelRapportPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* 1. HERO */}
            <section className="relative pt-32 pb-20 bg-navy-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900 to-blue-900/50"></div>
                    {/* Abstract background pattern */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-widest rounded-full border border-yellow-500/50 mb-6">
                            <ShieldCheck size={14} />
                            Risico-analyse & Bouwadvies
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6">
                            Koop geen kavel <br />
                            <span className="text-blue-400">zonder zekerheid.</span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
                            Het bestemmingsplan is complex. Wij vertalen de juridische regels naar heldere beslisinformatie: wat mag u bouwen en wat gaat het kosten?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/aanbod"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy-900 font-bold text-lg rounded-xl hover:bg-slate-100 transition-all shadow-lg"
                            >
                                Check een specifiek kavel <ArrowRight size={18} className="ml-2" />
                            </Link>
                            <Link
                                href="#tarieven"
                                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-slate-600 text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all"
                            >
                                Bekijk Tarieven
                            </Link>
                        </div>
                    </div>

                    {/* Visual: Blurred Report / Teaser */}
                    <div className="relative">
                        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-2 md:p-4 rotate-2 hover:rotate-0 transition-transform duration-500 max-w-lg mx-auto">
                            <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                {/* Header of report - Clear */}
                                <div className="bg-navy-900 p-8 text-white h-1/3 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <ShieldCheck size={32} />
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase">KavelRapport™</span>
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold">Kavel Analyse</h3>
                                        <p className="opacity-70">Villapark Weg 1, Blaricum</p>
                                    </div>
                                </div>
                                {/* Body - Blurred */}
                                <div className="p-8 space-y-6 filter blur-[2px]">
                                    <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-300 rounded w-1/2"></div>
                                    <div className="h-32 bg-slate-200 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-300 rounded w-full"></div>
                                        <div className="h-4 bg-slate-300 rounded w-5/6"></div>
                                    </div>
                                </div>
                                {/* Overlay Content */}
                                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
                                    <div className="bg-white px-6 py-4 rounded-xl shadow-xl border border-slate-100 text-center">
                                        <p className="font-bold text-navy-900 mb-1">Voorbeeldrapport</p>
                                        <p className="text-xs text-slate-500">Volledige PDF (12 pagina's)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
                    </div>
                </div>
            </section>

            {/* 2. VALUE PROPOSITION: Wat u krijgt vs Wat het niet is */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-6">Wat u precies krijgt</h2>
                        <ul className="space-y-4">
                            {[
                                { title: "Juridische vertaalslag", desc: "Geen ambtelijke taal, maar duidelijke conclusies: welk volume en welke goot- en nokhoogte zijn toegestaan.", icon: CheckCircle2 },
                                { title: "Financieel totaalplaatje", desc: "Niet alleen de vraagprijs, maar een raming van bouwkosten, leges, architect en terrein.", icon: CheckCircle2 },
                                { title: "Ruimtelijke analyse", desc: "Bezonningsstudie en privacy-check door een ervaren architect.", icon: CheckCircle2 },
                                { title: "Duidelijk advies", desc: "Een concreet 'Go' of 'No-Go' advies op basis van uw wensen.", icon: CheckCircle2 },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 text-emerald-500 shrink-0">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-900">{item.title}</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200">
                        <h2 className="font-serif text-3xl font-bold text-slate-500 mb-6">Wat het <span className="text-red-400 line-through decoration-2">niet</span> is</h2>
                        <ul className="space-y-6">
                            {[
                                { title: "Geen kant-en-klaar ontwerp", desc: "We laten zien wat mogelijk is binnen de regels (de 'envelop'), maar leveren geen uitgewerkt huisontwerp." },
                                { title: "Geen formele garantie", desc: "Wij baseren ons op het bestemmingsplan, maar de gemeente heeft altijd het laatste woord bij de vergunningaanvraag." },
                                { title: "Geen bodemonderzoek", desc: "Technische bodemchecks vereisen specialistisch veldwerk en vallen buiten deze bureaustudie." },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 opacity-75">
                                    <div className="mt-1 text-red-400 shrink-0">
                                        <X size={24} />
                                    </div>
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

            {/* 3. PRICING TIERS */}
            <section id="tarieven" className="py-20 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-serif text-4xl font-bold text-navy-900 mb-4">Kies uw zekerheid</h2>
                        <p className="text-slate-600">
                            Van een snelle check voor bezichtiging tot een uitgebreide analyse voor de aankoopbeslissing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Tier 1: Check */}
                        <div className="border border-slate-200 rounded-2xl p-8 flex flex-col hover:border-navy-900 transition-colors bg-white shadow-sm hover:shadow-md">
                            <div className="mb-6">
                                <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Oriëntatie</div>
                                <h3 className="font-serif text-2xl font-bold text-navy-900">KavelCheck</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-bold text-navy-900">€ 39</span>
                                    <span className="text-slate-500 ml-2">incl. btw</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">Voor snelle eerste indruk</p>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {['Quickscan bestemmingsplan', 'Hoofmaten & Volumes', 'Aandachtspunten-lijst'].map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                                        <Check size={16} className="text-emerald-500 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/aanbod" className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-center hover:border-navy-900 hover:text-navy-900 transition-all">
                                Kies een kavel
                            </Link>
                        </div>

                        {/* Tier 2: Rapport (Main) */}
                        <div className="border-2 border-navy-900 rounded-2xl p-8 flex flex-col bg-navy-50 relative shadow-xl transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                Meest Gekozen
                            </div>
                            <div className="mb-6">
                                <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">Beslis-Document</div>
                                <h3 className="font-serif text-2xl font-bold text-navy-900">KavelRapport™</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-bold text-navy-900">€ 149</span>
                                    <span className="text-slate-500 ml-2">incl. btw</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">Complete analyse vóór het bod</p>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {[
                                    'Alles uit KavelCheck',
                                    'Uitgebreide massastudie',
                                    'Investeringsraming (Grond + Bouw)',
                                    'Bezonnings & Privacy check',
                                    'Vergunningsvrij advies'
                                ].map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-navy-900 font-medium">
                                        <ShieldCheck size={16} className="text-blue-600 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/aanbod" className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl text-center hover:bg-navy-800 transition-all shadow-lg">
                                Start Aanvraag
                            </Link>
                        </div>

                        {/* Tier 3: Premium */}
                        <div className="border border-slate-200 rounded-2xl p-8 flex flex-col hover:border-navy-900 transition-colors bg-white shadow-sm hover:shadow-md">
                            <div className="mb-6">
                                <div className="text-purple-600 font-bold uppercase tracking-widest text-xs mb-2">Persoonlijk</div>
                                <h3 className="font-serif text-2xl font-bold text-navy-900">Premium Review</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-bold text-navy-900">€ 349</span>
                                    <span className="text-slate-500 ml-2">incl. btw</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">Met 1-op-1 architecten call</p>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {['Alles uit KavelRapport', '30 min video-call met architect', 'Persoonlijk haalbaarheidsadvies', 'Strategie voor het bod'].map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                                        <Crown size={16} className="text-purple-500 shrink-0" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/aanbod" className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-center hover:border-navy-900 hover:text-navy-900 transition-all">
                                Kies een kavel
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FAQ */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="font-serif text-3xl font-bold text-navy-900 mb-12 text-center">Veelgestelde vragen</h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Hoe snel ontvang ik het rapport?",
                                a: "Na betaling gaan wij direct aan de slag. Voor een KavelCheck en KavelRapport streven we naar levering binnen 24 uur (op werkdagen). De Premium Review plannen we in overleg."
                            },
                            {
                                q: "Wat als de kavel onbebouwbaar blijkt?",
                                a: "Dat is waardevolle informatie! Het rapport behoedt u dan voor een miskoop. U krijgt in dat geval een negatief bouwadvies, helder onderbouwd."
                            },
                            {
                                q: "Kan ik dit rapport gebruiken voor mijn hypotheek?",
                                a: "Het KavelRapport geeft een zeer accurate indicatie van de stichtingskosten, wat helpt bij uw eerste gesprek met de hypotheekadviseur. Het is echter geen officieel taxatierapport."
                            },
                            {
                                q: "Ik heb zelf een kavel gevonden (niet op jullie site), kunnen jullie helpen?",
                                a: "Absoluut! Neem contact op via info@kavelarchitect.nl voor een maatwerk analyse van uw eigen locatie."
                            }
                        ].map((faq, i) => (
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

            {/* 5. FINAL CTA */}
            <section className="py-20 bg-navy-900 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">Klaar om de volgende stap te zetten?</h2>
                    <p className="text-slate-300 mb-8 text-lg">
                        Zoek uw droomkavel in ons aanbod en vraag direct een analyse aan.
                    </p>
                    <Link
                        href="/aanbod"
                        className="inline-flex items-center justify-center px-10 py-4 bg-white text-navy-900 font-bold text-lg rounded-xl hover:bg-slate-100 transition-all shadow-xl"
                    >
                        Naar het Kavel Aanbod <ArrowRight size={20} className="ml-2" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
