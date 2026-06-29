'use client';

export function CompanySkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8 mb-12">
          <div className="w-24 h-24 rounded-2xl bg-dark-200" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 bg-dark-200 rounded" />
            <div className="h-4 w-1/2 bg-dark-200 rounded" />
            <div className="h-4 w-1/3 bg-dark-200 rounded" />
            <div className="h-4 w-1/4 bg-dark-200 rounded" />
          </div>
        </div>
        <div className="h-10 bg-dark-200 rounded mb-8" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-dark-200 p-5">
              <div className="h-4 w-1/2 bg-dark-200 rounded mb-2" />
              <div className="h-8 w-3/4 bg-dark-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}