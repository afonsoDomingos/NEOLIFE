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

      {/* ── PACOTE DE INCENTIVOS DA NEOLIFE ── */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isPt ? 'Pacote de Incentivos da NeoLife' : 'NeoLife Incentives Package'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {isPt
                ? 'À medida que cresces na carreira, aumenta também o acesso a reconhecimento, formação, bónus e experiências exclusivas.'
                : 'As you grow in your career, access to recognition, training, bonuses and exclusive experiences increases.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Novos Sapphire Directors */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🎓</div>
                  <div className="text-sm font-bold">Leadership School</div>
                  <div className="text-xs opacity-80">Pretória</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {isPt ? 'Novos Sapphire Directors' : 'New Sapphire Directors'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isPt
                    ? 'Formação e desenvolvimento para novos Sapphire Directors que cumpram os critérios de qualificação. Exclusivo também para Emerald Directors.'
                    : 'Training and development for new Sapphire Directors who meet qualification criteria. Also exclusive for Emerald Directors.'}
                </p>
                <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    {isPt ? 'Adicionar imagem...' : 'Add image...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sapphire Directors */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🌍</div>
                  <div className="text-sm font-bold">Vacations</div>
                  <div className="text-xs opacity-80">Destinos Internacionais</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {isPt ? 'Sapphire Directors' : 'Sapphire Directors'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isPt
                    ? 'Viagens e experiências internacionais em diferentes destinos. Os destinos variam de acordo com o programa de incentivos.'
                    : 'International trips and experiences in different destinations. Destinations vary according to the incentive program.'}
                </p>
                <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    {isPt ? 'Adicionar imagem...' : 'Add image...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Novos Ruby Directors */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🇿🇦</div>
                  <div className="text-sm font-bold">President's Club Pursuit</div>
                  <div className="text-xs opacity-80">África do Sul</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {isPt ? 'Novos Ruby Directors' : 'New Ruby Directors'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isPt
                    ? 'Experiência especial para novos Ruby Directors que alcançam este nível. Combinação de viagem, lazer, networking e reconhecimento.'
                    : 'Special experience for new Ruby Directors reaching this level. Combination of travel, leisure, networking and recognition.'}
                </p>
                <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    {isPt ? 'Adicionar imagem...' : 'Add image...'}
                  </span>
                </div>
              </div>
            </div>

            {/* President's Team */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="text-sm font-bold">Diamond Experience</div>
                  <div className="text-xs opacity-80">Internacional</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {isPt ? "President's Team" : "President's Team"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isPt
                    ? 'Experiência internacional em destinos de grande destaque como Europa ou EUA. Oportunidade de conviver com outros líderes e celebrar o crescimento.'
                    : 'International experience in high-profile destinations like Europe or USA. Opportunity to network with other leaders and celebrate growth.'}
                </p>
                <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    {isPt ? 'Adicionar imagem...' : 'Add image...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Diamond Step-Ups */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 md:col-span-2">
              <div className="h-48 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🛥️</div>
                  <div className="text-sm font-bold">Silverado Yacht</div>
                  <div className="text-xs opacity-80">México</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {isPt ? 'Diamond Step-Ups' : 'Diamond Step-Ups'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isPt
                    ? 'Experiências especiais associadas aos diferentes níveis Diamond. Inclui viagem aérea, alojamento, transporte, refeições e excursões especiais.'
                    : 'Special experiences associated with different Diamond levels. Includes air travel, accommodation, transport, meals and special excursions.'}
                </p>
                <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    {isPt ? 'Adicionar imagem...' : 'Add image...'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Career Path Summary */}
          <div className="mt-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4 text-center">
              {isPt ? '🌟 Caminho de Carreira' : '🌟 Career Path'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="p-4 bg-white/10 rounded-lg">
                <div className="text-2xl mb-2">👤</div>
                <div className="text-sm font-semibold">{isPt ? 'Distribuidor' : 'Distributor'}</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-semibold">{isPt ? 'Manager' : 'Manager'}</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm font-semibold">{isPt ? 'Senior Manager' : 'Senior Manager'}</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-sm font-semibold">{isPt ? 'Executive Manager' : 'Executive Manager'}</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <div className="text-2xl mb-2">👑</div>
                <div className="text-sm font-semibold">{isPt ? 'Director' : 'Director'}</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm font-semibold">{isPt ? 'Liderança' : 'Leadership'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VÍDEOS DA COMUNIDADE ── */}
      <VideoSection />
    </div>
  );
}
