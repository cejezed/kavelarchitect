'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Bell } from 'lucide-react';
import { Listing } from '@/lib/api';
import { InlineKavelAlert } from './InlineKavelAlert';

function buildListingHeadline(listing: Listing) {
  const place = listing.plaats || 'Nederland';
  const address = listing.adres || '';
  const idSeed = (listing.kavel_id || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const variants = [
    'vrijstaande villa mogelijk',
    'kavel voor vrijstaande woning',
    'zelfbouwkavel met potentie',
  ];
  const suffix = variants[idSeed % variants.length];

  if (!address) return `Bouwkavel ${place} - ${suffix}`;
  return `Bouwkavel ${place} ${address} - ${suffix}`;
}

function buildWoonmilieu(listing: Listing) {
  const area = listing.oppervlakte || 0;
  if (area >= 2000) return 'Woonmilieu: landelijk en ruim opgezet';
  if (area >= 1000) return 'Woonmilieu: ruim villamilieu';
  return 'Woonmilieu: dorps of stadsrand';
}

export function ListingCard({ listing }: { listing: Listing }) {
  const [showAlert, setShowAlert] = useState(false);

  const imageUrl = listing.image_url || listing.map_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80';
  const sourceTitle = listing.seo_title_ka || listing.seo_title || listing.adres || '';
  const isBrandedTitle = sourceTitle.toLowerCase().includes('jules zwijsen');
  const isTooLongTitle = sourceTitle.length > 85;
  const displayTitle = !sourceTitle || isBrandedTitle || isTooLongTitle ? buildListingHeadline(listing) : sourceTitle;
  const woonmilieu = buildWoonmilieu(listing);

  const price = typeof listing.prijs === 'number' ? listing.prijs : null;
  const oppervlakte = typeof listing.oppervlakte === 'number' ? listing.oppervlakte : null;
  const pricePerSqm = price && oppervlakte && oppervlakte > 0 ? Math.round(price / oppervlakte) : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 bg-slate-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={listing.adres}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-lg shadow-2xl transform -rotate-12">
              VERKOCHT
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center">
          <MapPin size={12} className="mr-1" /> {listing.provincie}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-serif text-xl font-bold text-navy-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {displayTitle}
        </h3>
        <p className="text-sm text-slate-500 mb-2">{listing.plaats}, {listing.provincie}</p>
        <p className="text-xs text-slate-500 mb-4">{woonmilieu}. Aanrader: laat de bouwmogelijkheden toetsen met een KavelRapport.</p>

        <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-slate-50 py-4 mt-auto">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Oppervlakte</p>
            <p className="font-bold text-slate-700">{oppervlakte ? `${oppervlakte} m²` : 'Onbekend'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Vraagprijs</p>
            <p className="font-bold text-slate-700">
              {price ? `€ ${price.toLocaleString('nl-NL')}` : 'Prijs op aanvraag'}
            </p>
            {pricePerSqm > 0 && (
              <p className="text-xs text-slate-400 font-medium">€ {pricePerSqm.toLocaleString('nl-NL')} / m²</p>
            )}
          </div>
        </div>

        {listing.status === 'sold' ? (
          <div className="space-y-3">
            {!showAlert ? (
              <button
                onClick={() => setShowAlert(true)}
                className="w-full py-3 border border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400 hover:bg-blue-100 rounded-xl font-bold text-sm transition-colors text-center flex items-center justify-center group/btn"
              >
                <Bell size={16} className="mr-2" />
                Wil ook een alert?
              </button>
            ) : (
              <InlineKavelAlert
                provincie={listing.provincie}
                plaats={listing.plaats}
                prijs={price ?? undefined}
                autoExpand={true}
              />
            )}
          </div>
        ) : (
          <Link
            href={`/aanbod/${listing.kavel_id}`}
            className="w-full py-3 border border-slate-200 text-slate-700 hover:border-navy-900 hover:text-navy-900 rounded-xl font-bold text-sm transition-colors text-center flex items-center justify-center group/btn"
          >
            Bekijk Potentie <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}