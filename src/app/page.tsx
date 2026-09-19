'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { DynamicBanner } from '@/components/ui/DynamicBanner';
import { VideoSection } from '@/components/ui/VideoSection';
import { NeoLifeScienceSection } from '@/components/sections/NeoLifeScienceSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Announcement Banner */}
      <DynamicBanner />

      {/* ── HERO SECTION: 3 Pilares com Pergunta-Guia ── */}
      <section className="relative bg-gradient-to-b from-emerald-50/50 via-white to-gray-50/40 py-16 md:py-24 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Main Question */}
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-bold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              {t.hero.badge}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>

          {/* 3 Pillars Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
            
            {/* 1. SAÚDE */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-emerald-100 hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Nutrição & Vitalidade
                  </span>
                </div>

                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  Pilar 01
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  1. SAÚDE
                </h3>
                
                <blockquote className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 italic border-l-2 border-emerald-300 pl-3">
                  “Eleve a forma como você cuida da sua saúde, de dentro para fora, através da nutrição celular.”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link href="/saude" className="block w-full">
                  <button className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-600">
                    <span>Explorar Soluções de Saúde</span>
                    <span>➔</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* 2. BUSINESS / OPORTUNIDADE */}
            <div className="group relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-gray-950 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between transform md:-translate-y-2">
              <div className="absolute -top-3.5 right-6 bg-emerald-400 text-emerald-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                Empreendedorismo
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-900 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300">
                    Negócio Próprio
                  </span>
                </div>

                <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1">
                  Pilar 02
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                  2. BUSINESS
                </h3>
                
                <blockquote className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6 italic border-l-2 border-emerald-400 pl-3">
                  “Construa uma nova fonte de renda sustentável e transforme o seu negócio em liberdade para escolher como viver.”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-emerald-800/80">
                <Link href="/business" className="block w-full">
                  <button className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                    <span>Conhecer o Business</span>
                    <span>➔</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* 3. OUTRAS EXPERIÊNCIAS */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-teal-100 hover:border-teal-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100/80 flex items-center justify-center text-teal-700 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Viagens & Lifestyle
                  </span>
                </div>

                <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">
                  Pilar 03
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors">
                  3. EXPERIÊNCIAS
                </h3>
                
                <blockquote className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 italic border-l-2 border-teal-300 pl-3">
                  “Expanda os seus horizontes, conheça o mundo e viva experiências únicas de reconhecimento e comunidade.”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link href="/experiencias" className="block w-full">
                  <button className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-teal-700 hover:bg-teal-800 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:bg-teal-600">
                    <span>Descobrir Experiências</span>
                    <span>➔</span>
                  </button>
                </Link>
              </div>
            </div>

          </div>

          {/* Mentorship Trust Callout */}
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-emerald-400 relative shadow-sm">
                <Image
                  src="/assistente.png"
                  alt="José e Ofélia Machado"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {t.hero.mentorshipBadge}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {t.hero.mentorshipText}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="#saude" className="text-xs font-semibold text-gray-600 hover:text-emerald-700 px-3 py-2">
                Ver Soluções ↓
              </a>
              <Link href="/formulario?tema=conheca-neolife&pais=mz">
                <Button size="sm" className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white">
                  {t.hero.talkToUs}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENTORS & POSITIONING SECTION ── */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {t.mentors.badge}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t.mentors.title}<br />
                <span className="text-emerald-700">{t.mentors.highlight}</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-5">
                {t.mentors.p1}
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                {t.mentors.p2}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t.mentors.p3}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#negocio">
                  <Button variant="outline" className="border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-semibold">
                    {t.hero.exploreBusiness}
                  </Button>
                </a>
                <a href="#saude">
                  <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
                    {t.hero.exploreHealth}
                  </Button>
                </a>
              </div>
            </div>

            {/* Visual side */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                {/* Mentor Couple Presentation Card */}
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-emerald-100 relative">
                    <Image
                      src="/assistente.png"
                      alt="José e Ofélia Machado"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg leading-snug">
                      {t.mentors.coupleTitle}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {t.mentors.coupleSubtitle}
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">
                      {t.mentors.coupleRegions}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    t.mentors.bullet1,
                    t.mentors.bullet2,
                    t.mentors.bullet3,
                    t.mentors.bullet4,
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-sm leading-snug">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-600 italic">
                    {t.mentors.quote}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-800 mt-1">
                    - José Sarmento Machado & Ofélia Alfredo Machado
                  </p>
                </div>
              </div>

              {/* Decorative WhatsApp badge */}
              <a
                href="https://wa.me/258823056900"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -bottom-4 -right-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-5 py-3 shadow-lg transition-all"
              >
                <p className="text-xs font-medium opacity-80">{t.mentors.alwaysAvailable}</p>
                <p className="text-sm font-bold flex items-center gap-1.5">
                  <span>+258 82 305 6900</span>
                  <span>➔</span>
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── A DIFERENÇA NEOLIFE: Natureza + Ciência ── */}
      <NeoLifeScienceSection />

      {/* ── NAVEGAÇÃO RÁPIDA: AS 3 ÁREAS PRINCIPAIS ── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Escolha o Seu Próximo Passo
          </h3>
          <p className="text-gray-600 text-sm max-w-xl mx-auto mb-10">
            Aceda diretamente à área que procura para ver todas as opções disponíveis e adicionar à sua seleção personalizada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/saude" className="group p-6 rounded-3xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 transition-all text-left flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-3 block">🌿</span>
                <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-emerald-800 transition-colors">
                  1. Área de Saúde
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Suplementos, nutrição celular, higiene pessoal, limpeza ecológica e agricultura.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span>Explorar Soluções</span>
                <span>➔</span>
              </span>
            </Link>

            <Link href="/business" className="group p-6 rounded-3xl bg-gray-950 text-white hover:bg-emerald-950 border border-emerald-500/30 transition-all text-left flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-2xl mb-3 block">💼</span>
                <h4 className="font-bold text-white text-lg mb-1 group-hover:text-emerald-300 transition-colors">
                  2. Oportunidade Business
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Os 5 módulos em vídeo, plano de ganhos e mentoria com José & Ofélia Machado.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Ver Módulos & Vídeos</span>
                <span>➔</span>
              </span>
            </Link>

            <Link href="/experiencias" className="group p-6 rounded-3xl bg-teal-50/60 hover:bg-teal-100/70 border border-teal-200 transition-all text-left flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-3 block">✈️</span>
                <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-teal-800 transition-colors">
                  3. Experiências & Viagens
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Viagens internacionais, reconhecimento, convenções e comunidade global.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
                <span>Descobrir Mais</span>
                <span>➔</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDEOS DA COMUNIDADE ── */}
      <VideoSection />

      {/* ── FINAL CTA SECTION ── */}
      <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-emerald-100/40 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
            {t.cta.readyTitle}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.cta.readyText}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/258823056900"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 shadow-md">
                {t.cta.startNow}
              </Button>
            </a>
            <Link href="/formulario?tema=conheca-neolife&pais=mz">
              <Button size="lg" variant="outline" className="border-emerald-400 text-emerald-800 hover:bg-emerald-50 font-bold px-8">
                Preencher Formulário
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-gray-500 font-mono">
            {t.cta.directContact}
          </p>
        </div>
      </section>
    </div>
  );
}