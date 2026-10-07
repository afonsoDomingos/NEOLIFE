'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BusinessSection } from '@/components/sections/BusinessSection';
import { VideoSection } from '@/components/ui/VideoSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';
import { requireGate } from '@/lib/utils/gateUtils';

export default function BusinessPage() {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const { totalItemsCount, businessGoals } = useSelection();

  // Gate verification
  useEffect(() => {
    requireGate('business', '/business');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HEADER DA ÁREA: BUSINESS ── */}
      <section className="relative bg-gray-950 text-white py-20 md:py-28 overflow-hidden border-b border-emerald-900/50">
        {/* Background Image with Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/banners/banner-business.jpg')" }}
        >
          {/* Multi-layered dark gradient to ensure text contrast and elegance */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/92 via-emerald-950/80 to-gray-950/95" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isPt ? 'Pilar 02 • Oportunidade & Empreendedorismo' : 'Pillar 02 • Opportunity & Entrepreneurship'}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
            {isPt ? (
              <>Construa um Negócio Próprio com <span className="text-emerald-400">Liberdade & Apoio Real</span></>
            ) : (
              <>Build Your Own Business with <span className="text-emerald-400">Freedom & True Support</span></>
            )}
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8 drop-shadow">
            {isPt
              ? 'Conheça o modelo passo a passo, veja os vídeos explicativos de cada módulo e selecione os seus objetivos. Conte com a mentoria direta de José Sarmento Machado e Ofélia Alfredo Machado.'
              : 'Understand the business model step by step, watch the explanatory videos, and select your goals. Benefit from direct mentorship with José & Ofélia Machado.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#modulos-negocio">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold px-8 shadow-xl">
                {isPt ? 'Ver Módulos & Vídeos ↓' : 'Watch Modules & Videos ↓'}
              </Button>
            </a>

            <Link href="/formulario?origem=business-topo">
              <Button size="lg" variant="outline" className="border-emerald-400 text-white hover:bg-emerald-800/80 backdrop-blur-sm font-bold px-8 shadow-lg">
                {totalItemsCount > 0
                  ? (isPt ? `Finalizar Seleção (${totalItemsCount}) ➔` : `Finish Selection (${totalItemsCount}) ➔`)
                  : (isPt ? 'Falar com os Mentores ➔' : 'Talk with Mentors ➔')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOCOS SEQUENCIAIS DO BUSINESS & VÍDEOS ── */}
      <div id="modulos-negocio">
        <BusinessSection />
      </div>

      {/* ── VÍDEOS & MASTERCLASSES DO MODELO DE NEGÓCIO ── */}
      <VideoSection pageTarget="business" />

      {/* ── CTA DE INSCRIÇÃO NA NEOLIFE ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-900 relative overflow-hidden">
        {/* Glow decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {isPt ? 'Começa Hoje' : 'Start Today'}
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            {isPt ? (
              <>Queres juntar-te à <span className="text-emerald-400">NeoLife</span>? 😊</>
            ) : (
              <>Want to join <span className="text-emerald-400">NeoLife</span>? 😊</>
            )}
          </h2>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl mx-auto">
            {isPt
              ? 'Clica no link abaixo e faz a tua inscrição. É rápido, simples e o primeiro passo para a tua liberdade financeira!'
              : 'Click the link below and complete your registration. It\'s quick, simple, and the first step toward your financial freedom!'}
          </p>

          {/* CTA Button */}
          <a
            href="https://shopneolife.com/OFELIAJOSEMACHADO/enrollment/enrollmentconfiguration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-lg rounded-2xl shadow-2xl shadow-emerald-900/60 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
          >
            <span>👉</span>
            {isPt ? 'Fazer a minha Inscrição' : 'Register Now'}
          </a>

          <p className="mt-6 text-sm text-emerald-400/70 font-medium">
            shopneolife.com/OFELIAJOSEMACHADO
          </p>
        </div>
      </section>

      {/* ── MENTORIA PROFILE CARD ── */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden relative shrink-0 shadow-lg border-2 border-emerald-400">
              <Image
                src="/assistente.png"
                alt="José e Ofélia Machado"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {isPt ? 'Mentores & Líderes de Negócio' : 'Business Mentors & Leaders'}
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1 mb-2">
                José Sarmento Machado & Ofélia Alfredo Machado
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {isPt
                  ? '“O nosso compromisso é andar consigo lado a lado. Não precisa de experiência prévia — fornecemos todo o apoio, sistema de formação e acompanhamento contínuo.”'
                  : '“Our commitment is to guide you step by step. No previous experience needed — we provide full support, training systems, and ongoing guidance.”'}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/258823056900?text=Olá José e Ofélia, gostaria de agendar uma conversa sobre a oportunidade NeoLife"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
                    {isPt ? 'Falar no WhatsApp' : 'Chat on WhatsApp'}
                  </Button>
                </a>
                <Link href="/saude">
                  <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold">
                    {isPt ? 'Ver Soluções de Saúde' : 'View Health Solutions'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
