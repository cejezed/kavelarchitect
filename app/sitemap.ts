import { MetadataRoute } from 'next';
import { getListings, getArticles } from '@/lib/api';

// Featured cities for programmatic SEO
const FEATURED_CITIES = [
  'blaricum', 'laren', 'hilversum', 'huizen', 'naarden',
  'bloemendaal', 'heemstede', 'haarlem', 'wassenaar', 'noordwijk',
  'voorschoten', 'leidschendam', 'zoetermeer',
  'bunnik', 'de-bilt', 'zeist',
  'oisterwijk', 'eersel',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kavelarchitect.nl';

  // Fetch all published listings and articles
  const listings = await getListings();
  const articles = await getArticles();

  // Static pages with priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/aanbod`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kennisbank`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic listing pages
  const listingUrls: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/aanbod/${listing.kavel_id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic article pages
  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/kennisbank/${article.slug}`,
    lastModified: new Date(article.modified || article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Programmatic SEO regio pages
  const regioUrls: MetadataRoute.Sitemap = FEATURED_CITIES.map((city) => ({
    url: `${baseUrl}/regio/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85, // High priority for conversion pages
  }));

  return [...staticPages, ...listingUrls, ...articleUrls, ...regioUrls];
}