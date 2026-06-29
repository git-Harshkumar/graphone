'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Building2, User, Briefcase, Globe, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useInvestors } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getInvestorTypeColor } from '@/lib/utils';
import type { Investor } from '@/types';

const collections = [
  {
    id: 'ai-agents',
    title: 'Backing AI Agents',
    description: 'Investors funding autonomous agent startups',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
    filter: { sectorFocus: 'AI Agents' },
    tags: ['Coding Agents', 'Research Agents', 'Task Automation'],
  },
  {
    id: 'indian-ai',
    title: 'Indian AI Startups',
    description: 'Capital flowing into India\'s AI ecosystem',
    icon: Globe,
    color: 'from-orange-500 to-red-500',
    bg: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
    filter: { location: 'India' },
    tags: ['GenAI', 'SaaS AI', 'AI Infra', 'Vertical AI'],
  },
  {
    id: 'seed-investors',
    title: 'Top Seed Investors',
    description: 'First check writers in AI',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    filter: { type: 'VC', stageFocus: 'Seed' },
    tags: ['Pre-Seed', 'Seed', 'Series A'],
  },
  {
    id: 'operator-angels',
    title: 'Operator Angels',
    description: 'Former founders & operators investing in AI',
    icon: User,
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
    filter: { type: 'Angel' },
    tags: ['Ex-Founders', 'Ex-Google', 'Ex-OpenAI', 'Ex-Meta'],
  },
  {
    id: 'corporate-vc',
    title: 'Corporate VCs in AI',
    description: 'Strategic capital from tech giants',
    icon: Building2,
    color: 'from-slate-500 to-blue-500',
    bg: 'bg-gradient-to-br from-slate-500/10 to-blue-500/10',
    filter: { type: 'Corporate' },
    tags: ['NVIDIA', 'Google', 'Microsoft', 'Salesforce', 'Amazon'],
  },
  {
    id: 'late-stage',
    title: 'Late Stage Leaders',
    description: 'Growth capital for AI scale-ups',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
    bg: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
    filter: { stageFocus: 'Series C' },
    tags: ['Series C', 'Series D+', 'Pre-IPO'],
  },
];

export function InvestorCollections() {
  return (
    <section className="py-20 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Investor Collections</h2>
            <p className="text-dark-500 text-sm mt-1">Curated groups of investors by thesis and focus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CollectionCard collection={collection} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ collection }: { collection: typeof collections[0] }) {
  const { data: investorsData } = useInvestors({ ...collection.filter, limit: 4 });
  const investors = investorsData?.data || [];
  const Icon = collection.icon;

  return (
    <Card variant="dark" className={`relative overflow-hidden ${collection.bg} border border-dark-700`} hover>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-full blur-3xl" />
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white`} style={{ background: `linear-gradient(135deg, ${collection.color})` }}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{collection.title}</h3>
              <p className="text-white/70 text-sm mt-1">{collection.description}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {collection.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Featured Investors */}
        <div className="space-y-3 mb-6">
          {investors.slice(0, 3).map((investor) => (
            <a key={investor.id} href={`/investors/${investor.slug}`} className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <img
                src={investor.logo_url}
                alt={investor.name}
                className="w-10 h-10 rounded-lg bg-white/10 object-contain p-1"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate group-hover:text-primary-300 transition-colors">{investor.name}</p>
                <p className="text-white/60 text-sm truncate">{investor.type} • {investor.portfolio_count} portfolio</p>
              </div>
              <div className="text-right text-white/60 text-sm">
                <p className="font-semibold">{formatCurrency(investor.aum || 0)} AUM</p>
              </div>
            </a>
          ))}
        </div>

        {/* View All */}
        <a
          href={`/investors?${new URLSearchParams(collection.filter as Record<string, string>).toString()}`}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
        >
          View Collection <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}