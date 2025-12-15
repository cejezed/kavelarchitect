'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/aanbod', label: 'Aanbod' },
  { href: '/kavelrapport', label: 'KavelRapport' },
  { href: '/kennisbank', label: 'Kennisbank' },
  { href: '/over-ons', label: 'Over ons' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 mt-4 flex items-center justify-between rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-sm px-4">
          <Link href="/" className="text-navy-900 font-serif font-bold text-lg">
            KavelArchitect
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-navy-900 transition-colors">
                {link.label}
              </Link>
            ))}
            <Link
              href="/aanbod"
              className="inline-flex items-center px-3 py-2 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
            >
              Bekijk kavels
            </Link>
          </nav>
          <button
            className="md:hidden p-2 rounded-full border border-slate-200 text-slate-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-2 mx-4 rounded-2xl bg-white border border-slate-200 shadow-lg py-3 px-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-semibold text-slate-700 hover:text-navy-900"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/aanbod"
            onClick={() => setOpen(false)}
            className="block text-center mt-2 px-3 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
          >
            Bekijk kavels
          </Link>
        </div>
      )}
      {/* Spacer to offset fixed header */}
      <div className="h-16" />
    </header>
  );
}
