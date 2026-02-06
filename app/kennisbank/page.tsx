import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getArticles, getCategories } from '../../lib/api';
import ArticleFilter from '@/components/ArticleFilter';
import { FAQ_ARTICLES } from '@/lib/faqArticles';

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
    try {
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

                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">Veelgestelde vragen</h2>
                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">FAQ</span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {FAQ_ARTICLES.map((faq) => (
                                <Link key={faq.slug} href={`/kennisbank/${faq.slug}`} className="group">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all h-full p-6">
                                        <h3 className="font-serif text-xl font-bold text-navy-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {faq.title}
                                        </h3>
                                        <p className="text-sm text-slate-600">{faq.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <ArticleFilter articles={articles} categories={categories} />
                </main>
            </div>
        );
    } catch (error) {
        console.error('Critical error in KennisbankPage:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Kennisbank tijdelijk niet beschikbaar</h1>
                    <p className="text-slate-600 mb-6">We konden de kennisbank momenteel niet laden. Probeer het later opnieuw.</p>
                    <Link href="/" className="inline-block px-6 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
                        Terug naar Home
                    </Link>
                </div>
            </div>
        );
    }
}
