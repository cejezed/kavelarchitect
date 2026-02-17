import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, Share2, ExternalLink, MapPin, FileText } from 'lucide-react';
import InlineCTA from '@/components/InlineCTA';
import { getArticle, getArticles, WORDPRESS_SITE_URL, getListings } from '../../../lib/api';
import ElementorContent from '@/components/ElementorContent';

type PillarType = 'faalkosten' | 'kavel-kopen' | 'bouwregels' | null;

type PillarConfig = {
    title: string;
    description: string;
    routeLabel: string;
    intro: string;
    faq: Array<{ q: string; a: string }>;
};

function getPillarType(slug: string, rawTitle: string): PillarType {
    const text = `${slug} ${rawTitle}`.toLowerCase();
    if (text.includes('faalkosten')) return 'faalkosten';
    if (text.includes('bouwen') || text.includes('omgevingsplan') || text.includes('bouwregels')) return 'bouwregels';
    if (text.includes('kavel') && text.includes('koop')) return 'kavel-kopen';
    return null;
}

function getPillarConfig(type: PillarType): PillarConfig | null {
    if (type === 'faalkosten') {
        return {
            title: 'Faalkosten bij nieuwbouw voorkomen in 2026 | KavelArchitect',
            description: 'Voorkom faalkosten bij nieuwbouw met praktische stappen voor zelfbouw, villabouw en bouwkavel kopen. Inzicht in risico\'s, budget en voorbereiding.',
            routeLabel: 'Onderdeel van de kavel-strategie-route',
            intro: 'Deze gids is bedoeld voor particuliere zelfbouwers, villabouw en sloop-nieuwbouw in Nederland. U leert hoe u faalkosten bij zelfbouw beperkt en faalkosten voorkomt voor kavelaankoop.',
            faq: [
                { q: 'Hoe voorkomt u faalkosten bij zelfbouw?', a: 'Door vroeg planologische regels, budget en ontwerpkeuzes te toetsen voordat u verplichtingen aangaat.' },
                { q: 'Wanneer ontstaan de grootste faalkosten?', a: 'Meestal in de fase voor aankoop of ontwerp, door onduidelijke bouwregels en verkeerde aannames over haalbaarheid.' },
                { q: 'Helpt een kavelcheck tegen faalkosten?', a: 'Ja. Een inhoudelijke kavelcheck voorkomt miskopen en reduceert dure bijsturing later in het traject.' },
            ],
        };
    }

    if (type === 'kavel-kopen') {
        return {
            title: 'Bouwkavel kopen in 2026: stappenplan en risico\'s | KavelArchitect',
            description: 'Gids voor bouwkavel kopen in 2026: zelfbouwkavel selecteren, financiering, risico\'s en due diligence. Voorkom miskopen met een helder stappenplan.',
            routeLabel: 'Onderdeel van de kavel-strategie-route',
            intro: 'Wilt u een bouwkavel kopen in 2026 en miskopen voorkomen? Deze gids helpt u met de kernstappen voor selectie, risico-inschatting, financiering en aankoop.',
            faq: [
                { q: 'Is een bouwkavel altijd bouwrijp?', a: 'Nee. Controleer altijd nutsvoorzieningen, bodem, ontsluiting en planregels voordat u koopt.' },
                { q: 'Hoeveel eigen geld heeft u nodig?', a: 'Dat hangt af van kavelprijs, financieringsvoorwaarden en bijkomende kosten zoals advies, leges en voorbereiding.' },
                { q: 'Koopt u beter via gemeente of makelaar?', a: 'Dat verschilt per regio. Belangrijk is dat u dezelfde technische en juridische controles uitvoert.' },
            ],
        };
    }

    if (type === 'bouwregels') {
        return {
            title: 'Wat mag ik bouwen op mijn kavel? Omgevingsplan en bouwregels 2026 | KavelArchitect',
            description: 'Ontdek wat u mag bouwen volgens omgevingsplan en bouwregels in 2026. Praktische uitleg voor zelfbouwers over bouwmogelijkheden en valkuilen.',
            routeLabel: 'Onderdeel van de kavel-strategie-route',
            intro: 'Deze gids helpt zelfbouwers en villabouwers om bouwmogelijkheden op kavel goed te interpreteren. U ziet wat mag volgens omgevingsplan, wat vaak misgaat en hoe u vooraf zekerheid krijgt.',
            faq: [
                { q: 'Wat mag ik bouwen volgens omgevingsplan?', a: 'Dat hangt af van bouwvlak, maatvoering, functies en aanvullende regels per locatie.' },
                { q: 'Waarom verschillen regels per gemeente?', a: 'Omdat lokale uitwerking en beleidskeuzes kunnen variëren, zelfs binnen vergelijkbare woongebieden.' },
                { q: 'Wanneer is een extra architectcheck verstandig?', a: 'Voordat u tekent of biedt, zodat u zeker weet dat uw woonwens juridisch en technisch haalbaar is.' },
            ],
        };
    }

    return null;
}

// --- 1. GENERATE METADATA FOR SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug);

    if (!article) {
        return {
            title: 'Artikel Niet Gevonden | KavelArchitect',
            description: 'Het opgevraagde artikel bestaat niet.'
        };
    }

    const rawTitle = article.title.rendered.replace(/<[^>]*>/g, '');
    const pillarType = getPillarType(params.slug, rawTitle);
    const pillarConfig = getPillarConfig(pillarType);

    const title = pillarConfig?.title || `${article.title.rendered} | KavelArchitect Kennisbank`;
    const description = pillarConfig?.description || article.yoast_head_json?.description || article.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160);
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
    const recentListings = await getListings();

    if (!article) {
        notFound();
    }

    const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const date = new Date(article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
    const breadcrumbTitle = article.title.rendered.replace(/<[^>]*>/g, '');
    const pillarType = getPillarType(params.slug, breadcrumbTitle);
    const pillarConfig = getPillarConfig(pillarType);

    // Extract city names from article content for contextual region links
    const popularCities = ['Blaricum', 'Laren', 'Heemstede', 'Zeist', 'Wassenaar', 'Noordwijk'];
    const contentText = article.content.rendered.toLowerCase();
    const mentionedCities = popularCities.filter(city =>
        contentText.includes(city.toLowerCase())
    ).slice(0, 3);

    // Get recent listings for internal linking
    const featuredListings = recentListings.slice(0, 2);

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

    const faqJsonLd = pillarConfig
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: pillarConfig.faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
        }
        : null;

    return (
        <div className="min-h-screen bg-white pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
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
                {pillarConfig && (
                    <p className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest border border-blue-100">
                        {pillarConfig.routeLabel}
                    </p>
                )}
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
                {pillarConfig && (
                    <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        {pillarConfig.intro}
                    </p>
                )}

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
                    {pillarConfig && (
                        <section className="mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <h2 className="font-bold text-navy-900 mb-3">Inhoud en route</h2>
                            <ul className="text-sm text-slate-700 space-y-2">
                                <li>- Stap 1: <Link href="/kennisbank" className="font-semibold text-navy-900 underline underline-offset-4">Bouwkavel kopen (2026)</Link></li>
                                <li>- Stap 2: <Link href="/kennisbank" className="font-semibold text-navy-900 underline underline-offset-4">Wat mag ik bouwen?</Link></li>
                                <li>- Stap 3: <Link href="/kennisbank" className="font-semibold text-navy-900 underline underline-offset-4">Faalkosten voorkomen</Link></li>
                            </ul>
                        </section>
                    )}

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

                    <ElementorContent
                        html={article.content.rendered}
                        postId={article.id}
                        siteUrl={WORDPRESS_SITE_URL}
                    />

                    {pillarConfig && (
                        <section className="mt-12 border-t border-slate-100 pt-10">
                            <h3 className="font-serif text-2xl font-bold mb-4 text-navy-900">Korte FAQ</h3>
                            <div className="space-y-4">
                                {pillarConfig.faq.map((item) => (
                                    <div key={item.q} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <p className="font-semibold text-slate-900 mb-1">{item.q}</p>
                                        <p className="text-sm text-slate-700">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
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
                                                {listing.adres}, {listing.plaats}
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
                    <div className="mt-12 border-t border-slate-100 pt-10">
                        <h3 className="font-serif text-2xl font-bold mb-4">Stop met zoeken</h3>
                        <p className="text-slate-600 mb-6">Laat ons dagelijks kavels matchen met uw profiel.</p>
                        <Link href="/" className="inline-block px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100">
                            Start Gratis Matching
                        </Link>
                    </div>

                    {pillarConfig && (
                        <section className="mt-10 border-t border-slate-100 pt-10">
                            <h3 className="font-serif text-2xl font-bold mb-4 text-navy-900">Clusterroute</h3>
                            <p className="text-slate-600 mb-4">
                                Volg deze route voor een complete kavelstrategie: eerst bouwkavel kopen, daarna bouwregels toetsen en vervolgens faalkosten beperken.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <Link href="/kennisbank" className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-navy-900 hover:border-navy-900">
                                    Stap 1: Kavel kopen in 2026
                                </Link>
                                <Link href="/kennisbank" className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-navy-900 hover:border-navy-900">
                                    Stap 2: Wat mag ik bouwen?
                                </Link>
                                <Link href="/kennisbank" className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-navy-900 hover:border-navy-900">
                                    Stap 3: Faalkosten voorkomen
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/kavelrapport/intake" className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-900 hover:border-slate-400">
                                    Start QuickScan intake
                                </Link>
                                <Link href="/kavelrapport" className="px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800">
                                    Laat uw omgevingsplan en bouwmogelijkheden door een architect checken voordat u tekent
                                </Link>
                            </div>
                        </section>
                    )}
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
