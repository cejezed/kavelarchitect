
import React from 'react';
import { Listing } from '../types';
import { MapPin, Maximize, Euro, Users, Clock, TrendingUp, ImageOff } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  };

  // Calculate price per square meter
  const pricePerSqm = listing.oppervlakte > 0 ? listing.prijs / listing.oppervlakte : 0;
  const summary = listing.seo_summary_ka || listing.seo_summary || listing.seo_summary_zw || '';

  return (
    <div 
      onClick={() => onClick(listing)}
      className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {listing.image_url ? (
            <img 
              src={listing.image_url} 
              alt={listing.adres} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
        ) : (
            <div className="flex flex-col items-center text-slate-400">
                <ImageOff size={32} className="mb-2" />
                <span className="text-xs">Geen afbeelding</span>
            </div>
        )}
        
        {/* Hidden fallback element */}
        <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
             <ImageOff size={32} className="mb-2" />
             <span className="text-xs">Afbeelding niet beschikbaar</span>
        </div>

        <div className="absolute top-3 right-3 z-10">
             <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-slate-100 flex items-center gap-1">
                <Clock size={12} /> {formatDate(listing.created_at)}
             </span>
        </div>
        
        {/* Status badge if matches exist */}
        {listing.potential_matches.length > 0 && (
             <div className="absolute top-3 left-3 z-10">
                 <span className="bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Users size={12} /> Match
                 </span>
            </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <div>
                 <h3 className="font-bold text-lg text-slate-900 leading-tight">{listing.adres}</h3>
                 <div className="flex items-center text-slate-500 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    {listing.plaats}, {listing.provincie}
                 </div>
            </div>
        </div>

        <p className="text-slate-600 text-sm line-clamp-3 mt-2 mb-4 flex-1">
          {summary}
        </p>

        <div className="border-t border-slate-100 pt-4 mt-auto">
            <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <div className="flex items-center text-slate-700 font-medium">
                        <Euro size={16} className="mr-2 text-slate-400" />
                        {formatPrice(listing.prijs)}
                    </div>
                    <div className="flex items-center text-xs text-slate-400 mt-1 ml-6" title="Prijs per m²">
                         <TrendingUp size={12} className="mr-1" />
                         {formatPrice(pricePerSqm)} / m²
                    </div>
                </div>
                <div className="flex items-center text-slate-700 font-medium h-fit">
                    <Maximize size={16} className="mr-2 text-slate-400" />
                    {listing.oppervlakte} m²
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
