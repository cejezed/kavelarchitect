'use client';

import { useState } from 'react';
import { X, Check, ShieldCheck, Lock } from 'lucide-react';
import { Listing } from '@/lib/api';

export type ReportTier = 'check' | 'rapport' | 'premium';

interface PurchaseModalProps {
    listing: Listing;
    tier: ReportTier;
    onClose: () => void;
}

export function PurchaseModal({ listing, tier, onClose }: PurchaseModalProps) {
    const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const getTierDetails = (t: ReportTier) => {
        switch (t) {
            case 'check': return { price: 39, name: 'KavelCheck', oldPrice: 79 };
            case 'premium': return { price: 349, name: 'Premium Review', oldPrice: 499 };
            case 'rapport': default: return { price: 149, name: 'KavelRapport™', oldPrice: 249 };
        }
    };

    const details = getTierDetails(tier);

    const handlePayment = async () => {
        setStep('payment');

        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: listing.kavel_id,
                    price: details.price,
                    description: `${details.name}: ${listing.adres}`,
                    productName: details.name,
                    email,
                    name,
                    metadata: {
                        provincie: listing.provincie,
                        plaats: listing.plaats,
                        tier: tier
                    }
                })
            });

            const data = await res.json();

            if (data.success && data.checkoutUrl) {
                // Redirect user to Mollie/Stripe
                window.location.href = data.checkoutUrl;
            } else {
                alert('Er ging iets mis met het aanmaken van de betaling: ' + (data.error || 'Onbekende fout'));
                setStep('info');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Kan geen verbinding maken met de server.');
            setStep('info');
        }
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl max-w-lg w-full p-8 text-center shadow-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>

                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                        <Check size={40} />
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">Bedankt voor je bestelling!</h2>
                    <p className="text-slate-600 mb-6">
                        Je ontvangt het <strong>{details.name}</strong> voor {listing.adres} spoedig in je mailbox ({email}).
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-left">
                        <p className="font-bold text-navy-900 mb-1">Volgende stap:</p>
                        <p className="text-sm text-slate-600">
                            Onze architect bekijkt de kavelgegevens nog een laatste keer handmatig om zeker te zijn dat alle bestemmingsplanregels actueel zijn.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
                    >
                        Sluiten
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl max-w-2xl w-full flex overflow-hidden shadow-2xl max-h-[90vh]">

                {/* Left Side: Summary - Hidden on mobile */}
                <div className="hidden md:block w-1/3 bg-slate-50 p-8 border-r border-slate-200">
                    <div className="mb-6">
                        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Geselecteerd</span>
                        <h3 className="font-serif font-bold text-navy-900 text-lg mt-1">{details.name}</h3>
                        <p className="text-sm text-slate-500">{listing.adres}</p>
                        <p className="text-xs text-slate-400">{listing.plaats}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start">
                            <Check size={16} className="text-emerald-500 mt-0.5 mr-2 shrink-0" />
                            <p className="text-sm text-slate-600">Bouwregels & Mogelijkheden</p>
                        </div>
                        <div className="flex items-start">
                            <Check size={16} className="text-emerald-500 mt-0.5 mr-2 shrink-0" />
                            <p className="text-sm text-slate-600">Financiële Haalbaarheid</p>
                        </div>
                        {tier !== 'check' && (
                            <div className="flex items-start">
                                <Check size={16} className="text-emerald-500 mt-0.5 mr-2 shrink-0" />
                                <p className="text-sm text-slate-600">Architectenblik + Advies</p>
                            </div>
                        )}
                        {tier === 'premium' && (
                            <div className="flex items-start">
                                <Check size={16} className="text-emerald-500 mt-0.5 mr-2 shrink-0" />
                                <p className="text-sm text-slate-600">Persoonlijke Review & Call</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-500 text-sm">Waarde</span>
                            <span className="text-slate-400 line-through text-sm">€ {details.oldPrice},-</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-navy-900">Te betalen</span>
                            <span className="font-bold text-navy-900 text-xl">€ {details.price},-</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-serif font-bold text-navy-900 text-2xl">Jouw Gegevens</h2>
                        <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    {step === 'payment' ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 border-4 border-slate-200 border-t-navy-900 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-600 font-medium">Betaling verwerken...</p>
                            <p className="text-sm text-slate-400 mt-2">Je wordt doorgestuurd voor de betaling.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start">
                                <ShieldCheck className="text-blue-600 shrink-0 mr-3" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-blue-800">Veilig & Vertrouwd</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Data direct van het kadaster en bestemmingsplan, gecontroleerd door experts.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Naam</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                            placeholder="Voor- en achternaam"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">E-mailadres</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 outline-none transition-all"
                                            placeholder="naam@voorbeeld.nl"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Hier sturen we het document naartoe.</p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <p className="text-sm font-bold text-slate-700 mb-3">Betaalmethode</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" className="flex items-center justify-center p-3 border-2 border-slate-200 rounded-xl bg-slate-50 cursor-default">
                                            <span className="font-bold text-slate-500">Google Pay</span>
                                        </button>
                                        <button type="button" className="flex items-center justify-center p-3 border-2 border-slate-200 rounded-xl bg-slate-50 cursor-default">
                                            <span className="font-bold text-slate-500">PayPal / Card</span>
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 text-center">U kiest uw betaalmethode in het volgende scherm.</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-center md:hidden mb-4">
                                        <span className="text-slate-500">Totaal ({details.name})</span>
                                        <div>
                                            <span className="text-slate-400 line-through text-sm mr-2">€ {details.oldPrice}</span>
                                            <span className="font-bold text-navy-900 text-xl">€ {details.price}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-navy-900 text-white font-bold text-lg rounded-xl hover:bg-navy-800 transition-all shadow-lg flex items-center justify-center group"
                                    >
                                        <Lock size={18} className="mr-2 opacity-80" />
                                        Afrekenen € {details.price},-
                                    </button>
                                    <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center">
                                        <Lock size={12} className="mr-1" /> SSL Beveiligde transactie
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
