import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, ArrowRight } from 'lucide-react';
import { getArticle, WORDPRESS_SITE_URL } from '@/lib/api';
import ElementorContent from '@/components/ElementorContent';

type PillarConfig = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  faqs: Array<{ q: string; a: string }>;
};

function detectPillar(slug: string, rawTitle: string): 'kavel-kopen' | 'bouwregels' | 'faalkosten' | null {
  const text = `${slug} ${rawTitle}`.toLowerCase();
  if (text.includes('faalkosten')) return 'faalkosten';
  if (text.includes('bouwen') || text.includes('omgevingsplan') || text.includes('bouwregels')) return 'bouwregels';
  if (text.includes('kavel') && text.includes('koop')) return 'kavel-kopen';
  return null;
}

function getPillarConfig(pillar: ReturnType<typeof detectPillar>): PillarConfig | null {
  if (pillar === 'kavel-kopen') {
    return {
      title: 'Kavel kopen in 2026 - stappenplan voor bouwkavel en zelfbouw | KavelArchitect',
      description: 'In 2026 een bouwkavel kopen? Praktisch stappenplan voor zelfbouwers: van budget en locatie tot risico\'s, BKR en koopcontract. Voorkom miskopen met architectenadvies.',
      h1: 'Kavel kopen in 2026: zo voorkomt u een miskoop',
      intro: 'In 2026 een bouwkavel kopen lijkt eenvoudiger dan het is: weinig aanbod, onduidelijke regels en hoge prijzen maken een miskoop snel gemaakt. Deze gids helpt particuliere zelfbouwers stap voor stap van eerste zoekvraag tot getekend koopcontract. U leert waar u bouwkavels vindt, hoe u aanbod betrouwbaar beoordeelt en welke planologische en financiele risico\'s u vooraf moet uitsluiten. Daarmee voorkomt u dat u te veel betaalt voor een kavel waarop u later minder mag bouwen dan u dacht.',
      faqs: [
        {
          q: 'Hoeveel eigen geld heb ik nodig om een bouwkavel te kopen in 2026?',
          a: 'Dat hangt af van koopsom, bijkomende kosten en financiering, maar reken op overdrachtsbelasting of btw, kosten koper (k.k.), voorbereidingskosten zoals architect en onderzoeken, en een eigen buffer voor tegenvallers.',
        },
        {
          q: 'Is een bouwkavel in 2026 altijd bouwrijp gemaakt?',
          a: 'Nee, veel kavels zijn niet volledig bouwrijp. Soms moet u zelf nog ontsluiting, nutsvoorzieningen, fundering of grondverbetering regelen, wat duizenden tot tienduizenden euro\'s extra kan kosten.',
        },
        {
          q: 'Waar vind ik bouwkavels die niet op Funda staan?',
          a: 'Off-market kavels vindt u via gemeenten, lokale makelaars, projectontwikkelaars, notarissen en door actief in te schrijven op wachtlijsten en zoekservices voor bouwkavels.',
        },
        {
          q: 'Wat is het verschil tussen een kavel kopen van een gemeente en van een ontwikkelaar?',
          a: 'Gemeenten werken vaak met loting en strikte randvoorwaarden, ontwikkelaars met onderhandelen en pakketoplossingen. De juridische voorwaarden, prijzen en bouwvrijheid kunnen sterk verschillen.',
        },
      ],
    };
  }

  if (pillar === 'bouwregels') {
    return {
      title: 'Wat mag ik bouwen op mijn kavel? Omgevingsplan en bouwregels uitgelegd (2026) | KavelArchitect',
      description: 'Twijfelt u wat u mag bouwen op uw kavel? Uitleg van omgevingsplan, bouwregels, goot- en nokhoogte, bijgebouwen en veelgemaakte fouten bij zelfbouw in 2026.',
      h1: 'Wat mag ik bouwen op mijn kavel? Zo leest u het omgevingsplan in 2026',
      intro: 'Veel kavelkopers ontdekken pas na de koop dat ze minder mogen bouwen dan ze dachten. Het omgevingsplan en de bijbehorende regels bepalen precies wat u op uw kavel mag bouwen: van goot- en nokhoogte tot bijgebouwen, kapvorm en gebruik. In deze gids leert u stap voor stap waar u de regels vindt, hoe u ze leest en hoe u valkuilen voorkomt. Zo weet u voordat u tekent of uw droomwoning daadwerkelijk binnen de bouwmogelijkheden van uw kavel past.',
      faqs: [
        {
          q: 'Hoe weet ik wat ik mag bouwen volgens het omgevingsplan?',
          a: 'In het omgevingsplan en de bijlagen vindt u regels over bouwvlak, goot- en nokhoogte, dakvorm, gebruik en bijgebouwen. Die bepalen samen de maximale omvang en functie van uw woning.',
        },
        {
          q: 'Mag ik op mijn kavel twee woningen of een dubbele woning bouwen?',
          a: 'Dat hangt af van de toegestane bestemming en het maximaal aantal woningen per bouwvlak. In veel plannen is slechts een hoofdgebouw met een woning toegestaan.',
        },
        {
          q: 'Mag ik mijn woning dichter bij de erfgrens bouwen dan in het plan staat?',
          a: 'Afwijken kan soms met een omgevingsvergunning of maatwerkregel, maar is nooit vanzelfsprekend. U moet kunnen onderbouwen dat de afwijking ruimtelijk inpasbaar is en voldoet aan beleid.',
        },
        {
          q: 'Hoe groot mogen bijgebouwen op mijn kavel zijn?',
          a: 'De maximale oppervlakte en hoogte van bijgebouwen is meestal apart geregeld, met regels voor bijgebouwen binnen en buiten het bouwvlak en soms een percentage van het erf dat bebouwd mag zijn.',
        },
      ],
    };
  }

  if (pillar === 'faalkosten') {
    return {
      title: 'Faalkosten voorkomen bij nieuwbouw (2026) - waarom projecten uitlopen en duurder worden | KavelArchitect',
      description: 'Nieuwbouwproject loopt uit of wordt duurder? Leer wat faalkosten zijn, waarom ze ontstaan en hoe u als zelfbouwer in 2026 vertraging en meerkosten voorkomt bij uw bouwproject.',
      h1: 'Faalkosten voorkomen bij nieuwbouw: zo blijft uw bouwproject binnen planning en budget',
      intro: 'Bij nieuwbouw en zelfbouw ontstaat een groot deel van de kosten niet door materialen, maar door fouten, miscommunicatie en vertraging: de zogeheten faalkosten. Projecten lopen uit, tekeningen kloppen niet met de regels en aannemers moeten werk overdoen, met duizenden euro\'s extra kosten als gevolg. In deze gids laten we zien waar faalkosten in de praktijk ontstaan en hoe u ze in 2026 kunt beperken met betere voorbereiding, heldere afspraken en een doordachte kavel- en bouwstrategie. Zo vergroot u de kans dat uw woning binnen planning en budget wordt opgeleverd.',
      faqs: [
        {
          q: 'Wat zijn de grootste oorzaken van faalkosten bij nieuwbouw?',
          a: 'Veel faalkosten ontstaan door onduidelijke uitvraag, wijzigingen tijdens het proces, slechte afstemming tussen partijen, fouten in tekeningen en onderschatting van risico\'s en planning.',
        },
        {
          q: 'Hoeveel procent van de bouwsom gaat gemiddeld op aan faalkosten?',
          a: 'In onderzoeken wordt vaak genoemd dat 5-15% van de bouwsom kan weglekken in faalkosten, zeker als voorbereiding, ontwerp en uitvoering niet goed op elkaar zijn afgestemd.',
        },
        {
          q: 'Hoe kan ik als zelfbouwer faalkosten vroeg in het traject beperken?',
          a: 'Door vroeg een helder programma van eisen op te stellen, het omgevingsplan goed te laten checken, een vast aanspreekpunt te hebben en afspraken met aannemers en adviseurs duidelijk vast te leggen.',
        },
        {
          q: 'Welke signalen wijzen erop dat mijn nieuwbouwproject dreigt uit te lopen?',
          a: 'Veel wijzigingen tijdens ontwerp, incomplete stukken bij vergunning, uitgelopen offertes, onduidelijke afspraken over meerwerk en een strakke planning zonder buffer zijn belangrijke alarmsignalen.',
        },
      ],
    };
  }

  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) {
    return {
      title: 'Gids niet gevonden | KavelArchitect',
      description: 'De opgevraagde gids bestaat niet.',
    };
  }

  const rawTitle = article.title.rendered.replace(/<[^>]*>/g, '');
  const pillar = detectPillar(params.slug, rawTitle);
  const config = getPillarConfig(pillar);
  const fallbackDescription = article.yoast_head_json?.description || article.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160);

  const title = config?.title || `${rawTitle} | Gids | KavelArchitect`;
  const description = config?.description || fallbackDescription;
  const canonicalUrl = `https://kavelarchitect.nl/gids/${params.slug}`;
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;

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
      type: 'article',
      siteName: 'KavelArchitect',
      locale: 'nl_NL',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: rawTitle }] : [],
    },
  };
}

export default async function GidsDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const rawTitle = article.title.rendered.replace(/<[^>]*>/g, '');
  const pillar = detectPillar(params.slug, rawTitle);
  const config = getPillarConfig(pillar);
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const date = new Date(article.modified || article.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kavelarchitect.nl' },
      { '@type': 'ListItem', position: 2, name: 'Gids', item: 'https://kavelarchitect.nl/gids' },
      { '@type': 'ListItem', position: 3, name: config?.h1 || rawTitle, item: `https://kavelarchitect.nl/gids/${params.slug}` },
    ],
  };

  const faqJsonLd = config
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      }
    : null;

  return (
    <main className="min-h-screen bg-white pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <div className="max-w-4xl mx-auto px-6 pt-12">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-8">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-slate-700">Home</Link></li>
            <li aria-hidden="true">&gt;</li>
            <li><Link href="/gids" className="hover:text-slate-700">Gids</Link></li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-slate-700">{config?.h1 || rawTitle}</li>
          </ol>
        </nav>

        <p className="inline-block mb-4 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest border border-blue-100">
          Onderdeel van de kavel-strategie-route
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight">
          {config?.h1 || rawTitle}
        </h1>
        {config?.intro && (
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            {config.intro}
          </p>
        )}
        <p className="text-sm text-slate-500 inline-flex items-center gap-2 mb-10">
          <Calendar size={14} />
          Bijgewerkt: {date}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {imageUrl && (
          <div className="relative h-96 w-full mb-10 rounded-2xl overflow-hidden shadow-sm">
            <Image src={imageUrl} alt={rawTitle} fill className="object-cover" priority />
          </div>
        )}

        <ElementorContent html={article.content.rendered} postId={article.id} siteUrl={WORDPRESS_SITE_URL} />

        {config && (
          <section className="mt-12 border-t border-slate-100 pt-10">
            <h2 className="font-serif text-2xl font-bold mb-4 text-navy-900">Veelgestelde vragen</h2>
            <div className="space-y-4">
              {config.faqs.map((faq) => (
                <article key={faq.q} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-1">{faq.q}</h3>
                  <p className="text-sm text-slate-700">{faq.a}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 border-t border-slate-100 pt-10">
          <h2 className="font-serif text-2xl font-bold mb-4 text-navy-900">Clusterroute</h2>
          <p className="text-slate-600 mb-4">
            Volg de drie pijlers in vaste volgorde om miskopen, planologische fouten en faalkosten te voorkomen.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/gids" className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-navy-900 hover:border-navy-900">
              Stap 1: Kavel kopen in 2026
            </Link>
            <Link href="/gids" className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-navy-900 hover:border-navy-900">
              Stap 2: Wat mag ik bouwen?
            </Link>
            <Link href="/gids" className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-navy-900 hover:border-navy-900">
              Stap 3: Faalkosten voorkomen
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/kavelrapport/intake" className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-slate-900 hover:border-slate-400">
              Start QuickScan intake
            </Link>
            <Link href="/kavelrapport" className="px-4 py-2 rounded-lg bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 inline-flex items-center gap-2">
              Laat uw omgevingsplan en bouwmogelijkheden door een architect checken voordat u tekent
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
