'use client';

import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useInvestors, useMostActiveInvestors } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getInvestorTypeColor } from '@/lib/utils';
import type { Investor } from '@/types';

export function TrendingInvestors() {
  const { data: investorsData, isLoading } = useInvestors({ sort: 'portfolio', limit: 10 });
  const { data: activeData } = useMostActiveInvestors(90, 10);
  const investors = investorsData?.data || [];
  const activeInvestors = activeData?.data || [];

  // Combine and rank by activity
  const trendingInvestors = investors.slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-label">Trending Investors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <TrendingInvestorSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Trending Investors</h2>
            <p className="text-dark-500 text-sm mt-1">Ranked by portfolio size, deal velocity, and AI focus</p>
          </div>
          <a href="/investors?sort=trending" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingInvestors.map((investor, index) => {
            const isActive = activeInvestors.some(ai => ai.id === investor.id);
            const dealCount = activeInvestors.find(ai => ai.id === investor.id)?.deal_count || 0;
            return (
              <motion.div
                key={investor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <TrendingInvestorCard
                  investor={investor}
                  rank={index + 1}
                  isActive={isActive}
                  dealCount={dealCount}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrendingInvestorCard({ investor, rank, isActive, dealCount }: { investor: Investor; rank: number; isActive: boolean; dealCount: number }) {
  const gradientColors = [
    'from-purple-600 via-purple-800 to-purple-900',
    'from-blue-600 via-blue-800 to-blue-900',
    'from-green-600 via-green-800 to-green-900',
    'from-orange-600 via-orange-800 to-orange-900',
    'from-pink-600 via-pink-800 to-pink-900',
    'from-indigo-600 via-indigo-800 to-indigo-900',
    'from-teal-600 via-teal-800 to-teal-900',
    'from-red-600 via-red-800 to-red-900',
  ];

  const gradient = gradientColors[rank - 1] || gradientColors[0];

  return (
    <Card variant="dark" className={`relative overflow-hidden bg-gradient-to-br ${gradient}`} hover>
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
        #{rank}
      </div>

      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
            <img
              src={investor.logo_url}
              alt={investor.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{investor.name}</h3>
            <p className="text-primary-200 text-sm truncate">{investor.type}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-primary-100">{investor.location}</span>
          <Badge variant="outline" className="border-primary-300 text-primary-100">
            Fund {investor.fund_number || 'N/A'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-primary-200 text-xs uppercase tracking-wider">Portfolio</p>
            <p className="text-white font-bold text-lg">{investor.portfolio_count}</p>
          </div>
          <div>
            <p className="text-primary-200 text-xs uppercase tracking-wider">AUM</p>
            <p className="text-white font-bold text-lg">{formatCurrency(investor.aum || 0)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-primary-200 text-sm">
              {dealCount > 0 ? `${dealCount} deals (90d)` : 'Active investor'}
            </span>
          </div>
          <a
            href={`/investors/${investor.slug}`}
            className="text-primary-300 hover:text-white text-sm font-medium flex items-center gap-1"
          >
            View Profile <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Card>
  );
}

function TrendingInvestorSkeleton() {
  return (
    <Card variant="dark" className="bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900 animate-pulse">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="h-2 w-full bg-white/10 rounded" />
            <div className="h-6 w-full bg-white/10 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-white/10 rounded" />
            <div className="h-6 w-full bg-white/10 rounded" />
          </div>
        </div>
        <div className="h-4 w-full bg-white/10 rounded" />
      </div>
    </Card>
  );
}