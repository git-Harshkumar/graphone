export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  funding_total: number;
  employee_count?: number;
  founded_year?: number;
  hq_city?: string;
  hq_country?: string;
  logo_url?: string;
  website?: string;
  stage?: string;
  is_unicorn: boolean;
  valuation?: number;
  growth_score?: number;
  last_scraped_at?: string;
  data_confidence_score?: number;
  created_at?: string;
  updated_at?: string;
  trending_score?: number;
  funding_rounds?: FundingRound[];
  products?: Product[];
  founders?: Founder[];
  investors?: Investor[];
  stage_focus?: string[];
  sector_focus?: string[];
  twitter?: string;
  linkedin?: string;
}

export interface Investor {
  id: string;
  name: string;
  slug: string;
  type: 'VC' | 'Angel' | 'Corporate' | 'Family Office' | 'Accelerator';
  bio?: string;
  aum?: number;
  portfolio_count: number;
  stage_focus: string[];
  sector_focus: string[];
  location?: string;
  logo_url?: string;
  avg_check_size?: number;
  fund_number?: number;
  created_at?: string;
  updated_at?: string;
  portfolio?: FundingRound[];
  co_investors?: Array<Investor & { shared_deals: number }>;
}

export interface FundingRound {
  id: string;
  company_id: string;
  round_type: string;
  amount: number;
  currency: string;
  date: string;
  lead_investor_id?: string;
  co_investors: string[];
  valuation?: number;
  source_url?: string;
  created_at?: string;
  company?: Company;
  lead_investor?: Investor;
  co_investor_data?: Investor[];
}

export interface Founder {
  id: string;
  name: string;
  slug: string;
  title?: string;
  company_id: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
  location?: string;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
  company?: Company;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  category?: string;
  launch_date?: string;
  upvotes: number;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
  company?: Company;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source: string;
  tag: string;
  related_company_ids: string[];
  summary?: string;
  view_count: number;
  created_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      cursor?: string;
      hasMore: boolean;
      total?: number;
    };
  };
}

export interface CompanyGraph {
  company: Company;
  investors: Investor[];
  competitors: Company[];
  coInvestors: Investor[];
  products: Product[];
}

export interface PlatformStats {
  companies: number;
  investors: number;
  fundingRounds: number;
  totalFunding: number;
  founders: number;
  products: number;
  newsArticles: number;
  unicorns: number;
}

export interface SearchResults {
  companies: Company[];
  investors: Investor[];
  founders: Founder[];
  products: Product[];
}

export interface FeedItem {
  id: string;
  type: 'news' | 'funding' | 'company';
  title: string;
  description?: string;
  url?: string;
  published_at: string;
  source?: string;
  company?: Company;
  investor?: Investor;
  amount?: number;
  round_type?: string;
  score: number;
  recencyScore: number;
  finalScore: number;
}