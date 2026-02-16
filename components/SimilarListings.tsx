'use client';

import { useEffect, useState } from 'react';
import { ListingCard } from './ListingCard';
import { Listing } from '@/lib/api';
import KavelAlertOverlay from './KavelAlertOverlay';

interface SimilarListingsProps {
    currentListing: Listing;
}

export function SimilarListings({ currentListing }: SimilarListingsProps) {
    const [similarListings, setSimilarListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSimilar() {
            try {
                // Fetch all published listings
                const response = await fetch('/api/published-listings');
                const allListings: Listing[] = await response.json();

                // Filter and score similar listings
                const scored = allListings
                    .filter(l => l.kavel_id !== currentListing.kavel_id) // Exclude current
                    .filter(l => l.status === 'published') // Only available
                    .map(listing => {
                        let score = 0;
                        const listingPrice = typeof listing.prijs === 'number' ? listing.prijs : 0;
                        const currentPrice = typeof currentListing.prijs === 'number' ? currentListing.prijs : 0;
                        const listingSurface = typeof listing.oppervlakte === 'number' ? listing.oppervlakte : 0;
                        const currentSurface = typeof currentListing.oppervlakte === 'number' ? currentListing.oppervlakte : 0;

                        // Same province gets highest score
                        if (listing.provincie === currentListing.provincie) score += 10;

                        // Same city gets bonus
                        if (listing.plaats === currentListing.plaats) score += 5;

                        // Price similarity (within 30%)
                        if (currentPrice > 0) {
                            const priceDiff = Math.abs(listingPrice - currentPrice) / currentPrice;
                            if (priceDiff < 0.3) score += 5;
                            else if (priceDiff < 0.5) score += 3;
                        }

                        // Size similarity (within 30%)
                        if (currentSurface > 0) {
                            const sizeDiff = Math.abs(listingSurface - currentSurface) / currentSurface;
                            if (sizeDiff < 0.3) score += 3;
                            else if (sizeDiff < 0.5) score += 1;
                        }

                        return { listing, score };
                    })
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3) // Top 3
                    .map(item => item.listing);

                setSimilarListings(scored);
            } catch (error) {
                console.error('Error fetching similar listings:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSimilar();
    }, [currentListing]);

    if (loading) {
        return (
            <section className="py-12 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="font-serif text-2xl font-bold text-navy-900 mb-8 text-center">
                        Bezig met laden...
                    </h2>
                </div>
            </section>
        );
    }

    if (similarListings.length === 0) {
        return null; // Don't show section if no similar listings
    }

    return (
        <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-900 mb-2">
                        {currentListing.status === 'sold' ? 'Vergelijkbare Kavels die Nog Beschikbaar Zijn' : 'Vergelijkbare Kavels'}
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        {currentListing.status === 'sold'
                            ? `Ook geïnteresseerd in een kavel in ${currentListing.provincie}? Bekijk deze kavels`
                            : `Andere interessante kavels in ${currentListing.provincie}`
                        }
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {similarListings.map(listing => (
                        <div key={listing.kavel_id}>
                            <ListingCard listing={listing} />
                        </div>
                    ))}
                </div>

                {currentListing.status === 'sold' && (
                    <div className="text-center mt-8">
                        <p className="text-sm text-slate-500 mb-4">Niet gevonden waar je naar zoekt?</p>
                        <KavelAlertOverlay
                            buttonText="Activeer KavelAlert voor Nieuwe Kavels"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
