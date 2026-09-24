'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  novo: '#3b82f6',
  contactado: '#f59e0b',
  acompanhamento: '#8b5cf6',
  interessado: '#10b981',
  convertido: '#22c55e',
  nao_interessado: '#ef4444',
};

interface LeadStatusChartProps {
  data: { status: string; count: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  novo: 'Novo',
  contactado: 'Contactado',
  acompanhamento: 'Acompanhamento',
  interessado: 'Interessado',
  convertido: 'Convertido',
  nao_interessado: 'Não Interessado',
};

export function LeadStatusChart({ data }: LeadStatusChartProps) {
  const chartData = data.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    color: COLORS[item.status as keyof typeof COLORS] || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}