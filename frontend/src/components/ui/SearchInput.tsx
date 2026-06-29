'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}

export const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  ({ className, value, onChange, placeholder = 'Search companies, investors, products...', onClear, autoFocus, ...props }, ref) => {
    const inputRef = autoFocus ? (el: HTMLInputElement | null) => { if (el) el.focus(); } : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full',
          className
        )}
        {...props}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            ref={inputRef}
            className={cn(
              'w-full pl-12 pr-12 py-3 rounded-xl border bg-white text-dark-900 placeholder-dark-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-all duration-200',
              'border-dark-300 hover:border-dark-400',
              'text-base',
              value ? 'pr-12' : 'pr-4'
            )}
            autoComplete="off"
            role="searchbox"
            aria-label="Search"
          />
          {value && (
            <button
              onClick={() => onClear?.()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-dark-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-dark-400 hover:text-dark-600" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';