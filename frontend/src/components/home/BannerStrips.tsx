'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Crown, FlaskConical, Code2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getStageColor } from '@/lib/utils';
import type { Company } from '@/types';

const bannerConfigs = [
  { key: 'unicorns', label: 'AI Unicorns', icon: Crown, color: 'from-yellow-500 via-amber-500 to-orange-500', filter: { stage: 'Series D+', sort: 'valuation' }, description: 'Valued at $1B+' },
  { key: 'frontier-labs', label: 'Frontier AI Labs', icon: FlaskConical, color: 'from-blue-500 via-indigo-500 to-purple-500', filter: { category: 'Foundation Models', sort: 'funded' }, description: 'Building foundational models' },
  { key: 'open-source', label: 'Open Source Leaders', icon: Code2, color: 'from-green-500 via-teal-500 to-cyan-500', filter: { category: 'MLOps & Tools', sort: 'growth' }, description: 'Driving open innovation' },
];

export function BannerStrips() {
  return (
    <section className="py-12 bg-white border-y border-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {bannerConfigs.map((config, configIndex) => (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: configIndex * 0.1 }}
              className="relative"
            >
              <BannerStrip config={config} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerStrip({ config }: { config: typeof bannerConfigs[0] }) {
  const { data: companiesData } = useCompanies({ ...config.filter, limit: 8 });
  const companies = companiesData?.data || [];

  const Icon = config.icon;

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${config.color})` }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{config.label}</h3>
              <p className="text-white/80 text-sm">{config.description}</p>
            </div>
          </div>
          <a
            href={`/companies?${new URLSearchParams(config.filter as Record<string, string>).toString()}`}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            Explore <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Company Logos Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {companies.length > 0 ? (
            companies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex-shrink-0"
              >
                <BannerCompanyCard company={company} />
              </motion.div>
            ))
          ) : (
            [...Array(5)].map((_, i) => (
              <BannerCompanySkeleton key={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BannerCompanyCard({ company }: { company: Company }) {
  return (
    <a
      href={`/companies/${company.slug}`}
      className="flex-shrink-0 w-40 sm:w-48 group relative"
    >
      <div className="relative aspect-square rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden group-hover:border-white/40 group-hover:bg-white/20 transition-all duration-300">
        <img
          src={company.logo_url || '/placeholder-logo.svg'}
          alt={company.name}
          className="w-full h-full object-cover p-4"
          onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-xs font-medium truncate">{company.name}</p>
          <p className="text-white/70 text-[10px] truncate">{company.category}</p>
        </div>
      </div>
    </a>
  );
}

function BannerCompanySkeleton() {
  return (
    <div className="flex-shrink-0 w-40 sm:w-48">
      <div className="aspect-square rounded-xl bg-white/10 animate-pulse" />
    </div>
  );
}