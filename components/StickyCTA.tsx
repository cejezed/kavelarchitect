'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, X } from 'lucide-react';

interface StickyCTAProps {
  cityName: string;
  citySlug: string;
}

export default function StickyCTA({ cityName, citySlug }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA when user scrolls past 50% of viewport height
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (scrollPosition > viewportHeight * 0.5 && !isDismissed) {
        setIsVisible(true);
      } else if (scrollPosition <= viewportHeight * 0.5) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">
                Mis geen kavel in {cityName}
              </p>
              <p className="text-sm text-emerald-100">
                Exclusieve toegang tot off-market kavels
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/?regio=${citySlug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg whitespace-nowrap"
              >
                <Bell size={18} />
                <span className="hidden sm:inline">Activeer Alert</span>
                <span className="sm:hidden">Alert</span>
              </Link>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 hover:bg-emerald-800 rounded-lg transition-colors"
                aria-label="Sluiten"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
