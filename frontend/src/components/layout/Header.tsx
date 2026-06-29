'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Sun, Moon, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { useSearch } from '@/hooks/useApi';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: searchResults } = useSearch(searchQuery, 5);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '/companies', label: 'Companies' },
    { href: '/investors', label: 'Investors' },
    { href: '/products', label: 'Products' },
  ];

  const hasSearchResults = searchQuery.length >= 2 && (
    searchResults?.data?.companies?.length || searchResults?.data?.investors?.length
  );

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl shadow-sm border-b border-dark-100/60 dark:border-dark-800/60'
        : 'bg-transparent'
    )}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="GraphOne Home">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-dark-900 dark:text-white">
              Graph<span className="text-primary-500">One</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/60 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Search bar */}
            <div ref={searchRef} className="relative hidden md:block">
              <div className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 cursor-text',
                searchOpen
                  ? 'w-72 bg-white dark:bg-dark-900 border-primary-300 dark:border-primary-700 shadow-sm ring-2 ring-primary-500/20'
                  : 'w-40 bg-dark-50 dark:bg-dark-900/60 border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
              )} onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4 text-dark-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder={searchOpen ? 'Search companies, investors...' : 'Search...'}
                  className="bg-transparent border-0 text-sm text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none w-full"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="text-dark-400 hover:text-dark-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {searchOpen && hasSearchResults && (
                <div className="absolute top-full mt-2 left-0 w-80 bg-white dark:bg-dark-900 rounded-2xl border border-dark-100 dark:border-dark-800 shadow-xl overflow-hidden z-50 animate-fade-in">
                  <div className="p-2">
                    {searchResults?.data?.companies?.slice(0, 3).map((company) => (
                      <Link
                        key={company.id}
                        href={`/companies/${company.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors group"
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      >
                        <Avatar src={company.logo_url} name={company.name} size="xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-dark-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{company.name}</p>
                          <p className="text-xs text-dark-400 truncate">{company.category}</p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-dark-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                    {searchResults?.data?.investors?.slice(0, 2).map((investor) => (
                      <Link
                        key={investor.id}
                        href={`/investors/${investor.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors group"
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      >
                        <Avatar src={investor.logo_url} name={investor.name} size="xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-dark-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{investor.name}</p>
                          <p className="text-xs text-dark-400 truncate">{investor.type} · {investor.portfolio_count} investments</p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-dark-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Beta badge */}
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-semibold border border-primary-200 dark:border-primary-800">
              <Sparkles className="h-3 w-3" />
              Beta
            </span>

            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-700 dark:hover:text-dark-200 transition-all duration-200"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-all"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-dark-950/95 backdrop-blur-xl border-t border-dark-100 dark:border-dark-800 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search companies, investors..."
                className="w-full pl-10 pr-4 py-2.5 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all font-medium"
              >
                {link.label}
                <ChevronRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}