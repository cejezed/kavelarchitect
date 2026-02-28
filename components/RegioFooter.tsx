import Link from 'next/link';

export default function RegioFooter() {
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h3 className="font-serif text-2xl font-bold mb-4">Regio's ontdekken</h3>
          <p className="text-slate-400 mb-6 max-w-2xl">
            Bekijk het actuele aanbod van bouwgrond en kavels per gemeente, inclusief exclusieve off-market kavels.
          </p>
          <p className="text-slate-500 text-sm mb-6 max-w-2xl">
            Hier vindt u per gemeente actuele bouwkavels, inclusief off-market bouwkavels voor particuliere zelfbouwers.
          </p>
          <Link
            href="/regio"
            className="inline-flex items-center text-sm font-bold text-white border-b border-white/60 hover:border-white"
          >
            Bekijk alle regio's
          </Link>
        </div>

        <div className="border-t border-slate-700 my-8"></div>

        <div className="grid md:grid-cols-6 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">KavelArchitect</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Vind sneller uw ideale bouwgrond of kavel met expert begeleiding van Architectenbureau Jules Zwijsen.
              Exclusieve toegang tot off-market kavels.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Navigatie</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/aanbod" className="text-slate-400 hover:text-white transition-colors">
                  Kavels
                </Link>
              </li>
              <li>
                <Link href="/diensten" className="text-slate-400 hover:text-white transition-colors">
                  Diensten
                </Link>
              </li>

              <li>
                <Link href="/gids" className="text-slate-400 hover:text-white transition-colors">
                  Gidsen
                </Link>
              </li>
              <li>
                <Link href="/nieuws" className="text-slate-400 hover:text-white transition-colors">
                  Nieuws
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-slate-400 hover:text-white transition-colors">
                  Over Ons
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-bold mb-4">Populaire Regio's & Steden</h4>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li><Link href="/regio/noord-holland" className="text-slate-400 hover:text-white transition-colors">Kavel Noord-Holland</Link></li>
                <li><Link href="/regio/zuid-holland" className="text-slate-400 hover:text-white transition-colors">Kavel Zuid-Holland</Link></li>
                <li><Link href="/regio/utrecht" className="text-slate-400 hover:text-white transition-colors">Kavel Utrecht</Link></li>
                <li><Link href="/regio/gelderland" className="text-slate-400 hover:text-white transition-colors">Kavel Gelderland</Link></li>
                <li><Link href="/regio/noord-brabant" className="text-slate-400 hover:text-white transition-colors">Kavel Noord-Brabant</Link></li>
                <li><Link href="/regio/overijssel" className="text-slate-400 hover:text-white transition-colors">Kavel Overijssel</Link></li>
                <li><Link href="/regio/limburg" className="text-slate-400 hover:text-white transition-colors">Kavel Limburg</Link></li>
                <li><Link href="/regio/flevoland" className="text-slate-400 hover:text-white transition-colors">Kavel Flevoland</Link></li>
                <li><Link href="/regio/zeeland" className="text-slate-400 hover:text-white transition-colors">Kavel Zeeland</Link></li>
                <li><Link href="/regio/friesland" className="text-slate-400 hover:text-white transition-colors">Kavel Friesland</Link></li>
                <li><Link href="/regio/groningen" className="text-slate-400 hover:text-white transition-colors">Kavel Groningen</Link></li>
                <li><Link href="/regio/drenthe" className="text-slate-400 hover:text-white transition-colors">Kavel Drenthe</Link></li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li><Link href="/regio/amsterdam" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Amsterdam</Link></li>
                <li><Link href="/regio/rotterdam" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Rotterdam</Link></li>
                <li><Link href="/regio/den-haag" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Den Haag</Link></li>
                <li><Link href="/regio/breda" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Breda</Link></li>
                <li><Link href="/regio/eindhoven" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Eindhoven</Link></li>
                <li><Link href="/regio/tilburg" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Tilburg</Link></li>
                <li><Link href="/regio/almere" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Almere</Link></li>
                <li><Link href="/regio/apeldoorn" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Apeldoorn</Link></li>
                <li><Link href="/regio/nijmegen" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Nijmegen</Link></li>
                <li><Link href="/regio/enschede" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Enschede</Link></li>
                <li><Link href="/regio/haarlem" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Haarlem</Link></li>
                <li><Link href="/regio/arnhem" className="text-slate-400 hover:text-white transition-colors">Bouwkavel Arnhem</Link></li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Pijlergidsen</h4>
            <p className="text-slate-500 text-xs mb-3">
              Dit zijn onze drie pijlergidsen voor iedereen die een bouwkavel wil kopen of een nieuwbouwproject start.
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gids/kavel-kopen" className="text-slate-400 hover:text-white transition-colors">
                  Kavel kopen (2026)
                </Link>
              </li>
              <li>
                <Link href="/gids/wat-mag-ik-bouwen" className="text-slate-400 hover:text-white transition-colors">
                  Wat mag ik bouwen?
                </Link>
              </li>
              <li>
                <Link href="/gids/faalkosten-voorkomen" className="text-slate-400 hover:text-white transition-colors">
                  Faalkosten voorkomen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-slate-400 text-sm">
              Architectenbureau Jules Zwijsen
              <br />
              Loenen, Nederland
              <br />
              Werkzaam in heel Nederland
              <br />
              <a href="mailto:info@kavelarchitect.nl" className="hover:text-white transition-colors">
                info@kavelarchitect.nl
              </a>
            </p>
            <p className="text-slate-500 text-xs mt-3">
              Gespecialiseerd in bouwgrond, kavels, villabouw en planologische haalbaarheid in Nederland.
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Deze gidsen zijn onderdeel van onze kennisbank voor zelfbouwers en villabouwers in Nederland.
            </p>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
          © {new Date().getFullYear()} KavelArchitect - Powered by Architectenbureau Jules Zwijsen
        </div>
      </div>
    </footer>
  );
}
