'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LeadsByCountryChartProps {
  data: { country: string; count: number }[];
}

const BAR_COLORS = [
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#06b6d4',
  '#ec4899',
  '#6366f1',
];

export function LeadsByCountryChart({ data }: LeadsByCountryChartProps) {
  const filteredData = data.filter(d => d.count > 0);
  const maxCount = Math.max(...data.map(d => d.count), 1);

  if (filteredData.length === 0) {
    return (
      <div className="h-[280px] w-full flex flex-col items-center justify-center text-gray-400 gap-2 border border-dashed border-gray-200 rounded-xl">
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs font-medium">Nenhum dado de países registado ainda</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filteredData}
          margin={{ top: 15, right: 10, left: -15, bottom: 25 }}
        >
          <defs>
            {filteredData.map((_, index) => (
              <linearGradient
                key={`grad-${index}`}
                id={`countryGrad-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={BAR_COLORS[index % BAR_COLORS.length]}
                  stopOpacity={0.95}
                />
                <stop
                  offset="100%"
                  stopColor={BAR_COLORS[index % BAR_COLORS.length]}
                  stopOpacity={0.65}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="country" 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={0}
            dy={8}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            domain={[0, Math.ceil(maxCount * 1.15)]}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-gray-900 text-white text-xs rounded-xl py-2 px-3 shadow-xl border border-gray-800">
                    <p className="font-bold text-sm mb-0.5">{item.country}</p>
                    <p className="text-emerald-400 font-semibold">
                      {item.count} lead{item.count !== 1 ? 's' : ''} registado{item.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="count" 
            radius={[8, 8, 0, 0]}
            maxBarSize={54}
            animationDuration={800}
          >
            {filteredData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#countryGrad-${index})`}
                className="transition-opacity duration-300 hover:opacity-85"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}