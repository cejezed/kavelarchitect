
import React, { Suspense } from 'react';
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { PHProvider } from './providers';
import RegioFooter from '@/components/RegioFooter';

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
  title: "KavelArchitect | Vind uw Droomkavel",
  description: "De enige zoekservice voor bouwkavels met architecten-check. Vind grond, check de bouwpotentie en realiseer uw droomhuis.",
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
            {children}
            <RegioFooter />
          </PHProvider>
        </Suspense>
      </body>
    </html>
  );
}