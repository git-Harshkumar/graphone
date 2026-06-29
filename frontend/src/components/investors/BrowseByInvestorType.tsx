'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Building2, User, Briefcase, Globe, Sparkles, Zap, Home } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useInvestors } from '@/hooks/useApi';
import { formatNumber, getInvestorTypeColor } from '@/lib/utils';
import type { Investor } from '@/types';

const investorTypes = [
  { id: 'seed', label: 'Seed', icon: Sparkles, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', text: 'text-green-700', count: 45, filter: { stageFocus: 'Seed' } },
  { id: 'series-a', label: 'Series A', icon: Zap, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-700', count: 38, filter: { stageFocus: 'Series A' } },
  { id: 'angel', label: 'Angel', icon: User, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', text: 'text-orange-700', count: 52, filter: { type: 'Angel' } },
  { id: 'corporate', label: 'Corporate VC', icon: Building2, color: 'from-slate-500 to-blue-500', bg: 'bg-slate-50', text: 'text-slate-700', count: 24, filter: { type: 'Corporate' } },
  { id: 'late-stage', label: 'Late Stage', icon: Briefcase, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-50', text: 'text-purple-700', count: 18, filter: { stageFocus: 'Series C' } },
  { id: 'family-office', label: 'Family Office', icon: Home, color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50', text: 'text-amber-700', count: 12, filter: { type: 'Family Office' } },
];

export function BrowseByInvestorType() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Browse by Investor Type</h2>
            <p className="text-dark-500 text-sm mt-1">Find investors by stage focus and investment style</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {investorTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <InvestorTypeCard type={type} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorTypeCard({ type }: typeof investorTypes[0]) {
  const { data: investorsData } = useInvestors({ ...type.filter, limit: 3 });
  const investors = investorsData?.data || [];
  const Icon = type.icon;

  return (
    <Card variant="outlined" hover className="group p-5 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${type.bg} ${type.text} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="font-semibold text-dark-900 mb-1">{type.label}</h3>
        <p className="text-dark-500 text-sm">{type.count} investors</p>
        
        {investors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-100 space-y-2">
            {investors.slice(0, 2).map((inv) => (
              <a key={inv.id} href={`/investors/${inv.slug}`} className="flex items-center gap-2 text-sm text-dark-600 hover:text-primary-600 transition-colors group">
                <img
                  src={inv.logo_url}
                  alt={inv.name}
                  className="w-6 h-6 rounded bg-dark-100 object-contain p-0.5 group-hover:ring-2 group-hover:ring-primary-500 transition-all"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="truncate">{inv.name}</span>
              </a>
            ))}
          </div>
        )}

        <a
          href={`/investors?${new URLSearchParams(type.filter as Record<string, string>).toString()}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Explore <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}