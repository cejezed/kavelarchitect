import { FAQ_ARTICLES, type FaqArticle } from '../faqArticles';
import type { GuideSlug } from './guideTypes';

export const GUIDE_RELATED_ARTICLES: Record<GuideSlug, string[]> = {
    'kavel-kopen': [
        'hoe-vind-ik-een-bouwkavel-in-nederland',
        'waar-kan-ik-een-kavel-kopen',
        'waarop-letten-bij-kopen-bouwkavel',
        'welke-kosten-bij-kopen-kavel',
        'wat-kost-een-bouwkavel-gemiddeld',
        'hypotheek-voor-alleen-een-kavel',
        'is-investeren-in-bouwgrond-een-goed-idee'
    ],
    'wat-mag-ik-bouwen': [
        'bestemmingsplan-omgevingsplan-lezen',
        'wat-mag-ik-bouwen-op-mijn-kavel',
        'hoeveel-huizen-mag-je-bouwen-op-een-kavel',
        'hoe-vraag-ik-een-kavelpaspoort-op'
    ],
    'faalkosten-voorkomen': [
        'wat-zijn-de-stappen-na-kavelaankoop',
        'hoe-werkt-een-zelfbouwhypotheek',
        'hoe-bereken-ik-mijn-totale-budget'
    ]
};

export function getRelatedArticles(slug: GuideSlug): FaqArticle[] {
    const slugs = GUIDE_RELATED_ARTICLES[slug] || [];
    return FAQ_ARTICLES.filter(article => slugs.includes(article.slug));
}
