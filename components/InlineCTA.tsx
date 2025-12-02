'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import KavelAlertForm from './KavelAlertForm';

export default function InlineCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      // Show after 30% scroll
      if (scrollPercent > 0.3) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* The Scroll Triggered Box */}
      <div 
        className={`my-12 p-8 bg-blue-50 rounded-2xl border border-blue-100 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h4 className="font-bold text-navy-900 text-lg mb-2">Zoekt u een kavel?</h4>
        <p className="text-slate-600 mb-6">Ontvang nieuw aanbod dat past bij uw criteria direct in uw inbox.</p>
        <button 
          onClick={() => setShowWizard(true)} 
          className="bg-navy-900 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center"
        >
          <Bell size={16} className="mr-2" />
          Ontvang nieuw aanbod via KavelAlert™
        </button>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
             {/* Wrapper to handle closing, or pass close handler to form */}
             <div className="relative w-full max-w-xl">
                 <KavelAlertForm onClose={() => setShowWizard(false)} />
             </div>
         </div>
      )}
    </>
  );
}