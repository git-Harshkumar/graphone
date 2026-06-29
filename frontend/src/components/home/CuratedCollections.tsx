'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Users, Globe, Shield, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { Company } from '@/types';

const collections = [
  {
    id: 'generative-ai',
    title: 'Generative AI Pioneers',
    description: 'Companies pushing the boundaries of content creation',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    borderColor: 'group-hover:border-purple-200',
    accentColor: 'from-purple-500 to-pink-500',
    filter: { category: 'Generative Media' },
    tags: ['Image Gen', 'Video Gen', 'Audio Gen'],
  },
  {
    id: 'ai-infra',
    title: 'AI Infrastructure',
    description: 'The picks and shovels of the AI gold rush',
    icon: Globe,
    gradient: 'from-blue-500 to-indigo-500',
    borderColor: 'group-hover:border-blue-200',
    accentColor: 'from-blue-500 to-indigo-500',
    filter: { category: 'AI Infrastructure' },
    tags: ['GPU Cloud', 'Vector DB', 'Frameworks'],
  },
  {
    id: 'enterprise-ai',
    title: 'Enterprise AI',
    description: 'AI solutions transforming business operations',
    icon: Users,
    gradient: 'from-slate-500 to-blue-500',
    borderColor: 'group-hover:border-slate-200',
    accentColor: 'from-slate-500 to-blue-500',
    filter: { category: 'Enterprise AI' },
    tags: ['Search', 'Automation', 'Analytics'],
  },
  {
    id: 'ai-agents',
    title: 'AI Agents & Automation',
    description: 'Autonomous agents that can reason and act',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    borderColor: 'group-hover:border-orange-200',
    accentColor: 'from-orange-500 to-red-500',
    filter: { category: 'AI Agents' },
    tags: ['Coding Agents', 'Research Agents', 'Task Agents'],
  },
];

export function CuratedCollections() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-dark-900">Curated Collections</h2>
            </div>
            <p className="text-dark-500 text-sm">Hand-picked groups of companies by theme and focus area</p>
          </div>
          <a
            href="/companies"
            className="hidden sm:flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-colors"
          >
            Explore all <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  const { data: companiesData } = useCompanies({ ...collection.filter, limit: 4 });
  const companies = companiesData?.data || [];
  const Icon = collection.icon;

  const viewAllUrl = `/companies?${new URLSearchParams(collection.filter as any).toString()}`;

  return (
    <a href={viewAllUrl} className="block group">
      <Card variant="outlined" hover className={`relative overflow-hidden transition-all duration-300 group-hover:shadow-lg ${collection.borderColor} bg-white`}>
        {/* Accent top bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${collection.accentColor}`} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${collection.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark-900 group-hover:text-primary-700 transition-colors">{collection.title}</h3>
                <p className="text-dark-500 text-xs mt-0.5">{collection.description}</p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <span className="text-xs font-semibold text-dark-500 bg-dark-50 px-2.5 py-1 rounded-lg">
                {companies.length > 0 ? `${companies.length}+ co.` : ''}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {collection.tags.map(tag => (
              <span key={tag} className="text-[11px] font-medium text-dark-600 bg-dark-50 border border-dark-100 px-2.5 py-1 rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          {/* Company previews */}
          {companies.length > 0 ? (
            <div className="space-y-2 mb-5">
              {companies.slice(0, 3).map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-50 hover:bg-dark-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-dark-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={company.logo_url || '/placeholder-logo.svg'}
                      alt={company.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 text-xs truncate">{company.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-dark-700">{formatCurrency(company.funding_total)}</p>
                    <p className="text-[10px] text-dark-400">{formatNumber(company.employee_count || 0)} team</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-24 bg-dark-50 rounded-xl mb-5 flex items-center justify-center">
              <p className="text-dark-300 text-xs">Loading companies...</p>
            </div>
          )}

          {/* CTA */}
          <div className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${collection.gradient} text-white text-sm font-medium hover:opacity-90 transition-opacity`}>
            View Collection <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </a>
  );
}