'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, TrendingUp, DollarSign, Users, Zap, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Company } from '@/types';

const CATEGORIES = [
  'All Categories',
  'Foundation Models', 'AI Applications', 'AI Infrastructure', 'AI Chips & Hardware',
  'MLOps & Tools', 'Data & Analytics', 'Generative Media', 'Enterprise AI',
  'Consumer AI', 'AI Agents', 'AI Coding', 'AI Search', 'AI Video', 'AI Voice',
];

const STAGES = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Acquired'];

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'funding', label: 'Most Funded', icon: DollarSign },
  { value: 'growth', label: 'Fastest Growing', icon: Zap },
  { value: 'employees', label: 'Largest Team', icon: Users },
  { value: 'new', label: 'Newest', icon: Zap },
];

function CompaniesPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [stage, setStage] = useState(searchParams.get('stage') || 'All Stages');
  const [sort, setSort] = useState(searchParams.get('sort') || 'trending');
  const [showFilters, setShowFilters] = useState(false);

  const params: Record<string, string | number> = { limit: 100 };
  if (category !== 'All Categories') params.category = category;
  if (stage !== 'All Stages') params.stage = stage;
  if (sort) params.sort = sort;

  const { data, isLoading } = useCompanies(params);
  const allCompanies = data?.data || [];

  const filtered = allCompanies.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 transition-colors duration-200">
      {/* Eye-catching Hero Header */}
      <div className="bg-gradient-to-br from-primary-500 via-purple-600 to-indigo-600 pt-24 pb-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-3">
              <a href="/" className="hover:text-white">GraphOne</a>
              <ChevronRight className="h-3 w-3" />
              <span>Companies</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">AI Companies</h1>
            <p className="text-white/90 text-lg max-w-xl">
              Discover {data?.total || '50+'} AI companies tracked across funding, growth, and innovation.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder="Search companies by name, category, or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort & Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sort === opt.value
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white dark:bg-dark-900 text-dark-600 dark:text-dark-300 border border-dark-200 dark:border-dark-800 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <opt.icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              showFilters || category !== 'All Categories' || stage !== 'All Stages'
                ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-800 text-primary-750 dark:text-primary-300'
                : 'bg-white dark:bg-dark-900 border-dark-200 dark:border-dark-800 text-dark-600 dark:text-dark-300 hover:border-primary-300 dark:hover:border-primary-500'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(category !== 'All Categories' || stage !== 'All Stages') && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                {(category !== 'All Categories' ? 1 : 0) + (stage !== 'All Stages' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-dark-700 dark:text-dark-200 mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          category === cat
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark-700 dark:text-dark-200 mb-3">Stage</p>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map(s => (
                      <button
                        key={s}
                        onClick={() => setStage(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          stage === s
                            ? 'bg-primary-500 text-white'
                            : 'bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {(category !== 'All Categories' || stage !== 'All Stages') && (
                  <button
                    onClick={() => { setCategory('All Categories'); setStage('All Stages'); }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" /> Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-dark-500 dark:text-dark-400 text-sm">
            {isLoading ? 'Loading...' : `${filtered.length} companies found`}
            {search && <span className="text-dark-700 dark:text-dark-300 font-medium"> for &ldquo;{search}&rdquo;</span>}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => <CompanyCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-dark-100 dark:bg-dark-900 flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-dark-400" />
            </div>
            <p className="text-dark-700 dark:text-dark-200 font-semibold text-lg mb-2">No companies found</p>
            <p className="text-dark-400 dark:text-dark-500 text-sm">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('All Categories'); setStage('All Stages'); }}
              className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
              >
                <CompanyCard company={company} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <a href={`/companies/${company.slug}`} className="block group h-full">
      <Card variant="outlined" hover className="h-full relative overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-primary-200 dark:group-hover:border-primary-500 bg-white dark:bg-dark-900">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={company.logo_url || '/placeholder-logo.svg'}
                  alt={company.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-dark-900 dark:text-white truncate text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{company.name}</h3>
                <p className="text-dark-400 dark:text-dark-500 text-xs truncate">{company.category}</p>
              </div>
            </div>
            {company.is_unicorn && <span className="text-base flex-shrink-0 ml-1" title="Unicorn">🦄</span>}
          </div>

          <p className="text-dark-500 dark:text-dark-400 text-xs line-clamp-2 mb-4 leading-relaxed min-h-[2.5rem]">
            {company.description || 'Building innovative AI solutions.'}
          </p>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="dark" className="text-[10px] px-2 py-0.5" style={{ background: getStageColor(company.stage) }}>
              {company.stage}
            </Badge>
            <span className="text-xs text-dark-400 dark:text-dark-500 truncate">{company.hq_city}, {company.hq_country}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dark-50 dark:border-dark-800">
            <div>
              <p className="text-dark-400 dark:text-dark-500 text-[10px] uppercase tracking-wider mb-0.5">Funding</p>
              <p className="text-dark-900 dark:text-white font-semibold text-sm">{formatCurrency(company.funding_total)}</p>
            </div>
            <div>
              <p className="text-dark-400 dark:text-dark-500 text-[10px] uppercase tracking-wider mb-0.5">Team</p>
              <p className="text-dark-900 dark:text-white font-semibold text-sm">{formatNumber(company.employee_count || 0)}</p>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}

function CompanyCardSkeleton() {
  return (
    <Card variant="outlined" className="h-full animate-pulse bg-white dark:bg-dark-900">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-dark-100 dark:bg-dark-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 bg-dark-100 dark:bg-dark-800 rounded" />
            <div className="h-3 w-1/2 bg-dark-100 dark:bg-dark-800 rounded" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-dark-100 dark:bg-dark-800 rounded" />
          <div className="h-3 w-5/6 bg-dark-100 dark:bg-dark-800 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-dark-100 dark:bg-dark-800 rounded-full" />
          <div className="h-5 w-24 bg-dark-100 dark:bg-dark-800 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dark-50 dark:border-dark-800">
          <div className="space-y-1">
            <div className="h-2 w-12 bg-dark-100 dark:bg-dark-800 rounded" />
            <div className="h-4 w-16 bg-dark-100 dark:bg-dark-800 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-8 bg-dark-100 dark:bg-dark-800 rounded" />
            <div className="h-4 w-12 bg-dark-100 dark:bg-dark-800 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-dark-500 dark:text-dark-400">Loading...</div>
      </div>
    }>
      <CompaniesPageContent />
    </Suspense>
  );
}
