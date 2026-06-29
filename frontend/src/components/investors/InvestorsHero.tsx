'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Building2, Users, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { useInvestors, useMostActiveInvestors, useTrendingCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getInvestorTypeColor } from '@/lib/utils';
import type { Investor } from '@/types';

const topInvestors = [
  { name: 'Sequoia Capital', slug: 'sequoia-capital', logo: 'https://sequoiacap.com/logo.svg' },
  { name: 'Andreessen Horowitz', slug: 'andreessen-horowitz', logo: 'https://a16z.com/logo.svg' },
  { name: 'Lightspeed Venture Partners', slug: 'lightspeed-venture-partners', logo: 'https://lsvp.com/logo.svg' },
  { name: 'Khosla Ventures', slug: 'khosla-ventures', logo: 'https://khoslaventures.com/logo.svg' },
  { name: 'Accel', slug: 'accel', logo: 'https://accel.com/logo.svg' },
  { name: 'General Catalyst', slug: 'general-catalyst', logo: 'https://generalcatapult.com/logo.svg' },
];

export function InvestorsHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const { data: investorsData } = useInvestors({ limit: 6 });
  const { data: activeData } = useMostActiveInvestors(90, 6);
  const { data: trendingData } = useTrendingCompanies(3);

  const investors = investorsData?.data || [];
  const activeInvestors = activeData?.data || [];
  const trendingCompanies = trendingData?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/investors?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      if (e.key === 'Escape') setIsCommandOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const investorTypes = ['All', 'VC', 'Angel', 'Corporate', 'Family Office', 'Accelerator'];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-dark-50 pt-20 pb-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        {/* Floating investor logos */}
        {topInvestors.map((inv, i) => (
          <motion.div
            key={inv.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 8, delay: i * 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="logo-float"
            style={{
              top: `${15 + i * 12}%`,
              left: `${5 + (i % 3) * 25}%`,
              transform: `rotate(${(-10 + i * 5)}deg)`,
            }}
          >
            <img
              src={inv.logo}
              alt={inv.name}
              className="h-16 w-auto opacity-60 filter grayscale"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </motion.div>
        ))}
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
          <span>Investor Intelligence</span>
          <span className="w-px h-4 bg-primary-200 mx-1" />
          <span className="text-xs">20+ Top AI Investors Tracked</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-dark-900 mb-6">
            Discover the <span className="gradient-text">Capital</span> Behind{' '}
            <span className="gradient-text">AI Innovation</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-600 max-w-2xl mx-auto leading-relaxed">
            Track the most active VCs, angels, and corporate investors funding the AI revolution.
            Analyze portfolios, co-investment networks, and investment thesis.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
        >
          <StatCard icon={Building2} value="20+" label="Tracked Investors" />
          <StatCard icon={Users} value="500+" label="Portfolio Companies" />
          <StatCard icon={TrendingUp} value="$200B+" label="Total AUM" />
          <StatCard icon={Zap} value="Real-time" label="Deal Tracking" />
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-dark-200 shadow-xl p-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search investors, firms, partners..."
                autoFocus
                className="flex-1 bg-transparent border-0 p-4 text-lg placeholder-dark-400 focus:ring-0"
              />
              <div className="flex items-center gap-2 sm:flex-row flex-col sm:flex-row">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none pl-10 pr-4 py-3 bg-dark-50 border border-dark-200 rounded-xl text-dark-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer min-w-[160px]"
                  >
                    {investorTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary px-8 py-3 w-full sm:w-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Featured Investors Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-label">Top AI Investors</h3>
            <a href="/investors" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ChevronDown className="h-4 w-4" />
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {topInvestors.map((inv, index) => (
              <InvestorPreviewCard key={inv.name} investor={inv} rank={index + 1} />
            ))}
          </div>
        </motion.div>

        {/* Active Investors & Trending Companies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Most Active Investors */}
          <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-label">Most Active (90d)</h3>
              <Badge variant="primary" className="text-xs">Live</Badge>
            </div>
            <div className="space-y-3">
              {activeInvestors.slice(0, 5).map((inv, i) => (
                <ActiveInvestorRow key={inv.id} investor={inv} rank={i + 1} />
              ))}
            </div>
            <a href="/investors?sort=active" className="block text-center mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
              View full ranking →
            </a>
          </div>

          {/* Trending Portfolio Companies */}
          <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-sm">
            <h3 className="section-label mb-4">Trending Portfolio Companies</h3>
            <div className="space-y-3">
              {trendingCompanies.slice(0, 5).map((company, i) => (
                <TrendingPortfolioRow key={company.id} company={company} rank={i + 1} />
              ))}
            </div>
            <a href="/companies?sort=trending" className="block text-center mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all trending →
            </a>
          </div>
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

function InvestorPreviewCard({ investor, rank }: { investor: typeof topInvestors[0]; rank: number }) {
  return (
    <div className="flex-shrink-0 w-56 sm:w-64 bg-white rounded-xl border border-dark-200 p-4 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold flex items-center justify-center">
        #{rank}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <img
          src={investor.logo}
          alt={investor.name}
          className="w-12 h-12 rounded-lg bg-dark-100 object-contain p-2"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-dark-900 truncate">{investor.name}</h4>
        </div>
      </div>
      <a href={`/investors/${investor.slug}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
        View Profile <ChevronDown className="h-4 w-4" />
      </a>
    </div>
  );
}

function ActiveInvestorRow({ investor, rank }: { investor: Investor & { deal_count?: number }; rank: number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 transition-colors group">
      <div className="w-8 h-8 rounded-full bg-dark-100 text-dark-500 text-xs font-bold flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
        {rank}
      </div>
      <img
        src={investor.logo_url}
        alt={investor.name}
        className="w-10 h-10 rounded-lg bg-dark-100 object-contain p-1"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-dark-900 truncate group-hover:text-primary-600 transition-colors">{investor.name}</p>
        <p className="text-xs text-dark-500">{investor.type} • {investor.portfolio_count} portfolio</p>
      </div>
      <Badge variant="dark" className="text-xs" style={{ background: getInvestorTypeColor(investor.type) }}>
        {investor.deal_count || 0} deals
      </Badge>
    </div>
  );
}

function TrendingPortfolioRow({ company, rank }: { company: typeof trendingData extends { data: infer T } ? T[number] : never; rank: number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 transition-colors group">
      <div className="w-8 h-8 rounded-full bg-dark-100 text-dark-500 text-xs font-bold flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
        {rank}
      </div>
      <img
        src={company.logo_url}
        alt={company.name}
        className="w-10 h-10 rounded-lg bg-dark-100 object-cover"
        onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-dark-900 truncate group-hover:text-primary-600 transition-colors">{company.name}</p>
        <p className="text-xs text-dark-500">{company.category}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-dark-900 text-sm">{formatCurrency(company.funding_total)}</p>
        <p className="text-xs text-dark-500">{formatNumber(company.employee_count || 0)} team</p>
      </div>
    </div>
  );
}