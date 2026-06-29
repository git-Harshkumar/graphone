'use client';

import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'dark' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'default', size = 'md', className, style }: BadgeProps) {
  const variants = {
    default: 'bg-dark-100 text-dark-700',
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    dark: 'bg-dark-800 text-dark-100',
    outline: 'bg-transparent border border-dark-300 text-dark-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}