'use client';

import Link from 'next/link';
import { Mail, Twitter, Linkedin, Github, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const footerLinks = {
    Explore: [
      { label: 'AI Companies', href: '/companies' },
      { label: 'Investors', href: '/investors' },
      { label: 'Products', href: '/products' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/graphone', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/graphone', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/git-Harshkumar/graphone', label: 'GitHub' },
    { icon: Mail, href: 'mailto:hello@graphone.ai', label: 'Email' },
  ];

  return (
    <footer className="relative bg-dark-950 text-dark-300 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(233,30,99,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Newsletter CTA — top section */}
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary-400" />
              <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Stay in the loop</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">AI Economy Weekly</h3>
            <p className="text-dark-400 text-sm">Funding rounds, product launches, and company insights — every week.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto min-w-[320px]">
            {submitted ? (
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-400 text-sm font-semibold">
                <span>✓</span> You're on the list!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2.5 bg-dark-950/60 border border-dark-700 rounded-xl text-white placeholder-dark-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 text-sm whitespace-nowrap active:scale-95"
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </form>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit group" aria-label="GraphOne Home">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Graph<span className="text-primary-400">One</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6 max-w-xs">
              Bloomberg-style intelligence for the AI economy. Track companies, investors, products, funding, and news in real-time.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-white hover:bg-primary-500/20 hover:border-primary-700 transition-all duration-200"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-dark-500 uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-dark-400 hover:text-white transition-colors duration-200 font-medium flex items-center gap-1 group"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-dark-600">
          <p>© {new Date().getFullYear()} GraphOne. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Built with
              <span className="text-dark-500">Next.js · TypeScript · Supabase</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}