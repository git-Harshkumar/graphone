'use client';

import { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Building2, MapPin, Calendar, Users, TrendingUp, DollarSign, Award, Star, PieChart, BarChart2, ArrowUpRight, Twitter, Linkedin, Globe, Share2, Bookmark, Plus, Minus, Search, Filter, Zap, Lightbulb, Briefcase, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useInvestor, useInvestorPortfolio, useInvestorCoInvestors } from '@/hooks/useApi';
import { formatCurrency, formatNumber, formatDate, getInvestorTypeColor, cn } from '@/lib/utils';
import type { Investor, FundingRound } from '@/types';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';

interface InvestorProfileProps {
  params: { slug: string };
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'velocity', label: 'Velocity', icon: TrendingUp },
  { id: 'network', label: 'Network', icon: Users },
  { id: 'thesis', label: 'Thesis', icon: Lightbulb },
  { id: 'exits', label: 'Exits', icon: Award },
  { id: 'research', label: 'Research', icon: Search },
];

export default function InvestorProfilePage({ params }: InvestorProfileProps) {
  const { data: investorData, isLoading, error } = useInvestor(params.slug);
  const { data: portfolioData } = useInvestorPortfolio(params.slug);
  const { data: coInvestorsData } = useInvestorCoInvestors(params.slug);

  const [activeTab, setActiveTab] = useState('overview');
  const investor = investorData?.data;

  if (isLoading) return <InvestorSkeleton />;
  if (error || !investor) return <InvestorNotFound slug={params.slug} />;

  const portfolio = portfolioData?.data || [];
  const coInvestors = coInvestorsData?.data || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-gradient-to-b from-white to-dark-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-dark-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                <img
                  src={investor.logo_url}
                  alt={investor.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>

            {/* Name & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold text-dark-900"
                >
                  {investor.name}
                </motion.h1>
                <Badge variant="dark" style={{ background: getInvestorTypeColor(investor.type) }}>
                  {investor.type}
                </Badge>
                {investor.fund_number && (
                  <Badge variant="outline">Fund {investor.fund_number}</Badge>
                )}
              </div>

              <p className="text-lg text-dark-600 mb-6 max-w-2xl">{investor.bio || 'Leading investor in AI and technology.'}</p>

              {/* Stat Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatPill icon={DollarSign} label="Deals (90d)" value={`${Math.floor(Math.random() * 15) + 5}`} color="green" />
                <StatPill icon={Star} label="Lead Investments" value={`${Math.floor(Math.random() * 8) + 2}`} color="purple" />
                <StatPill icon={TrendingUp} label="Most Active Stage" value={investor.stage_focus?.[0] || 'Series A'} color="blue" />
                <StatPill icon={Award} label="Top Focus" value={investor.sector_focus?.[0] || 'AI/ML'} color="orange" />
              </div>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-dark-500 mb-6">
                {(investor.location) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {investor.location}
                  </span>
                )}
                {investor.aum && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    AUM: {formatCurrency(investor.aum)}
                  </span>
                )}
                {investor.portfolio_count && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {investor.portfolio_count} Portfolio
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Follow
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            {/* Key People */}
            <div className="lg:w-80">
              <h3 className="text-sm font-semibold text-dark-900 mb-3">Key People</h3>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    name={`Partner ${i}`}
                    size="lg"
                    className="border-2 border-white"
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center text-primary-600 font-bold text-sm">
                  +3
                </div>
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
            {activeTab === 'overview' && <OverviewTab investor={investor} portfolio={portfolio} />}
            {activeTab === 'portfolio' && <PortfolioTab portfolio={portfolio} />}
            {activeTab === 'velocity' && <VelocityTab investor={investor} />}
            {activeTab === 'network' && <NetworkTab coInvestors={coInvestors} />}
            {activeTab === 'thesis' && <ThesisTab investor={investor} />}
            {activeTab === 'exits' && <ExitsTab />}
            {activeTab === 'research' && <ResearchTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ investor, portfolio }: { investor: Investor; portfolio: FundingRound[] }) {
  const recentInvestments = portfolio.slice(0, 5);
  const stages = investor.stage_focus || ['Seed', 'Series A', 'Series B'];
  const sectors = investor.sector_focus || ['AI/ML', 'Enterprise', 'Consumer'];

  return (
    <div className="space-y-8">
      {/* Investment Thesis */}
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-4">Investment Thesis</h3>
          <p className="text-dark-600 leading-relaxed mb-6">
            {investor.bio || 'We invest in exceptional founders building transformative AI companies. Our focus spans foundation models, AI applications, and the infrastructure powering the AI revolution. We partner early and stay long-term.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <Badge key={stage} variant="dark" style={{ background: getStageColor(stage) }}>
                {stage}
              </Badge>
            ))}
            {sectors.map((sector) => (
              <Badge key={sector} variant="outline">{sector}</Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total AUM" value={investor.aum ? formatCurrency(investor.aum) : 'N/A'} icon={DollarSign} color="green" />
        <StatCard label="Portfolio Companies" value={formatNumber(investor.portfolio_count || 0)} icon={Briefcase} color="blue" />
        <StatCard label="Current Fund" value={`Fund ${investor.fund_number || 'N/A'}`} icon={Building2} color="purple" />
        <StatCard label="Avg Check Size" value={investor.avg_check_size ? formatCurrency(investor.avg_check_size) : 'N/A'} icon={TrendingUp} color="orange" />
      </div>

      {/* Portfolio Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="p-6">
            <h3 className="section-label mb-6">Portfolio by Stage</h3>
            <DonutChart
              data={[
                { name: 'Seed', value: 35, color: '#a855f7' },
                { name: 'Series A', value: 25, color: '#3b82f6' },
                { name: 'Series B', value: 20, color: '#22c55e' },
                { name: 'Series C+', value: 15, color: '#f59e0b' },
                { name: 'Growth', value: 5, color: '#ef4444' },
              ]}
              height={280}
            />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="section-label mb-6">Portfolio by Sector</h3>
            <DonutChart
              data={[
                { name: 'AI/ML', value: 45, color: '#e91e63' },
                { name: 'Enterprise', value: 20, color: '#3b82f6' },
                { name: 'Consumer', value: 15, color: '#22c55e' },
                { name: 'FinTech', value: 10, color: '#f59e0b' },
                { name: 'Healthcare', value: 10, color: '#8b5cf6' },
              ]}
              height={280}
            />
          </div>
        </Card>
      </div>

      {/* Recent Investments */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-label">Recent Investments</h3>
            <a href={`/investors/${investor.slug}/investments`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentInvestments.length > 0 ? (
              recentInvestments.map((round) => (
                <InvestmentRow key={round.id} round={round} />
              ))
            ) : (
              <p className="text-dark-500 text-center py-8">No portfolio data available</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function PortfolioTab({ portfolio }: { portfolio: FundingRound[] }) {
  return (
    <div className="space-y-4">
      {portfolio.length > 0 ? (
        portfolio.map((round) => (
          <motion.div
            key={round.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PortfolioRow round={round} />
          </motion.div>
        ))
      ) : (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-dark-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-900 mb-2">No portfolio data</h3>
          <p className="text-dark-500">Investments will appear here when available.</p>
        </Card>
      )}
    </div>
  );
}

function VelocityTab({ investor }: { investor: Investor }) {
  return (
    <div className="space-y-8">
      {/* Yearly Deal Counts */}
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-6">Investment Velocity (Yearly Deal Count)</h3>
          <BarChart
            data={[
              { year: '2020', deals: 8 },
              { year: '2021', deals: 15 },
              { year: '2022', deals: 22 },
              { year: '2023', deals: 18 },
              { year: '2024', deals: 12 },
            ]}
            xKey="year"
            yKey="deals"
            color="#e91e63"
            height={300}
          />
        </div>
      </Card>

      {/* Capital Flow */}
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-6">Capital Deployed by Category</h3>
          <BarChart
            data={[
              { category: 'AI/ML', deployed: 45 },
              { category: 'Enterprise', deployed: 20 },
              { category: 'Consumer', deployed: 15 },
              { category: 'FinTech', deployed: 10 },
              { category: 'Healthcare', deployed: 10 },
            ]}
            xKey="category"
            yKey="deployed"
            color="#3b82f6"
            height={300}
          />
        </div>
      </Card>

      {/* Stage Evolution */}
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-6">Stage Evolution</h3>
          <div className="space-y-4">
            {[
              { year: '2020', focus: 'Seed (60%), Series A (30%), Series B (10%)' },
              { year: '2021', focus: 'Seed (40%), Series A (35%), Series B (20%), Series C+ (5%)' },
              { year: '2022', focus: 'Seed (30%), Series A (30%), Series B (25%), Series C+ (15%)' },
              { year: '2023', focus: 'Seed (25%), Series A (25%), Series B (25%), Series C+ (25%)' },
              { year: '2024', focus: 'Seed (20%), Series A (20%), Series B (20%), Series C+ (30%), Growth (10%)' },
            ].map((item) => (
              <div key={item.year} className="flex items-center gap-4 p-4 bg-dark-50 rounded-xl">
                <div className="w-20 text-right font-medium text-dark-900">{item.year}</div>
                <div className="flex-1 text-dark-600">{item.focus}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function NetworkTab({ coInvestors }: { coInvestors: Array<Investor & { shared_deals: number }> }) {
  return (
    <div className="space-y-8">
      {/* Co-Investor Network */}
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-6">Frequent Co-Investors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coInvestors.slice(0, 9).map((inv) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <a href={`/investors/${inv.slug}`} className="group flex items-center gap-3 p-4 rounded-xl bg-dark-50 hover:bg-dark-100 transition-colors">
                  <img
                    src={inv.logo_url}
                    alt={inv.name}
                    className="w-12 h-12 rounded-lg bg-white object-contain p-1"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 group-hover:text-primary-600 transition-colors truncate">{inv.name}</p>
                    <p className="text-sm text-dark-500">{inv.type} • {formatNumber(inv.portfolio_count || 0)} portfolio</p>
                  </div>
                  <Badge variant="primary" className="text-sm">{inv.shared_deals} shared</Badge>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Network Strength" value="92/100" icon={Users} color="purple" />
        <StatCard label="Co-Investment Rate" value="68%" icon={TrendingUp} color="green" />
        <StatCard label="AI Market Influence" value="Top 5%" icon={Zap} color="orange" />
        <StatCard label="Exit Intelligence" value="8.5/10" icon={Award} color="blue" />
      </div>
    </div>
  );
}

function ThesisTab({ investor }: { investor: Investor }) {
  return (
    <div className="max-w-3xl space-y-8">
      <Card>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-dark-900">Investment Thesis</h3>
          </div>
          <blockquote className="text-lg text-dark-600 leading-relaxed border-l-4 border-primary-500 pl-6 italic">
            "{investor.bio || 'We believe AI is the most transformative technology of our generation. We invest in founders building foundational models, AI applications, and the infrastructure that powers them. Our approach: partner early, add strategic value beyond capital, and stay committed through multiple fund cycles.'}"
          </blockquote>
          <div className="mt-6 pt-6 border-t border-dark-200">
            <h4 className="font-semibold text-dark-900 mb-3">Key Focus Areas</h4>
            <div className="flex flex-wrap gap-2">
              {(investor.sector_focus || ['Foundation Models', 'AI Applications', 'AI Infrastructure', 'MLOps', 'Enterprise AI']).map((sector) => (
                <Badge key={sector} variant="dark" style={{ background: 'rgba(233, 30, 99, 0.1)' }}>
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="section-label mb-4">Portfolio Concentration</h3>
          <DonutChart
            data={[
              { name: 'Top 5', value: 35, color: '#e91e63' },
              { name: 'Top 10', value: 25, color: '#c2185b' },
              { name: 'Top 20', value: 20, color: '#ad1457' },
              { name: 'Others', value: 20, color: '#fce4ec' },
            ]}
            height={250}
          />
          <div className="mt-4 grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-primary-50 rounded-lg"><p className="font-bold text-primary-700">35%</p><p className="text-xs text-primary-600">Top 5</p></div>
            <div className="p-3 bg-primary-50 rounded-lg"><p className="font-bold text-primary-700">25%</p><p className="text-xs text-primary-600">Top 10</p></div>
            <div className="p-3 bg-primary-50 rounded-lg"><p className="font-bold text-primary-700">20%</p><p className="text-xs text-primary-600">Top 20</p></div>
            <div className="p-3 bg-dark-50 rounded-lg"><p className="font-bold text-dark-700">20%</p><p className="text-xs text-dark-600">Others</p></div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ExitsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-4">Outcome Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OutcomeStat label="IPOs" value="3" color="green" icon={TrendingUp} />
            <OutcomeStat label="Acquisitions" value="12" color="blue" icon={Building2} />
            <OutcomeStat label="Unicorns" value="8" color="purple" icon={Star} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="section-label mb-4">Notable Exits</h3>
          <div className="space-y-3">
            {[
              { company: 'GitHub', outcome: 'Acquired by Microsoft', value: '$7.5B', year: '2018' },
              { company: 'Figma', outcome: 'Acquired by Adobe', value: '$20B', year: '2022' },
              { company: 'Databricks', outcome: 'IPO Pending', value: '$43B', year: '2024' },
              { company: 'Anthropic', outcome: 'Unicorn', value: '$18.4B', year: '2023' },
            ].map((exit) => (
              <div key={exit.company} className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-900">{exit.company}</p>
                    <p className="text-sm text-dark-500">{exit.outcome} • {exit.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{exit.value}</p>
                  <Badge variant="outline" className="text-xs">{exit.outcome.includes('IPO') ? 'IPO' : exit.outcome.includes('Acquired') ? 'M&A' : 'Unicorn'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ResearchTab() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-4">Recent Research & Mentions</h3>
          <div className="space-y-3">
            {[
              { title: 'AI Investment Thesis 2024', source: 'Sequoia Blog', date: '2024-01-15', type: 'Blog' },
              { title: 'The State of AI Funding', source: 'PitchBook', date: '2024-02-20', type: 'Report' },
              { title: 'Generative AI Market Map', source: 'a16z', date: '2024-03-10', type: 'Map' },
              { title: 'Investor Podcast: AI Frontier', source: 'Twenty Minute VC', date: '2024-04-05', type: 'Podcast' },
            ].map((item) => (
              <a key={item.title} href="#" className="group flex items-center justify-between p-4 rounded-xl hover:bg-dark-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-900 group-hover:text-primary-600 transition-colors">{item.title}</p>
                    <p className="text-sm text-dark-500">{item.source} • {item.type}</p>
                  </div>
                </div>
                <span className="text-sm text-dark-400">{formatDate(item.date)}</span>
              </a>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="section-label mb-4">Related Investors</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {[
              { name: 'Sequoia Capital', logo: 'https://sequoiacap.com/logo.svg' },
              { name: 'Andreessen Horowitz', logo: 'https://a16z.com/logo.svg' },
              { name: 'Lightspeed', logo: 'https://lsvp.com/logo.svg' },
              { name: 'Khosla Ventures', logo: 'https://khoslaventures.com/logo.svg' },
              { name: 'Accel', logo: 'https://accel.com/logo.svg' },
              { name: 'General Catalyst', logo: 'https://generalcatapult.com/logo.svg' },
            ].map((inv) => (
              <a key={inv.name} href="#" className="flex-shrink-0 flex flex-col items-center gap-2 w-28 group">
                <img src={inv.logo} alt={inv.name} className="w-20 h-20 rounded-xl bg-dark-100 object-contain p-2 group-hover:ring-2 group-hover:ring-primary-500 transition-all" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="text-xs text-dark-600 text-center truncate group-hover:text-primary-600">{inv.name}</span>
              </a>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper Components
function StatPill({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  const colors = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${colors[color as keyof typeof colors] || colors.blue}`}>
      <Icon className="h-5 w-5" />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs">{label}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; color: string }) {
  const colors = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card variant="outlined" className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-500">{label}</p>
          <p className="text-2xl font-bold text-dark-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color as keyof typeof colors] || colors.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function OutcomeStat({ label, value, color, icon: Icon }: { label: string; value: string; color: string; icon: React.ComponentType<{ className?: string }> }) {
  const colors = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="text-center p-4">
      <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${colors[color as keyof typeof colors] || colors.blue}`}>
        <Icon className="h-8 w-8" />
      </div>
      <p className="text-3xl font-bold text-dark-900">{value}</p>
      <p className="text-sm text-dark-500">{label}</p>
    </div>
  );
}

function InvestmentRow({ round }: { round: FundingRound }) {
  return (
    <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <p className="font-medium text-dark-900">{round.company?.name || 'Company'}</p>
          <p className="text-sm text-dark-500">{round.round_type} • {formatDate(round.date)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-dark-900">{formatCurrency(round.amount)}</p>
        <Badge variant="dark" className="text-xs" style={{ background: getStageColor(round.round_type) }}>
          {round.round_type}
        </Badge>
      </div>
    </div>
  );
}

function PortfolioRow({ round }: { round: FundingRound }) {
  return (
    <Card variant="outlined" className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={round.company?.logo_url}
            alt={round.company?.name}
            className="w-12 h-12 rounded-lg bg-dark-100 object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
          />
          <div>
            <p className="font-semibold text-dark-900">{round.company?.name}</p>
            <p className="text-sm text-dark-500">{round.round_type} • {formatDate(round.date)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-dark-900">{formatCurrency(round.amount)}</p>
          <Badge variant="dark" className="text-xs" style={{ background: getStageColor(round.round_type) }}>
            {round.round_type}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

function InvestorSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8 mb-12">
          <div className="w-24 h-24 rounded-2xl bg-dark-200" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 bg-dark-200 rounded" />
            <div className="h-4 w-1/2 bg-dark-200 rounded" />
            <div className="h-4 w-1/3 bg-dark-200 rounded" />
          </div>
        </div>
        <div className="h-10 bg-dark-200 rounded mb-8" />
      </div>
    </div>
  );
}

function InvestorNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Building2 className="h-16 w-16 text-dark-300 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-dark-900 mb-2">Investor Not Found</h1>
        <p className="text-dark-500 mb-6">We couldn't find an investor with the slug "{slug}".</p>
        <a href="/investors" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
          Browse all investors <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

