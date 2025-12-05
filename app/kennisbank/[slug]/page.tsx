import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import InlineCTA from '@/components/InlineCTA';
import { getArticle, getArticles } from '../../../lib/api';

// --- 1. GENERATE METADATA FOR SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);

    if (!article) {
        return {
            title: 'Artikel Niet Gevonden | KavelArchitect',
            description: 'Het opgevraagde artikel bestaat niet.'
        };
    }

    const title = `${article.title.rendered} | KavelArchitect Kennisbank`;
    const description = article.yoast_head_json?.description || article.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160);
    const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const canonicalUrl = `https://kavelarchitect.nl/kennisbank/${params.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'KavelArchitect',
            images: imageUrl ? [{
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: article.title.rendered,
            }] : [],
            locale: 'nl_NL',
            type: 'article',
            publishedTime: article.date,
            modifiedTime: article.modified || article.date,
            authors: ['Architectenbureau Zwijsen'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
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
}

// --- 2. PAGE COMPONENT ---
export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);
    const allArticles = await getArticles();

    if (!article) {
        notFound();
    }

    const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const date = new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Nav */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 h-16 flex items-center px-6">
                <Link href="/kennisbank" className="flex items-center text-sm font-medium text-slate-500 hover:text-navy-900">
                    <ArrowLeft size={18} className="mr-2" /> Terug naar Kennisbank
                </Link>
            </nav>

            {/* Header */}
            <header className="pt-32 pb-10 max-w-3xl mx-auto px-6 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: article.title.rendered }} />

                <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
                    <div className="flex items-center"><Calendar size={14} className="mr-2" /> {date}</div>
                    <div className="flex items-center"><User size={14} className="mr-2" /> Redactie Zwijsen</div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">

                {/* Left Column (Share/Spacer) */}
                <div className="lg:col-span-2 hidden lg:block">
                    <div className="sticky top-32 flex flex-col gap-4 text-slate-400 justify-center items-center">
                        <button className="p-3 hover:bg-slate-50 rounded-full transition-colors" aria-label="Delen">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Center Content */}
                <article className="lg:col-span-7">
                    {imageUrl && (
                        <div className="relative h-96 w-full mb-12 rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src={imageUrl}
                                alt={article.title.rendered}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="prose prose-lg prose-slate max-w-none font-serif text-slate-700 leading-loose" dangerouslySetInnerHTML={{ __html: article.content.rendered }} />

                    {/* SCROLL TRIGGERED CTA (Client Component) */}
                    <InlineCTA />

                    {/* Static Bottom CTA */}
                    <div className="mt-16 border-t border-slate-100 pt-10">
                        <h3 className="font-serif text-2xl font-bold mb-4">Stop met zoeken</h3>
                        <p className="text-slate-600 mb-6">Laat ons dagelijks kavels matchen met uw profiel.</p>
                        <Link href="/" className="inline-block px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
                            Start Gratis Matching
                        </Link>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="lg:col-span-3">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-navy-900 text-white p-6 rounded-2xl">
                            <h4 className="font-bold text-lg mb-2">Brikx KavelAlert</h4>
                            <p className="text-sm text-slate-400 mb-4">Mis nooit meer een buitenkans. Ontvang matches in uw mailbox.</p>
                            <Link href="/" className="block w-full text-center py-3 bg-white text-slate-900 font-bold rounded-lg text-xs hover:bg-blue-50 transition-colors">
                                Activeer Nu
                            </Link>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Ook lezen</h4>
                            <div className="space-y-4">
                                {allArticles.filter(a => a.id !== article.id).slice(0, 3).map(a => (
                                    <Link key={a.id} href={`/kennisbank/${a.slug}`} className="block group">
                                        <p className="font-bold text-sm text-slate-900 group-hover:text-blue-600 line-clamp-2 mb-1" dangerouslySetInnerHTML={{ __html: a.title.rendered }} />
                                        <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString('nl-NL')}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}