import Link from 'next/link';
import { CheckCircle, Mail, Phone, FileText, ArrowRight, MessageSquare, FileCheck, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Bedankt voor uw aanvraag | KavelRapport',
  description: 'Uw aanvraag is ontvangen. U ontvangt binnen enkele minuten een offerte per e-mail.',
  robots: 'noindex, nofollow'
};

export default function KavelRapportBedanktPage() {
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
              Bedankt voor uw aanvraag!
            </h1>

            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              We hebben uw aanvraag ontvangen en stellen een passende offerte voor u op.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800 text-left">
                  <strong>U ontvangt binnen 5-10 minuten</strong> een offerte per e-mail met alle informatie over uw aanvraag.
                  Controleer ook uw spam/ongewenste mail folder.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/aanbod"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors"
              >
                Bekijk kavels
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kavelrapport"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Terug naar KavelRapport
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <p className="text-slate-600">Vragen of extra informatie delen?</p>
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

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">1. Offerte per e-mail</h3>
                    <p className="text-slate-600 text-sm">
                      Binnen enkele minuten ontvangt u een offerte per e-mail. Hierin vindt u de prijs,
                      levertijd en wat er precies in het rapport komt te staan. Heeft u aanvullende
                      documenten of tekeningen? Dan kunt u deze per mail met ons delen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">2. Eventueel telefonisch contact</h3>
                    <p className="text-slate-600 text-sm">
                      Hebben wij aan de hand van uw aanvraag nog vragen? Dan nemen wij telefonisch
                      contact met u op om uw situatie en wensen te bespreken. Zo kunnen we een
                      passende offerte maken.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">3. Opdracht geven</h3>
                    <p className="text-slate-600 text-sm">
                      Akkoord met de offerte? Dan kunt u eenvoudig opdracht geven door de offerte
                      te ondertekenen en te betalen. Wilt u eerst nog iets bespreken? In de offerte
                      vindt u ook de mogelijkheid om een belafspraak in te plannen.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">4. Rapport & advies</h3>
                    <p className="text-slate-600 text-sm">
                      Na opdracht gaan wij aan de slag. Binnen 3-5 werkdagen ontvangt u het rapport
                      per e-mail als PDF. Wilt u daarna een adviesgesprek met architect Jules Zwijsen?
                      Dat kan! In het rapport vindt u de mogelijkheid om een gesprek in te plannen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="text-center">
            <h3 className="font-semibold text-navy-900 mb-3">Veelgestelde vragen</h3>
            <div className="space-y-4 max-w-2xl mx-auto text-left">
              <details className="bg-white rounded-xl border border-slate-200 p-4 group">
                <summary className="font-medium text-navy-900 cursor-pointer list-none flex justify-between items-center">
                  Wat kost een KavelRapport?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm">
                  De prijs hangt af van de complexiteit van uw situatie. In de offerte die u ontvangt
                  staat de exacte prijs vermeld. We werken met vaste prijzen, dus geen verrassingen achteraf.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-slate-200 p-4 group">
                <summary className="font-medium text-navy-900 cursor-pointer list-none flex justify-between items-center">
                  Hoe snel ontvang ik het rapport na opdracht?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm">
                  Na opdracht en betaling leveren wij het rapport binnen 3-5 werkdagen op.
                  Bij spoed is snellere levering mogelijk - geef dit aan in uw aanvraag of neem contact op.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-slate-200 p-4 group">
                <summary className="font-medium text-navy-900 cursor-pointer list-none flex justify-between items-center">
                  Kan ik extra documenten aanleveren?
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm">
                  Ja, dat kan! Heeft u tekeningen, een verkoopbrochure of andere relevante documenten?
                  Stuur deze per e-mail naar ons en wij nemen ze mee in de analyse.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
