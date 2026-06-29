'use client';

import { DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, getStageColor } from '@/lib/utils';
import type { FundingRound } from '@/types';

interface InvestmentRowProps {
  round: FundingRound;
}

export function InvestmentRow({ round }: InvestmentRowProps) {
  return (
    <Card variant="outlined" className="p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-dark-900">{round.round_type}</h4>
              <Badge variant="dark" className="text-sm">{formatCurrency(round.amount)}</Badge>
              <Badge variant="outline" className="text-xs">{round.currency}</Badge>
            </div>
            <p className="text-sm text-dark-500">{formatDate(round.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:ml-auto">
          {round.lead_investor && (
            <div className="flex items-center gap-2">
              <Avatar src={round.lead_investor.logo_url} name={round.lead_investor.name} size="sm" />
              <span className="text-sm font-medium text-dark-900">{round.lead_investor.name}</span>
              <Badge variant="primary" className="text-xs">Lead</Badge>
            </div>
          )}
          {round.co_investors && round.co_investors.length > 0 && (
            <Badge variant="outline" className="text-sm">
              +{round.co_investors.length} co-investors
            </Badge>
          )}
          {round.valuation && (
            <div className="text-right">
              <p className="text-xs text-dark-500">Valuation</p>
              <p className="font-semibold text-dark-900">{formatCurrency(round.valuation)}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Need Avatar import
import { Avatar } from '@/components/ui/Avatar';