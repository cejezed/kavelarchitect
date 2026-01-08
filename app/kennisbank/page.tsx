import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getArticles, getCategories } from '../../lib/api';
import ArticleFilter from '@/components/ArticleFilter';

export const metadata = {
    title: 'Kennisbank | KavelArchitect',
    description: 'Tips en gidsen over zelfbouwen, bestemmingsplannen en kavelprijzen. Expert advies van Architectenbureau Zwijsen.',
    keywords: ['kennisbank', 'zelfbouw', 'bouwkavel', 'bestemmingsplan', 'architect', 'nieuwbouw', 'kavelprijzen', 'bouwadvies'],
    alternates: {
        canonical: 'https://kavelarchitect.nl/kennisbank',
    },
    openGraph: {
        title: 'Kennisbank | KavelArchitect',
        description: 'Tips en gidsen over zelfbouwen, bestemmingsplannen en kavelprijzen. Expert advies van Architectenbureau Zwijsen.',
        url: 'https://kavelarchitect.nl/kennisbank',
        siteName: 'KavelArchitect',
        locale: 'nl_NL',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kennisbank | KavelArchitect',
        description: 'Tips en gidsen over zelfbouwen, bestemmingsplannen en kavelprijzen.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default async function KennisbankPage() {
    const articles = await getArticles();
    const categories = await getCategories();

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://kavelarchitect.nl'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Kennisbank',
                item: 'https://kavelarchitect.nl/kennisbank'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <main className="max-w-7xl mx-auto px-6 py-16">
                <nav aria-label="Breadcrumb" className="mb-10 text-xs text-slate-500">
                    <ol className="flex flex-wrap items-center gap-2">
                        <li>
                            <Link href="/" className="hover:text-slate-700">Home</Link>
                        </li>
                        <li aria-hidden="true">›</li>
                        <li className="text-slate-700">Kennisbank</li>
                    </ol>
                </nav>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Academy</span>
                    <h1 className="font-serif text-4xl font-bold text-slate-900 mb-4">Kennisbank</h1>
                    <p className="text-slate-600 text-lg">Expertise van architecten, vertaald naar heldere gidsen.</p>
                </div>

                <ArticleFilter articles={articles} categories={categories} />
            </main>
        </div>
    );
}
