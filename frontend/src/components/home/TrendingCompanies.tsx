'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTrendingCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor } from '@/lib/utils';
import type { Company } from '@/types';

export function TrendingCompanies() {
  const { data: trendingData, isLoading } = useTrendingCompanies(10);
  const companies = trendingData?.data || [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-dark-900">Trending AI Companies</h2>
            </div>
            <p className="text-dark-500 text-sm">Ranked by funding recency, employee growth &amp; product traction</p>
          </div>
          <a
            href="/companies?sort=trending"
            className="hidden sm:flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors"
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => <TrendingCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {companies.slice(0, 10).map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <TrendingCompanyCard company={company} rank={index + 1} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center sm:hidden">
          <a
            href="/companies?sort=trending"
            className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 hover:bg-primary-100 px-6 py-2.5 rounded-xl transition-colors"
          >
            View all trending companies <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function TrendingCompanyCard({ company, rank }: { company: Company; rank: number }) {
  const rankColors = [
    'from-amber-400 to-orange-500',
    'from-slate-400 to-slate-500',
    'from-amber-600 to-amber-700',
    'from-primary-500 to-primary-600',
    'from-primary-500 to-primary-600',
  ];
  const rankColor = rankColors[rank - 1] || 'from-primary-500 to-primary-600';

  return (
    <a href={`/companies/${company.slug}`} className="block group h-full">
      <Card variant="outlined" hover className="h-full relative overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-primary-200">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-5">
          {/* Rank badge */}
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${rankColor} text-white text-xs font-bold flex items-center justify-center mb-4 shadow-sm`}>
            #{rank}
          </div>

          {/* Logo + Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-dark-50 border border-dark-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={company.logo_url || '/placeholder-logo.svg'}
                alt={company.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-dark-900 truncate text-sm group-hover:text-primary-600 transition-colors">{company.name}</h3>
              <p className="text-dark-400 text-xs truncate">{company.category}</p>
            </div>
          </div>

          {/* Stage + Unicorn */}
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            <Badge variant="dark" className="text-[10px] px-2 py-0.5" style={{ background: getStageColor(company.stage) }}>
              {company.stage}
            </Badge>
            {company.is_unicorn && <span className="text-sm" title="Unicorn">🦄</span>}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-dark-50">
            <div>
              <p className="text-dark-400 text-[10px] uppercase tracking-wider mb-0.5">Funding</p>
              <p className="text-dark-900 font-semibold text-xs">{formatCurrency(company.funding_total)}</p>
            </div>
            <div>
              <p className="text-dark-400 text-[10px] uppercase tracking-wider mb-0.5">Team</p>
              <p className="text-dark-900 font-semibold text-xs">{formatNumber(company.employee_count || 0)}</p>
            </div>
          </div>

          {/* Score */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-dark-400">Score</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-16 bg-dark-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                  style={{ width: `${Math.min((company.trending_score || company.growth_score || 0), 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-primary-600">
                {(company.trending_score || company.growth_score || 0).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}

function TrendingCardSkeleton() {
  return (
    <Card variant="outlined" className="animate-pulse">
      <div className="p-5 space-y-4">
        <div className="w-8 h-8 rounded-xl bg-dark-100" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 bg-dark-100 rounded" />
            <div className="h-2.5 w-1/2 bg-dark-100 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-dark-100 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-dark-50">
          <div className="space-y-1">
            <div className="h-2 w-10 bg-dark-100 rounded" />
            <div className="h-3 w-14 bg-dark-100 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-8 bg-dark-100 rounded" />
            <div className="h-3 w-10 bg-dark-100 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}