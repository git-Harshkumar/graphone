'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, TrendingUp, Sparkles, Bot, Code, Zap, Image, Video, Mic, Users, Search, Zap as ZapIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const tabs = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'chat', label: 'Chat', icon: Bot },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'agents', label: 'Agents', icon: Zap },
  { id: 'image', label: 'Image', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'productivity', label: 'Productivity', icon: Users },
];

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular');

  return (
    <div className="border-b border-dark-200 bg-white/80 backdrop-blur-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
          {/* Tab Pills */}
          <div className="flex overflow-x-auto gap-2 pb-2 lg:pb-0 -mb-2 lg:mb-0" role="tablist">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: tabs.indexOf(tab) * 0.03 }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Sort Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-dark-500 hidden sm:block">Sort by:</span>
            <div className="flex bg-dark-50 border border-dark-200 rounded-xl overflow-hidden">
              <Button
                variant={sortBy === 'popular' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('popular')}
                className="rounded-none border-r border-dark-200 bg-transparent shadow-none"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Popular
              </Button>
              <Button
                variant={sortBy === 'newest' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('newest')}
                className="rounded-none bg-transparent shadow-none"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Newest
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}