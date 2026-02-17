'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { City } from '@/lib/regions';

interface NavBarClientProps {
  citiesByProvince: Record<string, City[]>;
  topCities: City[];
}

export default function NavBarClient({ citiesByProvince, topCities }: NavBarClientProps) {
  const [open, setOpen] = useState(false);

  const provinceEntries = useMemo(() => {
    return Object.entries(citiesByProvince).sort(([a], [b]) => a.localeCompare(b, 'nl'));
  }, [citiesByProvince]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="h-14 mt-4 flex items-center justify-between">
          <Link href="/" className="rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-sm px-3 py-1.5">
            <Image
              src="/images/kavelarchitect.webp"
              alt="KavelArchitect"
              width={140}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <div className="p-2 rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-sm">
            <button
              className="p-2 rounded-full text-slate-700"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed top-16 right-4 sm:right-6 z-40 w-[320px] md:w-[560px] max-w-[90vw] pointer-events-auto">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-2xl py-4 px-4 space-y-3">
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-3">
                <Link href="/" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
                  Home
                </Link>
                <Link href="/aanbod" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
                  Kavels
                </Link>
                <Link href="/diensten" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
                  Diensten
                </Link>

                <Link href="/gids" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
                  Gidsen
                </Link>
                <Link href="/over-ons" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
                  Over Ons
                </Link>
                <Link href="/regio" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
                  Regio's
                </Link>
                <Link
                  href="/aanbod"
                  onClick={() => setOpen(false)}
                  className="block text-center mt-2 px-3 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
                >
                  Bekijk Kavels
                </Link>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
                  Regio's
                </div>
                <div className="max-h-[60vh] overflow-auto pr-1">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                        Gidsen cluster
                      </p>
                      <ul className="space-y-1 mb-4">
                        <li>
                          <Link
                            href="/gids/kavel-kopen"
                            onClick={() => setOpen(false)}
                            className="text-xs text-slate-600 hover:text-navy-900 transition-colors"
                          >
                            Kavel kopen (2026)
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/gids/wat-mag-ik-bouwen"
                            onClick={() => setOpen(false)}
                            className="text-xs text-slate-600 hover:text-navy-900 transition-colors"
                          >
                            Wat mag ik bouwen?
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/gids/faalkosten-voorkomen"
                            onClick={() => setOpen(false)}
                            className="text-xs text-slate-600 hover:text-navy-900 transition-colors"
                          >
                            Faalkosten voorkomen
                          </Link>
                        </li>
                      </ul>
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                        Populaire regio's
                      </p>
                      <ul className="space-y-1">
                        {topCities.map((city) => (
                          <li key={city.slug}>
                            <Link
                              href={`/regio/${city.slug}`}
                              onClick={() => setOpen(false)}
                              className="text-xs text-slate-600 hover:text-navy-900 transition-colors"
                            >
                              Bouwkavel {city.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/regio"
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex text-xs font-semibold text-navy-900 hover:text-emerald-600 transition-colors"
                      >
                        Alle regio's bekijken
                      </Link>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                        Provincies
                      </p>
                      <ul className="space-y-1">
                        {provinceEntries.map(([province, cities]) => {
                          const provinceSlug = province.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <li key={province}>
                              <Link
                                href={`/regio#${provinceSlug}`}
                                onClick={() => setOpen(false)}
                                className="text-xs text-slate-600 hover:text-navy-900 transition-colors"
                              >
                                {province} ({cities.length})
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-16" />
    </header>
  );
}
