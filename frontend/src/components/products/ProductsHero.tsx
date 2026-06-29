'use client';

import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, Zap, Sparkles, TrendingUp, Star, Users, Code, Video, Mic, Bot, Server } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useProducts, useTrendingCompanies } from '@/hooks/useApi';
import { formatNumber } from '@/lib/utils';
import type { Product } from '@/types';

const tabs = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'chat', label: 'Chat', icon: Bot },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'agents', label: 'Agents', icon: Zap },
  { id: 'image', label: 'Image', icon: Sparkles },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'productivity', label: 'Productivity', icon: Users },
];

const categories = [
  'All', 'Chat', 'Code', 'Agents', 'Image', 'Video', 'Voice', 'Productivity',
  'Search', 'Writing', 'Design', 'Data', 'Automation', 'Research', 'Education'
];

export function ProductsHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-dark-50 pt-20 pb-16 lg:pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        {/* Floating company logos */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 opacity-10"
        >
          <img src="https://openai.com/logo.svg" alt="OpenAI" className="h-12 w-auto" onError={(e) => e.currentTarget.remove()} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-30 right-10 opacity-10"
        >
          <img src="https://anthropic.com/logo.svg" alt="Anthropic" className="h-12 w-auto" onError={(e) => e.currentTarget.remove()} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 left-20 opacity-10"
        >
          <img src="https://huggingface.co/logo.svg" alt="Hugging Face" className="h-12 w-auto" onError={(e) => e.currentTarget.remove()} />
        </motion.div>
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
          <span>Product Discovery</span>
          <span className="w-px h-4 bg-primary-200 mx-1" />
          <span className="text-xs">100+ AI Products</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-dark-900 mb-6">
            Discover the Best <span className="gradient-text">AI Products</span>
          </h1>
          <p className="text-lg text-dark-600 max-w-xl leading-relaxed">
            Explore and compare AI tools across chat, coding, agents, media generation, and productivity.
            Filter by category, sort by popularity or recency.
          </p>
        </motion.div>

        {/* Collection of the Week */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 p-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Collection of the Week</p>
                <h3 className="font-bold text-lg">Top AI Coding Assistants</h3>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              Explore Collection
            </Button>
          </div>
        </motion.div>

        {/* Product of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 p-6 bg-white rounded-2xl border border-dark-200 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center">
                <Code className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="text-primary-600 text-sm font-medium">Product of the Day</p>
                <h3 className="font-bold text-dark-900">Cursor</h3>
                <p className="text-dark-500 text-sm">AI-first code editor for pair programming</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:ml-auto">
              <Badge variant="primary">Code</Badge>
              <Badge variant="dark">30k+ upvotes</Badge>
              <Button size="sm">
                View Product
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 max-w-xl">
              <SearchInput
                placeholder="Search products..."
                value=""
                onChange={() => {}}
                className="bg-transparent border-0 p-0 focus:ring-0"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
              <div className="relative hidden sm:block">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
                <select className="appearance-none pl-10 pr-8 py-2.5 bg-dark-50 border border-dark-200 rounded-xl text-dark-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer min-w-[140px]">
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex bg-dark-50 border border-dark-200 rounded-xl overflow-hidden">
                <button className="px-4 py-2.5 flex items-center justify-center text-primary-600 bg-white border-r border-dark-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <button className="px-4 py-2.5 flex items-center justify-center text-dark-500 hover:text-dark-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}