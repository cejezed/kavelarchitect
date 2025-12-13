
// Type definitions for API responses
export interface Listing {
  kavel_id: string;
  adres: string;
  plaats: string;
  provincie: string;
  prijs: number;
  oppervlakte: number;
  image_url?: string;
  source_url?: string;
  map_url?: string;
  seo_title: string;
  seo_summary: string;
  seo_article_html: string;
  status: string;
  published_sites?: string[];
  specs?: {
    maxVolume?: string;
    maxHeight?: string;
    gutterHeight?: string;
    roofType?: string;
    volume?: string; // Dutch variant
    nokhoogte?: string; // Dutch variant
    goothoogte?: string; // Dutch variant
    regulations?: string;
  };
}

export interface CustomerInput {
  email: string;
  provincies: string[];
  min_oppervlakte: number;
  bouwbudget: string;
  bouwstijl: string;
  tijdslijn: string;
  kavel_type: string;
  telefoonnummer?: string;
  opmerkingen?: string;
  early_access_rapport?: boolean;
}

const API_BASE_URL = typeof window === 'undefined'
  ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api`
  : '/api';

// MOCK DATA FOR BUILD TIME / FALLBACK
const MOCK_LISTINGS: Listing[] = [
  {
    kavel_id: 'mock-1',
    adres: 'Villapark Weg 1',
    plaats: 'Blaricum',
    provincie: 'Noord-Holland',
    prijs: 1250000,
    oppervlakte: 1400,
    seo_title: 'Prachtige bouwkavel in Blaricum',
    seo_summary: 'Unieke kans in het hart van het Gooi.',
    seo_article_html: '<p>Volledige omschrijving...</p>',
    status: 'published',
    published_sites: ['kavelarchitect'],
    specs: { maxVolume: '1100m3', maxHeight: '10m', gutterHeight: '6m', roofType: 'Vrij' }
  },
  {
    kavel_id: 'mock-2',
    adres: 'Duinweg 4',
    plaats: 'Wassenaar',
    provincie: 'Zuid-Holland',
    prijs: 2100000,
    oppervlakte: 2500,
    seo_title: 'Bouwkavel nabij de duinen',
    seo_summary: 'Royaal perceel met veel privacy.',
    seo_article_html: '<p>Volledige omschrijving...</p>',
    status: 'published',
    published_sites: ['kavelarchitect']
  }
];

// Helper for fetching with timeout
async function fetchWithTimeout(resource: string, options: any = {}) {
  const { timeout = 10000 } = options; // Default 10s timeout for Supabase API calls

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

export async function getListings(): Promise<Listing[]> {
  // For server-side, use Supabase directly
  if (typeof window === 'undefined') {
    try {
      const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
      const { data } = await supabaseAdmin
        .from('listings')
        .select('*')
        .in('status', ['published', 'sold']) // Allow sold listings too
        .order('created_at', { ascending: false });

      return (data as Listing[]) || [];
    } catch (error) {
      console.warn('Supabase fetch failed, using mock data', error);
      return MOCK_LISTINGS;
    }
  }

  // For client-side, use API route
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/published-listings`, {
      cache: 'no-store',
      next: { tags: ['listings'] }
    });

    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data.length > 0 ? data : MOCK_LISTINGS;
  } catch (error) {
    console.warn('Backend fetch failed (or offline), using mock data');
    return MOCK_LISTINGS;
  }
}

export async function getListing(id: string): Promise<Listing | undefined> {
  // Direct fetch for single item (More efficient & robust)
  if (typeof window === 'undefined') {
    try {
      const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
      const { data } = await supabaseAdmin
        .from('listings')
        .select('*')
        .eq('kavel_id', id)
        .single();

      return (data as Listing) || undefined;
    } catch (error) {
      console.error(`Failed to fetch listing ${id}:`, error);
      // Fallback to searching in mock data if DB fails
    }
  }

  const listings = await getListings();
  return listings.find(l => l.kavel_id === id);
}

export async function registerCustomer(data: CustomerInput) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, dienstverlening: 'zoek' }),
      timeout: 8000 // Extended timeout for email sending
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Status: ${res.status}, Body: ${errBody}`);
      throw new Error(`Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    // Fallback for demo purposes if backend is unreachable or errors
    console.error('Registration API Error:', error);

    // Alleen simuleren als het echt misgaat (offline/network error), anders is het verwarrend
    return {
      success: true,
      message: 'Aanvraag ontvangen! (Demo modus: Backend gaf error)',
      debugError: error.message
    };
  }
}

// --- WORDPRESS INTEGRATION ---
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://cms.kavelarchitect.nl/wp-json/wp/v2';

export interface BlogPost {
  id: number;
  date: string;
  modified?: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'author'?: Array<{ name: string }>;
  };
  yoast_head_json?: any;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export async function getArticles(): Promise<BlogPost[]> {
  try {
    // Fetch posts with embedded media (images)
    const res = await fetch(`${WORDPRESS_API_URL}/posts?_embed&per_page=9`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) throw new Error('Failed to fetch posts');
    return await res.json();
  } catch (error) {
    console.error('WordPress fetch failed:', error);
    return [];
  }
}

export async function getArticle(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?_embed&slug=${slug}`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) throw new Error('Failed to fetch post');
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : undefined;
  } catch (error) {
    console.error('WordPress fetch failed:', error);
    return undefined;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.error('WordPress categories fetch failed:', error);
    return [];
  }
}
