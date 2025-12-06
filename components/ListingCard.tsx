
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { Listing } from '@/lib/api';

export function ListingCard({ listing }: { listing: Listing }) {
  // Use map_url as fallback for image
  const imageUrl = listing.image_url || listing.map_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80';

  // Calculate price/m2
  const pricePerSqm = listing.oppervlakte > 0 ? Math.round(listing.prijs / listing.oppervlakte) : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 bg-slate-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={listing.adres}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* VERKOCHT Overlay for sold properties */}
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
          {listing.seo_title || listing.adres}
        </h3>
        <p className="text-sm text-slate-500 mb-4">{listing.plaats}, {listing.provincie}</p>

        <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-slate-50 py-4 mt-auto">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Oppervlakte</p>
            <p className="font-bold text-slate-700">{listing.oppervlakte} m²</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Vraagprijs</p>
            <p className="font-bold text-slate-700">€ {listing.prijs.toLocaleString()}</p>
            <p className="text-xs text-slate-400 font-medium">€ {pricePerSqm.toLocaleString()} / m²</p>
          </div>
        </div>

        <Link
          href={`/aanbod/${listing.kavel_id}`}
          className={`w-full py-3 border rounded-xl font-bold text-sm transition-colors text-center flex items-center justify-center group/btn ${listing.status === 'sold'
              ? 'border-red-200 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100'
              : 'border-slate-200 text-slate-700 hover:border-navy-900 hover:text-navy-900'
            }`}
        >
          {listing.status === 'sold' ? (
            <>Wil ook een alert? <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" /></>
          ) : (
            <>Bekijk Potentie <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" /></>
          )}
        </Link>
      </div>
    </div>
  );
}
