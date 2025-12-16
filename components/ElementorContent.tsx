'use client';

import { useEffect } from 'react';

interface ElementorContentProps {
    html: string;
    postId?: number;
    siteUrl?: string;
}

// Load Elementor CSS assets once so layout matches the WordPress rendering
function ensureStylesheet(id: string, href?: string) {
    if (!href || document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
}

export default function ElementorContent({ html, postId, siteUrl }: ElementorContentProps) {
    useEffect(() => {
        if (!siteUrl || !postId) return;

        const base = siteUrl.replace(/\/$/, '');
        ensureStylesheet('elementor-icons', `${base}/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css`);
        ensureStylesheet('elementor-frontend', `${base}/wp-content/plugins/elementor/assets/css/frontend-lite.min.css`);
        ensureStylesheet(`elementor-post-${postId}`, `${base}/wp-content/uploads/elementor/css/post-${postId}.css`);
    }, [siteUrl, postId]);

    return (
        <div
            className="elementor-content prose prose-lg prose-slate max-w-none font-serif [&_*]:max-w-full"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
