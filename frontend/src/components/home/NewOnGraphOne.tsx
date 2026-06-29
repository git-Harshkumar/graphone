'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Filter, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor, formatDate } from '@/lib/utils';
import type { Company } from '@/types';

const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'funded', label: 'Most Funded' },
  { value: 'new', label: 'Newest' },
  { value: 'valuation', label: 'Highest Valuation' },
  { value: 'growth', label: 'Fastest Growing' },
];

const categoryFilters = [
  'All',
  'Foundation Models',
  'AI Applications',
  'AI Infrastructure',
  'Generative Media',
  'MLOps & Tools',
  'Data & Analytics',
  'Enterprise AI',
];

export function NewOnGraphOne() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: companiesData, isLoading } = useCompanies({
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    sort: selectedSort,
    limit: 20,
  });
  const companies = companiesData?.data || [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h2 className="section-label">New on GraphOne</h2>
            <p className="text-dark-500 text-sm mt-1">Explore all AI companies with advanced filters</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 bg-dark-50 border border-dark-200 rounded-xl text-dark-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer min-w-[150px]"
              >
                {categoryFilters.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="appearance-none pr-8 py-2 bg-dark-50 border border-dark-200 rounded-xl text-dark-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer min-w-[150px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="flex bg-dark-50 border border-dark-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-dark-500 hover:text-dark-700'}`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-dark-500 hover:text-dark-700'}`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-dark-500">
          Showing <span className="font-semibold text-dark-900">{companies.length}</span> companies
        </div>

        {/* Company Grid/List */}
        {viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {isLoading ? (
              [...Array(8)].map((_, i) => <CompanyCardSkeleton key={i} />)
            ) : (
              companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <CompanyCard company={company} />
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="space-y-3"
          >
            {isLoading ? (
              [...Array(8)].map((_, i) => <CompanyListItemSkeleton key={i} />)
            ) : (
              companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <CompanyListItem company={company} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Load More / View All */}
        <div className="mt-10 text-center">
          <a
            href={`/companies?category=${selectedCategory}&sort=${selectedSort}`}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-colors"
          >
            View All Companies <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <Card variant="outlined" hover className="relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" />
      <a href={`/companies/${company.slug}`} className="block p-5 h-full flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-xl bg-dark-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={company.logo_url || '/placeholder-logo.svg'}
              alt={company.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark-900 truncate group-hover:text-primary-600 transition-colors">{company.name}</h3>
            <p className="text-dark-500 text-sm truncate">{company.category}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="dark" className="text-xs" style={{ background: getStageColor(company.stage) }}>
            {company.stage}
          </Badge>
          {company.is_unicorn && (
            <Badge variant="primary" className="text-xs" style={{ background: 'rgba(233, 30, 99, 0.1)' }}>
              🦄 Unicorn
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-dark-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-dark-500 text-xs uppercase tracking-wider">Funding</p>
              <p className="font-semibold text-dark-900">{formatCurrency(company.funding_total)}</p>
            </div>
            <div>
              <p className="text-dark-500 text-xs uppercase tracking-wider">Team</p>
              <p className="font-semibold text-dark-900">{formatNumber(company.employee_count || 0)}</p>
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
}

function CompanyListItem({ company }: { company: Company }) {
  return (
    <Card variant="outlined" hover className="p-4">
      <a href={`/companies/${company.slug}`} className="flex items-center gap-4 w-full group">
        <img
          src={company.logo_url || '/placeholder-logo.svg'}
          alt={company.name}
          className="w-12 h-12 rounded-lg bg-dark-100 object-cover flex-shrink-0"
          onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-dark-900 truncate group-hover:text-primary-600 transition-colors">{company.name}</h3>
          <p className="text-dark-500 text-sm truncate">{company.category}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="dark" className="text-xs" style={{ background: getStageColor(company.stage) }}>
              {company.stage}
            </Badge>
            {company.is_unicorn && (
              <Badge variant="primary" className="text-xs" style={{ background: 'rgba(233, 30, 99, 0.1)' }}>
                🦄 Unicorn
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0 w-40">
          <p className="font-semibold text-dark-900">{formatCurrency(company.funding_total)}</p>
          <p className="text-sm text-dark-500">{formatNumber(company.employee_count || 0)} team</p>
          <p className="text-xs text-dark-400">{company.hq_city}, {company.hq_country}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 text-dark-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
      </a>
    </Card>
  );
}

function CompanyCardSkeleton() {
  return (
    <Card variant="outlined" className="animate-pulse">
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-dark-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-dark-200 rounded" />
            <div className="h-3 w-1/2 bg-dark-200 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-dark-200 rounded-full" />
          <div className="h-5 w-16 bg-dark-200 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-100">
          <div className="space-y-1">
            <div className="h-2 w-full bg-dark-200 rounded" />
            <div className="h-5 w-full bg-dark-200 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-dark-200 rounded" />
            <div className="h-5 w-full bg-dark-200 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function CompanyListItemSkeleton() {
  return (
    <Card variant="outlined" className="animate-pulse p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-dark-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-dark-200 rounded" />
          <div className="h-3 w-1/2 bg-dark-200 rounded" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-dark-200 rounded-full" />
            <div className="h-5 w-16 bg-dark-200 rounded-full" />
          </div>
        </div>
        <div className="text-right w-40 space-y-1">
          <div className="h-4 w-20 bg-dark-200 rounded" />
          <div className="h-3 w-16 bg-dark-200 rounded" />
          <div className="h-2 w-14 bg-dark-200 rounded" />
        </div>
        <div className="h-5 w-5 bg-dark-200" />
      </div>
    </Card>
  );
}