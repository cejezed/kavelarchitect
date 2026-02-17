import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { getArticles, type BlogPost } from '@/lib/api';

export const metadata = {
  title: 'Gidsen voor kavel kopen, bouwregels en faalkosten | KavelArchitect',
  description: 'Kennisbank met uitgebreide gidsen over bouwkavels kopen, bouwregels en faalkosten. Praktische uitleg voor particuliere zelfbouwers in 2026.',
  alternates: {
    canonical: 'https://kavelarchitect.nl/gids',
  },
};

type GuideCard = {
  article: BlogPost;
  label: string;
  intro: string;
  questions: string[];
  linkText: string;
};

function cleanTitle(title: string): string {
  return title.replace(/<[^>]*>/g, '');
}

function pickGuideCards(articles: BlogPost[]): GuideCard[] {
  const scored = articles.map((article) => {
    const text = `${article.slug} ${cleanTitle(article.title.rendered)}`.toLowerCase();
    let score = 0;
    if (text.includes('kavel') && text.includes('koop')) score += 3;
    if (text.includes('bouwen') || text.includes('bouwregels')) score += 2;
    if (text.includes('faalkosten')) score += 2;
    return { article, score, text };
  });

  const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 3);

  return sorted.map(({ article, text }) => {
    if (text.includes('faalkosten')) {
      return {
        article,
        label: 'Gids over faalkosten bij nieuwbouw',
        intro: 'Praktische gids om fouten in voorbereiding, ontwerp en uitvoering te voorkomen.',
        questions: [
          'Hoe voorkomt u faalkosten bij nieuwbouw?',
          'Welke keuzes besparen direct op ontwerp- en bouwfouten?',
        ],
        linkText: 'Hoe voorkom ik faalkosten bij nieuwbouw?',
      };
    }

    if (text.includes('bouwen') || text.includes('bouwregels')) {
      return {
        article,
        label: 'Gids over bouwregels',
        intro: 'Uitleg over wat u mag bouwen op uw kavel en welke regels doorslaggevend zijn.',
        questions: [
          'Wat mag ik bouwen op mijn kavel?',
          'Welke planologische regels bepalen het maximale bouwvolume?',
        ],
        linkText: 'Wat mag ik bouwen op mijn kavel?',
      };
    }

    return {
      article,
      label: 'Gids over kavel kopen',
      intro: 'Stappenplan voor veilig een bouwkavel kopen in 2026, met focus op risico en haalbaarheid.',
      questions: [
        'Hoe koop ik een bouwkavel in 2026?',
        'Welke planologische risico\'s moet u eerst uitsluiten?',
      ],
      linkText: 'Hoe koop ik een bouwkavel in 2026?',
    };
  });
}

export default async function GidsPage() {
  const articles = await getArticles();
  const guideCards = pickGuideCards(articles);
  const hasGuideCards = guideCards.length > 0;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kavelarchitect.nl' },
      { '@type': 'ListItem', position: 2, name: 'Gids', item: 'https://kavelarchitect.nl/gids' },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: guideCards.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cleanTitle(guide.article.title.rendered),
      url: `https://kavelarchitect.nl/gids/${guide.article.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section className="pt-24 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-slate-500">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-slate-700">Home</Link></li>
              <li aria-hidden="true">&gt;</li>
              <li className="text-slate-700">Gids</li>
            </ol>
          </nav>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Kennisbank voor kavel en bouwkeuzes
          </h1>
          <h2 className="font-bold uppercase tracking-widest text-sm text-blue-700 mb-6">
            Gidsen
          </h2>
          <p className="text-lg text-slate-700 max-w-4xl leading-relaxed">
            Hier vindt u drie verdiepende gidsen over kavel kopen, bouwregels en faalkosten. Ideaal als u in 2026
            een bouwkavel of nieuwbouwwoning wilt kopen en beter geinformeerd keuzes wilt maken.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Deze gidsen worden minimaal een keer per jaar geactualiseerd.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {guideCards.map((guide) => {
              const updated = new Date(guide.article.modified || guide.article.date).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <article key={guide.article.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-3">{guide.label}</p>
                  <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">
                    {cleanTitle(guide.article.title.rendered)}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">{guide.intro}</p>
                  <ul className="text-sm text-slate-700 space-y-2 mb-5">
                    {guide.questions.map((question) => (
                      <li key={question}>- {question}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      Bijgewerkt: {updated}
                    </span>
                  </div>
                  <Link
                    href={`/gids/${guide.article.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-navy-900 hover:text-blue-600"
                    title={guide.linkText}
                  >
                    Lees gids <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
            {!hasGuideCards && (
              <article className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">Gidsen worden geladen</h3>
                <p className="text-slate-600 mb-4">
                  De gidsen zijn tijdelijk niet beschikbaar via de CMS-koppeling. U kunt alle artikelen bekijken via de kennisbank.
                </p>
                <Link href="/kennisbank" className="inline-flex items-center gap-2 font-semibold text-navy-900 hover:text-blue-600">
                  Ga naar kennisbank <ArrowRight size={16} />
                </Link>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">Veelgestelde onderwerpen</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {guideCards.map((guide) => (
                <Link
                  key={`faq-${guide.article.id}`}
                  href={`/gids/${guide.article.slug}`}
                  className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700"
                >
                  <BookOpen size={16} />
                  {guide.linkText}
                </Link>
              ))}
              {!hasGuideCards && (
                <>
                  <Link href="/kennisbank" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700">
                    <BookOpen size={16} />
                    Hoe koop ik een bouwkavel in 2026?
                  </Link>
                  <Link href="/kennisbank" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700">
                    <BookOpen size={16} />
                    Wat mag ik bouwen op mijn kavel?
                  </Link>
                  <Link href="/kennisbank" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-700">
                    <BookOpen size={16} />
                    Hoe voorkomt u faalkosten bij nieuwbouw?
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-3">Regio's ontdekken</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Hier vindt u per gemeente actuele bouwkavels, inclusief off-market bouwkavels voor particuliere zelfbouwers.
            </p>
            <Link href="/regio" className="inline-flex items-center gap-2 font-semibold text-navy-900 hover:text-blue-600">
              Bekijk alle regio's <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-slate-600">
            KavelArchitect is een kennisbank voor zelfbouwers en villabouwers in Nederland, met praktische gidsen over
            bouwkavels, bouwregels, faalkosten en architectenbegeleiding.
          </p>
          <p className="text-slate-500 text-sm mt-3">
            Dit zijn onze drie pijlergidsen voor iedereen die een bouwkavel wil kopen of een nieuwbouwproject start.
          </p>
        </div>
      </section>
    </main>
  );
}
