'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { sciencePillars } from '@/data/health-solutions';

export const NeoLifeScienceSection: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white relative overflow-hidden">
      {/* Decorative ambient blurred spots */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isPt ? 'Nutrição de Elevada Qualidade desde 1958' : 'High Quality Nutrition Since 1958'}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            {isPt ? (
              <>A Diferença que a <span className="text-emerald-400">Neolife Traz</span></>
            ) : (
              <>The Difference <span className="text-emerald-400">Neolife Delivers</span></>
            )}
          </h2>

          <p className="text-emerald-200/90 text-lg font-medium mb-3">
            {isPt ? 'Baseada na Natureza. Apoiada pela Ciência.' : 'Based in Nature. Backed by Science.'}
          </p>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {isPt
              ? 'A Neolife combina os melhores ingredientes naturais, conhecimento científico rigoroso e biotecnologia avançada para apoiar a saúde integral das pessoas em mais de 50 países.'
              : 'Neolife unites the finest natural ingredients, rigorous scientific insight, and advanced biotechnology to foster complete health for families across 50+ countries.'}
          </p>
        </div>

        {/* 4 Quality Pillars (Official Badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
          {sciencePillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl hover:shadow-2xl border-2 border-emerald-400/30 hover:border-emerald-400 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center group overflow-hidden"
            >
              <div className="relative w-full aspect-square max-w-[280px] overflow-hidden rounded-2xl flex items-center justify-center">
                <Image
                  src={pillar.image}
                  alt={isPt ? `${pillar.titlePt} - ${pillar.descPt}` : `${pillar.titleEn} - ${pillar.descEn}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <span className="sr-only">
                {isPt ? `${pillar.titlePt}: ${pillar.descPt}` : `${pillar.titleEn}: ${pillar.descEn}`}
              </span>
            </div>
          ))}
        </div>

        {/* Closing Trust Slogan */}
        <div className="text-center pt-8 border-t border-emerald-800/50">
          <p className="text-emerald-300 text-xs sm:text-sm font-semibold uppercase tracking-widest">
            {isPt
              ? 'Neolife — Pessoas mais saudáveis. Um mundo melhor.'
              : 'Neolife — Healthier People. A Better World.'}
          </p>
          <p className="text-[10px] text-emerald-400/70 font-medium tracking-wide uppercase mt-2">
            Ofélia & José Machado
          </p>
        </div>

      </div>
    </section>
  );
};
