import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES, getGuideMeta } from "@/lib/guides/guideIndex";
import { getGuideMdxSource } from "@/lib/guides/guideContent";
import { renderMdx } from "@/lib/mdx/mdx";
import { GuideLayout } from "@/components/guides/GuideLayout";
import type { GuideSlug } from "@/lib/guides/guideTypes";
import { JsonLd } from "@/components/guides/JsonLd";

function buildToc(slug: GuideSlug) {
  if (slug === "kavel-kopen") {
    return [
      { id: "intro", label: "Stappenplan en miskooprisico" },
      { id: "fouten", label: "Veelgemaakte fouten" },
      { id: "bedenktijd", label: "Aankoop via gemeente of makelaar" },
      { id: "kosten", label: "Welke kosten komen erbij?" },
      { id: "hypotheek-2026", label: "Financiering, BKR en zekerheden" },
      { id: "verandert-2026", label: "Wat verandert er in 2026?" },
      { id: "checklist", label: "Kavel kopen checklist" },
      { id: "faq", label: "Veelgestelde vragen" },
      { id: "cluster-route", label: "Clusterroute" },
      { id: "stappen-na-aankoop", label: "Stappen na aankoop" },
    ];
  }
  if (slug === "wat-mag-ik-bouwen") {
    return [
      { id: "intro", label: "Wat mag ik bouwen volgens omgevingsplan?" },
      { id: "goothoogte", label: "Goothoogte en bouwhoogte" },
      { id: "bijgebouwen", label: "Bijgebouwen: regels en valkuilen" },
      { id: "welstand", label: "Kavelpaspoort en welstand" },
      { id: "interpretatie", label: "Interpretatie van planregels" },
      { id: "bopa", label: "BOPA uitgelegd" },
      { id: "vergunningduur", label: "Hoe lang duurt vergunning echt?" },
      { id: "stappenplan", label: "15 minuten check" },
      { id: "faq", label: "Veelgestelde vragen" },
      { id: "cluster-route", label: "Clusterroute" },
      { id: "volgende-stap", label: "Volgende stap" },
    ];
  }

  return [
    { id: "wat-zijn-faalkosten", label: "Wat zijn faalkosten?" },
    { id: "hoe-groot", label: "Hoe groot zijn faalkosten?" },
    { id: "oorzaken", label: "5 grootste oorzaken" },
    { id: "vooraf", label: "Faalkosten voor aankoop" },
    { id: "case", label: "Mini-case: domino-effect" },
    { id: "checklist", label: "Checklist" },
    { id: "faq", label: "Veelgestelde vragen" },
    { id: "cluster-route", label: "Clusterroute" },
    { id: "conclusie", label: "Strategische conclusie" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const meta = getGuideMeta(params.slug);
  if (!meta) return {};

  const baseUrl = "https://www.kavelarchitect.nl";
  const url = `${baseUrl}${meta.canonicalPath}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: meta.canonicalPath,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "KavelArchitect",
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export default async function GuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const meta = getGuideMeta(params.slug);
  if (!meta) return notFound();

  const slug = meta.slug;
  const toc = buildToc(slug);
  const mdxSource = getGuideMdxSource(slug);
  const content = await renderMdx(mdxSource);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.h1,
    description: meta.description,
    dateModified: meta.updatedAtISO,
    datePublished: meta.updatedAtISO,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.kavelarchitect.nl${meta.canonicalPath}`,
    },
    publisher: {
      "@type": "Organization",
      name: "KavelArchitect",
    },
    author: {
      "@type": "Person",
      name: "Jules Zwijsen",
      jobTitle: "Architect",
      url: "https://www.kavelarchitect.nl/over-ons",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.kavelarchitect.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gidsen",
        item: "https://www.kavelarchitect.nl/gids",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.h1,
        item: `https://www.kavelarchitect.nl${meta.canonicalPath}`,
      },
    ],
  };

  const howToSchema =
    slug === "wat-mag-ik-bouwen"
      ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Zo controleert u in 15 minuten wat u mag bouwen",
        description:
          "Snelle controle op bouwmogelijkheden via Regels op de kaart, definities en kavelvoorwaarden.",
        totalTime: "PT15M",
        step: [
          { "@type": "HowToStep", text: "Ga naar het Omgevingsloket." },
          {
            "@type": "HowToStep",
            text: "Zoek uw adres en open Regels op de kaart.",
          },
          {
            "@type": "HowToStep",
            text: "Controleer het bouwvlak en bebouwingspercentage.",
          },
          {
            "@type": "HowToStep",
            text: "Lees de definities van peil, goothoogte en bouwhoogte.",
          },
          {
            "@type": "HowToStep",
            text: "Controleer regels voor bijgebouwen.",
          },
          {
            "@type": "HowToStep",
            text: "Zoek of er een kavelpaspoort of beeldkwaliteitsplan geldt.",
          },
          {
            "@type": "HowToStep",
            text: "Noteer of uw ontwerp binnen deze kaders past.",
          },
        ],
      }
      : slug === "kavel-kopen"
        ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Checklist: waar moet u op letten bij het kopen van een kavel?",
          description:
            "Snelle pre-aankoopcontrole op juridische, planologische en financiele risico's bij een bouwkavel.",
          totalTime: "PT15M",
          step: [
            {
              "@type": "HowToStep",
              text: "Controleer of ontbindende voorwaarden zijn opgenomen.",
            },
            {
              "@type": "HowToStep",
              text: "Bekijk het omgevingsplan via Regels op de kaart.",
            },
            {
              "@type": "HowToStep",
              text: "Check erfdienstbaarheden en kadastrale beperkingen.",
            },
            {
              "@type": "HowToStep",
              text: "Bereken de werkelijke bouwkosten per m2.",
            },
            {
              "@type": "HowToStep",
              text: "Houd rekening met 10,4% overdrachtsbelasting.",
            },
            {
              "@type": "HowToStep",
              text: "Informeer naar hypotheekacceptatie voor de kavel.",
            },
            {
              "@type": "HowToStep",
              text: "Reserveer een realistische buffer (7-12%).",
            },
          ],
        }
        : slug === "faalkosten-voorkomen"
          ? {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Faalkosten voorkomen bij nieuwbouw",
            description:
              "Stappen om faalkosten te beperken door betere voorbereiding en vroege toetsing.",
            step: [
              {
                "@type": "HowToStep",
                name: "Toets planregels vooraf",
                text: "Laat planregels en interpretatie toetsen voor aankoop.",
              },
              {
                "@type": "HowToStep",
                name: "Werk een helder PvE uit",
                text: "Breng wensen en randvoorwaarden scherp in beeld voordat u offertes aanvraagt.",
              },
              {
                "@type": "HowToStep",
                name: "Reken met actuele marktprijzen",
                text: "Maak een begroting op actuele marktprijzen met een buffer van 7-12%.",
              },
            ],
          }
          : null;

  return (
    <>
      <GuideLayout meta={meta} toc={toc}>
        {content}
      </GuideLayout>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {howToSchema ? <JsonLd data={howToSchema} /> : null}
    </>
  );
}
