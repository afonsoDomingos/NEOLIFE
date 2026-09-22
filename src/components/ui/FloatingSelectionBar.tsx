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
    <aside aria-label={isPt ? 'Resumo da Seleção' : 'Selection Summary'} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-auto min-w-[320px] sm:min-w-[480px] max-w-xl animate-fade-in pointer-events-auto">
      <div className="bg-gray-950/95 backdrop-blur-md text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border-2 border-emerald-400 flex items-center justify-between gap-3 sm:gap-6 ring-4 ring-emerald-500/20">
        
        {/* Counter Badge & Summary */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-emerald-400 text-emerald-950 font-black flex items-center justify-center shrink-0 text-lg shadow-md animate-pulse">
            {totalItemsCount}
          </div>
          <div className="truncate">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>•</span>
              <span>{isPt ? 'A Sua Seleção Atual' : 'Your Current Selection'}</span>
            </p>
            <p className="text-xs text-gray-200 truncate font-medium mt-0.5">
              {selectedHealthPacks.length > 0 && `${selectedHealthPacks.length} ${isPt ? 'pacote(s) de saúde' : 'health pack(s)'}`}
              {customHealthNeed.trim() && `${selectedHealthPacks.length > 0 ? ' + ' : ''}${isPt ? 'Pedido Especial' : 'Special Request'}`}
              {businessGoals.length > 0 && `${(selectedHealthPacks.length > 0 || customHealthNeed.trim()) ? ' + ' : ''}${businessGoals.length} ${isPt ? 'meta(s)' : 'goal(s)'}`}
              {experienceInterests.length > 0 && ` + ${experienceInterests.length} ${isPt ? 'experiência(s)' : 'exp(s)'}`}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/formulario?origem=cesto" className="shrink-0">
          <button className="bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-emerald-950 text-xs sm:text-sm font-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 whitespace-nowrap">
            <span>{isPt ? 'Concluir Pedido' : 'Submit Order'}</span>
            <span className="text-base">➔</span>
          </button>
        </Link>
      </div>
    </aside>
  );
};
