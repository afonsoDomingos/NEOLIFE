'use client';

import React from 'react';
import Link from 'next/link';
import { HealthSection } from '@/components/sections/HealthSection';
import { NeoLifeScienceSection } from '@/components/sections/NeoLifeScienceSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';

export default function SaudePage() {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const { totalItemsCount, selectedHealthPacks } = useSelection();

  return (
    <div className="min-h-screen bg-white">
      {/* ── HEADER DA ÁREA: SAÚDE ── */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 md:py-24 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isPt ? 'Pilar 01 • Saúde & Vitalidade Celular' : 'Pillar 01 • Health & Cellular Vitality'}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            {isPt ? (
              <>Nutrição Superior & Soluções Naturais para a <span className="text-emerald-400">Sua Família</span></>
            ) : (
              <>Superior Nutrition & Natural Solutions for <span className="text-emerald-400">Your Family</span></>
            )}
          </h1>

          <p className="text-lg md:text-xl text-emerald-100/90 max-w-3xl mx-auto leading-relaxed mb-8">
            {isPt
              ? 'Explore suplementos com base científica, produtos de higiene pessoal, soluções de limpeza ecológica e bio-otimizadores agrícolas. Selecione o que procura e adicione ao seu pedido de aconselhamento personalizado.'
              : 'Discover science-backed supplements, personal care, eco-friendly home cleaning, and agricultural solutions. Select what you need and add it to your custom consultation order.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#solucoes-saude">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold px-8 shadow-lg">
                {isPt ? 'Ver Produtos & Pacotes ↓' : 'Explore Products & Packs ↓'}
              </Button>
            </a>

            {totalItemsCount > 0 && (
              <Link href="/formulario?origem=saude-topo">
                <Button size="lg" variant="outline" className="border-emerald-400 text-emerald-300 hover:bg-emerald-800 font-bold px-8">
                  {isPt ? `Finalizar Seleção (${totalItemsCount}) ➔` : `Finish Selection (${totalItemsCount}) ➔`}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── A CIÊNCIA NEOLIFE ── */}
      <NeoLifeScienceSection />

      {/* ── SOLUÇÕES, CATEGORIAS & PACOTES ── */}
      <div id="solucoes-saude">
        <HealthSection />
      </div>

      {/* ── TRANSIÇÃO PARA O PRÓXIMO PILAR: BUSINESS ── */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                {isPt ? 'Próximo Pilar • Empreendedorismo' : 'Next Pillar • Entrepreneurship'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3">
                {isPt ? 'Deseja também Conhecer a Oportunidade de Negócio?' : 'Want to Explore the Business Opportunity as well?'}
              </h3>
              <p className="text-sm sm:text-base text-emerald-100 max-w-xl leading-relaxed">
                {isPt
                  ? 'Veja como milhares de famílias em Moçambique e no mundo estão a gerar rendimentos sólidos partilhando estas mesmas soluções de saúde.'
                  : 'See how thousands of families worldwide are building reliable incomes by sharing these same health solutions.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/business">
                <Button size="lg" className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-6 shadow-md whitespace-nowrap">
                  {isPt ? 'Conhecer o Business ➔' : 'Explore Business ➔'}
                </Button>
              </Link>
              <Link href="/formulario?origem=saude-fim">
                <Button size="lg" variant="outline" className="border-emerald-300 text-white hover:bg-emerald-800 font-bold px-6 whitespace-nowrap">
                  {isPt ? 'Submeter Seleção ➔' : 'Submit Selection ➔'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
