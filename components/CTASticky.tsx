'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import posthog from 'posthog-js';
import { Bell } from 'lucide-react';
import { trackKavelAlertClick } from '@/lib/analytics';

export default function CTASticky({ onOpen }: { onOpen: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden animate-in slide-in-from-bottom-10">
        <button
          onClick={() => {
            posthog?.capture?.('cta_sticky_alert_click');
            trackKavelAlertClick('home_sticky');
            onOpen();
          }}
          className="w-full py-4 bg-navy-900 text-white font-bold text-lg rounded-xl shadow-2xl flex items-center justify-center"
        >
             <Bell size={20} className="mr-3" />
             Gratis Alert Instellen
        </button>
        <div className="mt-2 text-center text-[11px] text-slate-200">
          <Link
            href="/kavelrapport"
            onClick={() => posthog?.capture?.('cta_sticky_kavelrapport_click')}
            className="underline underline-offset-4"
          >
            Liever direct uitleg over KavelRapport?
          </Link>
        </div>
    </div>
  );
}
