'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, TrendingUp, Building2, Users, Zap, ChevronRight } from 'lucide-react';
import { useTrendingCompanies } from '@/hooks/useApi';
import { formatCurrency } from '@/lib/utils';
import type { Company } from '@/types';

const CATEGORIES = [
  'AI Agents', 'Foundation Models', 'AI Coding', 'AI Infrastructure',
  'Generative Media', 'Enterprise AI', 'MLOps & Tools', 'AI Search',
];

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: trendingData } = useTrendingCompanies(6);
  const trendingCompanies = trendingData?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategory) params.set('category', selectedCategory);
    window.location.href = `/companies?${params.toString()}`;
  };

  return (
    <section className="relative overflow-hidden hero-mesh min-h-[90vh] flex flex-col justify-center">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-60 animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(233,30,99,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -left-32 w-80 h-80 rounded-full opacity-50 animate-blob animate-delay-300"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-64 h-64 rounded-full opacity-40 animate-blob animate-delay-500"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold border border-primary-200 dark:border-primary-800/60 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI Economy Intelligence Platform · Public Beta
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-dark-900 dark:text-white mb-6 leading-[1.08]">
            The{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Bloomberg</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full opacity-40"
                style={{ background: 'linear-gradient(90deg, #e91e63, #c2185b)' }}
              />
            </span>{' '}
            for the{' '}
            <span className="gradient-text">AI Economy</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Track AI companies, investors, products, funding rounds, founders & news.
            Real-time intelligence for the fastest-moving market in technology.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto mb-6"
        >
          <div className="relative flex items-center bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-700 shadow-glass overflow-hidden transition-all duration-300 focus-within:border-primary-400 dark:focus-within:border-primary-600 focus-within:shadow-glow-sm">
            <Search className="absolute left-5 h-5 w-5 text-dark-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, investors, founders, products..."
              autoFocus
              className="flex-1 pl-14 pr-4 py-4 bg-transparent text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none text-base font-medium"
            />
            <div className="flex items-center gap-2 pr-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hidden sm:block appearance-none px-3 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-dark-700 dark:text-dark-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-glow-sm active:scale-95 text-sm"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.form>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          <span className="text-xs text-dark-400 font-medium py-1">Popular:</span>
          {['OpenAI', 'Anthropic', 'Mistral', 'Cohere', 'Groq'].map(q => (
            <a
              key={q}
              href={`/companies?q=${q}`}
              className="text-xs px-3 py-1 rounded-full bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-150 font-medium"
            >
              {q}
            </a>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
        >
          {[
            { icon: Building2, value: '50+', label: 'AI Companies', color: 'text-primary-500' },
            { icon: Users, value: '20+', label: 'Top Investors', color: 'text-indigo-500' },
            { icon: TrendingUp, value: '$100B+', label: 'Total Funding', color: 'text-emerald-500' },
            { icon: Zap, value: 'Live', label: 'Data Updates', color: 'text-amber-500' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div
              key={label}
              className="flex flex-col items-center p-5 bg-white/70 dark:bg-dark-900/60 backdrop-blur-sm rounded-2xl border border-dark-100/80 dark:border-dark-800/60 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              <Icon className={`h-6 w-6 ${color} mb-2`} />
              <div className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">{value}</div>
              <div className="text-xs text-dark-400 font-semibold mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Trending strip */}
        {trendingCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="section-label">
                <TrendingUp className="h-3.5 w-3.5 text-primary-500" />
                Trending Now
              </div>
              <Link href="/companies?sort=trending" className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold flex items-center gap-1 transition-colors">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {trendingCompanies.slice(0, 5).map((company, i) => (
                <TrendingCard key={company.id} company={company} rank={i + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function TrendingCard({ company, rank }: { company: Company; rank: number }) {
  return (
    <a
      href={`/companies/${company.slug}`}
      className="flex-shrink-0 w-56 group relative bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-4 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700 overflow-hidden flex-shrink-0">
            <img
              src={company.logo_url || '/placeholder-logo.svg'}
              alt={company.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-dark-900 dark:text-white text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{company.name}</p>
            <p className="text-[11px] text-dark-400 truncate">{company.category}</p>
          </div>
        </div>
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
          #{rank}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-semibold ${company.is_unicorn ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' : 'bg-dark-50 dark:bg-dark-800 text-dark-500 dark:text-dark-400'}`}>
          {company.is_unicorn ? '🦄 Unicorn' : company.stage}
        </span>
        <span className="text-dark-400 font-medium">{formatCurrency(company.funding_total)}</span>
      </div>
    </a>
  );
}