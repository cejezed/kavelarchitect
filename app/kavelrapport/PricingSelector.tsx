'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Listing } from '@/lib/api';
import { PurchaseModal, type ReportTier } from '@/components/PurchaseModal';

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
  const [showModal, setShowModal] = useState(false);
  const [purchaseListing, setPurchaseListing] = useState<Listing | null>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const router = useRouter();

  return (
    <>
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

              <button
                type="button"
                onClick={() => {
                  setSelectedTier(tier.key);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selectedTier', tier.key);
                  }
                  setShowModal(true);
                }}
                className={`w-full py-3 font-bold rounded-xl text-center transition inline-block ${
                  isSelected
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'border border-slate-300 text-navy-900 hover:border-slate-400'
                }`}
              >
                {`Start ${tier.title}`}
              </button>
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

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          disabled={!selectedTier}
          className={`px-6 py-3 rounded-xl font-bold shadow ${
            selectedTier
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          Start
        </button>
      </div>

      {showModal && (
        <StartModal
          onClose={() => setShowModal(false)}
          onSelectListing={(listing) => {
            setPurchaseListing(listing);
            setShowModal(false);
            setShowPurchase(true);
          }}
          onStartOwn={(analysisType, address, link, email) => {
            const params = new URLSearchParams({
              analysisType,
              tier: selectedTier,
              address,
              link,
              email,
            });
            router.push(`/kavelrapport/intake?${params.toString()}`);
            setShowModal(false);
          }}
        />
      )}

      {showPurchase && purchaseListing && (
        <PurchaseModal
          listing={purchaseListing}
          tier={selectedTier as ReportTier}
          onClose={() => {
            setShowPurchase(false);
            setPurchaseListing(null);
          }}
        />
      )}
    </>
  );
}

function StartModal({
  onClose,
  onSelectListing,
  onStartOwn,
}: {
  onClose: () => void;
  onSelectListing: (listing: Listing) => void;
  onStartOwn: (analysisType: 'plot' | 'existing_property', address: string, link: string, email: string) => void;
}) {
  const [mode, setMode] = useState<'aanbod' | 'own'>('aanbod');
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState('');
  const [address, setAddress] = useState('');
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [analysisType, setAnalysisType] = useState<'plot' | 'existing_property'>('existing_property');

  // Fetch listings simple
  useEffect(() => {
    fetch('/api/published-listings')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        }
      })
      .catch(() => {});
  }, []);

  const selectedListing = listings.find((l) => l.kavel_id === selectedListingId) || null;
  const disabledAanbod = mode === 'aanbod' && !selectedListing;
  const disabledOwn = mode === 'own' && (!address || !link || !email);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative">
        <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-700" onClick={onClose} aria-label="Sluiten">
          <X size={18} />
        </button>
        <h3 className="text-lg font-bold text-navy-900 mb-4">Kies uw kavel</h3>

        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-xl font-semibold border ${mode === 'aanbod' ? 'border-orange-500 text-orange-600' : 'border-slate-200 text-slate-700'}`}
            onClick={() => setMode('aanbod')}
          >
            Kavel uit ons aanbod
          </button>
          <button
            className={`flex-1 py-2 rounded-xl font-semibold border ${mode === 'own' ? 'border-orange-500 text-orange-600' : 'border-slate-200 text-slate-700'}`}
            onClick={() => setMode('own')}
          >
            Eigen kavel / woning
          </button>
        </div>

        {mode === 'aanbod' ? (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Kavel kiezen</label>
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Selecteer een kavel</option>
              {listings.map((l) => (
                <option key={l.kavel_id} value={l.kavel_id}>
                  {(l.seo_title_ka || l.seo_title || l.adres)} — {l.plaats}
                </option>
              ))}
            </select>
            <button
              disabled={disabledAanbod}
              onClick={() => selectedListing && onSelectListing(selectedListing)}
              className={`w-full py-3 rounded-xl font-bold ${disabledAanbod ? 'bg-slate-200 text-slate-500' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
              Verder
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700 block">Adres</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Straat, plaats"
            />
            <label className="text-sm font-semibold text-slate-700 block">Link (Funda/advertentie)</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="https://..."
            />
            <label className="text-sm font-semibold text-slate-700 block">E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              placeholder="naam@voorbeeld.nl"
            />
            <div className="flex gap-2">
              <button
                className={`flex-1 py-2 rounded-xl font-semibold border ${analysisType === 'plot' ? 'border-orange-500 text-orange-600' : 'border-slate-200 text-slate-700'}`}
                onClick={() => setAnalysisType('plot')}
              >
                Bouwkavel
              </button>
              <button
                className={`flex-1 py-2 rounded-xl font-semibold border ${analysisType === 'existing_property' ? 'border-orange-500 text-orange-600' : 'border-slate-200 text-slate-700'}`}
                onClick={() => setAnalysisType('existing_property')}
              >
                Bestaande woning
              </button>
            </div>
            <button
              disabled={disabledOwn}
              onClick={() => !disabledOwn && onStartOwn(analysisType, address, link, email)}
              className={`w-full py-3 rounded-xl font-bold ${disabledOwn ? 'bg-slate-200 text-slate-500' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
              Verstuur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
