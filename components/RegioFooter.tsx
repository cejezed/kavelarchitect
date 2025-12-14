'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';

// Top wealthy municipalities in Netherlands (Gooi & Vechtstreek, Zuid-Kennemerland, etc.)
const FEATURED_CITIES = [
  // Gooi & Vechtstreek
  { name: 'Blaricum', slug: 'blaricum', provincie: 'Noord-Holland' },
  { name: 'Laren', slug: 'laren', provincie: 'Noord-Holland' },
  { name: 'Hilversum', slug: 'hilversum', provincie: 'Noord-Holland' },
  { name: 'Huizen', slug: 'huizen', provincie: 'Noord-Holland' },
  { name: 'Naarden', slug: 'naarden', provincie: 'Noord-Holland' },

  // Zuid-Kennemerland & Bollenstreek
  { name: 'Bloemendaal', slug: 'bloemendaal', provincie: 'Noord-Holland' },
  { name: 'Heemstede', slug: 'heemstede', provincie: 'Noord-Holland' },
  { name: 'Haarlem', slug: 'haarlem', provincie: 'Noord-Holland' },
  { name: 'Wassenaar', slug: 'wassenaar', provincie: 'Zuid-Holland' },
  { name: 'Noordwijk', slug: 'noordwijk', provincie: 'Zuid-Holland' },

  // Den Haag regio
  { name: 'Voorschoten', slug: 'voorschoten', provincie: 'Zuid-Holland' },
  { name: 'Leidschendam', slug: 'leidschendam', provincie: 'Zuid-Holland' },
  { name: 'Zoetermeer', slug: 'zoetermeer', provincie: 'Zuid-Holland' },

  // Utrecht regio
  { name: 'Bunnik', slug: 'bunnik', provincie: 'Utrecht' },
  { name: 'De Bilt', slug: 'de-bilt', provincie: 'Utrecht' },
  { name: 'Zeist', slug: 'zeist', provincie: 'Utrecht' },

  // Noord-Brabant
  { name: 'Oisterwijk', slug: 'oisterwijk', provincie: 'Noord-Brabant' },
  { name: 'Eersel', slug: 'eersel', provincie: 'Noord-Brabant' },
];

export default function RegioFooter() {
  // Group cities by provincie
  const citiesByProvince = FEATURED_CITIES.reduce((acc, city) => {
    if (!acc[city.provincie]) {
      acc[city.provincie] = [];
    }
    acc[city.provincie].push(city);
    return acc;
  }, {} as Record<string, typeof FEATURED_CITIES>);

  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Regio Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={24} className="text-blue-400" />
            <h3 className="font-serif text-2xl font-bold">Bouwkavel kopen per regio</h3>
          </div>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Bekijk het actuele aanbod van bouwkavels per gemeente. Ook voor exclusieve off-market kavels
            die niet op Funda staan.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(citiesByProvince).map(([provincie, cities]) => (
              <div key={provincie}>
                <h4 className="font-bold text-blue-400 mb-3 text-sm uppercase tracking-wider">
                  {provincie}
                </h4>
                <ul className="space-y-2">
                  {cities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/regio/${city.slug}`}
                        className="text-slate-300 hover:text-white text-sm transition-colors inline-block"
                      >
                        Bouwkavel {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">KavelArchitect</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Vind sneller uw ideale bouwkavel met expert begeleiding van Architectenbureau Jules Zwijsen.
              Exclusieve toegang tot off-market kavels.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Navigatie</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/aanbod" className="text-slate-400 hover:text-white transition-colors">
                  Kavelaanbod
                </Link>
              </li>
              <li>
                <Link href="/kavelrapport" className="text-slate-400 hover:text-white transition-colors">
                  KavelRapport
                </Link>
              </li>
              <li>
                <Link href="/kennisbank" className="text-slate-400 hover:text-white transition-colors">
                  Kennisbank
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-slate-400 hover:text-white transition-colors">
                  Over Ons
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-slate-400 text-sm">
              Architectenbureau Jules Zwijsen
              <br />
              <a href="mailto:info@kavelarchitect.nl" className="hover:text-white transition-colors">
                info@kavelarchitect.nl
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-800">
          © {new Date().getFullYear()} KavelArchitect - Powered by Architectenbureau Jules Zwijsen
        </div>
      </div>
    </footer>
  );
}
