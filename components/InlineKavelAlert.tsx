'use client';

import { useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';

interface InlineKavelAlertProps {
    provincie?: string;
    plaats?: string;
    prijs?: number;
}

export function InlineKavelAlert({ provincie, plaats, prijs }: InlineKavelAlertProps) {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Call the KavelAlert API (reuse existing endpoint)
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    provincie: provincie || '',
                    plaats: plaats || '',
                    maxPrijs: prijs ? Math.round(prijs * 1.2) : undefined, // 20% above current price
                    source: 'sold_listing_inline'
                })
            });

            if (response.ok) {
                setIsSuccess(true);
                // Track with PostHog if available
                if (typeof window !== 'undefined' && (window as any).posthog) {
                    (window as any).posthog.capture('kavelalert_submitted_inline', {
                        provincie,
                        plaats,
                        source: 'sold_listing'
                    });
                }
            } else {
                alert('Er ging iets mis. Probeer het later opnieuw.');
            }
        } catch (error) {
            console.error('Error submitting KavelAlert:', error);
            alert('Er ging iets mis. Probeer het later opnieuw.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <CheckCircle className="text-emerald-600" size={32} />
                </div>
                <h4 className="font-bold text-emerald-900 mb-2">Alert Geactiveerd! 🎉</h4>
                <p className="text-sm text-emerald-700">
                    Je ontvangt een email zodra er een vergelijkbare kavel beschikbaar komt in {provincie || 'jouw regio'}.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-3">
                    <Bell className="text-white" size={24} />
                </div>
                <h4 className="font-bold text-navy-900 mb-1">Mis de Volgende Niet!</h4>
                <p className="text-sm text-slate-600">
                    Ontvang direct een melding voor kavels zoals deze in <strong>{provincie || 'jouw regio'}</strong>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    placeholder="jouw@email.nl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Activeren...
                        </>
                    ) : (
                        <>
                            <Bell size={16} />
                            Activeer Gratis Alert
                        </>
                    )}
                </button>

                <p className="text-xs text-slate-500 text-center">
                    ✓ Geen spam · ✓ Direct uitschrijven · ✓ 100% gratis
                </p>
            </form>
        </div>
    );
}
