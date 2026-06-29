'use client';

import { Building2, Calendar, MapPin, Users, TrendingUp, DollarSign, Award, Star, Globe, Twitter, Linkedin, Share2, Bookmark, ChevronRight, Zap, Lightbulb, Briefcase, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatNumber, formatDate, getStageColor } from '@/lib/utils';
import type { Company, FundingRound, Founder, Investor, Product } from '@/types';
import { MetricCard } from './MetricCard';
import { InvestmentRow } from './InvestmentRow';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';

interface OverviewTabProps {
  company: Company;
}

export function OverviewTab({ company }: OverviewTabProps) {
  const stages = company.stage_focus || ['Seed', 'Series A', 'Series B'];
  const sectors = company.sector_focus || ['AI/ML', 'Enterprise', 'Consumer'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard label="Total Funding" value={formatCurrency(company.funding_total)} icon={DollarSign} color="green" />
        <MetricCard label="Valuation" value={company.valuation ? formatCurrency(company.valuation) : 'N/A'} icon={TrendingUp} color="purple" />
        <MetricCard label="Employees" value={formatNumber(company.employee_count || 0)} icon={Users} color="blue" />
        <MetricCard label="Growth Score" value={`${company.growth_score || 0}/100`} icon={TrendingUp} color="orange" />
      </div>

      <Card>
        <div className="p-6">
          <h3 className="section-label mb-4">About</h3>
          <p className="text-dark-600 leading-relaxed">{company.description || 'No description available.'}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="section-label mb-4">Company Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-dark-500">Category</dt><dd className="font-medium text-dark-900">{company.category}</dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Stage</dt><dd className="font-medium text-dark-900"><Badge style={{ background: getStageColor(company.stage) }}>{company.stage}</Badge></dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Founded</dt><dd className="font-medium text-dark-900">{company.founded_year || 'N/A'}</dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Headquarters</dt><dd className="font-medium text-dark-900">{company.hq_city}, {company.hq_country}</dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Employees</dt><dd className="font-medium text-dark-900">{formatNumber(company.employee_count || 0)}</dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Data Confidence</dt><dd className="font-medium text-dark-900">{company.data_confidence_score}%</dd></div>
            </dl>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="section-label mb-4">Financials</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-dark-500">Total Funding</dt><dd className="font-medium text-dark-900">{formatCurrency(company.funding_total)}</dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Valuation</dt><dd className="font-medium text-dark-900">{company.valuation ? formatCurrency(company.valuation) : 'Private'}</dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Unicorn Status</dt><dd className="font-medium text-dark-900">{company.is_unicorn ? 'Yes 🦄' : 'No'}</dd></div>
              <div className="flex justify-between"><dt className="text-dark-500">Growth Score</dt><dd className="font-medium text-dark-900">{company.growth_score || 0}/100</dd></div>
            </dl>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="section-label mb-4">Links</h3>
            <div className="space-y-3">
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-dark-600 hover:text-primary-600 transition-colors">
                  <Globe className="h-5 w-5" />
                  <span>Website</span>
                </a>
              )}
              {company.twitter && (
                <a href={`https://twitter.com/${company.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-dark-600 hover:text-primary-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span>@{company.twitter}</span>
                </a>
              )}
              {company.linkedin && (
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-dark-600 hover:text-primary-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface TimelineTabProps {
  company: Company;
  fundingRounds: FundingRound[];
}

export function TimelineTab({ company, fundingRounds }: TimelineTabProps) {
  type Milestone = { date: string; title: string; description: string; type: string };
  
  const milestones: Milestone[] = [
    { date: company.founded_year ? `${company.founded_year}-01-01` : '', title: 'Company Founded', description: `${company.name} was founded in ${company.hq_city}, ${company.hq_country}`, type: 'founding' },
    ...fundingRounds.slice(0, 5).map((round) => ({
      date: round.date,
      title: `${round.round_type} - ${formatCurrency(round.amount)}`,
      description: `Led by ${round.lead_investor?.name || 'undisclosed'}${round.co_investors?.length ? ` + ${round.co_investors.length} others` : ''}`,
      type: 'funding',
    })),
    ...(company.products?.slice(0, 3).map((p) => ({
      date: p.launch_date!,
      title: `Product Launch: ${p.name}`,
      description: p.description || '',
      type: 'product',
    })) || []),
  ].filter((m): m is Milestone => !!m.date).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-3xl">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-200" />
        {milestones.map((milestone, index) => (
          <motion.div
            key={`${milestone.date}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-16 pb-10"
          >
            <div className="absolute left-6 top-1 w-3 h-3 rounded-full border-2 bg-white z-10"
              style={{ borderColor: milestone.type === 'founding' ? '#e91e63' : milestone.type === 'funding' ? '#22c55e' : '#3b82f6' }}
            />
            <Card variant="outlined" className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-sm text-dark-500 whitespace-nowrap min-w-[100px]">{formatDate(milestone.date)}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-dark-900">{milestone.title}</h4>
                  <p className="text-sm text-dark-500 mt-1">{milestone.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface FundingTabProps {
  fundingRounds: FundingRound[];
}

export function FundingTab({ fundingRounds }: FundingTabProps) {
  if (fundingRounds.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="h-12 w-12 text-dark-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-900 mb-2">No funding data available</h3>
        <p className="text-dark-500">Funding rounds will appear here when available.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {fundingRounds.map((round) => (
        <motion.div
          key={round.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <InvestmentRow round={round} />
        </motion.div>
      ))}
    </div>
  );
}

interface OwnershipTabProps {
  company: Company;
  fundingRounds: FundingRound[];
}

export function OwnershipTab({ company, fundingRounds }: OwnershipTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <div className="p-6">
          <h3 className="section-label mb-6">Ownership Breakdown</h3>
          <div className="aspect-square flex items-center justify-center relative">
            <div className="w-48 h-48 rounded-full border-8 border-primary-500/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-green-500/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-8 border-purple-500/20 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-center">
                        <span className="text-2xl font-bold text-dark-900">Founders</span>
                        <span className="block text-sm text-dark-500">~60%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg"><p className="font-bold text-green-700">60%</p><p className="text-xs text-green-600">Founders</p></div>
            <div className="p-3 bg-blue-50 rounded-lg"><p className="font-bold text-blue-700">25%</p><p className="text-xs text-blue-600">Investors</p></div>
            <div className="p-3 bg-purple-50 rounded-lg"><p className="font-bold text-purple-700">15%</p><p className="text-xs text-purple-600">ESOP/Other</p></div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="section-label mb-6">Key Shareholders</h3>
          <div className="space-y-3">
            {fundingRounds.flatMap(r => [r.lead_investor, ...(r.co_investors || [])]).filter((inv): inv is Investor => !!inv).slice(0, 8).map((inv, i) => (
              <div key={inv.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-dark-100 flex items-center justify-center text-sm font-medium text-dark-600">
                  {i + 1}
                </div>
                <Avatar src={inv.logo_url} name={inv.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-900 truncate">{inv.name}</p>
                  <p className="text-xs text-dark-500">{inv.type} • {inv.portfolio_count} portfolio</p>
                </div>
                <Badge variant="outline" className="text-xs">~{Math.floor(Math.random() * 15) + 1}%</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

interface InvestorsTabProps {
  investors: Investor[];
}

export function InvestorsTab({ investors }: InvestorsTabProps) {
  if (investors.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users className="h-12 w-12 text-dark-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-900 mb-2">No investor data</h3>
        <p className="text-dark-500">Investors will appear here when funding rounds are added.</p>
      </Card>
    );
  }

  const seedInvestors = investors.filter(i => i.type === 'VC' || i.type === 'Angel').slice(0, 6);
  const seriesInvestors = investors.filter(i => i.type === 'VC').slice(0, 6);
  const growthInvestors = investors.filter(i => i.type === 'Corporate' || i.type === 'Family Office').slice(0, 6);

  return (
    <div className="space-y-8">
      <InvestorColumn title="Seed Investors" investors={seedInvestors} color="green" />
      <InvestorColumn title="Series A/B Investors" investors={seriesInvestors} color="blue" />
      <InvestorColumn title="Growth Investors" investors={growthInvestors} color="purple" />
    </div>
  );
}

interface InvestorColumnProps {
  title: string;
  investors: Investor[];
  color: string;
}

function InvestorColumn({ title, investors, color }: InvestorColumnProps) {
  return (
    <Card>
      <div className="p-6">
        <h3 className="section-label mb-4">{title}</h3>
        <div className="space-y-3">
          {investors.length > 0 ? (
            investors.map((inv) => (
              <a key={inv.id} href={`/investors/${inv.slug}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-50 transition-colors group">
                <Avatar src={inv.logo_url} name={inv.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-900 group-hover:text-primary-600 transition-colors truncate">{inv.name}</p>
                  <p className="text-xs text-dark-500">{inv.type} • {formatCurrency(inv.aum || 0)} AUM</p>
                </div>
              </a>
            ))
          ) : (
            <p className="text-dark-500 text-sm text-center py-4">No investors in this category</p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface LeadershipTabProps {
  founders: Founder[];
}

export function LeadershipTab({ founders }: LeadershipTabProps) {
  if (founders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users className="h-12 w-12 text-dark-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-900 mb-2">No leadership data</h3>
        <p className="text-dark-500">Founders and executives will appear here.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {founders.map((founder) => (
        <motion.div
          key={founder.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="outlined" className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mx-auto mb-4">
              <Avatar src={founder.photo_url} name={founder.name} size="xl" />
            </div>
            <h4 className="font-semibold text-dark-900">{founder.name}</h4>
            <p className="text-sm text-primary-600 font-medium mb-1">{founder.title}</p>
            <p className="text-sm text-dark-500 mb-4 line-clamp-2">{founder.bio || 'No bio available'}</p>
            <div className="flex items-center justify-center gap-3">
              {founder.twitter && (
                <a href={`https://twitter.com/${founder.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-100 text-dark-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {founder.linkedin && (
                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-100 text-dark-500 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

interface ProductsTabProps {
  products: Product[];
  graphProducts: Product[];
}

export function ProductsTab({ products, graphProducts }: ProductsTabProps) {
  const allProducts = [...products, ...graphProducts.filter(p => !products.some(existing => existing.id === p.id))];

  if (allProducts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <TrendingUp className="h-12 w-12 text-dark-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-dark-900 mb-2">No products listed</h3>
        <p className="text-dark-500">Products will appear here when available.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {allProducts.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="outlined" className="p-5 hover:shadow-lg transition-shadow h-full">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-dark-900 mb-1">{product.name}</h4>
                <p className="text-sm text-dark-500 mb-2 line-clamp-2">{product.description || 'No description'}</p>
                <div className="flex items-center gap-2 text-xs">
                  {product.category && <Badge variant="outline">{product.category}</Badge>}
                  <Badge variant="dark" className="text-xs">{formatNumber(product.upvotes)} upvotes</Badge>
                  {product.launch_date && <span className="text-dark-400">• {formatDate(product.launch_date)}</span>}
                </div>
              </div>
            </div>
            {product.website_url && (
              <a href={product.website_url} target="_blank" rel="noopener noreferrer" className="mt-4 block text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                Visit <ChevronRight className="h-3 w-3" />
              </a>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

interface MoreTabProps {
  company: Company;
  competitors: Company[];
  coInvestors: Array<Investor & { shared_deals: number }>;
  trending: Company[];
}

export function MoreTab({ company, competitors, coInvestors, trending }: MoreTabProps) {
  return (
    <div className="space-y-8">
      {competitors.length > 0 && (
        <div>
          <h3 className="section-label mb-4">Competitor Landscape</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {competitors.slice(0, 10).map((comp) => (
              <a key={comp.id} href={`/companies/${comp.slug}`} className="flex-shrink-0 flex flex-col items-center gap-2 w-28 group">
                <div className="w-20 h-20 rounded-xl bg-dark-100 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary-500 transition-all">
                  <img src={comp.logo_url || '/placeholder-logo.svg'} alt={comp.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }} />
                </div>
                <span className="text-xs text-dark-600 text-center truncate group-hover:text-primary-600">{comp.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {coInvestors.length > 0 && (
        <div>
          <h3 className="section-label mb-4">Frequent Co-Investors</h3>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {coInvestors.slice(0, 8).map((inv) => (
              <a key={inv.id} href={`/investors/${inv.slug}`} className="flex-shrink-0 flex flex-col items-center gap-2 w-28 group">
                <div className="w-20 h-20 rounded-xl bg-dark-100 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary-500 transition-all">
                  <img src={inv.logo_url || '/placeholder-logo.svg'} alt={inv.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }} />
                </div>
                <span className="text-xs text-dark-600 text-center truncate group-hover:text-primary-600">{inv.name}</span>
                <span className="text-[10px] text-dark-400">{inv.shared_deals} shared deals</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {trending.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-label">Similar Companies</h3>
            <a href="/companies" className="text-sm text-primary-600 hover:text-primary-700">View all</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.slice(0, 4).map((comp) => (
              <a key={comp.id} href={`/companies/${comp.slug}`} className="rounded-xl border border-dark-200 p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <img src={comp.logo_url || '/placeholder-logo.svg'} alt={comp.name} className="w-10 h-10 rounded-lg bg-dark-100 object-cover" onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 truncate">{comp.name}</p>
                    <p className="text-xs text-dark-500 truncate">{comp.category}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}