import { MetadataRoute } from 'next';
import { getListings, getArticles } from '@/lib/api';
import { FAQ_ARTICLES } from '@/lib/faqArticles';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kavelarchitect.nl';

  // Fetch all published listings and articles
  const listings = await getListings();
  const articles = await getArticles();

  // Fetch all unique cities from published listings for regio pages
  let cityData: any[] | null = [];
  try {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('plaats')
      .eq('status', 'published');
    cityData = data;
  } catch (error) {
    console.error('Sitemap Supabase fetch failed:', error);
  }

  const uniqueCities = cityData
    ? Array.from(new Set(cityData.map(item => item.plaats)))
      .filter(Boolean)
      .map(city => city.toLowerCase().replace(/\s+/g, '-'))
    : [];

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
      url: `${baseUrl}/diensten`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kennisbank`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kavelrapport`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kavelrapport/intake`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic listing pages - use actual modified dates for better indexing
  const listingUrls: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/aanbod/${listing.kavel_id}`,
    lastModified: listing.created_at ? new Date(listing.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic article pages
  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/kennisbank/${article.slug}`,
    lastModified: new Date(article.modified || article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const faqUrls: MetadataRoute.Sitemap = FAQ_ARTICLES.map((faq) => ({
    url: `${baseUrl}/kennisbank/${faq.slug}`,
    lastModified: new Date(faq.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Programmatic SEO regio pages - dynamically generated from all published cities
  const regioUrls: MetadataRoute.Sitemap = uniqueCities.map((city) => ({
    url: `${baseUrl}/regio/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85, // High priority for conversion pages
  }));

  return [...staticPages, ...listingUrls, ...articleUrls, ...faqUrls, ...regioUrls];
}
