import Link from 'next/link';
import { CheckCircle, Mail, Phone, Clock, FileText, Search, Home, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Bedankt voor je aanmelding | KavelAlert',
  description: 'Je KavelAlert is geactiveerd. We houden je op de hoogte van nieuwe bouwkavels.',
  robots: 'noindex, nofollow'
};

export default function BedanktPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center mb-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Bedankt voor je aanmelding!
            </h1>

            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Je KavelAlert is succesvol geactiveerd. We houden je persoonlijk op de hoogte
              zodra er een nieuwe bouwkavel beschikbaar komt die past bij jouw wensen.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 text-left">
                  <strong>Check je inbox:</strong> Je ontvangt binnen enkele minuten een bevestigingsmail.
                  Kijk ook even in je spam/ongewenste mail folder.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/aanbod"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors"
              >
                Bekijk huidige kavels
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                Terug naar home
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <p className="text-slate-600">Vragen? Neem gerust contact op:</p>
            <a
              href="tel:+31612345678"
              className="inline-flex items-center gap-2 text-navy-900 font-semibold hover:text-blue-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              06 - 123 456 78
            </a>
          </div>

          {/* Steps Section */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-navy-900 text-center mb-8">
              Dit zijn de vervolgstappen
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">Bevestigingsmail</h3>
                    <p className="text-slate-600 text-sm">
                      Binnen enkele minuten ontvang je een bevestigingsmail met een overzicht
                      van je zoekprofiel en voorkeuren.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">Wij scannen dagelijks</h3>
                    <p className="text-slate-600 text-sm">
                      Ons systeem checkt dagelijks Funda en andere bronnen op nieuwe bouwkavels
                      die passen bij jouw wensen en budget.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">Match gevonden!</h3>
                    <p className="text-slate-600 text-sm">
                      Zodra we een kavel vinden die past bij jouw criteria, ontvang je direct
                      een e-mail met alle details en onze analyse.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">Persoonlijk advies</h3>
                    <p className="text-slate-600 text-sm">
                      Bij interesse in een kavel kun je direct een vrijblijvend adviesgesprek
                      inplannen met architect Jules Zwijsen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What you get Section */}
          <div className="bg-gradient-to-br from-navy-900 to-blue-900 rounded-2xl p-8 md:p-10 text-white mb-12">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">
              Wat krijg je bij elke match?
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200">Directe melding bij nieuwe kavels</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200">Analyse van bouwmogelijkheden</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200">Inschatting van het bestemmingsplan</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200">Indicatie maximale bouwhoogte</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200">Kaart met perceelgrenzen</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200">Vrijblijvend adviesgesprek mogelijk</span>
              </div>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="text-center">
            <h3 className="font-semibold text-navy-900 mb-3">Veelgestelde vragen</h3>
            <div className="space-y-4 max-w-2xl mx-auto text-left">
              <details className="bg-white rounded-xl border border-slate-200 p-4 group">
                <summary className="font-medium text-navy-900 cursor-pointer list-none flex justify-between items-center">
                  Hoe vaak checken jullie op nieuwe kavels?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm">
                  Ons systeem scant meerdere keren per dag Funda en andere bronnen op nieuwe bouwkavels.
                  Zodra er een match is, ontvang je direct bericht.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-slate-200 p-4 group">
                <summary className="font-medium text-navy-900 cursor-pointer list-none flex justify-between items-center">
                  Kan ik mijn voorkeuren later aanpassen?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm">
                  Ja, je kunt altijd je zoekvoorkeuren aanpassen door contact met ons op te nemen
                  of door je opnieuw aan te melden met hetzelfde e-mailadres.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-slate-200 p-4 group">
                <summary className="font-medium text-navy-900 cursor-pointer list-none flex justify-between items-center">
                  Zijn er kosten verbonden aan KavelAlert?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm">
                  Nee, KavelAlert is volledig gratis en vrijblijvend. Je kunt je op elk moment uitschrijven.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
