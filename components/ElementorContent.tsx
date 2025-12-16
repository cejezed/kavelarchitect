'use client';

import { useEffect, useState } from 'react';

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
    const [stylesLoaded, setStylesLoaded] = useState(false);

    useEffect(() => {
        if (!siteUrl || !postId) {
            setStylesLoaded(true);
            return;
        }

        const base = siteUrl.replace(/\/$/, '');

        // Load Elementor CSS
        ensureStylesheet('elementor-icons', `${base}/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css`);
        ensureStylesheet('elementor-frontend', `${base}/wp-content/plugins/elementor/assets/css/frontend-lite.min.css`);
        ensureStylesheet(`elementor-post-${postId}`, `${base}/wp-content/uploads/elementor/css/post-${postId}.css`);

        // Give styles time to load
        const timer = setTimeout(() => setStylesLoaded(true), 500);
        return () => clearTimeout(timer);
    }, [siteUrl, postId]);

    return (
        <div
            className="elementor-wrapper"
            style={{
                opacity: stylesLoaded ? 1 : 0.3,
                transition: 'opacity 0.3s ease-in-out'
            }}
        >
            <style jsx global>{`
                /* Elementor Container Fixes */
                .elementor-wrapper .elementor {
                    all: initial;
                    display: block;
                    font-family: inherit;
                }

                .elementor-wrapper * {
                    box-sizing: border-box;
                }

                /* Restore Elementor Container Layout */
                .elementor-wrapper .e-con {
                    display: flex;
                    flex-direction: column;
                }

                .elementor-wrapper .e-con.e-flex {
                    display: flex;
                }

                .elementor-wrapper .e-con-boxed {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .elementor-wrapper .e-con-full {
                    width: 100%;
                }

                .elementor-wrapper .e-con-inner {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }

                /* Elementor Widget Styling */
                .elementor-wrapper .elementor-widget {
                    margin-bottom: 20px;
                }

                .elementor-wrapper .elementor-widget-container {
                    display: block;
                }

                /* Headings */
                .elementor-wrapper h1,
                .elementor-wrapper h2,
                .elementor-wrapper h3,
                .elementor-wrapper h4,
                .elementor-wrapper h5,
                .elementor-wrapper h6 {
                    margin-top: 1em;
                    margin-bottom: 0.5em;
                    font-weight: 700;
                    line-height: 1.2;
                    color: #0F172A;
                }

                .elementor-wrapper h1 { font-size: 2.5em; }
                .elementor-wrapper h2 { font-size: 2em; }
                .elementor-wrapper h3 { font-size: 1.75em; }
                .elementor-wrapper h4 { font-size: 1.5em; }
                .elementor-wrapper h5 { font-size: 1.25em; }
                .elementor-wrapper h6 { font-size: 1.1em; }

                /* Paragraphs */
                .elementor-wrapper p {
                    margin-bottom: 1em;
                    line-height: 1.8;
                    color: #475569;
                    font-size: 1.125rem;
                }

                /* Images */
                .elementor-wrapper img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                }

                .elementor-wrapper .elementor-widget-image {
                    text-align: center;
                }

                /* Lists */
                .elementor-wrapper ul,
                .elementor-wrapper ol {
                    margin-left: 1.5em;
                    margin-bottom: 1em;
                    line-height: 1.8;
                    color: #475569;
                }

                .elementor-wrapper li {
                    margin-bottom: 0.5em;
                }

                /* Links */
                .elementor-wrapper a {
                    color: #2563eb;
                    text-decoration: underline;
                }

                .elementor-wrapper a:hover {
                    color: #1d4ed8;
                }

                /* Text alignment */
                .elementor-wrapper .elementor-widget-text-editor [style*="text-align: center"] {
                    text-align: center;
                }

                .elementor-wrapper .elementor-widget-text-editor [style*="text-align: right"] {
                    text-align: right;
                }

                /* Spacing between sections */
                .elementor-wrapper .e-con.e-parent {
                    margin-bottom: 40px;
                    padding: 20px 0;
                }

                /* Background images */
                .elementor-wrapper .e-con[data-settings*="background_background"] {
                    background-size: cover;
                    background-position: center;
                    min-height: 300px;
                }
            `}</style>
            <div
                className="prose prose-lg prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
