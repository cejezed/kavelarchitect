import { MetadataRoute } from 'next';
import { getListings } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getListings();
  
  const listingUrls = listings.map((listing) => ({
    url: `https://kavelarchitect.nl/aanbod/${listing.kavel_id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: 'https://kavelarchitect.nl',
      lastModified: new Date(),
    },
    {
      url: 'https://kavelarchitect.nl/aanbod',
      lastModified: new Date(),
    },
    {
      url: 'https://kavelarchitect.nl/kennisbank',
      lastModified: new Date(),
    },
    ...listingUrls,
  ];
}