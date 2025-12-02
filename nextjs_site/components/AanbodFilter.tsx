'use client';

import { useState, useMemo } from 'react';
import { Listing } from '@/lib/api';
import { ListingCard } from './ListingCard';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

interface AanbodFilterProps {
    initialListings: Listing[];
    onResultsChange?: (count: number) => void;
}

export function AanbodFilter({ initialListings, onResultsChange }: AanbodFilterProps) {
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [minSurface, setMinSurface] = useState<number | ''>('');
    const [province, setProvince] = useState<string>('Alle provincies');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'size-large' | 'size-small'>('newest');

    // Extract unique provinces from listings
    const provinces = useMemo(() => {
        const unique = new Set(initialListings.map(l => l.provincie).filter(Boolean));
        return ['Alle provincies', ...Array.from(unique).sort()];
    }, [initialListings]);

    // Filter logic
    const filteredListings = useMemo(() => {
        let filtered = initialListings.filter(listing => {
            // Price filter
            if (maxPrice && listing.prijs > maxPrice) return false;

            // Surface filter
            if (minSurface && listing.oppervlakte < minSurface) return false;

            // Province filter
            if (province !== 'Alle provincies' && listing.provincie !== province) return false;

            // Search query (address or city)
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const match =
                    listing.adres?.toLowerCase().includes(query) ||
                    listing.plaats?.toLowerCase().includes(query) ||
                    listing.seo_title?.toLowerCase().includes(query);
                if (!match) return false;
            }

            return true;
        });

        // Sort logic
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.prijs - b.prijs;
                case 'price-high':
                    return b.prijs - a.prijs;
                case 'size-large':
                    return b.oppervlakte - a.oppervlakte;
                case 'size-small':
                    return a.oppervlakte - b.oppervlakte;
                case 'newest':
                default:
                    return 0; // Keep original order
            }
        });

        return filtered;
    }, [initialListings, maxPrice, minSurface, province, searchQuery, sortBy]);

    // Quick filter presets
    const quickFilters = [
        { label: '< €500k', action: () => setMaxPrice(500000) },
        { label: '> 1000m²', action: () => setMinSurface(1000) },
        { label: 'Noord-Holland', action: () => setProvince('Noord-Holland') },
        { label: 'Zuid-Holland', action: () => setProvince('Zuid-Holland') },
    ];

    return (
        <div>
            {/* Quick Filters + Sort */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm font-medium text-slate-600 self-center">Snel filter:</span>
                {quickFilters.map((filter, idx) => (
                    <button
                        key={idx}
                        onClick={filter.action}
                        className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                        {filter.label}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                    <ArrowUpDown size={16} className="text-slate-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="newest">Nieuwste eerst</option>
                        <option value="price-low">Prijs: Laag → Hoog</option>
                        <option value="price-high">Prijs: Hoog → Laag</option>
                        <option value="size-large">Grootte: Groot → Klein</option>
                        <option value="size-small">Grootte: Klein → Groot</option>
                    </select>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">

                {/* Search & Toggle */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Zoek op plaats of straat..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg border font-medium transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        <SlidersHorizontal size={18} className="mr-2" /> Filters
                    </button>
                </div>

                {/* Extended Filters */}
                {showFilters && (
                    <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">

                        {/* Province */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Provincie</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            >
                                {provinces.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        {/* Max Price */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Max. Prijs</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">Geen maximum</option>
                                <option value="500000">€ 500.000</option>
                                <option value="750000">€ 750.000</option>
                                <option value="1000000">€ 1.000.000</option>
                                <option value="1500000">€ 1.500.000</option>
                                <option value="2000000">€ 2.000.000</option>
                            </select>
                        </div>

                        {/* Min Surface */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Min. Oppervlakte</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={minSurface}
                                onChange={(e) => setMinSurface(e.target.value ? Number(e.target.value) : '')}
                            >
                                <option value="">Geen minimum</option>
                                <option value="500">500 m²</option>
                                <option value="1000">1.000 m²</option>
                                <option value="2000">2.000 m²</option>
                                <option value="5000">5.000 m²</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Active Filters Summary */}
                {(maxPrice || minSurface || province !== 'Alle provincies') && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                        {province !== 'Alle provincies' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                {province} <button onClick={() => setProvince('Alle provincies')} className="ml-2 hover:text-blue-900"><X size={14} /></button>
                            </span>
                        )}
                        {maxPrice && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                Max € {maxPrice.toLocaleString()} <button onClick={() => setMaxPrice('')} className="ml-2 hover:text-blue-900"><X size={14} /></button>
                            </span>
                        )}
                        {minSurface && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                                Min {minSurface} m² <button onClick={() => setMinSurface('')} className="ml-2 hover:text-blue-900"><X size={14} /></button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setProvince('Alle provincies');
                                setMaxPrice('');
                                setMinSurface('');
                                setSearchQuery('');
                            }}
                            className="text-sm text-slate-500 hover:text-slate-700 underline ml-auto"
                        >
                            Alles wissen
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="mb-4 text-slate-500 text-sm">
                {filteredListings.length} {filteredListings.length === 1 ? 'kavel' : 'kavels'} gevonden
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredListings.map(listing => (
                    <div key={listing.kavel_id} className="h-full">
                        <ListingCard listing={listing} />
                    </div>
                ))}
            </div>

            {filteredListings.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 text-lg">Geen kavels gevonden die aan uw criteria voldoen.</p>
                    <button
                        onClick={() => {
                            setProvince('Alle provincies');
                            setMaxPrice('');
                            setMinSurface('');
                            setSearchQuery('');
                        }}
                        className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                        Filters wissen
                    </button>
                </div>
            )}
        </div>
    );
}
