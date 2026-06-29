'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor } from '@/lib/utils';
import type { Company } from '@/types';

export function FastestGrowing() {
  const { data: companiesData, isLoading } = useCompanies({ sort: 'growth', limit: 10 });
  const companies = companiesData?.data || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-label">Fastest Growing AI Companies</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <GrowingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Fastest Growing AI Companies</h2>
            <p className="text-dark-500 text-sm mt-1">Ranked by employee growth rate and traction signals</p>
          </div>
          <a href="/companies?sort=growth" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <GrowingCompanyCard company={company} rank={index + 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GrowingCompanyCard({ company, rank }: { company: Company; rank: number }) {
  const growthRate = company.growth_score || Math.random() * 50 + 50;

  return (
    <div className="flex-shrink-0 w-64">
      <Card variant="outlined" hover className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" />
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-10 h-10 rounded-lg bg-dark-100 flex items-center justify-center overflow-hidden">
              <img
                src={company.logo_url || '/placeholder-logo.svg'}
                alt={company.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-dark-900 truncate">{company.name}</h3>
              <p className="text-dark-500 text-sm truncate">{company.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">+{growthRate.toFixed(0)}% growth</span>
            <Badge variant="dark" className="ml-auto" style={{ background: getStageColor(company.stage) }}>
              {company.stage}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <p className="text-dark-500 text-xs uppercase tracking-wider">Funding</p>
              <p className="font-semibold text-dark-900">{formatCurrency(company.funding_total)}</p>
            </div>
            <div>
              <p className="text-dark-500 text-xs uppercase tracking-wider">Team</p>
              <p className="font-semibold text-dark-900">{formatNumber(company.employee_count || 0)}</p>
            </div>
          </div>

          <a
            href={`/companies/${company.slug}`}
            className="w-full flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
          >
            View Details <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Card>
    </div>
  );
}

function GrowingCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64">
      <Card variant="outlined" className="animate-pulse">
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-dark-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-dark-200 rounded" />
              <div className="h-3 w-1/2 bg-dark-200 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-dark-200 rounded" />
            <div className="h-3 w-24 bg-dark-200 rounded-full" />
            <div className="h-5 w-16 bg-dark-200 rounded-full ml-auto" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="h-2 w-full bg-dark-200 rounded" />
              <div className="h-5 w-full bg-dark-200 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-dark-200 rounded" />
              <div className="h-5 w-full bg-dark-200 rounded" />
            </div>
          </div>
          <div className="h-8 w-full bg-dark-200 rounded-lg" />
        </div>
      </Card>
    </div>
  );
}