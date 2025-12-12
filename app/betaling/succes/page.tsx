'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const listingId = searchParams.get('listingId');

    useEffect(() => {
        // Fire confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 md:p-12 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <CheckCircle size={48} />
                </div>

                <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">Gefeliciteerd!</h1>
                <p className="text-lg text-slate-600 mb-8">
                    Uw betaling is geslaagd. U heeft zojuist een slimme investering gedaan in zekerheid.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-left mb-8">
                    <h3 className="font-bold text-navy-900 text-lg mb-2 flex items-center">
                        <Download className="mr-2 text-blue-600" size={20} />
                        Wat gebeurt er nu?
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 mr-2"></div>
                            U krijgt binnen 5 minuten een e-mail met de factuur.
                        </li>
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 mr-2"></div>
                            Onze architect valideert de laatste bestemmingsplan-details.
                        </li>
                        <li className="flex items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 mr-2"></div>
                            <strong>Binnen 24 uur</strong> ontvangt u het definitieve KavelRapport™ in uw mailbox.
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    {listingId && (
                        <Link
                            href={`/aanbod/${listingId}`}
                            className="bg-navy-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-navy-800 transition-colors shadow-lg flex items-center justify-center"
                        >
                            Terug naar de kavel <ArrowRight className="ml-2" size={18} />
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="font-medium text-slate-500 hover:text-slate-800 py-2"
                    >
                        Naar Homepagina
                    </Link>
                </div>
            </div>
        </div>
    );
}
