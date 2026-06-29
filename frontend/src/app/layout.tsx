import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GraphOne - AI Economy Intelligence Platform',
    template: '%s | GraphOne',
  },
  description: 'Bloomberg-style intelligence platform for the AI economy. Track AI companies, investors, products, funding rounds, founders, and news.',
  keywords: ['AI', 'artificial intelligence', 'startups', 'venture capital', 'funding', 'investors', 'companies', 'products', 'news'],
  authors: [{ name: 'GraphOne' }],
  creator: 'GraphOne',
  publisher: 'GraphOne',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://graphone.ai',
    siteName: 'GraphOne',
    title: 'GraphOne - AI Economy Intelligence Platform',
    description: 'Bloomberg-style intelligence platform for the AI economy.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GraphOne - AI Economy Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GraphOne - AI Economy Intelligence Platform',
    description: 'Bloomberg-style intelligence platform for the AI economy.',
    images: ['/og-image.png'],
    creator: '@graphone',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-white font-sans text-dark-900">
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}