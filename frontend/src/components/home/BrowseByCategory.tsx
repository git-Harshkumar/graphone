'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Brain, Code, Search, Video, Mic, Server, Wand2, Layers, Database, Bot, Building, Heart, DollarSign, Shield, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useCompanies } from '@/hooks/useApi';
import type { Company } from '@/types';

const categories = [
  { id: 'AI Agents', name: 'AI Agents', icon: Bot, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' },
  { id: 'AI Coding', name: 'AI Coding', icon: Code, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700' },
  { id: 'AI Search', name: 'AI Search', icon: Search, color: 'from-green-500 to-green-600', bg: 'bg-green-50', text: 'text-green-700' },
  { id: 'AI Video', name: 'AI Video', icon: Video, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-700' },
  { id: 'AI Voice', name: 'AI Voice', icon: Mic, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', text: 'text-orange-700' },
  { id: 'AI Infrastructure', name: 'AI Infrastructure', icon: Server, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  { id: 'Foundation Models', name: 'Foundation Models', icon: Brain, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-700' },
  { id: 'Generative Media', name: 'Generative Media', icon: Wand2, color: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-700' },
  { id: 'MLOps & Tools', name: 'MLOps & Tools', icon: Layers, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-700' },
  { id: 'Data & Analytics', name: 'Data & Analytics', icon: Database, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', text: 'text-teal-700' },
  { id: 'Enterprise AI', name: 'Enterprise AI', icon: Building, color: 'from-slate-500 to-slate-600', bg: 'bg-slate-50', text: 'text-slate-700' },
  { id: 'Healthcare AI', name: 'Healthcare AI', icon: Heart, color: 'from-red-500 to-red-600', bg: 'bg-red-50', text: 'text-red-700' },
];

export function BrowseByCategory() {
  const { data: companiesData } = useCompanies({ limit: 100 });
  const companies = companiesData?.data || [];

  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: companies.filter(c => c.category === cat.id).length,
  }));

  return (
    <section className="py-20 bg-dark-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Browse by Category</h2>
            <p className="text-dark-500 text-sm mt-1">Explore AI companies across 12+ categories</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categoryCounts.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: typeof categories[0] & { count: number } }) {
  const Icon = category.icon;

  return (
    <Card variant="outlined" hover className="group p-5 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${category.bg} ${category.text} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="font-semibold text-dark-900 mb-1">{category.name}</h3>
        <p className="text-dark-500 text-sm">{category.count} companies</p>
      </div>
    </Card>
  );
}