'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Trophy, Sparkles, TrendingUp, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useInvestors, useCompanies } from '@/hooks/useApi';
import { formatCurrency, formatNumber, getInvestorTypeColor } from '@/lib/utils';
import type { Investor, Company } from '@/types';

const winnerCompanies = [
  { slug: 'openai', name: 'OpenAI' },
  { slug: 'anthropic', name: 'Anthropic' },
  { slug: 'perplexity-ai', name: 'Perplexity' },
  { slug: 'mistral-ai', name: 'Mistral' },
  { slug: 'cursor', name: 'Cursor' },
];

export function InvestorsBackingWinners() {
  const { data: companiesData } = useCompanies({ limit: 20 });
  const companies = companiesData?.data || [];

  const winnerCompanyData = winnerCompanies
    .map(wc => companies.find(c => c.slug === wc.slug))
    .filter(Boolean);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-label">Investors Backing Winners</h2>
            <p className="text-dark-500 text-sm mt-1">Who funded the breakout AI companies</p>
          </div>
        </div>

        <div className="space-y-8">
          {winnerCompanyData.map((company, companyIndex) => (
            <motion.div
              key={company!.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: companyIndex * 0.1 }}
            >
              <WinnerBackersCard company={company!} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WinnerBackersCard({ company }: { company: Company }) {
  // Mock investor data for the company
  const mockInvestors = [
    { name: 'Sequoia Capital', type: 'VC', logo: 'https://sequoiacap.com/logo.svg', stage: 'Series A', lead: true },
    { name: 'Andreessen Horowitz', type: 'VC', logo: 'https://a16z.com/logo.svg', stage: 'Series B', lead: true },
    { name: 'Microsoft M12', type: 'Corporate', logo: 'https://m12.vc/logo.svg', stage: 'Series A', lead: false },
    { name: 'Khosla Ventures', type: 'VC', logo: 'https://khoslaventures.com/logo.svg', stage: 'Seed', lead: true },
    { name: 'Tiger Global', type: 'VC', logo: 'https://tigerglobal.com/logo.svg', stage: 'Series C', lead: false },
    { name: 'Lightspeed', type: 'VC', logo: 'https://lsvp.com/logo.svg', stage: 'Series B', lead: false },
  ];

  return (
    <Card variant="outlined" className="overflow-hidden">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-dark-900">{company.name}</h3>
                <Badge variant="primary" className="text-sm">
                  <Trophy className="h-3 w-3 mr-1" />
                  {company.is_unicorn ? 'Unicorn' : 'Winner'}
                </Badge>
              </div>
              <p className="text-dark-500">{company.category} • ${(company.funding_total / 1e9).toFixed(1)}B raised • {formatNumber(company.employee_count || 0)} employees</p>
            </div>
          </div>
          <a href={`/companies/${company.slug}`} className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View Company <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          {mockInvestors.map((inv, i) => (
            <div key={inv.name} className="flex items-center gap-2 px-3 py-2 bg-dark-50 rounded-xl border border-dark-100">
              <img
                src={inv.logo}
                alt={inv.name}
                className="w-6 h-6 rounded bg-white object-contain p-0.5"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-sm font-medium text-dark-900">{inv.name}</span>
              <Badge variant="dark" className={`text-xs ${inv.lead ? 'bg-primary-50 text-primary-700' : ''}`} style={!inv.lead ? { background: getInvestorTypeColor(inv.type) } : undefined}>
                {inv.lead ? 'Lead' : inv.type}
              </Badge>
              <Badge variant="outline" className="text-xs">{inv.stage}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}