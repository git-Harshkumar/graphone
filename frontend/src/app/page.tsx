'use client';

import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { TrendingCompanies } from '@/components/home/TrendingCompanies';
import { FastestGrowing } from '@/components/home/FastestGrowing';
import { EmergingStartups } from '@/components/home/EmergingStartups';
import { BrowseByCategory } from '@/components/home/BrowseByCategory';
import { ThreeColumnLists } from '@/components/home/ThreeColumnLists';
import { BannerStrips } from '@/components/home/BannerStrips';
import { CuratedCollections } from '@/components/home/CuratedCollections';
import { NewOnGraphOne } from '@/components/home/NewOnGraphOne';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrendingCompanies />
      <FastestGrowing />
      <EmergingStartups />
      <BrowseByCategory />
      <ThreeColumnLists />
      <BannerStrips />
      <CuratedCollections />
      <NewOnGraphOne />
      <NewsletterSignup />
    </div>
  );
}