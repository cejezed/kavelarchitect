export type GuideSlug =
  | "kavel-kopen"
  | "wat-mag-ik-bouwen"
  | "faalkosten-voorkomen";

export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type GuideMeta = {
  slug: GuideSlug;
  title: string;
  description: string;
  h1: string;
  eyebrow?: string;
  updatedAtISO: string;
  readingTimeMinutes: number;
  heroImage?: string;
  ogImageUrl?: string;
  canonicalPath: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  cta: {
    title: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
    note?: string;
  };
  faqs: GuideFaqItem[];
};
