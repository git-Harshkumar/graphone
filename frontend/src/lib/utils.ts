import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
  return `$${amount.toLocaleString()}`;
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 365) return `${Math.floor(diffDays / 365)}y ago`;
  if (diffDays > 30) return `${Math.floor(diffDays / 30)}mo ago`;
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'Just now';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getStageColor(stage?: string): string {
  const colors: Record<string, string> = {
    'Pre-Seed': 'bg-purple-50 text-purple-700',
    'Seed': 'bg-green-50 text-green-700',
    'Series A': 'bg-blue-50 text-blue-700',
    'Series B': 'bg-indigo-50 text-indigo-700',
    'Series C': 'bg-violet-50 text-violet-700',
    'Series D+': 'bg-pink-50 text-pink-700',
    'Public': 'bg-gray-50 text-gray-700',
    'Acquired': 'bg-orange-50 text-orange-700',
  };
  return colors[stage || ''] || 'bg-dark-100 text-dark-700';
}

export function getInvestorTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'VC': 'bg-primary-50 text-primary-700',
    'Angel': 'bg-amber-50 text-amber-700',
    'Corporate': 'bg-blue-50 text-blue-700',
    'Family Office': 'bg-green-50 text-green-700',
    'Accelerator': 'bg-purple-50 text-purple-700',
  };
  return colors[type] || 'bg-dark-100 text-dark-700';
}

export function getNewsTagColor(tag: string): string {
  const colors: Record<string, string> = {
    'Funding': 'bg-green-50 text-green-700',
    'Launch': 'bg-blue-50 text-blue-700',
    'Acquisition': 'bg-purple-50 text-purple-700',
    'Partnership': 'bg-indigo-50 text-indigo-700',
    'Research': 'bg-violet-50 text-violet-700',
    'Hiring': 'bg-orange-50 text-orange-700',
    'Regulation': 'bg-red-50 text-red-700',
    'Market': 'bg-teal-50 text-teal-700',
    'Product': 'bg-pink-50 text-pink-700',
    'Leadership': 'bg-amber-50 text-amber-700',
  };
  return colors[tag] || 'bg-dark-100 text-dark-700';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}