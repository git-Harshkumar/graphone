'use client';

import { Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CompanyNotFoundProps {
  slug: string;
}

export function CompanyNotFound({ slug }: CompanyNotFoundProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Building2 className="h-16 w-16 text-dark-300 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-dark-900 mb-2">Company Not Found</h1>
        <p className="text-dark-500 mb-6">We couldn't find a company with the slug "{slug}".</p>
        <Link href="/companies" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
          Browse all companies <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}