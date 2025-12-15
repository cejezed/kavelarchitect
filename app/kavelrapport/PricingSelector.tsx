'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'lucide-react';

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
          'relative rounded-2xl p-8 flex flex-col transition border cursor-pointer shadow-sm';
        const selectedClasses = isSelected
          ? 'border-orange-500 bg-white shadow-lg ring-4 ring-orange-100'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md focus-within:border-slate-300 focus-within:shadow-md';

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
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold uppercase px-4 py-1 rounded-full shadow">
                {tier.badge}
              </div>
            )}

            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-1">{tier.title}</h3>
            <p className="text-slate-500 text-sm italic mb-3">{tier.subtitle}</p>
            <div className="text-4xl font-bold text-navy-900 mb-6">{tier.price}</div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.bullets.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check size={16} className="text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/aanbod"
              className={`w-full py-3 font-bold rounded-xl text-center transition inline-block ${
                isSelected
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'border border-slate-300 text-navy-900 hover:border-slate-400'
              }`}
            >
              {`Start ${tier.title}`}
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
