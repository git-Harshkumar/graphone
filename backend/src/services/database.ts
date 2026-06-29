import { supabaseAdminClient, supabasePublicClient } from '../config/supabase';
import { cache, getOrSetCache, CACHE_KEYS } from './cache';
import type { CompanyFilters, InvestorFilters, PaginationParams } from '../types';

const PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const applyCompanyFilters = (query: any, filters: CompanyFilters) => {
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.stage) query = query.eq('stage', filters.stage);
  if (filters.country) query = query.ilike('hq_country', `%${filters.country}%`);
  if (filters.minFunding) query = query.gte('funding_total', filters.minFunding);
  if (filters.maxFunding) query = query.lte('funding_total', filters.maxFunding);
  if (filters.minEmployees) query = query.gte('employee_count', filters.minEmployees);
  if (filters.maxEmployees) query = query.lte('employee_count', filters.maxEmployees);
  if (filters.isUnicorn !== undefined) query = query.eq('is_unicorn', filters.isUnicorn);
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  return query;
};

const applyCompanySort = (query: any, sort?: string) => {
  switch (sort) {
    case 'trending':
      return query.order('growth_score', { ascending: false });
    case 'funded':
    case 'funding':
      return query.order('funding_total', { ascending: false });
    case 'new':
      return query.order('founded_year', { ascending: false });
    case 'valuation':
      return query.order('valuation', { ascending: false });
    case 'growth':
      return query.order('growth_score', { ascending: false });
    case 'employees':
      return query.order('employee_count', { ascending: false });
    default:
      return query.order('growth_score', { ascending: false });
  }
};

const applyCursorPagination = (query: any, cursor?: string, limit: number = PAGE_SIZE) => {
  const safeLimit = Math.min(limit, MAX_PAGE_SIZE);
  if (cursor) {
    try {
      const decoded = Buffer.from(cursor, 'base64').toString();
      const [id, createdAt] = decoded.split(':');
      query = query.or(`created_at.lt.${createdAt},and(created_at.eq.${createdAt},id.lt.${id})`);
    } catch {
      // Invalid cursor, ignore
    }
  }
  return query.limit(safeLimit + 1); // Fetch one extra to check hasMore
};

export const companyService = {
  async list(filters: CompanyFilters = {}, pagination: PaginationParams = {}) {
    const limit = pagination.limit ?? PAGE_SIZE;
    let query = supabasePublicClient.from('companies').select('*', { count: 'exact' });

    query = applyCompanyFilters(query, filters);
    query = applyCompanySort(query, filters.sort);
    query = applyCursorPagination(query, pagination.cursor, limit);

    const { data, error, count } = await query;
    if (error) throw error;

    const hasMore = (data?.length || 0) > limit;
    const items = hasMore ? data!.slice(0, limit) : data || [];
    const nextCursor = hasMore && items.length > 0
      ? Buffer.from(`${items[items.length - 1].id}:${items[items.length - 1].created_at}`).toString('base64')
      : null;

    return { data: items, nextCursor, hasMore, total: count };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabasePublicClient
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  async getWithRelations(slug: string) {
    const { data, error } = await supabasePublicClient.rpc('get_company_with_relations', {
      p_slug: slug,
    });
    if (error) throw error;
    return data;
  },

  async getFunding(companyId: string, pagination: PaginationParams = {}) {
    const limit = pagination.limit || PAGE_SIZE;
    let query = supabasePublicClient
      .from('funding_rounds')
      .select('*, lead_investor:investors!lead_investor_id(*), co_investors:investors!funding_rounds_co_investors_fkey(*)')
      .eq('company_id', companyId)
      .order('date', { ascending: false });

    query = applyCursorPagination(query, pagination.cursor, limit);

    const { data, error } = await query;
    if (error) throw error;

    const hasMore = (data?.length || 0) > limit;
    const items = hasMore ? data!.slice(0, limit) : data || [];
    const nextCursor = hasMore && items.length > 0
      ? Buffer.from(`${items[items.length - 1].id}:${items[items.length - 1].date}`).toString('base64')
      : null;

    return { data: items, nextCursor, hasMore };
  },

  async getProducts(companyId: string) {
    const { data, error } = await supabasePublicClient
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .order('upvotes', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getTrending(limit: number = 10) {
    return getOrSetCache(CACHE_KEYS.TRENDING_COMPANIES, async () => {
      const { data, error } = await supabasePublicClient
        .from('company_trending_scores')
        .select('*')
        .order('trending_score', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    }, 300);
  },

  async getGraph(slug: string) {
    const cacheKey = CACHE_KEYS.COMPANY_GRAPH(slug);
    return getOrSetCache(cacheKey, async () => {
      const { data: company, error: companyError } = await supabasePublicClient
        .from('companies')
        .select('id, name, slug, logo_url, category, stage')
        .eq('slug', slug)
        .single();
      if (companyError) throw companyError;

      const companyId = company.id;

      // Get investors
      const { data: fundingRounds } = await supabasePublicClient
        .from('funding_rounds')
        .select('lead_investor_id, co_investors')
        .eq('company_id', companyId);

      const investorIds = new Set<string>();
      fundingRounds?.forEach(fr => {
        if (fr.lead_investor_id) investorIds.add(fr.lead_investor_id);
        fr.co_investors?.forEach((id: string) => investorIds.add(id));
      });

      const { data: investors } = await supabasePublicClient
        .from('investors')
        .select('id, name, slug, logo_url, type')
        .in('id', Array.from(investorIds));

      // Get competitors (same category, similar stage)
      const { data: competitors } = await supabasePublicClient
        .from('companies')
        .select('id, name, slug, logo_url, category, stage, funding_total')
        .eq('category', company.category)
        .neq('id', companyId)
        .order('funding_total', { ascending: false })
        .limit(10);

      // Get co-investors (investors who invested in same companies)
      const { data: coInvestors } = await supabasePublicClient
        .from('funding_rounds')
        .select('lead_investor_id, co_investors')
        .in('company_id', competitors?.map(c => c.id) || []);

      const coInvestorIds = new Set<string>();
      coInvestors?.forEach(fr => {
        if (fr.lead_investor_id) coInvestorIds.add(fr.lead_investor_id);
        fr.co_investors?.forEach((id: string) => coInvestorIds.add(id));
      });

      const { data: coInvestorData } = await supabasePublicClient
        .from('investors')
        .select('id, name, slug, logo_url, type')
        .in('id', Array.from(coInvestorIds))
        .limit(10);

      // Get products
      const { data: products } = await supabasePublicClient
        .from('products')
        .select('id, name, description, category, upvotes, logo_url')
        .eq('company_id', companyId)
        .order('upvotes', { ascending: false })
        .limit(10);

      return {
        company,
        investors: investors || [],
        competitors: competitors || [],
        coInvestors: coInvestorData || [],
        products: products || [],
      };
    }, 300);
  },

  async create(data: any) {
    const { data: company, error } = await supabaseAdminClient
      .from('companies')
      .insert(data)
      .select()
      .single();
    if (error) throw error;

    cache.del(CACHE_KEYS.TRENDING_COMPANIES);
    cache.del(CACHE_KEYS.STATS);
    return company;
  },
};

export const investorService = {
  async list(filters: InvestorFilters = {}, pagination: PaginationParams = {}) {
    const limit = pagination.limit ?? PAGE_SIZE;
    let query = supabasePublicClient.from('investors').select('*', { count: 'exact' });

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.stageFocus) query = query.contains('stage_focus', [filters.stageFocus]);
    if (filters.sectorFocus) query = query.contains('sector_focus', [filters.sectorFocus]);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
    }

    query = applyCursorPagination(query, pagination.cursor, limit);
    query = query.order('portfolio_count', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;

    const hasMore = (data?.length || 0) > limit;
    const items = hasMore ? data!.slice(0, limit) : data || [];
    const nextCursor = hasMore && items.length > 0
      ? Buffer.from(`${items[items.length - 1].id}:${items[items.length - 1].created_at}`).toString('base64')
      : null;

    return { data: items, nextCursor, hasMore, total: count };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabasePublicClient
      .from('investors')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  async getPortfolio(investorId: string, pagination: PaginationParams = {}) {
    const limit = pagination.limit ?? PAGE_SIZE;
    const cacheKey = CACHE_KEYS.INVESTOR_PORTFOLIO(investorId);
    return getOrSetCache(cacheKey, async () => {
      let query = supabasePublicClient
        .from('funding_rounds')
        .select('*, company:companies(*)')
        .or(`lead_investor_id.eq.${investorId},co_investors.cs.{${investorId}}`)
        .order('date', { ascending: false });

      query = applyCursorPagination(query, pagination.cursor, limit);

      const { data, error } = await query;
      if (error) throw error;

      const hasMore = (data?.length || 0) > limit;
      const items = hasMore ? data!.slice(0, limit) : data || [];
      const nextCursor = hasMore && items.length > 0
        ? Buffer.from(`${items[items.length - 1].id}:${items[items.length - 1].date}`).toString('base64')
        : null;

      return { data: items, nextCursor, hasMore };
    }, 300);
  },

  async getCoInvestors(investorId: string, limit: number = 20) {
    const { data: rounds } = await supabasePublicClient
      .from('funding_rounds')
      .select('lead_investor_id, co_investors, company_id')
      .or(`lead_investor_id.eq.${investorId},co_investors.cs.{${investorId}}`);

    const companyIds = rounds?.map(r => r.company_id) || [];
    const { data: allRounds } = await supabasePublicClient
      .from('funding_rounds')
      .select('lead_investor_id, co_investors')
      .in('company_id', companyIds);

    const coInvestorCounts = new Map<string, number>();
    allRounds?.forEach(fr => {
      const ids = [fr.lead_investor_id, ...(fr.co_investors || [])].filter(Boolean);
      ids.forEach(id => {
        if (id !== investorId) {
          coInvestorCounts.set(id, (coInvestorCounts.get(id) || 0) + 1);
        }
      });
    });

    const topCoInvestors = Array.from(coInvestorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    const { data: investors } = await supabasePublicClient
      .from('investors')
      .select('id, name, slug, logo_url, type, portfolio_count')
      .in('id', topCoInvestors);

    return investors?.map(i => ({
      ...i,
      shared_deals: coInvestorCounts.get(i.id) || 0,
    })).sort((a, b) => b.shared_deals - a.shared_deals) || [];
  },

  async getMostActive(days: number = 90, limit: number = 20) {
    const cacheKey = `investor:activity:${days}d:${limit}`;
    return getOrSetCache(cacheKey, async () => {
      const { data, error } = await supabasePublicClient
        .from('investor_activity_90d')
        .select('*')
        .order('deal_count', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    }, 300);
  },
};

export const founderService = {
  async getBySlug(slug: string) {
    const { data, error } = await supabasePublicClient
      .from('founders')
      .select('*, company:companies(*)')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },
};

export const productService = {
  async list(filters: { category?: string; sort?: string } = {}, pagination: PaginationParams = {}) {
    const limit = pagination.limit ?? PAGE_SIZE;
    let query = supabasePublicClient.from('products').select('*, company:companies(*)', { count: 'exact' });

    if (filters.category) query = query.eq('category', filters.category);

    switch (filters.sort) {
      case 'popular':
        query = query.order('upvotes', { ascending: false });
        break;
      case 'newest':
        query = query.order('launch_date', { ascending: false });
        break;
      default:
        query = query.order('upvotes', { ascending: false });
    }

    query = applyCursorPagination(query, pagination.cursor, limit);

    const { data, error, count } = await query;
    if (error) throw error;

    const hasMore = (data?.length || 0) > limit;
    const items = hasMore ? data!.slice(0, limit) : data || [];
    const nextCursor = hasMore && items.length > 0
      ? Buffer.from(`${items[items.length - 1].id}:${items[items.length - 1].created_at}`).toString('base64')
      : null;

    return { data: items, nextCursor, hasMore, total: count };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabasePublicClient
      .from('products')
      .select('*, company:companies(*)')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },
};

export const newsService = {
  async list(filters: { tag?: string } = {}, pagination: PaginationParams = {}) {
    const limit = pagination.limit ?? PAGE_SIZE;
    let query = supabasePublicClient.from('news_articles').select('*', { count: 'exact' });

    if (filters.tag) query = query.eq('tag', filters.tag);

    query = query.order('published_at', { ascending: false });
    query = applyCursorPagination(query, pagination.cursor, limit);

    const { data, error, count } = await query;
    if (error) throw error;

    const hasMore = (data?.length || 0) > limit;
    const items = hasMore ? data!.slice(0, limit) : data || [];
    const nextCursor = hasMore && items.length > 0
      ? Buffer.from(`${items[items.length - 1].id}:${items[items.length - 1].published_at}`).toString('base64')
      : null;

    return { data: items, nextCursor, hasMore, total: count };
  },

  async getTrending(limit: number = 10) {
    return getOrSetCache(CACHE_KEYS.TRENDING_NEWS, async () => {
      const { data, error } = await supabasePublicClient
        .from('news_articles')
        .select('*')
        .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('view_count', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    }, 300);
  },
};

export const searchService = {
  async search(query: string, limit: number = 10) {
    if (!query || query.length < 2) return { companies: [], investors: [], founders: [], products: [] };

    const searchTerm = `%${query}%`;

    const [companies, investors, founders, products] = await Promise.all([
      supabasePublicClient
        .from('companies')
        .select('id, name, slug, logo_url, category, stage, funding_total')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(limit),
      supabasePublicClient
        .from('investors')
        .select('id, name, slug, logo_url, type, portfolio_count')
        .or(`name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(limit),
      supabasePublicClient
        .from('founders')
        .select('id, name, slug, photo_url, title, company:companies(name,slug)')
        .or(`name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(limit),
      supabasePublicClient
        .from('products')
        .select('id, name, description, company:companies(name,slug,logo_url)')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(limit),
    ]);

    return {
      companies: companies.data || [],
      investors: investors.data || [],
      founders: founders.data || [],
      products: products.data || [],
    };
  },
};

export const statsService = {
  async getPlatformStats() {
    return getOrSetCache(CACHE_KEYS.STATS, async () => {
      const [
        { count: companies },
        { count: investors },
        { count: fundingRounds },
        { count: founders },
        { count: products },
        { count: news },
        { data: totalFunding },
        { data: unicorns },
      ] = await Promise.all([
        supabasePublicClient.from('companies').select('*', { count: 'exact', head: true }),
        supabasePublicClient.from('investors').select('*', { count: 'exact', head: true }),
        supabasePublicClient.from('funding_rounds').select('*', { count: 'exact', head: true }),
        supabasePublicClient.from('founders').select('*', { count: 'exact', head: true }),
        supabasePublicClient.from('products').select('*', { count: 'exact', head: true }),
        supabasePublicClient.from('news_articles').select('*', { count: 'exact', head: true }),
        supabasePublicClient.from('funding_rounds').select('amount'),
        supabasePublicClient.from('companies').select('*', { count: 'exact', head: true }).eq('is_unicorn', true),
      ]);

      const totalFundingAmount = totalFunding?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;

      return {
        companies: companies || 0,
        investors: investors || 0,
        fundingRounds: fundingRounds || 0,
        totalFunding: totalFundingAmount,
        founders: founders || 0,
        products: products || 0,
        newsArticles: news || 0,
        unicorns: unicorns || 0,
      };
    }, 300);
  },
};

export const feedService = {
  async getFeed(limit: number = 50) {
    const [news, funding, companies] = await Promise.all([
      supabasePublicClient
        .from('news_articles')
        .select('*, type:text')
        .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('published_at', { ascending: false })
        .limit(20),
      supabasePublicClient
        .from('funding_rounds')
        .select('*, company:companies(name,slug,logo_url), lead_investor:investors(name,slug,logo_url), type:text')
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: false })
        .limit(20),
      supabasePublicClient
        .from('companies')
        .select('*, type:text')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    const items = [
      ...(news.data || []).map(n => ({ ...n, type: 'news', score: 1 })),
      ...(funding.data || []).map(f => ({ ...f, type: 'funding', score: 2 })),
      ...(companies.data || []).map(c => ({ ...c, type: 'company', score: 1.5 })),
    ];

    // Score by recency and relevance
    const now = Date.now();
    items.forEach(item => {
      const date = new Date(item.published_at || item.date || item.created_at).getTime();
      const hoursAgo = (now - date) / (1000 * 60 * 60);
      item.recencyScore = Math.max(0, 1 - hoursAgo / 168); // Decay over a week
      item.finalScore = item.score * item.recencyScore;
    });

    items.sort((a, b) => b.finalScore - a.finalScore);

    return items.slice(0, limit);
  },
};