'use client';

import { Suspense } from 'react';
import { InvestorsHero } from '@/components/investors/InvestorsHero';
import { TrendingInvestors } from '@/components/investors/TrendingInvestors';
import { InvestorCollections } from '@/components/investors/InvestorCollections';
import { BrowseByInvestorType } from '@/components/investors/BrowseByInvestorType';
import { MostActiveInvestors } from '@/components/investors/MostActiveInvestors';
import { InvestorsBackingWinners } from '@/components/investors/InvestorsBackingWinners';
import { CapitalThemes } from '@/components/investors/CapitalThemes';
import { CapitalFlowCTA } from '@/components/investors/CapitalFlowCTA';

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <InvestorsHero />
      <TrendingInvestors />
      <InvestorCollections />
      <BrowseByInvestorType />
      <MostActiveInvestors />
      <InvestorsBackingWinners />
      <CapitalThemes />
      <CapitalFlowCTA />
    </div>
  );
}