import type { Company, Investor, FundingRound, Founder, Product, NewsArticle, PlatformStats, SearchResults, FeedItem, CompanyGraph, PaginatedResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Companies
  async getCompanies(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ data: Company[]; meta?: any }>(`/api/companies?${searchParams}`);
  }

  async getCompany(slug: string, includeRelations = false) {
    const params = includeRelations ? '?include=relations' : '';
    return this.request<{ data: Company }>(`/api/companies/${slug}${params}`);
  }

  async getCompanyFunding(slug: string, params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ data: FundingRound[]; meta?: any }>(`/api/companies/${slug}/funding?${searchParams}`);
  }

  async getCompanyProducts(slug: string) {
    return this.request<{ data: Product[] }>(`/api/companies/${slug}/products`);
  }

  async getCompanyGraph(slug: string) {
    return this.request<{ data: CompanyGraph }>(`/api/companies/${slug}/graph`);
  }

  async getTrendingCompanies(limit = 10) {
    return this.request<{ data: Company[] }>(`/api/companies/trending?limit=${limit}`);
  }

  // Investors
  async getInvestors(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ data: Investor[]; meta?: any }>(`/api/investors?${searchParams}`);
  }

  async getInvestor(slug: string) {
    return this.request<{ data: Investor }>(`/api/investors/${slug}`);
  }

  async getInvestorPortfolio(slug: string, params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ data: FundingRound[]; meta?: any }>(`/api/investors/${slug}/investments?${searchParams}`);
  }

  async getInvestorCoInvestors(slug: string, limit = 20) {
    return this.request<{ data: Array<Investor & { shared_deals: number }> }>(`/api/investors/${slug}/co-investors?limit=${limit}`);
  }

  async getMostActiveInvestors(days = 90, limit = 20) {
    return this.request<{ data: Investor[] }>(`/api/investors/most-active?days=${days}&limit=${limit}`);
  }

  // Founders
  async getFounder(slug: string) {
    return this.request<{ data: Founder }>(`/api/founders/${slug}`);
  }

  // Products
  async getProducts(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ data: Product[]; meta?: any }>(`/api/products?${searchParams}`);
  }

  async getProduct(slug: string) {
    return this.request<{ data: Product }>(`/api/products/${slug}`);
  }

  // News
  async getNews(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request<{ data: NewsArticle[]; meta?: any }>(`/api/news?${searchParams}`);
  }

  async getTrendingNews(limit = 10) {
    return this.request<{ data: NewsArticle[] }>(`/api/news/trending?limit=${limit}`);
  }

  // Search & Utility
  async search(query: string, limit = 10) {
    return this.request<{ data: SearchResults }>(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getStats() {
    return this.request<{ data: PlatformStats }>(`/api/stats`);
  }

  async getFeed(limit = 50) {
    return this.request<{ data: FeedItem[] }>(`/api/feed?limit=${limit}`);
  }
}

export const api = new ApiClient();

// Types for the API client
export type {
  Company,
  Investor,
  FundingRound,
  Founder,
  Product,
  NewsArticle,
  PaginatedResponse,
  CompanyGraph,
  PlatformStats,
  SearchResults,
  FeedItem,
} from '@/types';