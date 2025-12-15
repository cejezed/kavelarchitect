
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { AanbodFilter } from '../../components/AanbodFilter';
import { FloatingAlertButton } from '../../components/FloatingAlertButton';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Listing } from '@/lib/api';

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
    // Fetch directly from Supabase in server component - show available and sold listings
    const { data } = await supabaseAdmin
        .from('listings')
        .select('*')
        .in('status', ['published', 'sold']) // Show both available and sold listings
        .order('created_at', { ascending: false });

    const listings: Listing[] = data || [];

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-20 md:pt-24">
                <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
                    <h1 className="font-serif text-2xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-4">Beschikbare Grond</h1>
                    <p className="text-slate-600 text-sm md:text-base mb-4 md:mb-6">Dagelijks geactualiseerd aanbod.</p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 md:px-6 py-2 md:py-3 text-sm text-emerald-900">
                            <strong>{listings.filter(l => l.status === 'published').length}</strong> kavels beschikbaar
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 md:px-6 py-2 md:py-3 text-sm text-red-900">
                            <strong>{listings.filter(l => l.status === 'sold').length}</strong> verkocht
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

                <AanbodFilter initialListings={listings} />
            </main>

            <FloatingAlertButton />
        </div>
    );
}
