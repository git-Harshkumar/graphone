'use client';

import { motion } from 'framer-motion';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  className?: string;
}

const COLORS = [
  '#e91e63', '#c2185b', '#ad1457', '#880e4f',
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
  '#22c55e', '#16a34a', '#15803d', '#166534',
  '#f59e0b', '#d97706', '#b45309', '#92400e',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6',
];

export function DonutChart({ data, height = 280, className }: DonutChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; payload: { name: string; value: number } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-900 text-white p-3 rounded-lg shadow-lg border border-dark-700"
        >
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-dark-400">{item.value}% • {percentage}%</p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            startAngle={90}
            endAngle={450}
          >
            {chartData.map((item, index) => (
              <Cell key={`cell-${index}`} fill={item.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => value}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}