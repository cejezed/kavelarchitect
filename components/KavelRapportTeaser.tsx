'use client';

import { useMemo, useState } from 'react';
import { Shield, CheckCircle2, Lock, Crown, FileText } from 'lucide-react';
import { PurchaseModal, ReportTier } from './PurchaseModal';
import type { Listing } from '@/lib/api';

interface KavelRapportTeaserProps {
    listing: Listing;
}

/**
 * KavelRapportTeaser
 * - 3-tier pricing: decoy (cheap), target (rapport), anchor (expensive)
 * - Starts with NO preselection to avoid "weird default choice"
 * - CTA disabled until user selects a tier
 */
export function KavelRapportTeaser({ listing }: KavelRapportTeaserProps) {
    const [showModal, setShowModal] = useState(false);
    const [selectedTier, setSelectedTier] = useState<ReportTier | null>(null);

    // If sold, no report CTA (default: hide)
    if (listing.status === 'sold') return null;

    const tiers = useMemo(
        () => [
            {
                key: 'check' as const,
                title: 'KavelCheck',
                price: 39,
                badge: 'Oriëntatie',
                icon: FileText,
                bullets: [
                    'Korte samenvatting bouwregels en aandachtspunten',
                    'Snelle indicatie: waar moet u op letten',
                    'Geschikt om te vergelijken, niet om te beslissen',
                ],
                fineprint: 'Beperkt en zonder verdieping of interpretatie op detailniveau.',
            },
            {
                key: 'rapport' as const,
                title: 'KavelRapport',
                price: 149,
                badge: 'Meest gekozen',
                icon: Shield,
                bullets: [
                    'Heldere uitleg: wat mag u hier bouwen (en wat niet)',
                    'Vergunningsvrij: praktisch uitgelegd in begrijpelijke taal',
                    'Risico’s en vervolgstappen: waar zit de echte onzekerheid',
                ],
                fineprint:
                    'Het beslisdocument vóór aankoop. Focus op zekerheid, risico’s en interpretatie.',
            },
            {
                key: 'premium' as const,
                title: 'Premium Review',
                price: 349,
                badge: 'Maximale zekerheid',
                icon: Crown,
                bullets: [
                    'Alles uit KavelRapport, plus persoonlijke review',
                    'Extra duiding op impact voor ontwerp en haalbaarheid',
                    'Korte toelichting/strategiemoment inbegrepen',
                ],
                fineprint: 'Voor kopers die geen twijfel willen en extra duiding waarderen.',
            },
        ],
        []
    );

    const active = selectedTier ? tiers.find((t) => t.key === selectedTier) : null;

    return (
        <>
            <div className="mb-6 bg-gradient-to-br from-slate-900 to-navy-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-navy-700">
                {/* Background decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl" />

                {/* Header */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/15 text-yellow-200 text-xs font-bold uppercase tracking-widest rounded-full border border-yellow-500/40 mb-4">
                    <Shield size={14} />
                    Zekerheid vóór aankoop
                </div>

                <h3 className="font-serif text-2xl font-bold mb-2">
                    Weet wat u koopt vóór u een bod doet
                </h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed max-w-2xl">
                    Het KavelRapport zet bouwregels, beperkingen en risico’s om naar begrijpelijke
                    beslisinformatie. Geen verkooppraat, wel helderheid.
                </p>

                {/* Tier cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {tiers.map((t) => {
                        const Icon = t.icon;
                        const isActive = t.key === selectedTier;

                        return (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setSelectedTier(t.key)}
                                className={[
                                    'text-left rounded-2xl border transition-colors p-4 relative overflow-hidden',
                                    isActive
                                        ? 'bg-white/10 border-white/30'
                                        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20',
                                ].join(' ')}
                                aria-pressed={isActive}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <Icon size={18} className={isActive ? 'text-white' : 'text-slate-200'} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">{t.title}</span>
                                                <span
                                                    className={[
                                                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                                                        t.key === 'rapport'
                                                            ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30'
                                                            : 'bg-white/8 text-slate-200 border-white/15',
                                                    ].join(' ')}
                                                >
                                                    {t.badge}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-baseline gap-1">
                                                <span className="text-2xl font-extrabold">€ {t.price},-</span>
                                                <span className="text-slate-400 text-xs">incl. btw</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selection indicator (subtle, but clear) */}
                                    <div
                                        className={[
                                            'h-4 w-4 rounded-full border mt-1 shrink-0',
                                            isActive ? 'bg-white border-white' : 'border-white/25',
                                        ].join(' ')}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="mt-3 space-y-2">
                                    {t.bullets.map((b) => (
                                        <div key={b} className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                            <span className="text-xs text-slate-200 leading-relaxed">{b}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 text-[11px] text-slate-400 leading-relaxed">{t.fineprint}</div>
                            </button>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-slate-300 text-xs leading-relaxed">
                        {!active ? (
                            <>
                                <span className="font-bold text-white">Kies een optie</span> om door te gaan naar betaling.
                                <div className="text-slate-400 mt-1">
                                    Transparant: dit is een analyse voor beslisinformatie, geen ontwerp of juridische garantie.
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="font-bold text-white">Gekozen:</span> {active.title} — € {active.price},-
                                <div className="text-slate-400 mt-1">
                                    Transparant: dit is een analyse voor beslisinformatie, geen ontwerp of juridische garantie.
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => active && setShowModal(true)}
                        disabled={!active}
                        className={[
                            'inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold shadow-lg transition-colors',
                            active
                                ? 'bg-white text-navy-900 hover:bg-slate-100'
                                : 'bg-white/20 text-white/60 cursor-not-allowed',
                        ].join(' ')}
                    >
                        <Lock size={16} className="mr-2" />
                        Verder naar betaling
                    </button>
                </div>

                {/* Micro trust */}
                <div className="mt-4 text-[11px] text-slate-500">
                    Objectief en data-gedreven, met expertise van Architectenbureau Zwijsen. Powered by Brikx.
                </div>
            </div>

            {showModal && selectedTier && (
                <PurchaseModal
                    listing={listing}
                    tier={selectedTier}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
