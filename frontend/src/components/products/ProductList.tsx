'use client';

import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Star, MessageSquare, Tag, ExternalLink, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useProducts, useTrendingCompanies } from '@/hooks/useApi';
import { formatNumber, formatDate, cn } from '@/lib/utils';
import type { Product } from '@/types';

const mockProducts: Product[] = [
  { id: '1', company_id: 'openai', name: 'ChatGPT', description: 'Conversational AI assistant powered by GPT-4', category: 'Chat', launch_date: '2022-11-30', upvotes: 50000, website_url: 'https://chat.openai.com', created_at: '', updated_at: '' },
  { id: '2', company_id: 'openai', name: 'GPT-4', description: 'Most capable multimodal model from OpenAI', category: 'Foundation Model', launch_date: '2023-03-14', upvotes: 15000, website_url: 'https://openai.com/gpt-4', created_at: '', updated_at: '' },
  { id: '3', company_id: 'anthropic', name: 'Claude 3 Opus', description: 'Most intelligent Claude model for complex tasks', category: 'Chat', launch_date: '2024-03-04', upvotes: 18000, website_url: 'https://claude.ai', created_at: '', updated_at: '' },
  { id: '4', company_id: 'cursor', name: 'Cursor', description: 'AI-first code editor built for pair programming', category: 'Code', launch_date: '2023-03-15', upvotes: 30000, website_url: 'https://cursor.sh', created_at: '', updated_at: '' },
  { id: '5', company_id: 'midjourney', name: 'Midjourney v6', description: 'Advanced AI image generation with photorealism', category: 'Image', launch_date: '2023-12-21', upvotes: 40000, website_url: 'https://midjourney.com', created_at: '', updated_at: '' },
  { id: '6', company_id: 'runway', name: 'Gen-3 Alpha', description: 'Next-generation video generation model', category: 'Video', launch_date: '2024-06-15', upvotes: 25000, website_url: 'https://runwayml.com/gen-3', created_at: '', updated_at: '' },
  { id: '7', company_id: 'elevenlabs', name: 'ElevenLabs Voice AI', description: 'Realistic text-to-speech and voice cloning', category: 'Voice', launch_date: '2023-01-15', upvotes: 22000, website_url: 'https://elevenlabs.io', created_at: '', updated_at: '' },
  { id: '8', company_id: 'perplexity-ai', name: 'Perplexity Pro', description: 'AI-powered search with GPT-4 and Claude', category: 'Search', launch_date: '2023-01-15', upvotes: 20000, website_url: 'https://perplexity.ai/pro', created_at: '', updated_at: '' },
  { id: '9', company_id: 'hugging-face', name: 'Hugging Face Hub', description: 'Platform for sharing models and datasets', category: 'Platform', launch_date: '2020-03-15', upvotes: 40000, website_url: 'https://huggingface.co', created_at: '', updated_at: '' },
  { id: '10', company_id: 'mistral-ai', name: 'Mixtral 8x7B', description: 'Open-weight mixture of experts model', category: 'Foundation Model', launch_date: '2023-12-11', upvotes: 15000, website_url: 'https://mistral.ai', created_at: '', updated_at: '' },
  { id: '11', company_id: 'stability-ai', name: 'Stable Diffusion XL', description: 'Open-source high-resolution image generation', category: 'Image', launch_date: '2023-07-26', upvotes: 45000, website_url: 'https://stability.ai/stable-diffusion', created_at: '', updated_at: '' },
  { id: '12', company_id: 'notion', name: 'Notion AI', description: 'AI-powered writing and organization in Notion', category: 'Productivity', launch_date: '2023-02-15', upvotes: 18000, website_url: 'https://notion.so/ai', created_at: '', updated_at: '' },
  { id: '13', company_id: 'codeium', name: 'Codeium', description: 'Free AI-powered code completion and chat', category: 'Code', launch_date: '2022-06-15', upvotes: 12000, website_url: 'https://codeium.com', created_at: '', updated_at: '' },
  { id: '14', company_id: 'replit', name: 'Replit Ghostwriter', description: 'AI coding assistant in your browser IDE', category: 'Code', launch_date: '2022-10-15', upvotes: 8000, website_url: 'https://replit.com/ghostwriter', created_at: '', updated_at: '' },
  { id: '15', company_id: 'descript', name: 'Descript', description: 'AI-powered audio and video editing', category: 'Video', launch_date: '2020-01-15', upvotes: 10000, website_url: 'https://descript.com', created_at: '', updated_at: '' },
  { id: '16', company_id: 'pika', name: 'Pika', description: 'AI video generation for creative content', category: 'Video', launch_date: '2023-11-28', upvotes: 12000, website_url: 'https://pika.art', created_at: '', updated_at: '' },
];

export function ProductList() {
  const { data: companiesData } = useTrendingCompanies(10);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Sponsored Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-gradient-to-r from-dark-900 to-dark-800 rounded-2xl text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-500/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-primary-300 text-sm">Sponsored</p>
              <h3 className="font-bold">Supercharge Your AI Workflow</h3>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20 whitespace-nowrap">
            Learn More <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </motion.div>

      {/* Product List */}
      <div className="space-y-4">
        {mockProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <ProductRow product={product} />
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <Button variant="outline" size="lg" className="px-10 py-3">
          Load More Products
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Newsletter Sidebar (shown on desktop) */}
      <div className="hidden lg:block mt-12">
        <ProductNewsletter />
      </div>
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Chat': 'bg-green-50 text-green-700',
      'Code': 'bg-blue-50 text-blue-700',
      'Agents': 'bg-purple-50 text-purple-700',
      'Image': 'bg-pink-50 text-pink-700',
      'Video': 'bg-rose-50 text-rose-700',
      'Voice': 'bg-orange-50 text-orange-700',
      'Search': 'bg-indigo-50 text-indigo-700',
      'Foundation Model': 'bg-violet-50 text-violet-700',
      'Platform': 'bg-teal-50 text-teal-700',
      'Productivity': 'bg-slate-50 text-slate-700',
    };
    return colors[cat] || 'bg-dark-100 text-dark-700';
  };

  return (
    <Card variant="outlined" hover className="p-4">
      <div className="flex items-center gap-4">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-lg bg-dark-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src={`https://logo.clearbit.com/${product.company_id}.com`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholder-logo.svg'; }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-dark-900 truncate">{product.name}</h3>
            <Badge variant="dark" className={cn('text-xs', getCategoryColor(product.category))}>
              {product.category}
            </Badge>
          </div>
          <p className="text-dark-600 text-sm truncate mb-2">{product.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-dark-500">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {formatNumber(product.upvotes)} upvotes
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {formatNumber(Math.floor(product.upvotes * 0.1))} comments
            </span>
            {product.launch_date && (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Launched {formatDate(product.launch_date, { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {product.website_url && (
            <a
              href={product.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-dark-100 text-dark-500 hover:bg-primary-100 hover:text-primary-600 transition-colors"
              aria-label="Visit website"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Button variant="ghost" size="sm" className="px-3">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProductNewsletter() {
  return (
    <div className="fixed bottom-8 right-8 w-80 lg:static lg:w-auto">
      <Card variant="outlined" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-900">Stay Ahead</h3>
            <p className="text-sm text-dark-500">Weekly AI product picks</p>
          </div>
        </div>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 rounded-lg border border-dark-300 bg-white text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Button className="w-full" size="sm">
            Subscribe
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </form>
        <p className="text-xs text-dark-500 text-center mt-3">No spam. Unsubscribe anytime.</p>
      </Card>
    </div>
  );
}