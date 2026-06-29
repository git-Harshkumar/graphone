import useSWR from 'swr';
import { api } from '@/lib/api';
import type { Company, Investor, FundingRound, Founder, Product, NewsArticle, PlatformStats, SearchResults, FeedItem, CompanyGraph, PaginatedResponse } from '@/types';

// Fetcher for SWR
const fetcher = <T,>(url: string) => api.request<T>(url);

// Companies
export function useCompanies(params?: Record<string, string | number | undefined>) {
  const stringParams: Record<string, string> = {};
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) stringParams[k] = String(v);
    });
  }
  const searchParams = new URLSearchParams(stringParams);

  return useSWR<PaginatedResponse<Company>>(
    `/api/companies?${searchParams}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}

export function useCompany(slug: string, includeRelations = false) {
  const params = includeRelations ? '?include=relations' : '';
  return useSWR<{ data: Company }>(
    slug ? `/api/companies/${slug}${params}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

export function useCompanyFunding(slug: string, params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return useSWR<PaginatedResponse<FundingRound>>(
    slug ? `/api/companies/${slug}/funding?${searchParams}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

export function useCompanyProducts(slug: string) {
  return useSWR<{ data: Product[] }>(
    slug ? `/api/companies/${slug}/products` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

export function useCompanyGraph(slug: string) {
  return useSWR<{ data: CompanyGraph }>(
    slug ? `/api/companies/${slug}/graph` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 120000 }
  );
}

export function useTrendingCompanies(limit = 10) {
  return useSWR<{ data: Company[] }>(
    `/api/companies/trending?limit=${limit}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

// Investors
export function useInvestors(params?: Record<string, string | number | undefined>) {
  const stringParams: Record<string, string> = {};
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) stringParams[k] = String(v);
    });
  }
  const searchParams = new URLSearchParams(stringParams);
  return useSWR<PaginatedResponse<Investor>>(
    `/api/investors?${searchParams}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}

export function useInvestor(slug: string) {
  return useSWR<{ data: Investor }>(
    slug ? `/api/investors/${slug}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

export function useInvestorPortfolio(slug: string, params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return useSWR<PaginatedResponse<FundingRound>>(
    slug ? `/api/investors/${slug}/investments?${searchParams}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

export function useInvestorCoInvestors(slug: string, limit = 20) {
  return useSWR<{ data: Array<Investor & { shared_deals: number }> }>(
    slug ? `/api/investors/${slug}/co-investors?limit=${limit}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

export function useMostActiveInvestors(days = 90, limit = 20) {
  return useSWR<{ data: Array<Investor & { deal_count?: number }> }>(
    `/api/investors/most-active?days=${days}&limit=${limit}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );
}

// Founders
export function useFounder(slug: string) {
  return useSWR<{ data: Founder }>(
    slug ? `/api/founders/${slug}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

// Products
export function useProducts(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return useSWR<PaginatedResponse<Product>>(
    `/api/products?${searchParams}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}

export function useProduct(slug: string) {
  return useSWR<{ data: Product }>(
    slug ? `/api/products/${slug}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

// News
export function useNews(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return useSWR<PaginatedResponse<NewsArticle>>(
    `/api/news?${searchParams}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
}

export function useTrendingNews(limit = 10) {
  return useSWR<{ data: NewsArticle[] }>(
    `/api/news/trending?limit=${limit}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}

// Search & Utility
export function useSearch(query: string, limit = 10) {
  return useSWR<{ data: SearchResults }>(
    query.length >= 2 ? `/api/search?q=${encodeURIComponent(query)}&limit=${limit}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  );
}

export function useStats() {
  return useSWR<{ data: PlatformStats }>(
    '/api/stats',
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );
}

export function useFeed(limit = 50) {
  return useSWR<{ data: FeedItem[] }>(
    `/api/feed?limit=${limit}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
}