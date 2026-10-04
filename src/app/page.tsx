'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DynamicBanner } from '@/components/ui/DynamicBanner';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import EventCard from '@/components/EventCard';

interface PillarCardData {
  pillarId: string;
  image: string;
  altText?: string;
}

const DEFAULT_IMAGES: Record<string, string> = {
  saude: '/images/sections/pilar-saude.jpg',
  business: '/images/sections/pilar-business.jpg',
  experiencias: '/images/sections/pilar-experiencias.jpg',
};

export default function Home() {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const [cardImages, setCardImages] = useState<Record<string, string>>(DEFAULT_IMAGES);

  useEffect(() => {
    fetch('/api/pillar-cards')
      .then((r) => r.json())
      .then((data: PillarCardData[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = { ...DEFAULT_IMAGES };
          data.forEach((c) => { if (c.image) map[c.pillarId] = c.image; });
          setCardImages(map);
        }
      })
      .catch(() => {/* use defaults */});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <DynamicBanner />

      {/* ── HERO SECTION ── */}
      <section className="relative bg-gradient-to-b from-emerald-50/50 via-white to-gray-50/40 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-bold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              {t.hero.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              <TypewriterText text={t.hero.title} speed={50} />
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">

            {/* ── 1. SAÚDE ── */}
            <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl border border-emerald-100 hover:border-emerald-400 transition-all duration-300 flex flex-col overflow-hidden">
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={cardImages.saude}
                  alt="Família saudável e feliz"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/30 to-white" />
                <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-emerald-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-emerald-800 border border-emerald-200 shadow-sm">
                    {isPt ? 'Nutrição &amp; Vitalidade' : 'Nutrition &amp; Vitality'}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="flex flex-col flex-1 px-6 pb-6 -mt-2">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  {isPt ? 'Pilar 01' : 'Pillar 01'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {isPt ? '1. SAÚDE' : '1. HEALTH'}
                </h3>
                <blockquote className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 italic border-l-2 border-emerald-300 pl-3 flex-1">
                  {isPt ? '"Eleve a forma como você cuida da sua saúde, de dentro para fora, através da nutrição celular."' : '"Elevate how you care for your health, from the inside out, through cellular nutrition."'}
                </blockquote>
                <div className="pt-4 border-t border-gray-100">
                  <Link href="/saude" className="block w-full">
                    <button className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <span>{isPt ? 'Explorar Soluções de Saúde' : 'Explore Health Solutions'}</span>
                      <span>➔</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── 2. BUSINESS ── */}
            <div className="group relative bg-emerald-950 rounded-3xl shadow-xl hover:shadow-2xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300 flex flex-col overflow-hidden md:-translate-y-2">
              <div className="absolute -top-3.5 right-6 z-10 bg-emerald-400 text-emerald-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                {isPt ? 'Empreendedorismo' : 'Entrepreneurship'}
              </div>
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={cardImages.business}
                  alt="Empreendedor a trabalhar no computador"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-emerald-950/50 to-emerald-950" />
                <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-500/40 backdrop-blur-sm flex items-center justify-center text-emerald-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-emerald-200">Negócio Próprio</span>
                </div>
              </div>
              {/* Content */}
              <div className="flex flex-col flex-1 px-6 pb-6 -mt-2">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1">
                  {isPt ? 'Pilar 02' : 'Pillar 02'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  2. BUSINESS
                </h3>
                <blockquote className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-5 italic border-l-2 border-emerald-400 pl-3 flex-1">
                  {isPt ? '"Construa uma nova fonte de renda sustentável e transforme o seu negócio em liberdade para escolher como viver."' : '"Build a sustainable income stream and turn your ambition into the freedom to choose how you live."'}
                </blockquote>
                <div className="pt-4 border-t border-emerald-800/80">
                  <Link href="/business" className="block w-full">
                    <button className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                      <span>Conhecer o Business</span>
                      <span>➔</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── 3. EXPERIÊNCIAS ── */}
            <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl border border-teal-100 hover:border-teal-400 transition-all duration-300 flex flex-col overflow-hidden">
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={cardImages.experiencias}
                  alt="Casal a viajar pelo mundo"
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/30 to-white" />
                <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-teal-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-teal-800 border border-teal-200 shadow-sm">
                    Viagens &amp; Lifestyle
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="flex flex-col flex-1 px-6 pb-6 -mt-2">
                <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">
                  {isPt ? 'Pilar 03' : 'Pillar 03'}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                  {isPt ? '3. EXPERIÊNCIAS' : '3. EXPERIENCES'}
                </h3>
                <blockquote className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5 italic border-l-2 border-teal-300 pl-3 flex-1">
                  {isPt ? '"Expanda os seus horizontes, conheça o mundo e viva experiências únicas de reconhecimento e comunidade."' : '"Expand your horizons, see the world and live unique experiences of recognition and community."'}
                </blockquote>
                <div className="pt-4 border-t border-gray-100">
                  <Link href="/experiencias" className="block w-full">
                    <button className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-teal-700 hover:bg-teal-800 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <span>Descobrir Experiências</span>
                      <span>➔</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-emerald-100/40 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
            <TypewriterText text={t.cta.readyTitle} speed={40} />
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t.cta.readyText}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/258823056900" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 shadow-md">
                {t.cta.startNow}
              </Button>
            </a>
            <Link href="/formulario?tema=conheca-neolife&pais=mz-pt">
              <Button size="lg" variant="outline" className="border-emerald-400 text-emerald-800 hover:bg-emerald-50 font-bold px-8">
                {t.cta.fillForm}
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-gray-500 font-mono">
            {t.cta.directContact}
          </p>
        </div>
      </section>

      <EventCard />
    </div>
  );
}