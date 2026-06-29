'use client';

import { Suspense } from 'react';
import { ProductsHero } from '@/components/products/ProductsHero';
import { ProductTabs } from '@/components/products/ProductTabs';
import { ProductList } from '@/components/products/ProductList';
import { ProductSidebar } from '@/components/products/ProductSidebar';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <ProductSidebar />
        <div className="flex-1 lg:ml-64">
          <ProductsHero />
          <ProductTabs />
          <ProductList />
        </div>
      </div>
    </div>
  );
}