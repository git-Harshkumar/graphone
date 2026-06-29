'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Sun, Moon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Avatar } from '@/components/ui/Avatar';
import { useSearch } from '@/hooks/useApi';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults } = useSearch(searchQuery, 5);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize theme from localStorage/system preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
    }
  }, []);

  // Persist theme and update HTML document class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navLinks = [
    { href: '/', label: 'Companies' },
    { href: '/investors', label: 'Investors' },
    { href: '/products', label: 'Products' },
    { href: '/news', label: 'News' },
    { href: '/jobs', label: 'Jobs' },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    )}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="GraphOne Home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="font-bold text-xl text-dark-900 dark:text-white">GraphOne</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-dark-600 dark:text-dark-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:block w-72">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Search..."
              />
              {searchQuery.length >= 2 && searchResults?.data && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 shadow-lg p-3 z-50 animate-fade-in">
                  <div className="space-y-2">
                    {searchResults.data.companies?.slice(0, 3).map((company) => (
                      <Link
                        key={company.id}
                        href={`/companies/${company.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
                      >
                        <Avatar src={company.logo_url} name={company.name} size="xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-900 dark:text-white truncate">{company.name}</p>
                          <p className="text-xs text-dark-500 dark:text-dark-400">{company.category}</p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.data.investors?.slice(0, 2).map((investor) => (
                      <Link
                        key={investor.id}
                        href={`/investors/${investor.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
                      >
                        <Avatar src={investor.logo_url} name={investor.name} size="xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-900 dark:text-white truncate">{investor.name}</p>
                          <p className="text-xs text-dark-500 dark:text-dark-400">{investor.type} • {investor.portfolio_count} portfolio</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-700 dark:hover:text-dark-200 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-800 animate-slide-up">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Search..."
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}