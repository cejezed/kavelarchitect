
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X, Check, MapPin, Award } from 'lucide-react';
import { registerCustomer } from '@/lib/api';
import posthog from 'posthog-js';

type Step = 'intro' | 'location' | 'ambition' | 'intention' | 'lead' | 'success';

export default function KavelAlertForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('location');
  const [formData, setFormData] = useState({
    provincies: '',
    min_oppervlakte: '',
    bouwbudget: '',
    type_wens: '', 
    tijdslijn: '',
    kavel_type: '',
    email: '',
    telefoonnummer: '',
    opmerkingen: '',
    early_access_rapport: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Track initial view
  useEffect(() => {
    posthog.capture('kavelalert_view_modal');
  }, []);

  const handleNext = () => {
    // Analytics tracking per step
    posthog.capture('kavelalert_step_complete', { 
        completed_step: step,
        provincie: formData.provincies // Interessant voor analytics
    });

    if (step === 'location') setStep('ambition');
    else if (step === 'ambition') setStep('intention');
    else if (step === 'intention') setStep('lead');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
        const [registerResult, contactResult] = await Promise.all([
            registerCustomer({
                email: formData.email,
                provincies: formData.provincies.split(',').map(s => s.trim()).filter(Boolean),
                min_oppervlakte: Number(formData.min_oppervlakte),
                bouwbudget: formData.bouwbudget,
                bouwstijl: formData.type_wens,
                tijdslijn: formData.tijdslijn,
                kavel_type: formData.kavel_type,
                telefoonnummer: formData.telefoonnummer,
                opmerkingen: formData.opmerkingen,
                early_access_rapport: formData.early_access_rapport
            }),
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formType: 'kavelalert',
                    email: formData.email,
                    telefoonnummer: formData.telefoonnummer,
                    provincies: formData.provincies.split(',').map(s => s.trim()).filter(Boolean),
                    min_oppervlakte: Number(formData.min_oppervlakte),
                    bouwbudget: formData.bouwbudget,
                    type_wens: formData.type_wens,
                    tijdslijn: formData.tijdslijn,
                    kavel_type: formData.kavel_type,
                    opmerkingen: formData.opmerkingen,
                    early_access_rapport: formData.early_access_rapport,
                    honeypot: ''
                })
            })
        ]);

        const contactOk = contactResult.ok;
        if (!contactOk) {
            const contactBody = await contactResult.json().catch(() => ({}));
            console.warn('CF7 contact failed', contactBody);
        }

        if (registerResult.success) {
            posthog.capture('kavelalert_submission_success');
            if (!contactOk) {
                posthog.capture('kavelalert_contact_error');
            }
            setStep('success');
        } else {
            posthog.capture('kavelalert_submission_error', { error: registerResult.message });
            setError(registerResult.message || 'Er ging iets mis.');
        }
    } catch (err) {
        setError('Kon niet verbinden met the server.');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (step === 'success') {
      return (
        <div className="max-w-xl w-full bg-white shadow-2xl rounded-3xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Alert Geactiveerd!</h2>
            <p className="text-slate-600 mb-8">
                U ontvangt een e-mail zodra we een match hebben.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-left mb-8">
                 <div className="flex items-start">
                      <div className="p-2 bg-navy-900 text-white rounded-lg mr-4 mt-1">
                        <Award size={20} />
                      </div>
                      <div>
                          <h4 className="font-bold text-navy-900 text-lg">Coming Soon: KavelRapport™</h4>
                          <p className="text-sm text-slate-600 mt-1">
                              U staat op de lijst voor 50% korting bij lancering (Q2 2025).
                          </p>
                          <Link
                            href="/kavelrapport"
                            onClick={() => posthog?.capture?.('kavelrapport_link_success_click')}
                            className="text-sm text-blue-700 font-semibold inline-flex items-center gap-1 mt-3 underline underline-offset-4"
                          >
                            Lees meer over alle rapporten
                            <ArrowRight size={16} />
                          </Link>
                      </div>
                 </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 font-medium text-xs uppercase tracking-widest">
                Sluiten
            </button>
        </div>
      );
  }

  return (
    <div className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">KavelAlert™</span>
                <span className="text-sm font-medium text-slate-900">Stap {['location','ambition','intention','lead'].indexOf(step) + 1} van 4</span>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100">
                <X size={24} />
            </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
            <div className="h-full bg-navy-900 transition-all duration-500 ease-out" style={{ width: `${((['location','ambition','intention','lead'].indexOf(step) + 1) / 4) * 100}%` }}></div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <form onSubmit={handleSubmit}>
                {step === 'location' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-navy-900">Locatie & Ruimte</h2>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Regio(s)</label>
                            <div className="relative">
                                <MapPin className="absolute top-3.5 left-4 text-slate-400" size={20} />
                                <input autoFocus type="text" className="w-full text-lg pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-navy-900 outline-none" placeholder="Bijv. 't Gooi, Wassenaar..." value={formData.provincies} onChange={e => setFormData({...formData, provincies: e.target.value})} />
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Min. Oppervlakte (m²)</label>
                             <input type="number" className="w-full text-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-navy-900 outline-none" placeholder="800" value={formData.min_oppervlakte} onChange={e => setFormData({...formData, min_oppervlakte: e.target.value})} />
                        </div>
                    </div>
                )}

                {step === 'ambition' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-navy-900">Uw Ambities</h2>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Budget voor Kavel</label>
                            <select className="w-full text-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg" value={formData.bouwbudget} onChange={e => setFormData({...formData, bouwbudget: e.target.value})}>
                                <option value="">Maak een keuze...</option>
                                <option value="<500k">Tot € 500.000</option>
                                <option value="500k-1m">€ 500k - € 1m</option>
                                <option value="1m-2m">€ 1m - € 2m</option>
                                <option value="2m+">€ 2m+</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Woningtype</label>
                             <div className="grid grid-cols-2 gap-3">
                                {['Modern', 'Klassiek', 'Landelijk', 'Vrij'].map(type => (
                                    <button type="button" key={type} onClick={() => setFormData({...formData, type_wens: type})} className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.type_wens === type ? 'bg-navy-900 text-white border-navy-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                                        {type}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {step === 'intention' && (
                     <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-navy-900">Tijdslijn</h2>
                         <div className="space-y-3">
                            {['0-6 maanden', '6-12 maanden', '> 12 maanden'].map(opt => (
                                <label key={opt} className={`flex items-center p-4 rounded-lg border cursor-pointer ${formData.tijdslijn === opt ? 'border-navy-900 bg-slate-50' : 'border-slate-200'}`}>
                                    <input type="radio" name="tijdslijn" className="accent-navy-900 w-5 h-5" checked={formData.tijdslijn === opt} onChange={() => setFormData({...formData, tijdslijn: opt})} />
                                    <span className="ml-3 text-slate-700 font-medium">{opt}</span>
                                </label>
                            ))}
                        </div>
                     </div>
                )}

                {step === 'lead' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-navy-900">Contactgegevens</h2>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">E-mailadres</label>
                            <input required type="email" className="w-full text-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-navy-900 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Telefoon (Optioneel)</label>
                            <input type="tel" className="w-full text-lg px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-navy-900 outline-none" value={formData.telefoonnummer} onChange={e => setFormData({...formData, telefoonnummer: e.target.value})} />
                        </div>
                        {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
                    </div>
                )}
            </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
            {step === 'lead' ? (
                <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-navy-900 text-white font-bold text-lg rounded-xl hover:bg-navy-800 transition-all shadow-lg disabled:opacity-70">
                    {isSubmitting ? 'Even geduld...' : 'Ontvang Mijn KavelAlert'}
                </button>
            ) : (
                <button onClick={handleNext} disabled={step === 'location' && !formData.provincies} className="w-full py-4 bg-navy-900 text-white font-bold text-lg rounded-xl hover:bg-navy-800 transition-all shadow-lg flex items-center justify-center disabled:opacity-50">
                    Volgende Stap <ArrowRight className="ml-2" />
                </button>
            )}
            <div className="mt-3 text-center text-xs text-slate-500">
                <Link
                  href="/kavelrapport"
                  onClick={() => posthog?.capture?.('kavelrapport_link_footer_click')}
                  className="underline underline-offset-4 hover:text-navy-900"
                >
                  Liever eerst zien wat in het KavelRapport staat?
                </Link>
            </div>
        </div>
    </div>
  );
}
