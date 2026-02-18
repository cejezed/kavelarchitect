
import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { PHProvider } from './providers';
import RegioFooter from '@/components/RegioFooter';
import NavBar from '@/components/NavBar';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'KavelArchitect',
  url: 'https://kavelarchitect.nl',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://kavelarchitect.nl/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KavelArchitect',
  url: 'https://kavelarchitect.nl',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bastertlaan 3',
    addressLocality: 'Loenen',
    addressCountry: 'NL',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Architectenbureau Jules Zwijsen',
  url: 'https://kavelarchitect.nl',
  image: 'https://kavelarchitect.nl/jules-zwijsen.jpg',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bastertlaan 3',
    addressLocality: 'Loenen',
    addressCountry: 'NL',
  },
  areaServed: 'NL',
  knowsAbout: ['bouwgrond kopen', 'kavel kopen', 'kavelcheck', 'villabouw', 'planologische haalbaarheid'],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kavelarchitect.nl'),
  icons: {
    icon: '/images/kavelarchitect_icon.webp',
    apple: '/images/kavelarchitect_icon.webp',
  },
  title: {
    default: "KavelArchitect | Bouwgrond en kavel zoeken met architecten-check",
    template: "%s | KavelArchitect"
  },
  description: "Zoek bouwgrond en kavels in Nederland en laat uw kavel checken door een architect voordat u biedt. Dagelijkse matches en persoonlijke kavelrapporten.",
  keywords: ['bouwgrond kopen', 'bouwgrond te koop', 'kavel kopen', 'kavel kopen met architect', 'kavelcheck', 'zelfbouw', 'nieuwbouw', 'kavelarchitect'],
  authors: [{ name: 'KavelArchitect' }],
  creator: 'KavelArchitect',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://kavelarchitect.nl',
    title: "KavelArchitect | Bouwgrond en kavel zoeken met architecten-check",
    description: "Zoek bouwgrond en kavels in Nederland en laat uw kavel checken door een architect voordat u biedt.",
    siteName: 'KavelArchitect',
    images: [
      {
        url: '/hero-bg.jpg', // Fallback image
        width: 1200,
        height: 630,
        alt: 'KavelArchitect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KavelArchitect | Bouwgrond en kavel zoeken met architecten-check",
    description: "Zoek bouwgrond en kavels in Nederland en laat uw kavel checken door een architect voordat u biedt.",
    images: ['/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Critical CSS inline for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
          /* Critical above-the-fold styles */
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          body {
            background-color: #F8FAFC;
            color: #0F172A;
            font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
            line-height: 1.5;
          }
          /* Prevent layout shift */
          img, video { max-width: 100%; height: auto; display: block; }
          a { color: inherit; text-decoration: none; }
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* Google Tag Manager - Standard head part */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}

        {/* Google Analytics - Optional standalone integration */}
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${ga4Id}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        <Suspense fallback={null}>
          <PHProvider>
            <NavBar />
            {children}
            <RegioFooter />
          </PHProvider>
        </Suspense>
      </body>
    </html>
  );
}
