'use client';

import { useState } from 'react';
import { FileText, Shield, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { PurchaseModal } from './PurchaseModal';
import { Listing } from '@/lib/api';

interface KavelRapportTeaserProps {
    listing: Listing;
}

export function KavelRapportTeaser({ listing }: KavelRapportTeaserProps) {
    const [showModal, setShowModal] = useState(false);

    // If sold, we don't show the report teaser, or maybe we do? 
    // Usually selling a report for a sold property is less useful unless it's for reference.
    if (listing.status === 'sold') return null;

    return (
        <>
            <div className="mb-6 bg-gradient-to-br from-slate-900 to-navy-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-navy-700">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-widest rounded-full border border-yellow-500/50 mb-4">
                    <Shield size={12} /> Zekerheid
                </div>

                <h3 className="font-serif text-2xl font-bold mb-2">Verzekering tegen een miskoop</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Mensen kopen geen PDF, ze kopen zekerheid. Weet direct of uw droomhuis hier past en wat het écht gaat kosten.
                </p>

                <div className="space-y-3 mb-8">
                    <div className="flex items-start">
                        <CheckCircle2 className="text-emerald-400 mt-0.5 mr-3 shrink-0" size={18} />
                        <div>
                            <span className="font-bold text-white text-sm block">Harde Cijfers</span>
                            <span className="text-slate-400 text-xs">Precieze massastudie (m³ & m²) volgens bestemmingsplan.</span>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CheckCircle2 className="text-emerald-400 mt-0.5 mr-3 shrink-0" size={18} />
                        <div>
                            <span className="font-bold text-white text-sm block">Financiële Realiteit</span>
                            <span className="text-slate-400 text-xs">Compleet kostenplaatje: Grond + Bouw + Leges.</span>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CheckCircle2 className="text-emerald-400 mt-0.5 mr-3 shrink-0" size={18} />
                        <div>
                            <span className="font-bold text-white text-sm block">Architectenblik</span>
                            <span className="text-slate-400 text-xs">Is de zonligging goed? Hoe is de privacy?</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs line-through">Normaal € 150,-</span>
                        <span className="text-white font-bold text-2xl">€ 75,-</span>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center bg-white text-navy-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
                    >
                        <Lock size={16} className="mr-2" />
                        Koop Rapport
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-500 mt-2">
                    100% Geld-terug-garantie als u niet tevreden bent.
                </p>
            </div>

            {showModal && (
                <PurchaseModal listing={listing} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
