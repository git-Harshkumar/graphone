'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Building2, User, Lightbulb, Briefcase, Zap, Rocket, TrendingUp, Users, DollarSign, ArrowRightFromLine, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

const flowSteps = [
  {
    id: 'investor',
    label: 'Investor',
    icon: Building2,
    color: 'from-purple-500 to-pink-500',
    description: 'VCs, Angels, Corporate VCs allocate capital',
    stats: { count: '20+', capital: '$200B+' },
  },
  {
    id: 'founder',
    label: 'Founder',
    icon: User,
    color: 'from-blue-500 to-indigo-500',
    description: 'Visionaries building category-defining AI companies',
    stats: { count: '50+', capital: '$100B+' },
  },
  {
    id: 'company',
    label: 'Company',
    icon: Briefcase,
    color: 'from-green-500 to-emerald-500',
    description: 'AI startups across Foundation Models, Apps, Infra',
    stats: { count: '50+', valuation: '$500B+' },
  },
  {
    id: 'funding',
    label: 'Funding Round',
    icon: DollarSign,
    color: 'from-orange-500 to-red-500',
    description: 'Seed → Series A → B → C → Growth → IPO',
    stats: { rounds: '100+', total: '$50B+' },
  },
  {
    id: 'product',
    label: 'Product',
    icon: Zap,
    color: 'from-pink-500 to-rose-500',
    description: 'LLMs, Agents, Coding Tools, GenMedia, Infra',
    stats: { products: '100+', users: '1B+' },
  },
];

const insights = [
  { icon: TrendingUp, label: 'Deal Velocity', value: '+45% YoY', desc: 'AI deal pace accelerating' },
  { icon: Rocket, label: 'Time to Unicorn', value: '2.3 years', desc: 'Fastest in tech history' },
  { icon: Users, label: 'Co-investment Rate', value: '68%', desc: 'Syndicates standard' },
  { icon: Lightbulb, label: 'Follow-on Rate', value: '82%', desc: 'Strong conviction signals' },
];

export function CapitalFlowCTA() {
  return (
    <section className="py-20 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="primary" className="mb-4" style={{ background: 'rgba(233, 30, 99, 0.2)' }}>
            <Sparkles className="h-3 w-3 mr-1.5" />
            Capital Flow Visualization
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Visualize How <span className="gradient-text">Capital Moves</span> in AI
          </h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto">
            Follow the money from investor thesis → founder vision → company building → funding rounds → product launch → market impact.
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-16 left-10 right-10 h-0.5 bg-gradient-to-r from-dark-700 via-dark-600 to-dark-700 hidden lg:block" />
            <div className="absolute top-16 left-10 right-10 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 hidden lg:block" style={{ width: '0%' }}>
              <motion.div
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-0">
              {flowSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="relative flex flex-col items-center lg:flex-1"
                >
                  {/* Step Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl`} style={{ background: `linear-gradient(135deg, ${step.color})` }}>
                      <step.icon className="h-12 w-12 text-white" />
                    </div>
                    
                    {/* Arrow between steps */}
                    {index < flowSteps.length - 1 && (
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                        className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500"
                      >
                        <ArrowRight className="h-6 w-6 text-primary-400 -ml-2" />
                      </motion.div>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="mt-6 text-center lg:w-full px-4">
                    <h3 className="text-lg font-bold text-white mb-1">{step.label}</h3>
                    <p className="text-dark-400 text-sm mb-3">{step.description}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                      {Object.entries(step.stats).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="border-dark-600 text-dark-300 hover:border-primary-500 hover:text-white">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-center text-white text-xl font-bold mb-8">Key Capital Insights</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <Card variant="dark" className="p-6 text-center border-dark-700 hover:border-primary-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center bg-primary-500/20">
                    <insight.icon className="h-6 w-6 text-primary-400" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{insight.value}</p>
                  <p className="text-dark-400 text-sm font-medium">{insight.label}</p>
                  <p className="text-dark-500 text-xs mt-2">{insight.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="w-full sm:w-auto px-10 py-4 text-lg" style={{ background: 'linear-gradient(135deg, #e91e63, #c2185b)' }}>
            <ArrowRightFromLine className="h-5 w-5 mr-2" />
            Explore Capital Flow
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-4 text-lg border-white/30 text-white hover:bg-white/10">
            View Investor Network
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}