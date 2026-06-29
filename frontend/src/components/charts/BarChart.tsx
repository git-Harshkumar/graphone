'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  className?: string;
}

const DEFAULT_COLOR = '#e91e63';

export function BarChart({ data, xKey, yKey, color = DEFAULT_COLOR, height = 300, className }: BarChartProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }> }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-900 text-white p-3 rounded-lg shadow-lg border border-dark-700"
        >
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-dark-400">{payload[0].value}</p>
        </motion.div>
      );
    }
    return null;
  };

  const CustomBar = (props: any) => {
    const { x, y, width, height, fill, ...rest } = props;
    const radius = 4;
    
    return (
      <motion.rect
        {...rest}
        x={x}
        y={y + height}
        width={width}
        height={0}
        fill={fill}
        rx={radius}
        ry={radius}
        initial={{ height: 0, y: y + height }}
        animate={{ height, y }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: parseFloat(props['data-index'] || '0') * 0.1 }}
      />
    );
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={yKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarWidth={50}
            shape={CustomBar}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}