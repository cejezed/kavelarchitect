'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, ShieldCheck, Crown } from 'lucide-react';

const tiers = [
  {
    key: 'check' as const,
    title: 'KavelCheck',
    price: '€ 39',
    subtitle: 'Voor een eerste indruk',
    bullets: ['Bestemmingsplan (hoog over)', 'Bouwvlak & maxima (globaal)', 'Top-3 aandachtspunten'],
  },
  {
    key: 'rapport' as const,
    title: 'KavelRapport',
    price: '€ 149',
    subtitle: 'Beslisdocument voor het bod',
    bullets: [
      'Alles uit KavelCheck',
      'Bouwmogelijkheden vertaald naar duidelijke grenzen',
      'Indicatieve investeringsbandbreedte',
      'Risicoanalyse + vervolgstappen',
    ],
    badge: 'Meest gekozen',
  },
  {
    key: 'premium' as const,
    title: 'Premium Review',
    price: '€ 349',
    subtitle: 'Extra zekerheid met persoonlijke toelichting',
    bullets: ['Alles uit KavelRapport', 'Persoonlijke review door architect', '30 min strategiegesprek'],
  },
];

export default function PricingSelector() {
  const [selectedTier, setSelectedTier] = useState<(typeof tiers)[number]['key']>('rapport');

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {tiers.map((tier) => {
        const isSelected = selectedTier === tier.key;
        const baseClasses =
          'rounded-2xl p-8 flex flex-col transition border cursor-pointer';
        const selectedClasses = isSelected
          ? 'border-orange-500 bg-orange-50 shadow-xl ring-2 ring-orange-200'
          : 'border-slate-200 bg-white hover:border-navy-900 hover:shadow-md focus-within:border-navy-900 focus-within:shadow-md';

        return (
          <div
            key={tier.key}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedTier(tier.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedTier(tier.key);
              }
            }}
            aria-pressed={isSelected}
            className={`${baseClasses} ${selectedClasses} text-left`}
          >
            {tier.badge && (
              <div className="mb-4 inline-flex px-3 py-1 rounded-full bg-navy-900 text-white text-xs font-bold uppercase">
                {tier.badge}
              </div>
            )}

            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">{tier.title}</h3>
            <p className="text-slate-500 text-sm mb-4">{tier.subtitle}</p>
            <div className="text-4xl font-bold text-navy-900 mb-6">{tier.price}</div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.bullets.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  {tier.key === 'premium' ? (
                    <Crown size={16} className="text-purple-500 shrink-0" />
                  ) : (
                    <ShieldCheck
                      size={16}
                      className={tier.key === 'rapport' ? 'text-blue-600 shrink-0' : 'text-emerald-500 shrink-0'}
                    />
                  )}
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/aanbod"
              className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl text-center hover:bg-navy-800 transition inline-block"
            >
              Start aanvraag
            </Link>
            <Link
              href={`/kavelrapport/intake?analysisType=existing_property&tier=${tier.key}`}
              className="mt-3 text-xs text-center text-slate-500 underline inline-block w-full"
            >
              Ik heb al een eigen kavel/woning
            </Link>
          </div>
        );
      })}
    </div>
  );
}
