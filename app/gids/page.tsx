import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/guides/JsonLd";
import { GUIDES } from "@/lib/guides/guideIndex";

export const metadata: Metadata = {
  title: "Gidsen voor kavel kopen, bouwregels en faalkosten | KavelArchitect",
  description:
    "Kennisbank met uitgebreide gidsen over bouwkavels kopen, bouwregels en faalkosten. Praktische uitleg voor particuliere zelfbouwers in 2026.",
  alternates: {
    canonical: "/gids",
  },
};


import Image from "next/image";

export default function GuidesIndexPage() {
  const orderedGuides = [
    GUIDES["kavel-kopen"],
    GUIDES["wat-mag-ik-bouwen"],
    GUIDES["faalkosten-voorkomen"],
  ];
  const guideQuestions: Record<string, string[]> = {
    "kavel-kopen": [
      "Hoe werkt bedenktijd bij kavels?",
      "Welke planologische risico's zijn er?",
    ],
    "wat-mag-ik-bouwen": [
      "Wat mag ik bouwen volgens het omgevingsplan?",
      "Welke regels gelden voor goothoogte, nokhoogte en bijgebouwen?",
    ],
    "faalkosten-voorkomen": [
      "Wat zijn de grootste oorzaken van faalkosten bij nieuwbouw?",
      "Hoe voorkomt u vertraging en meerwerk in uw bouwproject?",
    ],
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
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gidsen voor kavel en bouwkeuzes",
    itemListElement: orderedGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.kavelarchitect.nl${guide.canonicalPath}`,
      name: guide.h1,
    })),
  };

  return (
    <>
      <div className="guides-index">
        <header className="guides-index-hero">
          <nav aria-label="Breadcrumb" className="guides-index-breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">Gidsen</li>
            </ol>
          </nav>
          <h1 className="guides-index-title">
            Kennisbank voor kavel en bouwkeuzes
          </h1>
          <h2 className="guides-index-eyebrow">Gidsen</h2>
          <p className="guides-index-lead">
            Hier vindt u drie verdiepende gidsen over kavel kopen, bouwregels en
            faalkosten bij nieuwbouw. Ideaal als u in 2026 een bouwkavel of
            nieuwbouwwoning wilt kopen en beter geinformeerd keuzes wilt maken.
            Deze gidsen over kavel kopen, gidsen over bouwregels en gidsen over
            faalkosten bij nieuwbouw helpen u om eerder de juiste beslissingen te nemen.
          </p>
        </header>

        <section className="guides-index-grid" aria-label="Beschikbare gidsen">
          {orderedGuides.map((guide) => {
            return (
              <article key={guide.slug} className="guides-index-card">
                <div className="guides-index-card-header">
                  {guide.heroImage && (
                    <Image
                      src={guide.heroImage}
                      alt={guide.h1}
                      fill
                      className="guides-index-card-image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  <div className="guides-index-card-overlay" />
                </div>

                <div className="guides-index-card-content">
                  <p className="guides-index-card-meta">
                    Bijgewerkt: {guide.updatedAtISO} • {guide.readingTimeMinutes} min
                  </p>
                  <h2 className="guides-index-card-title">{guide.h1}</h2>
                  <p className="guides-index-card-body">{guide.description}</p>
                  <ul className="mt-3 text-sm text-slate-600 list-disc pl-5 space-y-1">
                    {(guideQuestions[guide.slug] ?? []).map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </div>

                <div className="guides-index-card-footer">
                  <Link href={guide.canonicalPath} className="guides-index-card-link">
                    Lees gids
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        <section className="guides-index-hero" aria-label="Veelgestelde vragen">
          <h2 className="guides-index-title">Veelgestelde vragen</h2>
          <p className="guides-index-lead">
            Deze gidsen worden minimaal een keer per jaar geactualiseerd, zodat u werkt met actuele informatie.
          </p>
          <ul className="mt-4 space-y-2 text-base">
            <li>
              <Link href="/gids/kavel-kopen" className="text-navy-900 underline underline-offset-4 hover:text-blue-700">
                Hoe koop ik een bouwkavel in 2026?
              </Link>
            </li>
            <li>
              <Link href="/gids/wat-mag-ik-bouwen" className="text-navy-900 underline underline-offset-4 hover:text-blue-700">
                Wat mag ik bouwen op mijn kavel?
              </Link>
            </li>
            <li>
              <Link href="/gids/faalkosten-voorkomen" className="text-navy-900 underline underline-offset-4 hover:text-blue-700">
                Hoe voorkom ik faalkosten bij nieuwbouw?
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
    </>
  );
}

