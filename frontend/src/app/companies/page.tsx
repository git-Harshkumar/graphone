'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, TrendingUp, DollarSign, Users, Zap, X, ChevronRight, Building2 } from 'lucide-react';
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
  { value: 'new', label: 'Newest', icon: Building2 },
];

function CompaniesPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
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

  const activeFilterCount = (category !== 'All Categories' ? 1 : 0) + (stage !== 'All Stages' ? 1 : 0);

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">

      {/* ── Hero Header ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-pink-600 pt-24 pb-14 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold mb-4 uppercase tracking-wider">
              <a href="/" className="hover:text-white transition-colors">GraphOne</a>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">Companies</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                  AI Companies
                </h1>
                <p className="text-white/80 text-base font-medium">
                  {data?.meta?.pagination?.total || filtered.length || '50+'} companies tracked · funding, growth & innovation
                </p>
              </div>
            </div>

            {/* Search in hero */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, category, description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm font-medium transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Sort + Filter row */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          {/* Sort tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  sort === opt.value
                    ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                    : 'bg-white dark:bg-dark-900 text-dark-500 dark:text-dark-400 border border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <opt.icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              showFilters || activeFilterCount > 0
                ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-800 text-primary-600 dark:text-primary-400'
                : 'bg-white dark:bg-dark-900 border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:border-primary-300 dark:hover:border-primary-600'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-6 space-y-5 shadow-card">
                <div>
                  <p className="text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-widest mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          category === cat
                            ? 'bg-primary-500 text-white shadow-sm'
                            : 'bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 border border-dark-200 dark:border-dark-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-widest mb-3">Stage</p>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map(s => (
                      <button
                        key={s}
                        onClick={() => setStage(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          stage === s
                            ? 'bg-primary-500 text-white shadow-sm'
                            : 'bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 border border-dark-200 dark:border-dark-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setCategory('All Categories'); setStage('All Stages'); }}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" /> Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-dark-400 dark:text-dark-500 font-medium">
            {isLoading ? (
              <span className="animate-pulse">Loading companies...</span>
            ) : (
              <>
                <span className="text-dark-700 dark:text-dark-200 font-bold">{filtered.length}</span> companies
                {search && <span> matching <span className="text-primary-600 dark:text-primary-400 font-semibold">"{search}"</span></span>}
              </>
            )}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setCategory('All Categories'); setStage('All Stages'); }}
              className="text-xs text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => <CompanyCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-dark-400" />
            </div>
            <p className="text-dark-700 dark:text-dark-200 font-bold text-lg mb-2">No companies found</p>
            <p className="text-dark-400 text-sm mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('All Categories'); setStage('All Stages'); }}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-semibold"
            >
              Clear everything
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
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
      <div className="h-full bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative">
        {/* Top accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-11 h-11 rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={company.logo_url || '/placeholder-logo.svg'}
                  alt={company.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-dark-900 dark:text-white truncate text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {company.name}
                </h3>
                <p className="text-dark-400 dark:text-dark-500 text-xs truncate font-medium">{company.category}</p>
              </div>
            </div>
            {company.is_unicorn && (
              <span className="text-base flex-shrink-0 ml-2" title="Unicorn 🦄">🦄</span>
            )}
          </div>

          {/* Description */}
          <p className="text-dark-500 dark:text-dark-400 text-xs line-clamp-2 mb-4 leading-relaxed min-h-[2.5rem]">
            {company.description || 'Building innovative AI solutions for the modern world.'}
          </p>

          {/* Stage + Location */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge
              variant="dark"
              className="text-[10px] px-2 py-0.5 font-semibold"
              style={{ background: getStageColor(company.stage) }}
            >
              {company.stage}
            </Badge>
            <span className="text-xs text-dark-400 dark:text-dark-500 font-medium truncate">
              {[company.hq_city, company.hq_country].filter(Boolean).join(', ')}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dark-50 dark:border-dark-800">
            <div>
              <p className="text-dark-400 dark:text-dark-500 text-[10px] uppercase tracking-widest mb-0.5 font-bold">Funding</p>
              <p className="text-dark-900 dark:text-white font-bold text-sm">{formatCurrency(company.funding_total)}</p>
            </div>
            <div>
              <p className="text-dark-400 dark:text-dark-500 text-[10px] uppercase tracking-widest mb-0.5 font-bold">Team</p>
              <p className="text-dark-900 dark:text-white font-bold text-sm">{formatNumber(company.employee_count || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function CompanyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-dark-100 dark:bg-dark-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-3/4 bg-dark-100 dark:bg-dark-800 rounded-lg" />
          <div className="h-3 w-1/2 bg-dark-100 dark:bg-dark-800 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-dark-100 dark:bg-dark-800 rounded-lg" />
        <div className="h-3 w-5/6 bg-dark-100 dark:bg-dark-800 rounded-lg" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-dark-100 dark:bg-dark-800 rounded-full" />
        <div className="h-5 w-24 bg-dark-100 dark:bg-dark-800 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dark-50 dark:border-dark-800">
        <div className="space-y-1.5">
          <div className="h-2 w-10 bg-dark-100 dark:bg-dark-800 rounded" />
          <div className="h-4 w-16 bg-dark-100 dark:bg-dark-800 rounded" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-8 bg-dark-100 dark:bg-dark-800 rounded" />
          <div className="h-4 w-12 bg-dark-100 dark:bg-dark-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          <p className="text-dark-400 text-sm font-medium">Loading companies...</p>
        </div>
      </div>
    }>
      <CompaniesPageContent />
    </Suspense>
  );
}
