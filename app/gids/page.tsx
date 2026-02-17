import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/guides/JsonLd";
import { GUIDES } from "@/lib/guides/guideIndex";

export const metadata: Metadata = {
  title: "Gidsen voor kavel kopen, bouwregels en faalkosten | KavelArchitect",
  description:
    "Praktische gidsen over kavel kopen, wat u mag bouwen en hoe u faalkosten voorkomt.",
  alternates: {
    canonical: "/gids",
  },
};


import Image from "next/image";

export default function GuidesIndexPage() {
  const guides = Object.values(GUIDES);
  const orderedGuides = [
    GUIDES["kavel-kopen"],
    GUIDES["wat-mag-ik-bouwen"],
    GUIDES["faalkosten-voorkomen"],
  ];

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
          <p className="guides-index-eyebrow">Gidsen</p>
          <h1 className="guides-index-title">
            Kennisbank voor kavel en bouwkeuzes
          </h1>
          <p className="guides-index-lead">
            Drie verdiepende gidsen voor betere keuzes vooraf: aankoop, regels en
            risico.
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
      </div>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
    </>
  );
}

