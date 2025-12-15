
import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://kavelarchitect.nl'),
  title: {
    default: "KavelArchitect | Vind uw Droomkavel",
    template: "%s | KavelArchitect"
  },
  description: "De enige zoekservice voor bouwkavels met architecten-check. Vind grond, check de bouwpotentie en realiseer uw droomhuis.",
  keywords: ['bouwkavel', 'kavel te koop', 'zelfbouw', 'architect', 'nieuwbouw', 'kavelarchitect'],
  authors: [{ name: 'KavelArchitect' }],
  creator: 'KavelArchitect',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://kavelarchitect.nl',
    title: "KavelArchitect | Vind uw Droomkavel",
    description: "De enige zoekservice voor bouwkavels met architecten-check.",
    siteName: 'KavelArchitect',
    images: [
      {
        url: '/hero-bg.png', // Fallback image
        width: 1200,
        height: 630,
        alt: 'KavelArchitect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KavelArchitect | Vind uw Droomkavel",
    description: "De enige zoekservice voor bouwkavels met architecten-check.",
    images: ['/hero-bg.png'],
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
      <body className={inter.className}>
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
