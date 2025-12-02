import React, { useEffect, useState } from 'react';
import { Listing } from '../types';
import { api } from '../services/api';
import { Loader2, ExternalLink, Calendar, MapPin, TrendingUp, BarChart3, Ruler, Filter } from 'lucide-react';
import { ListingDrawer } from './ListingDrawer';

export const PublishedView: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await api.getPublishedListings();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatPrice = (price: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });

  // 1. Get unique provinces for the filter dropdown
  const provinces = [...new Set(listings.map(l => l.provincie).filter(Boolean))].sort();

  // 2. Filter listings based on selection
  const filteredListings = selectedProvince === 'all'
    ? listings
    : listings.filter(l => l.provincie === selectedProvince);

  // 3. Calculate stats based on filtered data
  const totalListings = filteredListings.length;
  const avgPrice = totalListings > 0 ? filteredListings.reduce((acc, l) => acc + l.prijs, 0) / totalListings : 0;
  const avgSurface = totalListings > 0 ? filteredListings.reduce((acc, l) => acc + l.oppervlakte, 0) / totalListings : 0;

  // Avg Price per m2 (calculated as Average of the Price/m2 of each listing, to represent market average)
  const avgPricePerSqm = totalListings > 0
    ? filteredListings.reduce((acc, l) => acc + (l.oppervlakte > 0 ? l.prijs / l.oppervlakte : 0), 0) / totalListings
    : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gepubliceerde Kavels</h2>
          <p className="text-slate-500">Marktanalyse en historisch overzicht.</p>
        </div>

        {/* Province Filter */}
        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-sm">
          <Filter size={16} className="text-slate-500 mr-2" />
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer min-w-[150px]"
          >
            <option value="all">Alle Provincies</option>
            <option disabled>──────────</option>
            {provinces.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Row (Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-5">
            <TrendingUp size={64} />
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mr-4 z-10">
            <TrendingUp size={24} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500">Gem. Vraagprijs</p>
            <p className="text-2xl font-bold text-slate-900">{formatPrice(avgPrice)}</p>
            <p className="text-xs text-slate-400 mt-1">{selectedProvince === 'all' ? 'Landelijk' : selectedProvince}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-5">
            <BarChart3 size={64} />
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full mr-4 z-10">
            <BarChart3 size={24} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500">Gem. Prijs / m²</p>
            <p className="text-2xl font-bold text-slate-900">{formatPrice(avgPricePerSqm)}</p>
            <p className="text-xs text-slate-400 mt-1">Marktindicatie</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-5">
            <Ruler size={64} />
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mr-4 z-10">
            <Ruler size={24} />
          </div>
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500">Gem. Oppervlakte</p>
            <p className="text-2xl font-bold text-slate-900">{Math.round(avgSurface)} m²</p>
            <p className="text-xs text-slate-400 mt-1">Gemiddeld perceel</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Locatie</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Prijs & Oppervlakte</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Gepubliceerd Op</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actie</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredListings.map((listing) => (
                <tr
                  key={listing.kavel_id}
                  onClick={() => setSelectedListing(listing)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {formatDate(listing.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2 text-slate-400" />
                      <div>
                        <div className="font-bold text-slate-900">{listing.plaats}</div>
                        <div className="text-xs text-slate-500">{listing.adres}, {listing.provincie}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{formatPrice(listing.prijs)}</div>
                    <div className="text-xs text-slate-500">{listing.oppervlakte} m²</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {listing.oppervlakte > 0 ? formatPrice(listing.prijs / listing.oppervlakte) : '-'} / m²
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {listing.published_sites?.map(site => (
                        <span key={site} className={`px-2 py-1 text-xs font-bold rounded ${site === 'kavelarchitect' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {site === 'kavelarchitect' ? 'KA' : 'Zwijsen'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {listing.published_url && (
                        <a
                          href={listing.published_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-600 hover:text-purple-900 inline-flex items-center"
                          title="Bekijk op Zwijsen.net"
                        >
                          WP <ExternalLink size={12} className="ml-1" />
                        </a>
                      )}
                      {listing.source_url && (
                        <a
                          href={listing.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          title="Bekijk op Funda"
                        >
                          Funda <ExternalLink size={12} className="ml-1" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredListings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500 font-medium">Geen kavels gevonden voor {selectedProvince === 'all' ? 'deze selectie' : selectedProvince}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Listing Detail Drawer */}
      {selectedListing && (
        <ListingDrawer
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onProcessed={() => {
            // Refresh listings after any action
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
};