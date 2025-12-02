
import { Listing, DashboardStats, CustomerProfile } from '../types';

// Configuration
const API_BASE_URL = 'http://localhost:8765/api'; // Port defined in your config.yaml

// --- MOCK DATA FALLBACK (Used if backend is offline) ---
let mockListings: Listing[] = [
  {
    kavel_id: 'kv-001',
    funda_id: 'fd-99283',
    source_url: '#',
    adres: 'Berkenlaan 12 (Demo Data)',
    postcode: '1234 AB',
    plaats: 'Blaricum',
    provincie: 'Noord-Holland',
    prijs: 850000,
    oppervlakte: 1200,
    seo_title: 'Unieke bouwkavel in het groene hart van Blaricum',
    seo_summary: 'Een prachtige kavel van 1200m2 gelegen in een bosrijke omgeving. Ideaal voor een moderne villa met veel privacy.',
    seo_article_html: '<p>Dit is een <strong>unieke kans</strong> om uw droomhuis te realiseren in het Gooi.</p><h3>Locatie & Mogelijkheden</h3><p>De kavel biedt mogelijkheden voor een vrijstaande villa. Het bestemmingsplan laat een ruime bouwhoogte toe.</p><p><strong>Architect Advies:</strong> Door de breedte van het perceel is een moderne bungalow of rietgedekte villa hier perfect inpasbaar.</p>',
    created_at: new Date().toISOString(),
    status: 'pending',
    potential_matches: [
      { klant_id: 'c1', naam: 'Fam. Jansen', email: 'jansen@xs4all.nl', provincies: ['Noord-Holland'], status: 'actief' },
      { klant_id: 'c2', naam: 'P. de Vries', email: 'devries@gmail.com', provincies: ['Noord-Holland', 'Utrecht'], status: 'actief' }
    ],
    published_sites: []
  },
  {
    kavel_id: 'kv-002',
    funda_id: 'fd-11234',
    source_url: '#',
    adres: 'Hoofdstraat 45 (Demo Data)',
    postcode: '5678 CD',
    plaats: 'Wassenaar',
    provincie: 'Zuid-Holland',
    prijs: 1250000,
    oppervlakte: 2500,
    seo_title: 'Exclusief landgoed te koop in Wassenaar',
    seo_summary: 'Royaal perceel nabij de duinen. Perfect voor een klassieke villa onder architectuur.',
    seo_article_html: '<p>Wonen in Wassenaar betekent wonen in <em>weelde</em>. Dit perceel van 2500m2 ligt op steenworp afstand van de Amerikaanse School.</p>',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
    potential_matches: [
      { klant_id: 'c3', naam: 'Investeerder Pietersen', email: 'info@pietersen-holdings.nl', provincies: ['Zuid-Holland'], status: 'actief' }
    ],
    published_sites: []
  }
];

// Mock Published Data (History)
let mockPublishedHistory: Listing[] = [
  {
    kavel_id: 'kv-old-1',
    funda_id: 'fd-old-1',
    source_url: '#',
    adres: 'Kerkstraat 3',
    postcode: '1000 AA',
    plaats: 'Laren',
    provincie: 'Noord-Holland',
    prijs: 950000,
    oppervlakte: 800,
    seo_title: 'Bouwkavel Laren',
    seo_summary: '...',
    seo_article_html: '...',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'published',
    potential_matches: [],
    published_sites: ['kavelarchitect', 'zwijsen']
  },
  {
    kavel_id: 'kv-old-2',
    funda_id: 'fd-old-2',
    source_url: '#',
    adres: 'Bosweg 10',
    postcode: '3721 MA',
    plaats: 'Bilthoven',
    provincie: 'Utrecht',
    prijs: 1100000,
    oppervlakte: 1500,
    seo_title: 'Bosrijke kavel Bilthoven',
    seo_summary: '...',
    seo_article_html: '...',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    status: 'published',
    potential_matches: [],
    published_sites: ['zwijsen']
  }
];

let mockCustomers: CustomerProfile[] = [
  { klant_id: 'c1', naam: 'Fam. Jansen', email: 'jansen@xs4all.nl', provincies: ['Noord-Holland'], status: 'actief', min_prijs: 500000, max_prijs: 900000, min_oppervlakte: 500, heeft_kavel: false, dienstverlening: 'zoek' },
  { klant_id: 'c2', naam: 'P. de Vries', email: 'devries@gmail.com', provincies: ['Noord-Holland', 'Utrecht'], status: 'actief', min_prijs: 800000, max_prijs: 1500000, min_oppervlakte: 1000, heeft_kavel: false, dienstverlening: 'totaal' },
  { klant_id: 'c3', naam: 'Investeerder Pietersen', email: 'info@pietersen-holdings.nl', provincies: ['Zuid-Holland'], status: 'actief', min_prijs: 1000000, max_prijs: 3000000, min_oppervlakte: 2000, heeft_kavel: true, dienstverlening: 'totaal' },
];

let sessionStats = {
  publishedToday: 0,
  skippedToday: 0,
};

// Internal state to track connection
let isConnected = false;

// --- API IMPLEMENTATION ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Check if the last request was successful against the real backend
  isConnected: () => isConnected,

  getPendingListings: async (): Promise<Listing[]> => {
    try {
      // Try to fetch from real backend
      const response = await fetch(`${API_BASE_URL}/pending-listings`);
      if (!response.ok) throw new Error('Backend offline');
      const data = await response.json();

      isConnected = true; // Success!
      return data;
    } catch (error) {
      console.warn('Backend connection failed, using mock data.');
      isConnected = false; // Failed

      // Fallback to mock data
      await delay(400);
      return [...mockListings];
    }
  },

  getPublishedListings: async (): Promise<Listing[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/published-listings`);
      if (!response.ok) throw new Error('Backend offline');
      const data = await response.json();
      return data;
    } catch (e) {
      // Fallback mock history
      await delay(300);
      return [...mockPublishedHistory];
    }
  },

  getCustomers: async (): Promise<CustomerProfile[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) throw new Error('Backend offline');
      const data = await response.json();
      return data;
    } catch (error) {
      await delay(300);
      return [...mockCustomers];
    }
  },

  registerCustomer: async (profile: Partial<CustomerProfile>): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Fout bij opslaan');
      return data;
    } catch (error: any) {
      console.warn('Backend offline, simulating customer registration');
      // Mock logic
      mockCustomers.push({
        klant_id: `demo-${Date.now()}`,
        status: 'actief',
        naam: profile.naam || 'Demo Klant',
        email: profile.email || 'demo@test.nl',
        provincies: profile.provincies || [],
        // Defaults for demo
        min_prijs: profile.min_prijs || 0,
        max_prijs: profile.max_prijs || 0,
        min_oppervlakte: profile.min_oppervlakte || 0,
        heeft_kavel: !!profile.heeft_kavel,
        dienstverlening: profile.dienstverlening || 'zoek'
      } as CustomerProfile);
      return { success: true, message: "(DEMO) Uw KavelAlert is geactiveerd!" };
    }
  },

  getStats: async (): Promise<DashboardStats> => {
    try {
      // Try to fetch real stats if endpoint exists
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Stats endpoint offline');
      return await response.json();
    } catch (e) {
      // Mock stats calculation
      await delay(200);
      const pendingCount = mockListings.length;
      const matchCount = mockListings.reduce((acc, l) => acc + l.potential_matches.length, 0);
      return {
        pendingCount: pendingCount,
        publishedToday: sessionStats.publishedToday,
        totalMatches: 12 + matchCount,
        lastUpdated: new Date().toISOString(),
        syncStatus: { status: 'unknown', message: 'Demo Mode (Geen verbinding)', lastCheck: null }
      };
    }
  },

  triggerSync: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sync`, { method: 'POST' });
      if (!response.ok) throw new Error('Sync failed');
      return true;
    } catch (e) {
      console.warn('Backend offline, cannot trigger sync.');
      await delay(1000); // Fake delay
      return true; // Pretend it worked in demo
    }
  },

  addManualListing: async (url: string): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/listings/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn('Backend offline, simulating manual add.');
      await delay(1000);
      return { success: true, message: "(DEMO) Kavel toegevoegd (simulatie)" };
    }
  },

  publishListing: async (kavelId: string, sites: string[]): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/publish/${kavelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sites })
      });

      if (!response.ok) throw new Error('Failed to publish');

      const result = await response.json();
      return { success: true, message: result.message || 'Succesvol gepubliceerd' };
    } catch (e) {
      console.warn('Backend offline, simulating publish action locally.');

      await delay(800);
      const listingIndex = mockListings.findIndex(l => l.kavel_id === kavelId);
      if (listingIndex === -1) return { success: false, message: 'Kavel niet gevonden' };

      const listing = mockListings[listingIndex];

      // Move to history in mock
      mockPublishedHistory.unshift({
        ...listing,
        status: 'published',
        published_sites: sites
      });

      mockListings = mockListings.filter(l => l.kavel_id !== kavelId);
      sessionStats.publishedToday += 1;

      // Return simulated success message
      return {
        success: true,
        message: `(DEMO) Gepubliceerd op ${sites.join(' & ')} en opgeslagen in Google Sheets.`
      };
    }
  },

  skipListing: async (kavelId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/skip/${kavelId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to skip');
      return true;
    } catch (e) {
      console.warn('Backend offline, simulating skip action locally.');
      await delay(500);
      mockListings = mockListings.filter(l => l.kavel_id !== kavelId);
      sessionStats.skippedToday += 1;
      return true;
    }
  },

  updateListing: async (kavelId: string, updates: Partial<Listing>): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/listings/${kavelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update');
      return { success: true, message: 'Wijzigingen opgeslagen' };
    } catch (e) {
      console.warn('Backend offline, simulating update action locally.');
      await delay(300);

      // Update mock data
      const idx = mockListings.findIndex(l => l.kavel_id === kavelId);
      if (idx !== -1) {
        mockListings[idx] = { ...mockListings[idx], ...updates };
      }

      return { success: true, message: '(DEMO) Wijzigingen lokaal opgeslagen' };
    }
  }
};