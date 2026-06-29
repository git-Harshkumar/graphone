import NodeCache from 'node-cache';

export const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default
  checkperiod: 60,
  maxKeys: 1000,
});

export const CACHE_KEYS = {
  TRENDING_COMPANIES: 'trending:companies',
  STATS: 'platform:stats',
  INVESTOR_ACTIVITY: 'investor:activity:90d',
  TRENDING_NEWS: 'news:trending:24h',
  COMPANY_GRAPH: (slug: string) => `graph:company:${slug}`,
  INVESTOR_PORTFOLIO: (slug: string) => `investor:portfolio:${slug}`,
} as const;

export const invalidateCache = (pattern: string) => {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  cache.del(matchingKeys);
};

export const getOrSetCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> => {
  const cached = cache.get<T>(key);
  if (cached) return cached;

  const data = await fetcher();
  cache.set(key, data, ttl);
  return data;
};