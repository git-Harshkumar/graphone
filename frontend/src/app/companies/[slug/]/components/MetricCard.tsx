'use client';

import { ChevronRight, Building2, Calendar, MapPin, Users, TrendingUp, DollarSign, Award, Star, PieChart, BarChart, ArrowUpRight, Twitter, Linkedin, Globe, Share2, Bookmark, Zap, Lightbulb, Briefcase, FileText, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function MetricCard({ label, value, icon: Icon, color }: MetricCardProps) {
  const colors = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card variant="outlined" className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-500">{label}</p>
          <p className="text-2xl font-bold text-dark-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color as keyof typeof colors] || colors.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}