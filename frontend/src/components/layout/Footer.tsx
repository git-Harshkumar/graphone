'use client';

import Link from 'next/link';
import { Mail, Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    alert('Thanks for subscribing! (Demo only)');
    setEmail('');
  };

  const footerLinks = {
    product: [
      { label: 'AI Companies', href: '/' },
      { label: 'Investors', href: '/investors' },
      { label: 'Products', href: '/products' },
      { label: 'News', href: '/news' },
      { label: 'Jobs', href: '/jobs' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api-docs' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Community', href: '/community' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/security' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/graphone', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/graphone', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/graphone', label: 'GitHub' },
    { icon: Mail, href: 'mailto:hello@graphone.ai', label: 'Email' },
  ];

  return (
    <footer className="bg-dark-50 border-t border-dark-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="GraphOne Home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="font-bold text-xl text-dark-900">GraphOne</span>
            </Link>
            <p className="text-dark-600 text-sm mb-6 max-w-xs">
              Bloomberg-style intelligence platform for the AI economy. Track companies, investors, products, funding, and news.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg text-dark-400 hover:text-primary-500 hover:bg-dark-100 transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-dark-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark-600 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-dark-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark-600 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-dark-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark-600 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-dark-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-dark-600 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-dark-200">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-dark-900 mb-2">Stay Updated</h3>
            <p className="text-dark-600 text-sm mb-4">Get the latest AI economy insights delivered to your inbox.</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1"
                aria-label="Email address"
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-dark-500 mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            © {new Date().getFullYear()} GraphOne. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-dark-500">
            <span>Built with Next.js, TypeScript, Tailwind</span>
            <span>•</span>
            <span>Data from Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}