'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Building2, Users, TrendingUp, Sparkles, Briefcase, Newspaper, Briefcase as BriefcaseIcon, Search, X, Bot, Code, Zap, Image, Video, Mic, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Building2 },
  { href: '/companies', label: 'AI Startups', icon: Building2 },
  { href: '/products', label: 'AI Products', icon: Sparkles, active: true },
  { href: '/investors', label: 'Investors', icon: Users },
  { href: '/jobs', label: 'Jobs', icon: BriefcaseIcon },
  { href: '/news', label: 'News', icon: Newspaper },
];

const categories = [
  { id: 'all', label: 'All Products', count: 156 },
  { id: 'chat', label: 'Chat & Assistants', count: 28, icon: Bot },
  { id: 'code', label: 'Code & Development', count: 34, icon: Code },
  { id: 'agents', label: 'AI Agents', count: 19, icon: Zap },
  { id: 'image', label: 'Image Generation', count: 22, icon: Image },
  { id: 'video', label: 'Video Generation', count: 15, icon: Video },
  { id: 'voice', label: 'Voice & Audio', count: 12, icon: Mic },
  { id: 'productivity', label: 'Productivity', count: 26, icon: Users },
];

export function ProductSidebar() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-dark-200 h-screen sticky top-0 overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-dark-200">
          <a href="/" className="flex items-center gap-2" aria-label="GraphOne Home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="font-bold text-xl text-dark-900">GraphOne</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                item.active
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="border-t border-dark-200 mx-4 my-4" />

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-dark-50 border border-dark-200 rounded-xl text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-500 mb-3 px-2">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                  selectedCategory === cat.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
                )}
              >
                <div className="flex items-center gap-2">
                  {cat.icon && <cat.icon className="h-4 w-4" />}
                  <span>{cat.label}</span>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  selectedCategory === cat.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-dark-100 text-dark-500'
                )}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-dark-200 mx-4 my-4" />

        {/* Sort */}
        <div className="px-4 mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-500 mb-3 px-2">Sort By</h3>
          <div className="space-y-1">
            {[
              { id: 'popular', label: 'Most Popular', icon: TrendingUp },
              { id: 'newest', label: 'Newest First', icon: Sparkles },
              { id: 'upvotes', label: 'Most Upvotes', icon: Star },
            ].map((opt) => (
              <button
                key={opt.id}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                  selectedCategory === opt.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
                )}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Newsletter Signup */}
        <div className="p-4 border-t border-dark-200">
          <div className="mb-4">
            <h3 className="font-semibold text-dark-900 mb-1">Newsletter</h3>
            <p className="text-sm text-dark-500">Weekly AI product picks</p>
          </div>
          <form className="space-y-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-dark-50 border border-dark-200 rounded-lg text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <button type="submit" className="w-full btn-primary py-2 text-sm">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-dark-500 text-center mt-3">No spam. Unsubscribe anytime.</p>
        </div>

        <div className="p-4 border-t border-dark-200 text-xs text-dark-500 text-center">
          <p>GraphOne v1.0</p>
          <p className="mt-1">AI Economy Intelligence</p>
        </div>
      </div>
    </aside>
  );
}

