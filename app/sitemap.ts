import { MetadataRoute } from 'next';
import { getListings, getArticles } from '@/lib/api';
import { FAQ_ARTICLES } from '@/lib/faqArticles';
import { GUIDES } from '@/lib/guides/guideIndex';
import { NIEUWS_ITEMS } from '@/lib/news';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kavelarchitect.nl';

  const listings = await getListings();
  const articles = await getArticles();

  let cityData: any[] | null = [];
  try {
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
    const { data } = await supabaseAdmin
      .from('listings')
      .select('plaats')
      .eq('status', 'published');
    cityData = data;
  } catch (error) {
    cityData = [];
  }

  const uniqueCities = cityData
    ? Array.from(new Set(cityData.map(item => item.plaats)))
      .filter(Boolean)
      .map(city => city.toLowerCase().replace(/\s+/g, '-'))
    : [];

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
      url: `${baseUrl}/gids`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/nieuws`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
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

  const listingUrls: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/aanbod/${listing.kavel_id}`,
    lastModified: listing.created_at ? new Date(listing.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

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

  const guideUrls: MetadataRoute.Sitemap = Object.values(GUIDES).map((guide) => ({
    url: `${baseUrl}${guide.canonicalPath}`,
    lastModified: new Date(guide.updatedAtISO),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const nieuwsUrls: MetadataRoute.Sitemap = NIEUWS_ITEMS.map((item) => ({
    url: `${baseUrl}/nieuws/${item.slug}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const regioUrls: MetadataRoute.Sitemap = uniqueCities.map((city) => ({
    url: `${baseUrl}/regio/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticPages, ...guideUrls, ...nieuwsUrls, ...listingUrls, ...articleUrls, ...faqUrls, ...regioUrls];
}