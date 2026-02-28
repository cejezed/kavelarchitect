import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, Share2, ExternalLink, MapPin, FileText } from 'lucide-react';
import InlineCTA from '@/components/InlineCTA';
import { getArticle, getArticles, WORDPRESS_SITE_URL, getListings } from '../../../lib/api';
import ElementorContent from '@/components/ElementorContent';
import { FAQ_ARTICLES, getFaqArticle } from '@/lib/faqArticles';

// --- 1. GENERATE METADATA FOR SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const faqArticle = getFaqArticle(params.slug);
    if (faqArticle) {
        const canonicalUrl = `https://kavelarchitect.nl/kennisbank/${params.slug}`;
        return {
            title: `${faqArticle.title} | KavelArchitect Kennisbank`,
            description: faqArticle.description,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title: faqArticle.title,
                description: faqArticle.description,
                url: canonicalUrl,
                siteName: 'KavelArchitect',
                locale: 'nl_NL',
                type: 'article',
                publishedTime: faqArticle.date,
                modifiedTime: faqArticle.date,
                authors: ['Architectenbureau Zwijsen'],
            },
            twitter: {
                card: 'summary_large_image',
                title: faqArticle.title,
                description: faqArticle.description,
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
    try {
        const faqArticle = getFaqArticle(params.slug);
        const recentListings = await getListings();

        const article = faqArticle ? null : await getArticle(params.slug);
        const allArticles = faqArticle ? [] : await getArticles();

        if (!faqArticle && !article) {
            notFound();
        }

        const imageUrl = article?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        const dateSource = faqArticle ? faqArticle.date : article?.date;
        const date = dateSource
            ? new Date(dateSource).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
            : '';
        const breadcrumbTitle = faqArticle
            ? faqArticle.title
            : article?.title?.rendered?.replace(/<[^>]*>/g, '') || 'Artikel';

        // Extract city names from article content for contextual region links
        const popularCities = ['Blaricum', 'Laren', 'Heemstede', 'Zeist', 'Wassenaar', 'Noordwijk'];
        const contentText = (faqArticle ? faqArticle.contentHtml : article?.content?.rendered || '').toLowerCase();
        const mentionedCities = popularCities.filter(city =>
            contentText.includes(city.toLowerCase())
        ).slice(0, 3);

        // Get recent listings for internal linking
        const featuredListings = recentListings.slice(0, 2);

        const articleJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: breadcrumbTitle,
            description: faqArticle ? faqArticle.description : article?.yoast_head_json?.description || '',
            image: imageUrl || 'https://kavelarchitect.nl/images/og-image.jpg',
            author: {
                '@type': 'Person',
                name: 'Jules Zwijsen',
                url: 'https://kavelarchitect.nl/over-ons',
                jobTitle: 'Architect & Oprichter'
            },
            publisher: {
                '@type': 'Organization',
                name: 'KavelArchitect',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://kavelarchitect.nl/kavelarchitect-logo.png'
                }
            },
            datePublished: dateSource || new Date().toISOString()
        };

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
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: breadcrumbTitle,
                    item: `https://kavelarchitect.nl/kennisbank/${params.slug}`
                }
            ]
        };

        return (
            <div className="min-h-screen bg-white pb-20">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />
                <nav aria-label="Breadcrumb" className="max-w-3xl mx-auto px-6 pt-10 text-xs text-slate-500">
                    <ol className="flex flex-wrap items-center gap-2">
                        <li>
                            <Link href="/" className="hover:text-slate-700">Home</Link>
                        </li>
                        <li aria-hidden="true">›</li>
                        <li>
                            <Link href="/kennisbank" className="hover:text-slate-700">Kennisbank</Link>
                        </li>
                        <li aria-hidden="true">›</li>
                        <li className="text-slate-700">{breadcrumbTitle}</li>
                    </ol>
                </nav>
                {/* Header */}
                <header className="pt-32 pb-10 max-w-3xl mx-auto px-6 text-center">
                    {faqArticle ? (
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            {faqArticle.title}
                        </h1>
                    ) : (
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: article?.title?.rendered || '' }} />
                    )}

                    <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
                        {date && (
                            <div className="flex items-center"><Calendar size={14} className="mr-2" /> {date}</div>
                        )}
                        <div className="flex items-center">
                            <User size={14} className="mr-2" />
                            Door <Link href="/over-ons" className="underline hover:text-slate-700 ml-1">Jules Zwijsen</Link>
                        </div>
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
                        {imageUrl && !faqArticle && (
                            <div className="relative h-96 w-full mb-12 rounded-2xl overflow-hidden shadow-sm">
                                <Image
                                    src={imageUrl}
                                    alt={article?.title?.rendered || 'Artikel afbeelding'}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {faqArticle ? (
                            <div className="prose prose-slate max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: faqArticle.contentHtml }} />
                            </div>
                        ) : (
                            <ElementorContent
                                html={article?.content?.rendered || ''}
                                postId={article?.id}
                                siteUrl={WORDPRESS_SITE_URL}
                            />
                        )}

                        {/* SCROLL TRIGGERED CTA (Client Component) */}
                        <InlineCTA />

                        {/* Related Content - Internal Linking for SEO */}
                        <div className="mt-16 border-t border-slate-100 pt-10">
                            <h3 className="font-serif text-2xl font-bold mb-6 text-navy-900">Interessant voor u</h3>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* KavelRapport Link - Money Page */}
                                <Link href="/kavelrapport" className="group bg-gradient-to-br from-navy-900 to-blue-900 text-white rounded-2xl p-6 hover:shadow-xl transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                            <FileText className="text-blue-400" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-2 group-hover:text-blue-300 transition-colors">KavelRapport aanvragen</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                Laat een bouwkavel professioneel beoordelen door een architect voordat u koopt.
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Recent Kavels Link */}
                                <Link href="/aanbod" className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-navy-900 hover:shadow-lg transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                            <ExternalLink className="text-emerald-600" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-2 text-navy-900 group-hover:text-emerald-600 transition-colors">Bekijk beschikbare kavels</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Ontdek ons actuele aanbod van bouwkavels in heel Nederland.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Contextual Region Links - if cities mentioned in article */}
                            {mentionedCities.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-bold text-slate-900 mb-4">Bouwkavels in deze regio's</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {mentionedCities.map(city => (
                                            <Link
                                                key={city}
                                                href={`/regio/${city.toLowerCase()}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-navy-900 hover:border-navy-900 hover:bg-navy-50 transition-colors"
                                            >
                                                <MapPin size={16} />
                                                Bouwkavel kopen in {city}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Featured Listings - if available */}
                            {featuredListings.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4">Recent beschikbaar</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {featuredListings.map(listing => (
                                            <Link
                                                key={listing.kavel_id}
                                                href={`/aanbod/${listing.kavel_id}`}
                                                className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-navy-900 hover:shadow-md transition-all"
                                            >
                                                <p className="font-bold text-navy-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                    {listing.adres || 'Bouwgrond'}{listing.plaats ? `, ${listing.plaats}` : ''}
                                                </p>
                                                <p className="text-sm text-slate-600 mb-2">
                                                    {listing.oppervlakte} m² • {listing.prijs ? `€${listing.prijs.toLocaleString('nl-NL')}` : 'Prijs op aanvraag'}
                                                </p>
                                                <span className="text-xs text-emerald-600 font-medium">
                                                    Bekijk details →
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Static Bottom CTA */}
                        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">Hulp bij uw aankoop</h3>
                            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                                Heeft u een kavel op het oog, maar wilt u zekerheid over de mogelijkheden en kosten? Laat dit objectief toetsen voordat u een bod uitbrengt.
                            </p>
                            <Link href="/kavelrapport" className="inline-block px-6 py-3 bg-white text-navy-900 border border-slate-300 font-bold rounded-xl hover:border-navy-900 transition-colors">
                                Bekijk het KavelRapport
                            </Link>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                <h4 className="font-bold text-lg text-navy-900 mb-2">KavelAlert</h4>
                                <p className="text-sm text-slate-600 mb-4">Ontvang nieuwe bouwkavels die passen bij uw wensen direct in uw inbox.</p>
                                <Link href="/" className="block w-full text-center py-2.5 bg-white border border-slate-300 text-navy-900 font-semibold rounded-lg text-sm hover:border-slate-400 transition-colors shadow-sm">
                                    Alert instellen
                                </Link>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Ook lezen</h4>
                                <div className="space-y-4">
                                    {faqArticle
                                        ? FAQ_ARTICLES.filter(a => a.slug !== faqArticle.slug).slice(0, 3).map(a => (
                                            <Link key={a.slug} href={`/kennisbank/${a.slug}`} className="block group">
                                                <p className="font-bold text-sm text-slate-900 group-hover:text-blue-600 line-clamp-2 mb-1">{a.title}</p>
                                                <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString('nl-NL')}</p>
                                            </Link>
                                        ))
                                        : allArticles.filter(a => a.id !== article?.id).slice(0, 3).map(a => (
                                            <Link key={a.id} href={`/kennisbank/${a.slug}`} className="block group">
                                                <p className="font-bold text-sm text-slate-900 group-hover:text-blue-600 line-clamp-2 mb-1" dangerouslySetInnerHTML={{ __html: a?.title?.rendered || '' }} />
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
    } catch (error) {
        console.error('Critical error in ArticleDetailPage:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Artikel niet beschikbaar</h1>
                    <p className="text-slate-600 mb-6">We konden dit artikel momenteel niet laden. Probeer het later opnieuw.</p>
                    <Link href="/kennisbank" className="inline-block px-6 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
                        Terug naar Kennisbank
                    </Link>
                </div>
            </div>
        );
    }
}
