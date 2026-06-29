'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Star, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor } from '@/lib/utils';
import type { Company } from '@/types';

export function EmergingStartups() {
  const { data: companiesData, isLoading } = useCompanies({ stage: 'Seed', sort: 'new', limit: 9 });
  const companies = companiesData?.data || [];

  return (
    <section className="py-20 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Rocket className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-dark-900">Emerging Startups to Watch</h2>
            </div>
            <p className="text-dark-500 text-sm">Early-stage AI companies making waves in 2024–25</p>
          </div>
          <a
            href="/companies?stage=Seed&sort=new"
            className="hidden sm:flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors"
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <EmergingCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <EmergingCard company={company} featured={index === 0} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center sm:hidden">
          <a
            href="/companies?stage=Seed&sort=new"
            className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 hover:bg-primary-100 px-6 py-2.5 rounded-xl transition-colors"
          >
            View all emerging startups <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function EmergingCard({ company, featured }: { company: Company; featured?: boolean }) {
  return (
    <a href={`/companies/${company.slug}`} className="block group h-full">
      <Card variant="outlined" hover className={`h-full relative overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-primary-200 bg-white ${featured ? 'ring-1 ring-primary-100' : ''}`}>
        {featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-semibold rounded-full">
              <Star className="h-2.5 w-2.5" fill="currentColor" /> Featured
            </span>
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-dark-50 border border-dark-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={company.logo_url || '/placeholder-logo.svg'}
                alt={company.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-dark-900 truncate text-sm group-hover:text-primary-600 transition-colors">{company.name}</h3>
              <p className="text-dark-400 text-xs truncate">{company.category}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-dark-500 text-xs line-clamp-2 mb-3 leading-relaxed min-h-[2rem]">
            {company.description || 'Building the next generation of AI solutions.'}
          </p>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="dark" className="text-[10px] px-2 py-0.5" style={{ background: getStageColor(company.stage) }}>
              {company.stage}
            </Badge>
            <span className="text-xs text-dark-400">{company.hq_city}, {company.hq_country}</span>
            {company.founded_year && (
              <span className="text-xs text-dark-400">Est. {company.founded_year}</span>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-50">
            <div>
              <p className="text-dark-400 text-[10px] uppercase tracking-wider mb-0.5">Funding</p>
              <p className="text-dark-900 font-semibold text-xs">{formatCurrency(company.funding_total)}</p>
            </div>
            <div>
              <p className="text-dark-400 text-[10px] uppercase tracking-wider mb-0.5">Team</p>
              <p className="text-dark-900 font-semibold text-xs">{formatNumber(company.employee_count || 0)}</p>
            </div>
            <div>
              <p className="text-dark-400 text-[10px] uppercase tracking-wider mb-0.5">Score</p>
              <p className="text-primary-600 font-semibold text-xs">{(company.growth_score || 0).toFixed(0)}</p>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}

function EmergingCardSkeleton() {
  return (
    <Card variant="outlined" className="animate-pulse bg-white">
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-dark-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 bg-dark-100 rounded" />
            <div className="h-3 w-1/2 bg-dark-100 rounded" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-dark-100 rounded" />
          <div className="h-3 w-5/6 bg-dark-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-dark-100 rounded-full" />
          <div className="h-5 w-20 bg-dark-100 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-50">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-2 w-10 bg-dark-100 rounded" />
              <div className="h-3 w-12 bg-dark-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}