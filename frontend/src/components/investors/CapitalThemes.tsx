'use client';

import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Zap, Lightbulb, Shield, Users, Globe, Brain, Database, Bot, Video, Code2, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useInvestors } from '@/hooks/useApi';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { Investor } from '@/types';

const themes = [
  {
    id: 'genai-infra',
    title: 'Generative AI Infrastructure',
    description: 'Picks and shovels for the GenAI gold rush',
    icon: Database,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
    stats: { deals: 45, capital: '$12.3B', yoy: '+180%' },
    tags: ['Vector DBs', 'GPU Cloud', 'Model Serving', 'Fine-tuning'],
    filter: { sectorFocus: 'AI Infrastructure' },
  },
  {
    id: 'ai-agents',
    title: 'AI Agents & Automation',
    description: 'Autonomous agents transforming knowledge work',
    icon: Bot,
    color: 'from-orange-500 to-red-500',
    bg: 'bg-gradient-to-br from-orange-500/10 to-red-500/10',
    stats: { deals: 32, capital: '$8.7B', yoy: '+340%' },
    tags: ['Coding Agents', 'Research Agents', 'RPA', 'Workflow'],
    filter: { sectorFocus: 'AI Agents' },
  },
  {
    id: 'foundation-models',
    title: 'Foundation Models',
    description: 'Massive capital for model training',
    icon: Brain,
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
    stats: { deals: 18, capital: '$45.2B', yoy: '+95%' },
    tags: ['LLMs', 'Multimodal', 'Open Source', 'Enterprise'],
    filter: { sectorFocus: 'Foundation Models' },
  },
  {
    id: 'gen-media',
    title: 'Generative Media',
    description: 'Image, video, audio, and 3D generation',
    icon: Video,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
    stats: { deals: 28, capital: '$6.4B', yoy: '+220%' },
    tags: ['Image Gen', 'Video Gen', 'Audio', '3D Assets'],
    filter: { sectorFocus: 'Generative Media' },
  },
  {
    id: 'ai-coding',
    title: 'AI Coding Tools',
    description: 'Developer productivity revolution',
    icon: Code2,
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    stats: { deals: 24, capital: '$4.1B', yoy: '+410%' },
    tags: ['Code Gen', 'Code Review', 'Debugging', 'Documentation'],
    filter: { sectorFocus: 'AI Coding' },
  },
  {
    id: 'enterprise-ai',
    title: 'Enterprise AI Applications',
    description: 'Vertical AI for business workflows',
    icon: Users,
    color: 'from-slate-500 to-blue-500',
    bg: 'bg-gradient-to-br from-slate-500/10 to-blue-500/10',
    stats: { deals: 56, capital: '$15.8B', yoy: '+120%' },
    tags: ['Sales', 'Support', 'Legal', 'HR', 'Finance'],
    filter: { sectorFocus: 'Enterprise AI' },
  },
];

export function CapitalThemes() {
  return (
    <section className="py-20 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Capital Themes</h2>
            <p className="text-dark-500 text-sm mt-1">Where smart money is flowing in AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ThemeCard theme={theme} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThemeCard({ theme }: { theme: typeof themes[0] }) {
  const { data: investorsData } = useInvestors({ ...theme.filter, limit: 4 });
  const investors = investorsData?.data || [];
  const Icon = theme.icon;

  return (
    <Card variant="dark" className={`relative overflow-hidden ${theme.bg} border border-dark-700`} hover>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-full blur-3xl" />
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white`} style={{ background: `linear-gradient(135deg, ${theme.color})` }}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{theme.title}</h3>
              <p className="text-white/70 text-sm mt-1">{theme.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{theme.stats.capital}</p>
            <p className="text-green-400 text-sm">{theme.stats.yoy} YoY</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-1.5 text-white/80">
            <TrendingUp className="h-4 w-4" />
            <span>{theme.stats.deals} deals (YTD)</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80">
            <DollarSign className="h-4 w-4" />
            <span>Capital: {theme.stats.capital}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {theme.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Top Investors */}
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
          href={`/investors?${new URLSearchParams(theme.filter as any).toString()}`}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
        >
          Explore Theme <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}

function Currency({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}