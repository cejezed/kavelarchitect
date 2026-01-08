// Google Analytics 4 event tracking utilities
// For behavioral signals and conversion tracking

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || '';

// Initialize GA4
export const initGA = () => {
    if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
    });
};

// Track page views
export const trackPageView = (url: string) => {
    if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
    });
};

// Track custom events
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return;

    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

export const trackKavelAlertClick = (label?: string) => {
    trackEvent('kavelalert_click', 'conversion', label);
};

// Specific event trackers for KavelArchitect

export const trackKennismakingClick = (cityName: string, source: string) => {
    trackEvent('kennismaking_click', 'engagement', `${cityName} - ${source}`);
};

export const trackAlertActivation = (cityName: string) => {
    trackEvent('alert_activation', 'conversion', cityName);
};

export const trackKavelView = (kavelId: string, cityName: string) => {
    trackEvent('kavel_view', 'engagement', `${kavelId} - ${cityName}`);
};

export const trackKavelRapportRequest = (kavelId: string, tier: string) => {
    trackEvent('kavelrapport_request', 'conversion', `${kavelId} - ${tier}`);
};

export const trackFAQInteraction = (question: string, cityName: string) => {
    trackEvent('faq_interaction', 'engagement', `${cityName} - ${question}`);
};

export const trackEmailClick = (cityName: string) => {
    trackEvent('email_click', 'engagement', cityName);
};

export const trackPhoneClick = (cityName: string) => {
    trackEvent('phone_click', 'engagement', cityName);
};

export const trackExternalLink = (url: string, label: string) => {
    trackEvent('external_link', 'engagement', `${label} - ${url}`);
};

// Scroll depth tracking for behavioral signals
export const trackScrollDepth = (depth: number, cityName: string) => {
    trackEvent('scroll_depth', 'engagement', cityName, depth);
};

// Time on page tracking
export const trackTimeOnPage = (seconds: number, cityName: string) => {
    trackEvent('time_on_page', 'engagement', cityName, seconds);
};
