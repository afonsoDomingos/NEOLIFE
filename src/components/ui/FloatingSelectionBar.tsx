'use client';

import React from 'react';
import Link from 'next/link';
import { useSelection } from '@/lib/context/SelectionContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const FloatingSelectionBar: React.FC = () => {
  const { totalItemsCount, selectedHealthPacks, customHealthNeed, businessGoals, experienceInterests } = useSelection();
  const { language } = useLanguage();
  const isPt = language === 'pt';

  if (totalItemsCount === 0) return null;

  return (
    <aside aria-label={isPt ? 'Resumo da Seleção' : 'Selection Summary'} className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 animate-fade-in">
      <div className="bg-emerald-950/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 flex items-center justify-between gap-4 max-w-lg mx-auto sm:max-w-md">
        
        {/* Counter Badge & Summary */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 font-black flex items-center justify-center shrink-0 text-base shadow-sm">
            {totalItemsCount}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {isPt ? 'A Sua Seleção' : 'Your Selection'}
            </p>
            <p className="text-xs text-gray-200 truncate font-medium">
              {selectedHealthPacks.length > 0 && `${selectedHealthPacks.length} ${isPt ? 'pacote(s)' : 'pack(s)'}`}
              {customHealthNeed.trim() && `${selectedHealthPacks.length > 0 ? ', ' : ''}${isPt ? 'Pedido Especial' : 'Special Request'}`}
              {businessGoals.length > 0 && `${(selectedHealthPacks.length > 0 || customHealthNeed.trim()) ? ', ' : ''}${businessGoals.length} ${isPt ? 'meta(s) Business' : 'Business goal(s)'}`}
              {experienceInterests.length > 0 && `, ${experienceInterests.length} ${isPt ? 'experiência(s)' : 'experience(s)'}`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/formulario?origem=cesto" className="shrink-0">
          <button className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95">
            <span>{isPt ? 'Submeter' : 'Submit'}</span>
            <span>➔</span>
          </button>
        </Link>
      </div>
    </aside>
  );
};
