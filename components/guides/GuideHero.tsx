import type { GuideMeta } from "@/lib/guides/guideTypes";
import Image from "next/image";
import Link from "next/link";

export function GuideHero({ meta }: { meta: GuideMeta }) {
  const updated = new Date(meta.updatedAtISO).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="guide-hero">
      {meta.heroImage && (
        <div className="guide-hero-bg">
          <Image
            src={meta.heroImage}
            alt=""
            fill
            className="guide-hero-bg-image"
            priority
          />
          <div className="guide-hero-overlay" />
        </div>
      )}

      <div className="guide-hero-container">
        <div className="guide-hero-text">
          <nav aria-label="Breadcrumb" className="guide-breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/gids">Gidsen</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{meta.h1}</li>
            </ol>
          </nav>

          <div className="guide-badge">{meta.eyebrow ?? "Gids"}</div>
          <h1 className="guide-h1">{meta.h1}</h1>
          <p className="guide-lead">{meta.description}</p>

          <div className="guide-meta">
            <span>Bijgewerkt: {updated}</span>
            <span aria-hidden="true">•</span>
            <span>Leestijd: {meta.readingTimeMinutes} min</span>
          </div>
        </div>
      </div>
    </header>
  );
}
