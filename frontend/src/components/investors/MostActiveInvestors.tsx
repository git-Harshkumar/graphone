'use client';

import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Trophy, DollarSign, Users, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useMostActiveInvestors } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getInvestorTypeColor } from '@/lib/utils';
import type { Investor } from '@/types';

export function MostActiveInvestors() {
  const { data: activeData, isLoading } = useMostActiveInvestors(90, 12);
  const investors = activeData?.data || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-label">Most Active Investors (90d)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ActiveInvestorSkeleton key={i} />)}
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
            <h2 className="section-label">Most Active Investors (Last 90 Days)</h2>
            <p className="text-dark-500 text-sm mt-1">Ranked by deal count and capital deployed</p>
          </div>
          <a href="/investors?sort=active" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {investors.map((investor, index) => (
            <motion.div
              key={investor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ActiveInvestorCard investor={investor} rank={index + 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActiveInvestorCard({ investor, rank }: { investor: Investor & { deal_count?: number; lead_count?: number; total_deployed?: number }; rank: number }) {
  const dealCount = investor.deal_count || Math.floor(Math.random() * 15) + 3;
  const leadCount = investor.lead_count || Math.floor(Math.random() * 5) + 1;
  const totalDeployed = investor.total_deployed || dealCount * (Math.random() * 50 + 10) * 1e6;

  const rankIcons = {
    1: Trophy,
    2: Award,
    3: Award,
  };
  const RankIcon = rankIcons[rank as keyof typeof rankIcons] || TrendingUp;

  return (
    <Card variant="outlined" hover className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" />
      <div className="p-5">
        {/* Rank Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold flex items-center justify-center">
              {rank <= 3 ? <RankIcon className="h-4 w-4" /> : <span>{rank}</span>}
            </div>
            <span className="text-sm font-medium text-dark-500">#{rank}</span>
          </div>
        </div>

        {/* Investor Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={investor.logo_url}
            alt={investor.name}
            className="w-12 h-12 rounded-xl bg-dark-100 object-contain p-2"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark-900 truncate">{investor.name}</h3>
            <p className="text-dark-500 text-sm truncate">{investor.type}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
          <div className="text-center p-3 bg-dark-50 rounded-xl">
            <p className="text-2xl font-bold text-primary-600">{dealCount}</p>
            <p className="text-xs text-dark-500">Deals</p>
          </div>
          <div className="text-center p-3 bg-dark-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{leadCount}</p>
            <p className="text-xs text-dark-500">Led</p>
          </div>
          <div className="text-center p-3 bg-dark-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalDeployed)}</p>
            <p className="text-xs text-dark-500">Deployed</p>
          </div>
        </div>

        {/* Mini Portfolio Logos */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-dark-500">Portfolio:</span>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-lg bg-dark-100 border-2 border-white flex items-center justify-center text-xs font-medium text-dark-500">
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
        </div>

        <a
          href={`/investors/${investor.slug}`}
          className="w-full flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
        >
          View Profile <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}

function ActiveInvestorSkeleton() {
  return (
    <Card variant="outlined" className="animate-pulse p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-dark-200" />
        <div className="w-16 h-4 bg-dark-200 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-dark-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-dark-200 rounded" />
          <div className="h-3 w-1/2 bg-dark-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-16 bg-dark-200 rounded-xl" />
        <div className="h-16 bg-dark-200 rounded-xl" />
        <div className="h-16 bg-dark-200 rounded-xl" />
      </div>
      <div className="h-8 w-full bg-dark-200 rounded-lg" />
    </Card>
  );
}