
import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';
import { AanbodFilter } from '../../components/AanbodFilter';
import { FloatingAlertButton } from '../../components/FloatingAlertButton';
import { getListings } from '@/lib/api';

export const metadata = {
    title: 'Kavelaanbod | KavelArchitect',
    description: 'Actueel overzicht van bouwkavels in Nederland.',
};

export default async function AanbodPage() {
    const listings = await getListings();

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 p-4">
                <div className="max-w-7xl mx-auto flex items-center">
                    <Link href="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-navy-900">
                        <ArrowLeft size={18} className="mr-2" /> Terug naar Home
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 pt-24">
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <h1 className="font-serif text-4xl font-bold text-slate-900 mb-4">Beschikbare Grond</h1>
                    <p className="text-slate-600 mb-6">Dagelijks geactualiseerd aanbod.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 text-sm text-blue-900">
                            <strong>{listings.length}</strong> kavels beschikbaar
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
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
