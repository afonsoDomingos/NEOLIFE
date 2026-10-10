'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LeadsByPillarChartProps {
  data: { pillar: string; count: number }[];
}

const PILLAR_LABELS: Record<string, string> = {
  'gate-saude': 'Saúde & Nutrição',
  'gate-business': 'Oportunidade & Renda',
  'gate-experiencias': 'Experiências Neolife',
  'conheca-neolife': 'Conheça Neolife',
  'saude': 'Saúde',
  'produtos': 'Produtos',
  'oportunidade': 'Oportunidade',
};

const PILLAR_COLORS: Record<string, string> = {
  'gate-saude': '#10b981',
  'gate-business': '#3b82f6',
  'gate-experiencias': '#8b5cf6',
  'conheca-neolife': '#f59e0b',
  'saude': '#10b981',
  'produtos': '#06b6d4',
  'oportunidade': '#3b82f6',
};

export function LeadsByPillarChart({ data }: LeadsByPillarChartProps) {
  const chartData = data
    .filter(item => item.count > 0)
    .map(item => ({
      name: PILLAR_LABELS[item.pillar] || item.pillar,
      value: item.count,
      color: PILLAR_COLORS[item.pillar] || '#6b7280',
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-[220px] w-full flex flex-col items-center justify-center text-gray-400 gap-2 border border-dashed border-gray-200 rounded-xl">
        <p className="text-xs font-medium">Nenhum interesse por pilar registado ainda</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis 
            type="number"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis 
            type="category"
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-gray-900 text-white text-xs rounded-xl py-2 px-3 shadow-xl border border-gray-800">
                    <p className="font-bold text-sm mb-0.5">{item.name}</p>
                    <p className="text-emerald-400 font-semibold">
                      {item.value} lead{item.value !== 1 ? 's' : ''} registado{item.value !== 1 ? 's' : ''}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 6, 6, 0]}
            maxBarSize={28}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}