'use client';

import Link from 'next/link';
import { Bell, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function FloatingAlertButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Show after scrolling a bit
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isDismissed) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
        >
            <div className="bg-navy-900 text-white p-1 rounded-2xl shadow-2xl flex items-center pr-6 pl-2 py-2 relative group">

                {/* Close button */}
                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X size={14} />
                </button>

                <div className="bg-blue-600 p-3 rounded-xl mr-4 animate-pulse">
                    <Bell size={24} className="text-white" />
                </div>

                <div className="mr-4">
                    <p className="font-bold text-sm">Niet gevonden?</p>
                    <p className="text-xs text-slate-300">Ontvang nieuwe kavels in uw mail.</p>
                </div>

                <Link
                    href="/"
                    className="bg-white text-navy-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                    Start Alert
                </Link>
            </div>
        </div>
    );
}
