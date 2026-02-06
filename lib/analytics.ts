// Google Tag Manager event tracking utilities
// Sends events to dataLayer for GA4 (and other) tags in GTM

declare global {
    interface Window {
        dataLayer?: any[];
    }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

// Track page views
export const trackPageView = (url: string) => {
    if (typeof window === 'undefined' || !GTM_ID) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'page_view',
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
    });
};

// Track custom events
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window === 'undefined' || !GTM_ID) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: action,
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
