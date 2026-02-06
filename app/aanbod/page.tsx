
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { AanbodFilter } from '@/components/AanbodFilter';
import { FloatingAlertButton } from '@/components/FloatingAlertButton';
// import { AanbodMap } from '@/components/AanbodMap'; // Tijdelijk uitgeschakeld
import { getListings, type Listing } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
    title: 'Kavelaanbod | KavelArchitect - Bouwkavels in heel Nederland',
    description: 'Actueel overzicht van bouwkavels in Nederland. Vind uw ideale kavel voor zelfbouw met expert begeleiding van Architectenbureau Zwijsen.',
    keywords: ['bouwkavels', 'kavelaanbod', 'zelfbouw', 'bouwgrond te koop', 'Nederland', 'architect', 'nieuwbouw', 'kavels', 'grond kopen'],
    alternates: {
        canonical: 'https://kavelarchitect.nl/aanbod',
    },
    openGraph: {
        title: 'Kavelaanbod | KavelArchitect',
        description: 'Actueel overzicht van bouwkavels in Nederland. Vind uw ideale kavel voor zelfbouw.',
        url: 'https://kavelarchitect.nl/aanbod',
        siteName: 'KavelArchitect',
        locale: 'nl_NL',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kavelaanbod | KavelArchitect',
        description: 'Actueel overzicht van bouwkavels in Nederland.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default async function AanbodPage() {
    try {
        const listingsResult = await getListings();
        const listings = Array.isArray(listingsResult) ? listingsResult : [];

        const breadcrumbJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://kavelarchitect.nl'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Kavels',
                    item: 'https://kavelarchitect.nl/aanbod'
                }
            ]
        };

        return (
            <div className="min-h-screen bg-slate-50">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />
                <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-20 md:pt-24">
                    <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500">
                        <ol className="flex flex-wrap items-center gap-2">
                            <li>
                                <Link href="/" className="hover:text-slate-700">Home</Link>
                            </li>
                            <li aria-hidden="true">›</li>
                            <li className="text-slate-700">Kavels</li>
                        </ol>
                    </nav>
                    <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
                        <h1 className="font-serif text-2xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-4">Beschikbare Grond</h1>
                        <p className="text-slate-600 text-sm md:text-base mb-4 md:mb-6">Dagelijks geactualiseerd aanbod.</p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 md:px-6 py-2 md:py-3 text-sm text-emerald-900">
                                <strong>{listings.filter((l: Listing) => l.status === 'published').length}</strong> kavels beschikbaar
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 md:px-6 py-2 md:py-3 text-sm text-red-900">
                                <strong>{listings.filter((l: Listing) => l.status === 'sold').length}</strong> verkocht
                            </div>
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-navy-900 text-white font-bold text-sm md:text-base rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
                            >
                                <Bell size={18} className="mr-2" />
                                Activeer KavelAlert
                            </Link>
                        </div>
                    </div>

                    {/* Kaart tijdelijk uitgeschakeld voor debugging
                    <section className="mb-8 md:mb-12">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">Kaartweergave</h2>
                        <p className="text-slate-600 text-sm md:text-base mb-4">
                            Bekijk de kavels op de kaart en klik door naar de detailpagina.
                        </p>
                        {listings.length > 0 ? (
                            <AanbodMap listings={listings} />
                        ) : (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
                                Geen kavels beschikbaar om weer te geven op de kaart.
                            </div>
                        )}
                    </section>
                    */}

                    <AanbodFilter initialListings={listings} />
                </main>

                <FloatingAlertButton />
            </div>
        );
    } catch (error) {
        console.error('Critical error in AanbodPage:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Er is iets misgegaan</h1>
                    <p className="text-slate-600 mb-6">We konden de kavels momenteel niet laden. Probeer het later opnieuw.</p>
                    <Link href="/" className="inline-block px-6 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
                        Terug naar Home
                    </Link>
                </div>
            </div>
        );
    }
}
