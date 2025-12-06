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
    const [showSold, setShowSold] = useState<boolean>(true);

    // Extract unique provinces from listings
    const provinces = useMemo(() => {
        const unique = new Set(initialListings.map(l => l.provincie).filter(Boolean));
        return ['Alle provincies', ...Array.from(unique).sort()];
    }, [initialListings]);

    // Filter logic
    const filteredListings = useMemo(() => {
        let filtered = initialListings.filter(listing => {
            // Sold filter - hide sold listings if toggle is off
            if (!showSold && listing.status === 'sold') return false;

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
    }, [initialListings, maxPrice, minSurface, province, searchQuery, sortBy, showSold]);

    // Quick filter presets
    const quickFilters = [
        { label: '< €500k', action: () => setMaxPrice(500000) },
        { label: '> 1000m²', action: () => setMinSurface(1000) },
        { label: 'Noord-Holland', action: () => setProvince('Noord-Holland') },
        { label: 'Zuid-Holland', action: () => setProvince('Zuid-Holland') },
    ];

    return (
        <div>
            {/* Quick Filters + Sort - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex flex-wrap gap-2 mb-4">
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

            {/* Mobile Sort - Only shown on mobile */}
            <div className="md:hidden flex items-center gap-2 mb-3">
                <ArrowUpDown size={16} className="text-slate-400" />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="newest">Nieuwste eerst</option>
                    <option value="price-low">Prijs: Laag → Hoog</option>
                    <option value="price-high">Prijs: Hoog → Laag</option>
                    <option value="size-large">Grootte: Groot → Klein</option>
                    <option value="size-small">Grootte: Klein → Groot</option>
                </select>
            </div>

            {/* Filter Bar - More compact on mobile */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6">

                {/* Search & Toggle */}
                <div className="flex gap-2 md:gap-4 mb-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Zoek plaats..."
                            className="w-full pl-9 pr-3 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-lg border font-medium transition-colors text-sm md:text-base whitespace-nowrap ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                        <SlidersHorizontal size={18} className="md:mr-2" />
                        <span className="hidden md:inline">Filters</span>
                    </button>
                </div>

                {/* Show/Hide Sold Toggle */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                    <label htmlFor="show-sold" className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            id="show-sold"
                            checked={showSold}
                            onChange={(e) => setShowSold(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                            Toon verkochte kavels
                        </span>
                    </label>
                    {!showSold && (
                        <span className="text-xs text-slate-500">
                            {initialListings.filter(l => l.status === 'sold').length} verborgen
                        </span>
                    )}
                </div>

                {/* Extended Filters */}
                {showFilters && (
                    <div className="grid md:grid-cols-3 gap-4 md:gap-6 pt-4 mt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">

                        {/* Province */}
                        <div>
                            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">Provincie</label>
                            <select
                                className="w-full p-2.5 md:p-3 text-sm md:text-base rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">Max. Prijs</label>
                            <select
                                className="w-full p-2.5 md:p-3 text-sm md:text-base rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">Min. Oppervlakte</label>
                            <select
                                className="w-full p-2.5 md:p-3 text-sm md:text-base rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

                {/* Active Filters Summary - More compact on mobile */}
                {(maxPrice || minSurface || province !== 'Alle provincies') && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-100">
                        {province !== 'Alle provincies' && (
                            <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-medium">
                                {province} <button onClick={() => setProvince('Alle provincies')} className="ml-1.5 md:ml-2 hover:text-blue-900"><X size={12} /></button>
                            </span>
                        )}
                        {maxPrice && (
                            <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-medium">
                                Max € {maxPrice.toLocaleString()} <button onClick={() => setMaxPrice('')} className="ml-1.5 md:ml-2 hover:text-blue-900"><X size={12} /></button>
                            </span>
                        )}
                        {minSurface && (
                            <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-medium">
                                Min {minSurface} m² <button onClick={() => setMinSurface('')} className="ml-1.5 md:ml-2 hover:text-blue-900"><X size={12} /></button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setProvince('Alle provincies');
                                setMaxPrice('');
                                setMinSurface('');
                                setSearchQuery('');
                            }}
                            className="text-xs md:text-sm text-slate-500 hover:text-slate-700 underline ml-auto"
                        >
                            Wis alles
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="mb-3 md:mb-4 text-slate-500 text-xs md:text-sm">
                {filteredListings.length} {filteredListings.length === 1 ? 'kavel' : 'kavels'} gevonden
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredListings.map(listing => (
                    <div key={listing.kavel_id} className="h-full">
                        <ListingCard listing={listing} />
                    </div>
                ))}
            </div>

            {filteredListings.length === 0 && (
                <div className="text-center py-12 md:py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500 text-base md:text-lg">Geen kavels gevonden die aan uw criteria voldoen.</p>
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
