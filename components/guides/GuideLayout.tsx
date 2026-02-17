import type { GuideMeta } from "@/lib/guides/guideTypes";
import { GuideHero } from "./GuideHero";
import { GuideToc } from "./GuideToc";
import { GuideCtaCard } from "./GuideCtaCard";
import { GuideFaq } from "./GuideFaq";
import { GuideRelatedArticles } from "./GuideRelatedArticles";
import { getRelatedArticles } from "@/lib/guides/guideRelated";

export function GuideLayout({
  meta,
  toc,
  children,
}: {
  meta: GuideMeta;
  toc: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  const relatedArticles = getRelatedArticles(meta.slug);

  return (
    <div className="guide-shell">
      <GuideHero meta={meta} />

      <div className="guide-grid">
        <aside className="guide-aside">
          <div className="guide-sticky">
            <GuideCtaCard cta={meta.cta} />
            <GuideToc items={toc} />
          </div>
        </aside>

        <main className="guide-main">
          <article className="guide-article">{children}</article>

          <section className="guide-divider" aria-hidden="true" />

          <GuideFaq items={meta.faqs} />

          <GuideRelatedArticles articles={relatedArticles} />
        </main>
      </div>
    </div>
  );
}
