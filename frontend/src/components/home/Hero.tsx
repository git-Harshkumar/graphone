'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Sparkles, TrendingUp, Building2, Users, Zap } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { useCompanies, useTrendingCompanies } from '@/hooks/useApi';
import type { Company } from '@/types';

const categories = [
  'All',
  'AI Agents',
  'AI Coding',
  'AI Search',
  'AI Video',
  'AI Voice',
  'AI Infrastructure',
  'Foundation Models',
  'Generative Media',
  'MLOps & Tools',
  'Data & Analytics',
  'Robotics & Automation',
  'Enterprise AI',
  'Consumer AI',
  'Healthcare AI',
  'FinTech AI',
];

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const { data: trendingData } = useTrendingCompanies(5);
  const trendingCompanies = trendingData?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/companies?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/' && e.target instanceof HTMLInputElement === false) {
      e.preventDefault();
      setIsCommandOpen(true);
    }
    if (e.key === 'Escape') {
      setIsCommandOpen(false);
    }
  };


  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-dark-50 pt-20 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8"
        >
          <Sparkles className="h-4 w-4" />
          <span>GraphOne AI Economy Intelligence Platform</span>
          <span className="w-px h-4 bg-primary-200 mx-1" />
          <span className="text-xs">v1.0 • Public Beta</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-dark-900 mb-6">
            The <span className="gradient-text">Bloomberg</span> for the{' '}
            <span className="gradient-text">AI Economy</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-600 max-w-2xl mx-auto leading-relaxed">
            Track AI companies, investors, products, funding rounds, founders, and news.
            Real-time intelligence for the fastest-moving market in technology.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-dark-200 shadow-xl p-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search companies, investors, founders, products..."
                autoFocus
                className="flex-1 bg-transparent border-0 p-4 text-lg placeholder-dark-400 focus:ring-0"
              />
              <div className="flex items-center gap-2 sm:flex-row flex-col sm:flex-row">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none pl-10 pr-4 py-3 bg-dark-50 border border-dark-200 rounded-xl text-dark-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer min-w-[180px]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto px-8 py-3">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <StatCard icon={Building2} value="50+" label="AI Companies" />
          <StatCard icon={Users} value="20+" label="Top Investors" />
          <StatCard icon={TrendingUp} value="$100B+" label="Total Funding" />
          <StatCard icon={Zap} value="Real-time" label="Data Updates" />
        </motion.div>

        {/* Trending Preview */}
        {trendingCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-label">Trending Now</h3>
              <a href="/companies?sort=trending" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View all <ChevronDown className="h-4 w-4" />
              </a>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {trendingCompanies.slice(0, 5).map((company, index) => (
                <TrendingPreviewCard key={company.id} company={company} rank={index + 1} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Keyboard Shortcut Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 text-dark-400 text-sm flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-dark-200 shadow-lg"
        >
          <kbd className="px-2 py-0.5 bg-dark-100 rounded text-dark-600 font-mono text-xs">/</kbd>
          <span>Focus search</span>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-dark-200 hover:border-primary-200 transition-colors">
      <Icon className="h-8 w-8 text-primary-500 mx-auto mb-3" />
      <div className="text-3xl font-bold text-dark-900">{value}</div>
      <div className="text-sm text-dark-500 mt-1">{label}</div>
    </div>
  );
}

function TrendingPreviewCard({ company, rank }: { company: Company; rank: number }) {
  return (
    <div className="flex-shrink-0 w-56 sm:w-64 bg-white rounded-xl border border-dark-200 p-4 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold flex items-center justify-center">
        #{rank}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <img
          src={company.logo_url || '/placeholder-logo.svg'}
          alt={company.name}
          className="w-10 h-10 rounded-lg bg-dark-100 object-cover"
          onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-dark-900 truncate">{company.name}</h4>
          <p className="text-xs text-dark-500 truncate">{company.category}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-dark-600">{company.hq_city}, {company.hq_country}</span>
        <span className={`badge ${company.is_unicorn ? 'bg-yellow-50 text-yellow-700' : 'badge-dark'}`}>
          {company.is_unicorn ? 'Unicorn' : company.stage}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-dark-100 flex items-center justify-between text-xs text-dark-500">
        <span>${(company.funding_total / 1e9).toFixed(1)}B raised</span>
        <span>{company.employee_count?.toLocaleString()} employees</span>
      </div>
    </div>
  );
}