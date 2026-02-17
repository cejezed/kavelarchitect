export interface Listing {
  kavel_id: string;
  funda_id?: string;
  source_url: string;
  adres: string;
  postcode: string;
  plaats: string;
  provincie: string;
  prijs: number;
  oppervlakte: number;
  seo_title?: string;
  seo_summary?: string;
  seo_article_html?: string;
  seo_title_ka?: string;
  seo_summary_ka?: string;
  seo_article_html_ka?: string;
  seo_title_zw?: string;
  seo_summary_zw?: string;
  seo_article_html_zw?: string;
  created_at: string;
  updated_at?: string;
  status: 'pending' | 'published' | 'skipped';
  potential_matches: CustomerProfile[];
  published_sites: string[];
  published_url?: string;
  image_url?: string;
  map_url?: string;
  lat?: number;
  lon?: number;
  specs?: {
    gmail?: any;
    scraped?: any;
    perplexity?: any;
    map_url?: string;
    lat?: number;
    lon?: number;
    // Building regulations
    goothoogte?: number;  // Gutter height in meters
    nokhoogte?: number;   // Ridge height in meters
    volume?: number;      // Maximum volume in m³
    regulations?: string; // Text description of building regulations
  };
}

export interface CustomerProfile {
  klant_id: string;
  naam: string;
  email: string;
  telefoonnummer?: string;
  provincies: string[];
  status: 'actief' | 'pauze' | 'inactief';
  min_prijs?: number;
  max_prijs?: number;
  min_oppervlakte?: number;
  bouwstijl?: string;
  tijdslijn?: string;
  bouwbudget?: string;
  kavel_type?: string;
  dienstverlening?: string;
  early_access_rapport?: boolean;
  opmerkingen?: string;
  heeft_kavel?: boolean;
}

export interface DashboardStats {
  pendingCount: number;
  publishedToday: number;
  totalMatches: number;
  lastUpdated: string;
  syncStatus: {
    status: 'ok' | 'error' | 'warning' | 'unknown';
    message: string;
    lastCheck: string | null;
  };
}

export type RedditPostStatus = 'new' | 'seen' | 'answered' | 'ignored';

export interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  createdAt: string;
  url: string;
  score: number;
  summary: string;
  topic: string;
  followupQuestions: string[];
  suggestedReply: string[];
  status: RedditPostStatus;
  seenAt?: string | null;
  answeredAt?: string | null;
  language?: string | null;
  hasSummary?: boolean;
}

export interface RedditSettings {
  subreddits: { name: string; enabled: boolean }[];
  starterSetEnabled: boolean;
  includeKeywords: string[];
  excludeKeywords: string[];
  questionSignals: string[];
  languageFilterNl: boolean;
  scanIntervalMins: number;
  maxPostsPerRun: number;
  maxItemsPerFeed?: number;
  politeMode: boolean;
  jitterSeconds?: number;
  backoffSeconds?: number;
  model: string;
  maxOutputTokens: number;
  summaryTemplate: string;
  strictJson: boolean;
  emailDigest: boolean;
  notificationScoreThreshold: number;
}

export interface RedditScanStats {
  lastRun: string | null;
  totalScanned: number;
  newPosts: number;
  rateLimited: boolean;
}
