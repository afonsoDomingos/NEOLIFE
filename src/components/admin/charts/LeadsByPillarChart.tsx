'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LeadsByPillarChartProps {
  data: { pillar: string; count: number }[];
}

const PILLAR_LABELS: Record<string, string> = {
  'gate-saude': 'Saúde',
  'gate-business': 'Business',
  'gate-experiencias': 'Experiências',
  'conheca-neolife': 'Conheça Neolife',
};

const PILLAR_COLORS: Record<string, string> = {
  'gate-saude': '#10b981',
  'gate-business': '#3b82f6',
  'gate-experiencias': '#8b5cf6',
  'conheca-neolife': '#f59e0b',
};

export function LeadsByPillarChart({ data }: LeadsByPillarChartProps) {
  const chartData = data.map(item => ({
    name: PILLAR_LABELS[item.pillar] || item.pillar,
    value: item.count,
    color: PILLAR_COLORS[item.pillar] || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          type="number"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          type="category"
          dataKey="name"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Bar 
          dataKey="value" 
          name="Leads"
          radius={[0, 4, 4, 0]}
        >
          {chartData.map((entry, index) => (
            <Bar key={`bar-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}