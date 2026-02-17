import type { GuideFaqItem } from "@/lib/guides/guideTypes";
import { JsonLd } from "./JsonLd";

export function GuideFaq({ items }: { items: GuideFaqItem[] }) {
  if (!items?.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };

  return (
    <section className="guide-faq" aria-label="Veelgestelde vragen">
      <h2 className="guide-h2">Veelgestelde vragen</h2>

      <div className="guide-faq-list">
        {items.map((it, idx) => (
          <details key={idx} className="guide-faq-item">
            <summary className="guide-faq-q">{it.question}</summary>
            <div className="guide-faq-a">{it.answer}</div>
          </details>
        ))}
      </div>

      <JsonLd data={schema} />
    </section>
  );
}
