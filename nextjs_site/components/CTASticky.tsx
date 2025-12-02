'use client';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

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
        <button onClick={onOpen} className="w-full py-4 bg-navy-900 text-white font-bold text-lg rounded-xl shadow-2xl flex items-center justify-center">
             <Bell size={20} className="mr-3" />
             Gratis Alert Instellen
        </button>
    </div>
  );
}