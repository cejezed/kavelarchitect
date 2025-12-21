'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 mt-4 flex items-center justify-end">
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
        <div className="fixed top-16 right-4 sm:right-6 z-40 w-[280px] max-w-[90vw]">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-2xl py-4 px-4 space-y-3">
            <Link href="/" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
              Home
            </Link>
            <Link href="/aanbod" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
              Kavels
            </Link>
            <Link href="/diensten" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
              Diensten
            </Link>
            <Link href="/kennisbank" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
              Kennisbank
            </Link>
            <Link href="/over-ons" onClick={() => setOpen(false)} className="block text-sm font-semibold text-slate-700 hover:text-navy-900">
              Over Ons
            </Link>
            <hr className="border-slate-200 my-2" />
            <Link
              href="/aanbod"
              onClick={() => setOpen(false)}
              className="block text-center mt-2 px-3 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
            >
              Bekijk Kavels
            </Link>
          </div>
        </div>
      )}
      {/* Spacer to offset fixed header */}
      <div className="h-16" />
    </header>
  );
}
