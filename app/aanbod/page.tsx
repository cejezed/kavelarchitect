
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { AanbodFilter } from '../../components/AanbodFilter';
import { FloatingAlertButton } from '../../components/FloatingAlertButton';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Listing } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
    title: 'Kavelaanbod | KavelArchitect - Bouwkavels in heel Nederland',
    description: 'Actueel kavelaanbod in heel Nederland. Dagelijks geactualiseerde bouwkavels, inclusief off-market kavels, met begeleiding door architect Jules Zwijsen.',
    keywords: ['bouwkavels', 'kavelaanbod', 'zelfbouw', 'bouwgrond te koop', 'Nederland', 'architect', 'nieuwbouw', 'kavels', 'grond kopen'],
    alternates: {
        canonical: 'https://kavelarchitect.nl/aanbod',
    },
    openGraph: {
        title: 'Kavelaanbod | KavelArchitect',
        description: 'Actueel kavelaanbod in heel Nederland, inclusief off-market bouwkavels met architectenbegeleiding.',
        url: 'https://kavelarchitect.nl/aanbod',
        siteName: 'KavelArchitect',
        locale: 'nl_NL',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kavelaanbod | KavelArchitect',
        description: 'Actueel kavelaanbod in heel Nederland, inclusief off-market bouwkavels.',
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
    // Fetch directly from Supabase in server component - show available and sold listings
    const { data } = await supabaseAdmin
        .from('listings')
        .select('*')
        .in('status', ['published', 'sold']) // Show both available and sold listings
        .order('created_at', { ascending: false });

    const listings: Listing[] = data || [];

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
                    <p className="text-slate-600 text-sm md:text-base mb-4 leading-relaxed">
                        Bekijk bouwkavels te koop in Nederland in een dagelijks geactualiseerd kavelaanbod voor zelfbouw en villabouw.
                        Liever per gemeente zoeken? <Link href="/regio" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-blue-600">Bekijk alle regio&apos;s</Link>.
                    </p>
                    <h1 className="font-serif text-2xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-4">Beschikbare bouwkavels</h1>
                    <p className="text-slate-600 text-sm md:text-base mb-4 md:mb-6">Dagelijks geactualiseerd aanbod in heel Nederland.</p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 md:px-6 py-2 md:py-3 text-sm text-emerald-900">
                            <strong>{listings.filter(l => l.status === 'published').length}</strong> kavels beschikbaar
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 md:px-6 py-2 md:py-3 text-sm text-red-900">
                            <strong>{listings.filter(l => l.status === 'sold').length}</strong> verkocht
                        </div>
                        <Link
                            href="/"
                            aria-label="Ontvang nieuwe bouwkavels in uw mail met KavelAlert"
                            title="Activeer KavelAlert"
                            className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-navy-900 text-white font-bold text-sm md:text-base rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
                        >
                            <Bell size={18} className="mr-2" />
                            Activeer KavelAlert
                        </Link>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 mt-4">
                        Ons aanbod wordt dagelijks vernieuwd op basis van het volledige markt-aanbod plus exclusieve off-market kavels.
                    </p>
                </div>

                <section className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 mb-6">
                    <h2 className="font-bold text-navy-900 mb-2">Nieuw met bouwkavels?</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Lees eerst:
                        <Link href="/gids" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-blue-600 ml-1">Kavel kopen (2026)</Link>,
                        <Link href="/gids" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-blue-600 ml-1">Wat mag ik bouwen?</Link> en
                        <Link href="/gids" className="font-semibold text-navy-900 underline underline-offset-4 hover:text-blue-600 ml-1">Faalkosten voorkomen</Link>.
                    </p>
                </section>

                <AanbodFilter initialListings={listings} />
            </main>

            <FloatingAlertButton />
        </div>
    );
}
