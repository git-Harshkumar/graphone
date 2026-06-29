'use client';

import { ArrowUpRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor } from '@/lib/utils';
import type { Company } from '@/types';

const listConfigs = [
  { key: 'breakout', label: 'Breakout Companies', icon: Sparkles, color: 'from-purple-500 to-pink-500', filter: { stage: 'Series A', sort: 'growth' } },
  { key: 'recently-funded', label: 'Recently Funded', icon: TrendingUp, color: 'from-green-500 to-emerald-500', filter: { sort: 'funded' } },
  { key: 'startups-to-watch', label: 'Startups to Watch', icon: Award, color: 'from-orange-500 to-red-500', filter: { stage: 'Seed', sort: 'new' } },
];

export function BreakoutLists() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Curated Lists</h2>
            <p className="text-dark-500 text-sm mt-1">Hand-picked companies worth watching</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {listConfigs.map((config) => (
            <CompanyListColumn key={config.key} config={config} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanyListColumn({ config }: { config: typeof listConfigs[0] }) {
  const { data: companiesData, isLoading } = useCompanies({ ...config.filter, limit: 10 });
  const companies = companiesData?.data || [];

  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-dark-50 to-white rounded-2xl border border-dark-100">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white`} style={{ background: `linear-gradient(135deg, ${config.color})` }}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-dark-900">{config.label}</h3>
          <p className="text-dark-500 text-sm">{companies.length} companies</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => <ListItemSkeleton key={i} />)
        ) : (
          companies.slice(0, 8).map((company, index) => (
            <ListItem key={company.id} company={company} rank={index + 1} />
          ))
        )}
      </div>

      <a
        href={`/companies?${new URLSearchParams(config.filter as any).toString()}`}
        className="block text-center py-3 text-sm text-primary-600 hover:text-primary-700 font-medium border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
      >
        View all {config.label} <ArrowUpRight className="h-4 w-4 inline ml-1" />
      </a>
    </div>
  );
}

function ListItem({ company, rank }: { company: Company; rank: number }) {
  return (
    <a href={`/companies/${company.slug}`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 transition-colors border border-transparent hover:border-dark-200">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-100 text-dark-500 text-xs font-bold flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
        {rank}
      </div>
      <img
        src={company.logo_url || '/placeholder-logo.svg'}
        alt={company.name}
        className="w-10 h-10 rounded-lg bg-dark-100 object-cover"
        onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-dark-900 truncate group-hover:text-primary-600 transition-colors">{company.name}</h4>
        <div className="flex items-center gap-2 text-xs text-dark-500">
          <span className="truncate">{company.category}</span>
          <span>•</span>
          <Badge variant="dark" className="text-xs" style={{ background: getStageColor(company.stage) }}>
            {company.stage}
          </Badge>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-dark-900 text-sm">{formatCurrency(company.funding_total)}</p>
        <p className="text-xs text-dark-500">{formatNumber(company.employee_count || 0)} team</p>
      </div>
    </a>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
      <div className="w-8 h-8 rounded-full bg-dark-200" />
      <div className="w-10 h-10 rounded-lg bg-dark-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-dark-200 rounded" />
        <div className="h-3 w-1/2 bg-dark-200 rounded" />
      </div>
      <div className="text-right space-y-1">
        <div className="h-4 w-20 bg-dark-200 rounded" />
        <div className="h-3 w-16 bg-dark-200 rounded" />
      </div>
    </div>
  );
}