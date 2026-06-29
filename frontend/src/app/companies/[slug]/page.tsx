'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Building2, Calendar, MapPin, Users, TrendingUp, DollarSign, Award, Star, PieChart, ArrowUpRight, Twitter, Linkedin, Globe, Share2, Bookmark, Zap, Lightbulb, Briefcase, FileText, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useCompany, useCompanyGraph, useTrendingCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, formatDate, getStageColor, cn } from '@/lib/utils';
import type { Company, CompanyGraph, FundingRound, Product, Founder, Investor } from '@/types';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';
import { MetricCard } from './components/MetricCard';
import { InvestmentRow } from './components/InvestmentRow';
import { CompanySkeleton } from './components/CompanySkeleton';
import { CompanyNotFound } from './components/CompanyNotFound';
import { OverviewTab, TimelineTab, FundingTab, OwnershipTab, InvestorsTab, LeadershipTab, ProductsTab, MoreTab } from './components/Tabs';

interface CompanyPageProps {
  params: { slug: string };
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'funding', label: 'Funding', icon: DollarSign },
  { id: 'ownership', label: 'Ownership', icon: TrendingUp },
  { id: 'investors', label: 'Investors', icon: Users },
  { id: 'leadership', label: 'Leadership', icon: Bookmark },
  { id: 'products', label: 'Products', icon: TrendingUp },
  { id: 'more', label: 'More', icon: ChevronRight },
];

export default function CompanyPage({ params }: CompanyPageProps) {
  const { data: companyData, isLoading: companyLoading, error: companyError } = useCompany(params.slug, true);
  const { data: graphData } = useCompanyGraph(params.slug);
  const { data: trendingData } = useTrendingCompanies(6);

  const [activeTab, setActiveTab] = useState('overview');
  const company = companyData?.data;

  if (companyLoading) return <CompanySkeleton />;
  if (companyError || !company) return <CompanyNotFound slug={params.slug} />;

  const fundingRounds = company.funding_rounds || [];
  const products = company.products || [];
  const founders = company.founders || [];
  const investors = company.investors || [];
  const competitors = graphData?.data?.competitors || [];
  const coInvestors = graphData?.data?.coInvestors || [];
  const graphProducts = graphData?.data?.products || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-gradient-to-b from-white to-dark-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Logo & Basic Info */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-dark-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                <img
                  src={company.logo_url || '/placeholder-logo.svg'}
                  alt={company.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
                />
              </div>
              {company.is_unicorn && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                  className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                >
                  🦄
                </motion.div>
              )}
            </div>

            {/* Name & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold text-dark-900"
                >
                  {company.name}
                </motion.h1>
                {company.is_unicorn && (
                  <Badge variant="primary" className="text-sm">
                    <span className="mr-1">🦄</span> Unicorn
                  </Badge>
                )}
                <Badge variant="dark" style={{ background: getStageColor(company.stage) }}>
                  {company.stage}
                </Badge>
                <Badge variant="outline">{company.category}</Badge>
              </div>

              <p className="text-lg text-dark-600 mb-6 max-w-2xl">{company.description || 'Building the future of AI...'}</p>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-dark-500 mb-6">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                    <Globe className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{new URL(company.website).hostname}</span>
                  </a>
                )}
                {company.founded_year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Founded {company.founded_year}
                  </span>
                )}
                {(company.hq_city || company.hq_country) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {company.hq_city}, {company.hq_country}
                  </span>
                )}
                {company.employee_count && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {formatNumber(company.employee_count)} employees
                  </span>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {company.twitter && (
                  <a href={`https://twitter.com/${company.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-100 text-dark-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {company.linkedin && (
                  <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-100 text-dark-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-dark-200" role="tablist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 pb-px" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors',
                  activeTab === tab.id
                    ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-500'
                    : 'text-dark-500 hover:text-dark-700 hover:bg-dark-50'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab company={company} />}
            {activeTab === 'timeline' && <TimelineTab company={company} fundingRounds={fundingRounds} />}
            {activeTab === 'funding' && <FundingTab fundingRounds={fundingRounds} />}
            {activeTab === 'ownership' && <OwnershipTab company={company} fundingRounds={fundingRounds} />}
            {activeTab === 'investors' && <InvestorsTab investors={investors} />}
            {activeTab === 'leadership' && <LeadershipTab founders={founders} />}
            {activeTab === 'products' && <ProductsTab products={products} graphProducts={graphProducts} />}
            {activeTab === 'more' && <MoreTab company={company} competitors={competitors} coInvestors={coInvestors} trending={trendingData?.data || []} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}