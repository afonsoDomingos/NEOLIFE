'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ExperiencesSection } from '@/components/sections/ExperiencesSection';
import { VideoSection } from '@/components/ui/VideoSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';
import { requireGate } from '@/lib/utils/gateUtils';

export default function ExperienciasPage() {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const { totalItemsCount } = useSelection();

  // Gate verification
  useEffect(() => {
    requireGate('experiencias', '/experiencias');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HEADER DA ÁREA: EXPERIÊNCIAS ── */}
      <section className="relative bg-gradient-to-b from-teal-950 via-gray-900 to-teal-950 text-white py-16 md:py-24 overflow-hidden border-b border-teal-900/50">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-800/60 border border-teal-400/40 text-teal-300 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {isPt ? 'Pilar 03 • Viagens & Reconhecimento' : 'Pillar 03 • Travel & Recognition'}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            {isPt ? (
              <>Viva Experiências Exclusivas & <span className="text-teal-400">Reconhecimento Global</span></>
            ) : (
              <>Live Exclusive Experiences & <span className="text-teal-400">Global Recognition</span></>
            )}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            {isPt
              ? 'A NeoLife vai muito além de produtos e rendimento: é sobre viajar pelo mundo, crescer como líder e celebrar cada conquista numa comunidade internacional de apoio.'
              : 'NeoLife is much more than wellness and income: it is about traveling the world, developing leadership, and celebrating every milestone in a global community.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#galeria-experiencias">
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-teal-950 font-extrabold px-8 shadow-lg">
                {isPt ? 'Explorar Experiências ↓' : 'Explore Experiences ↓'}
              </Button>
            </a>

            <Link href="/formulario?origem=experiencias-topo">
              <Button size="lg" variant="outline" className="border-teal-400 text-white hover:bg-white/10 font-bold px-8">
                {totalItemsCount > 0
                  ? (isPt ? `Finalizar Seleção (${totalItemsCount}) ➔` : `Finish Selection (${totalItemsCount}) ➔`)
                  : (isPt ? 'Falar Connosco ➔' : 'Talk with Us ➔')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO DE EXPERIÊNCIAS COM SELEÇÃO ── */}
      <div id="galeria-experiencias">
        <ExperiencesSection />
      </div>

      {/* ── VÍDEOS DA COMUNIDADE ── */}
      <VideoSection />
    </div>
  );
}
