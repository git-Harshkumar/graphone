'use client';

import { ArrowUpRight, DollarSign, Users, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor } from '@/lib/utils';
import type { Company } from '@/types';

const listConfigs = [
  {
    key: 'top-funded',
    label: 'Top Funded',
    description: 'Highest total capital raised',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-500',
    filter: { sort: 'funding', limit: 8 },
  },
  {
    key: 'largest-teams',
    label: 'Largest Teams',
    description: 'Companies with the most employees',
    icon: Users,
    gradient: 'from-blue-500 to-indigo-500',
    filter: { sort: 'employees', limit: 8 },
  },
  {
    key: 'recently-launched',
    label: 'Recently Launched',
    description: 'Newest companies on the platform',
    icon: Rocket,
    gradient: 'from-orange-500 to-rose-500',
    filter: { sort: 'new', limit: 8 },
  },
];

export function ThreeColumnLists() {
  return (
    <section className="py-20 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="section-label">Rankings &amp; Lists</h2>
          <p className="text-dark-500 text-sm mt-1">Explore companies across different dimensions</p>
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
  const { data: companiesData, isLoading } = useCompanies(config.filter as any);
  const companies = companiesData?.data || [];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
      <div className="p-5 border-b border-dark-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${config.gradient}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-dark-900">{config.label}</h3>
            <p className="text-dark-500 text-xs mt-0.5">{config.description}</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-dark-50">
        {isLoading
          ? [...Array(6)].map((_, i) => <ListItemSkeleton key={i} />)
          : companies.slice(0, 8).map((company: Company, index: number) => (
              <ListItem key={company.id} company={company} rank={index + 1} />
            ))}
      </div>

      <div className="p-4 border-t border-dark-100">
        <a
          href={`/companies?sort=${config.filter.sort}`}
          className="flex items-center justify-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium py-2 rounded-xl hover:bg-primary-50 transition-colors"
        >
          View all {config.label} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function ListItem({ company, rank }: { company: Company; rank: number }) {
  return (
    <a
      href={`/companies/${company.slug}`}
      className="group flex items-center gap-3 px-4 py-3 hover:bg-dark-50 transition-colors"
    >
      <span className="flex-shrink-0 w-6 text-center text-xs font-bold text-dark-400 group-hover:text-primary-500 transition-colors">
        {rank}
      </span>
      <img
        src={company.logo_url || '/placeholder-logo.svg'}
        alt={company.name}
        className="w-9 h-9 rounded-lg bg-dark-100 object-cover flex-shrink-0"
        onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-dark-900 text-sm truncate group-hover:text-primary-600 transition-colors">
          {company.name}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-dark-500 mt-0.5">
          <span className="truncate max-w-[80px]">{company.category}</span>
          <span>·</span>
          <Badge
            variant="dark"
            className="text-[10px] px-1.5 py-0"
            style={{ background: getStageColor(company.stage) }}
          >
            {company.stage}
          </Badge>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-dark-900">{formatCurrency(company.funding_total)}</p>
        <p className="text-xs text-dark-500">{formatNumber(company.employee_count || 0)} team</p>
      </div>
    </a>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-6 h-3 rounded bg-dark-200" />
      <div className="w-9 h-9 rounded-lg bg-dark-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 bg-dark-200 rounded" />
        <div className="h-2 w-1/2 bg-dark-200 rounded" />
      </div>
      <div className="text-right space-y-1">
        <div className="h-3 w-16 bg-dark-200 rounded" />
        <div className="h-2 w-12 bg-dark-200 rounded" />
      </div>
    </div>
  );
}
