'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'outlined';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-dark-200 shadow-card',
      dark: 'bg-gradient-to-br from-dark-800 via-dark-900 to-dark-950 text-white border border-dark-700',
      outlined: 'bg-white border-2 border-dark-200',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverClasses = hover
      ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          variants[variant],
          paddings[padding],
          hoverClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';