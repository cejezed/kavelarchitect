'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { AnalysisType, Goal, KavelrapportIntakeRequest, Stage, TimeHorizon } from '@/types/kavelrapport';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(payload: KavelrapportIntakeRequest): string | null {
  const {
    analysisType,
    address,
    link,
    stage,
    timeHorizon,
    email,
    notes,
    goal,
  } = payload;

  if (!analysisType || !['plot', 'existing_property'].includes(analysisType)) return 'Kies wat u wilt laten analyseren.';
  if (!address.trim()) return 'Adres is verplicht.';
  if (analysisType === 'plot' && !link.trim()) return 'Link is verplicht.';
  if (!['orientation', 'considering_offer', 'offer_made'].includes(stage)) return 'Kies een fase.';
  if (!['0_6', '6_12', '12_plus'].includes(timeHorizon)) return 'Kies een horizon.';
  if (!email.trim() || !emailRegex.test(email)) return 'Vul een geldig e-mailadres in.';
  if (notes && notes.length > 500) return 'Opmerkingen mogen maximaal 500 tekens zijn.';
  if (analysisType === 'existing_property' && goal && !['renovate', 'rebuild', 'unsure'].includes(goal)) return 'Ongeldige keuze bij doel.';
  return null;
}

export default function IntakeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAnalysis = (searchParams?.get('analysisType') as AnalysisType) || 'plot';
  const initialTier = searchParams?.get('tier') || '';

  const [analysisType, setAnalysisType] = useState<AnalysisType>(initialAnalysis);
  const [stage, setStage] = useState<Stage>('orientation');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('0_6');
  const [address, setAddress] = useState('');
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [goal, setGoal] = useState<Goal | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState(initialTier);

  useEffect(() => {
    if (initialAnalysis) {
      setAnalysisType(initialAnalysis);
    }
    if (initialTier) {
      setSelectedTier(initialTier);
    }
  }, [initialAnalysis, initialTier]);

  const remaining = 500 - notes.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload: KavelrapportIntakeRequest = {
      analysisType,
      address: address.trim(),
      link: link.trim(),
      stage,
      timeHorizon,
      email: email.trim(),
      notes: notes.trim() || undefined,
      goal: analysisType === 'existing_property' && goal ? goal : undefined,
    };

    const validationError = validate(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/kavelrapport/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Er ging iets mis. Probeer het opnieuw.');
      }
      // Redirect naar bedankpagina
      router.push('/kavelrapport/intake/bedankt');
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 text-sm text-slate-600">
          <Link href="/kavelrapport" className="inline-flex items-center gap-2 text-navy-900 font-semibold">
            <ArrowLeft size={16} /> Terug naar KavelRapport
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 md:p-12">
          <div className="md:flex md:items-center md:justify-between gap-6 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Intake</p>
              <h1 className="font-serif text-3xl font-bold text-navy-900">Analyse voor uw kavel of woning</h1>
              <p className="text-slate-600 mt-2 text-sm">
                Bureaustudie / planologische analyse voor aankoopbeslissing. Geen bouwkundige keuring, geen ontwerp, geen vergunninggarantie.
              </p>
              {selectedTier && (
                <p className="mt-2 text-sm font-semibold text-navy-900">Gekozen pakket: {selectedTier}</p>
              )}
            </div>
            <Link
              href="/aanbod"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-navy-900 font-semibold border border-slate-200 hover:bg-slate-200"
            >
              Kavels uit ons aanbod <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mb-8 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-900">
              U ontvangt binnen 48 uur een volledig KavelRapport per e-mail (op werkdagen).
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Stap 1</p>
                <h3 className="font-bold text-navy-900 mb-3">Wat wilt u laten analyseren?</h3>
                <div className="space-y-3">
                  {[
                    { value: 'plot' as AnalysisType, label: 'Bouwkavel (onbebouwd)' },
                    { value: 'existing_property' as AnalysisType, label: 'Bestaande woning – verbouwen / slopen & nieuwbouw' },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${analysisType === opt.value ? 'border-navy-900 bg-slate-50' : 'border-slate-200'}`}>
                      <input
                        type="radio"
                        name="analysisType"
                        value={opt.value}
                        checked={analysisType === opt.value}
                        onChange={() => setAnalysisType(opt.value)}
                        className="mt-1"
                        required
                      />
                      <span className="text-sm text-slate-800">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Stap 2</p>
                <h3 className="font-bold text-navy-900 mb-3">Basisgegevens</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Adres</label>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-navy-900"
                      placeholder="Straat, plaats"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Link naar advertentie / dossier</label>
                    <input
                      required={analysisType === 'plot'}
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-navy-900"
                      placeholder="URL"
                      type="url"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1">Fase</label>
                      <select
                        required
                        value={stage}
                        onChange={(e) => setStage(e.target.value as Stage)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-navy-900"
                      >
                        <option value="orientation">Orientatie</option>
                        <option value="considering_offer">Overweegt een bod</option>
                        <option value="offer_made">Bod uitgebracht</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1">Tijdshorizon</label>
                      <select
                        required
                        value={timeHorizon}
                        onChange={(e) => setTimeHorizon(e.target.value as TimeHorizon)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-navy-900"
                      >
                        <option value="0_6">0-6 maanden</option>
                        <option value="6_12">6-12 maanden</option>
                        <option value="12_plus">12+ maanden</option>
                      </select>
                    </div>
                  </div>
                  {analysisType === 'existing_property' && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1">Doel (aanbevolen)</label>
                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value as Goal)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-navy-900"
                      >
                        <option value="">Kies een optie</option>
                        <option value="renovate">Ingrijpende verbouwing</option>
                        <option value="rebuild">Sloop en nieuwbouw</option>
                        <option value="unsure">Nog niet zeker</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">E-mailadres</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-navy-900"
                      placeholder="naam@voorbeeld.nl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Opmerkingen (optioneel)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-navy-900"
                      rows={4}
                      placeholder="Bijvoorbeeld: bijzonderheden, deadlines, specifieke vragen."
                    />
                    <div className="text-right text-xs text-slate-400 mt-1">{remaining} tekens over</div>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-slate-500 text-sm">
                Dit is een bureaustudie en planologische analyse. Geen bouwkundige keuring en geen vergunninggarantie.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-navy-900 text-white font-semibold hover:bg-navy-800 disabled:opacity-60"
              >
                {loading ? 'Versturen...' : 'Ontvang voorstel voor KavelRapport™'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
