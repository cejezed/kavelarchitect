'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
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

const REPORT_PREVIEWS: Record<ReportTier, { title: string; images: string[] }> = {
  check: {
    title: 'Preview KavelCheck',
    images: [
      '/images/rapporten/KA%20rapport%20basis%20Grindweg%20Rotterdam_Page_1.webp',
      '/images/rapporten/KA%20rapport%20basis%20Grindweg%20Rotterdam_Page_2.webp',
      '/images/rapporten/KA%20rapport%20basis%20Grindweg%20Rotterdam_Page_3.webp',
      '/images/rapporten/KA%20rapport%20basis%20Grindweg%20Rotterdam_Page_4.webp',
    ],
  },
  rapport: {
    title: 'Preview KavelRapport',
    images: [
      '/images/rapporten/KA%20rapport%20plus%20Grindweg%20Rotterdam_Page_1.webp',
      '/images/rapporten/KA%20rapport%20plus%20Grindweg%20Rotterdam_Page_2.webp',
      '/images/rapporten/KA%20rapport%20plus%20Grindweg%20Rotterdam_Page_3.webp',
      '/images/rapporten/KA%20rapport%20plus%20Grindweg%20Rotterdam_Page_4.webp',
      '/images/rapporten/KA%20rapport%20plus%20Grindweg%20Rotterdam_Page_5.webp',
    ],
  },
  premium: {
    title: 'Preview Premium Review',
    images: [
      '/images/rapporten/KA%20rapport%20premium%20Grindweg%20Rotterdam_Page_1.webp',
      '/images/rapporten/KA%20rapport%20premium%20Grindweg%20Rotterdam_Page_2.webp',
      '/images/rapporten/KA%20rapport%20premium%20Grindweg%20Rotterdam_Page_3.webp',
      '/images/rapporten/KA%20rapport%20premium%20Grindweg%20Rotterdam_Page_4.webp',
      '/images/rapporten/KA%20rapport%20premium%20Grindweg%20Rotterdam_Page_5.webp',
      '/images/rapporten/KA%20rapport%20premium%20Grindweg%20Rotterdam_Page_6.webp',
    ],
  },
};

export default function PricingSelector() {
  const [selectedTier, setSelectedTier] = useState<(typeof tiers)[number]['key']>('rapport');
  const [showModal, setShowModal] = useState(false);
  const [purchaseListing, setPurchaseListing] = useState<Listing | null>(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [previewTier, setPreviewTier] = useState<ReportTier | null>(null);
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
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTier(tier.key);
                }}
                className="mt-2 w-full py-2.5 border border-slate-300 text-slate-700 hover:border-slate-400 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Bekijk preview
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

      {previewTier && (
        <ReportPreviewModal
          title={REPORT_PREVIEWS[previewTier].title}
          images={REPORT_PREVIEWS[previewTier].images}
          onClose={() => setPreviewTier(null)}
        />
      )}
    </>
  );
}

function ReportPreviewModal({
  title,
  images,
  onClose,
}: {
  title: string;
  images: string[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const goPrev = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-fit max-w-[96vw] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-navy-900">
            {title} <span className="text-slate-500 font-semibold text-sm">({currentIndex + 1}/{images.length})</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 rounded-full p-1"
            aria-label="Sluiten"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 bg-slate-50">
          <div className="relative mx-auto w-fit bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 shadow flex items-center justify-center"
                  aria-label="Vorige pagina"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 shadow flex items-center justify-center"
                  aria-label="Volgende pagina"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="relative mx-auto w-fit">
              <Image
                src={images[currentIndex]}
                alt={`${title} pagina ${currentIndex + 1}`}
                width={1200}
                height={1600}
                className="h-[70vh] max-h-[800px] min-h-[360px] w-auto max-w-[90vw] object-contain bg-white"
                sizes="(max-width: 768px) 90vw, 1200px"
                priority
              />
            </div>
          </div>

          {hasMultiple && (
            <div className="mt-4 flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-7 bg-navy-900' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ga naar pagina ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
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
