'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  novo: { label: 'Novo', color: '#3b82f6', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  contactado: { label: 'Contactado', color: '#f59e0b', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  acompanhamento: { label: 'Acompanhamento', color: '#8b5cf6', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  interessado: { label: 'Interessado', color: '#10b981', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  convertido: { label: 'Convertido', color: '#059669', bg: 'bg-green-50 text-green-700 border-green-200' },
  nao_interessado: { label: 'Não Interessado', color: '#ef4444', bg: 'bg-red-50 text-red-700 border-red-200' },
};

interface LeadStatusChartProps {
  data: { status: string; count: number }[];
}

export function LeadStatusChart({ data }: LeadStatusChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + (curr.count || 0), 0);

  // Filter only items with count > 0 for the pie chart slices so 0% slices never overlap!
  const activeSlices = data
    .filter(item => item.count > 0)
    .map(item => ({
      statusKey: item.status,
      name: STATUS_CONFIG[item.status]?.label || item.status,
      value: item.count,
      color: STATUS_CONFIG[item.status]?.color || '#6b7280',
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(0) : '0',
    }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="relative w-full h-[230px]">
        {total === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-300">0</span>
            </div>
            <p className="text-xs font-medium">Nenhum status registado</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeSlices}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={86}
                  paddingAngle={activeSlices.length > 1 ? 4 : 0}
                  cornerRadius={activeSlices.length > 1 ? 5 : 0}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationDuration={800}
                >
                  {activeSlices.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="transition-all duration-300 cursor-pointer hover:opacity-85"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-xl border border-gray-800">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-300">
                            {item.value} lead{item.value !== 1 ? 's' : ''} ({item.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Summary Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {activeIndex !== null && activeSlices[activeIndex]
                  ? activeSlices[activeIndex].value
                  : total}
              </span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {activeIndex !== null && activeSlices[activeIndex]
                  ? activeSlices[activeIndex].name
                  : 'Total Leads'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Dynamic Status Badges Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-gray-100">
        {data.map((item) => {
          const config = STATUS_CONFIG[item.status] || {
            label: item.status,
            color: '#6b7280',
            bg: 'bg-gray-50 text-gray-700 border-gray-200',
          };
          const count = item.count || 0;
          const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';

          return (
            <div
              key={item.status}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                count > 0 ? config.bg + ' shadow-2xs font-medium' : 'bg-gray-50/50 text-gray-400 border-gray-100'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: count > 0 ? config.color : '#cbd5e1' }}
                />
                <span className="truncate">{config.label}</span>
              </div>
              <span className="font-bold ml-1 shrink-0">
                {count} <span className="text-[10px] opacity-75 font-normal">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}