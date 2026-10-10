'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyVisitorsChartProps {
  data: { date: string; label: string; views: number; visitors: number }[];
}

export function DailyVisitorsChart({ data }: DailyVisitorsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="label" 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
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
        <Line 
          type="monotone" 
          dataKey="visitors" 
          stroke="#6366f1" 
          strokeWidth={2.5}
          dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name="Visitantes Únicos"
        />
        <Line 
          type="monotone" 
          dataKey="views" 
          stroke="#06b6d4" 
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5 }}
          name="Visualizações de Página"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
