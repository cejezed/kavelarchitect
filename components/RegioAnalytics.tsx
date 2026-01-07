'use client';

import { useEffect } from 'react';
import { trackKennismakingClick, trackScrollDepth, trackTimeOnPage } from '@/lib/analytics';

interface RegioAnalyticsProps {
    cityName: string;
}

export default function RegioAnalytics({ cityName }: RegioAnalyticsProps) {
    useEffect(() => {
        let startTime = Date.now();
        let scrollDepths = new Set<number>();

        // Track scroll depth
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);

            // Track at 25%, 50%, 75%, 100%
            [25, 50, 75, 100].forEach(depth => {
                if (scrollPercent >= depth && !scrollDepths.has(depth)) {
                    scrollDepths.add(depth);
                    trackScrollDepth(depth, cityName);
                }
            });
        };

        // Track time on page when user leaves
        const handleBeforeUnload = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            trackTimeOnPage(timeSpent, cityName);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [cityName]);

    // Track CTA clicks
    useEffect(() => {
        const handleCTAClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link) {
                const href = link.getAttribute('href');
                const text = link.textContent?.trim() || '';

                // Track kennismaking/alert clicks
                if (href?.includes('regio=') || text.includes('Alert') || text.includes('Haalbaarheidscheck')) {
                    trackKennismakingClick(cityName, text);
                }
            }
        };

        document.addEventListener('click', handleCTAClick);

        return () => {
            document.removeEventListener('click', handleCTAClick);
        };
    }, [cityName]);

    return null; // This component doesn't render anything
}
