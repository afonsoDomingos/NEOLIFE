'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { DynamicBanner } from '@/components/ui/DynamicBanner';
import { VideoSection } from '@/components/ui/VideoSection';
import { getActiveThemes as getStaticThemes } from '@/data/themes';
import { TypewriterText, SlideUpText, WordByWordText } from '@/components/ui/AnimatedText';
import Link from 'next/link';
import Image from 'next/image';
import { Theme } from '@/types';

export default function Home() {
  const [themes, setThemes] = useState<(Theme & { _id?: string })[]>(() => getStaticThemes());

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch('/api/themes');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setThemes(data);
          }
        }
      } catch (err) {
        console.error('Error loading dynamic themes:', err);
      }
    };
    fetchThemes();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Banner */}
      <DynamicBanner />

      {/* Hero Section - 3 Pilares com Pergunta-Guia */}
      <section className="relative bg-gradient-to-b from-emerald-50/40 via-white to-gray-50/50 py-16 md:py-24 overflow-hidden">
        {/* Background ambient decorative shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Question */}
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              NeoLife África • Mentoria & Transformação
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              <TypewriterText 
                text="O que você está buscando para a sua vida hoje?"
                speed={60}
                className="inline-block"
              />
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              <SlideUpText 
                text="Para a sua jornada, conte com a mentoria próxima e dedicada de Ofélia & José Machado."
                delay={600}
              />
            </p>
          </div>

          {/* 3 Pillars Cards */}
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
                    Nutrição Celular
                  </span>
                </div>

                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  Pilar 01
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
                  1. SAÚDE
                </h3>
                
                <blockquote className="text-gray-600 text-base leading-relaxed mb-6 italic border-l-2 border-emerald-300 pl-3">
                  “Eleve a forma como você cuida da sua saúde, de dentro para fora, através da nutrição celular.”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link href="/interesse?tema=saude" className="block w-full">
                  <Button fullWidth variant="outline" className="border-emerald-300 text-emerald-800 hover:bg-emerald-600 hover:text-white group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    Explorar Saúde
                  </Button>
                </Link>
              </div>
            </div>

            {/* 2. LIBERDADE E RENDA */}
            <div className="group relative bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white rounded-3xl p-8 shadow-md hover:shadow-2xl border-2 border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between transform md:-translate-y-2">
              <div className="absolute -top-3.5 right-6 bg-emerald-500 text-emerald-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
                Empreendedorismo
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-700/60 border border-emerald-500/40 flex items-center justify-center text-emerald-200 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-900 transition-all duration-300">
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
                  2. LIBERDADE E RENDA
                </h3>
                
                <blockquote className="text-emerald-100/90 text-base leading-relaxed mb-6 italic border-l-2 border-emerald-400 pl-3">
                  “Construa uma nova fonte de renda através do marketing de rede e transforme seu negócio em liberdade para escolher como viver.”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-emerald-800/80">
                <Link href="/oportunidade" className="block w-full">
                  <Button fullWidth className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold shadow-sm">
                    Conhecer Oportunidade
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3. MUNDO E EXPERIÊNCIAS */}
            <div className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-emerald-100 hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between">
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
                  3. MUNDO E EXPERIÊNCIAS
                </h3>
                
                <blockquote className="text-gray-600 text-base leading-relaxed mb-6 italic border-l-2 border-teal-300 pl-3">
                  “Expanda seus horizontes, conheça o mundo e transforme seu negócio em novas experiências de vida.”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link href="/interesse?tema=mundo-experiencias" className="block w-full">
                  <Button fullWidth variant="outline" className="border-teal-300 text-teal-800 hover:bg-teal-600 hover:text-white group-hover:bg-teal-600 group-hover:text-white transition-all">
                    Descobrir Experiências
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Mentorship Trust Callout */}
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-emerald-400 relative">
                <Image
                  src="/assistente.png"
                  alt="José e Ofélia Machado"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Mentoria Personalizada</p>
                <p className="text-sm font-semibold text-gray-900">Ofélia & José Machado ao seu lado</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="#temas" className="text-xs font-semibold text-gray-600 hover:text-emerald-700 px-3 py-2">
                Ver todos os temas ↓
              </Link>
              <Link href="/formulario?tema=conheca-neolife&pais=mz">
                <Button size="sm" className="text-xs font-semibold">
                  Falar Connosco
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors / Personal Positioning Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Quem Somos
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Uma Equipa Real.<br />
                <span className="text-emerald-700">Partilha Genuína.</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Não somos uma corporação distante. Somos o <strong className="font-semibold text-gray-900">José Sarmento Machado</strong> e a <strong className="font-semibold text-gray-900">Ofélia Alfredo Machado</strong>, um casal que encontrou na NeoLife o caminho para transformar a saúde da nossa família e construir uma fonte de rendimento sustentável - e decidimos partilhar essa experiência e mentoria com quem está ao nosso redor.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                A nossa missão é simples: partilhar conhecimento prático e comprovado sobre nutrição celular, esclarecer dúvidas com transparência e acompanhar quem desejar empreender connosco - sem pressão, com acompanhamento próximo e respeito pelo seu tempo.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Se tiver dúvidas, perguntas ou curiosidade sobre a nossa caminhada - estamos aqui. A conversa é gratuita e sem qualquer compromisso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/oportunidade">
                  <Button variant="outline">
                    Conhecer a Oportunidade
                  </Button>
                </Link>
                <Link href="#temas">
                  <Button>
                    Explorar Temas de Saúde
                  </Button>
                </Link>
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
                    <p className="font-bold text-gray-900 text-lg leading-snug">José & Ofélia Machado</p>
                    <p className="text-xs text-gray-500 font-medium">Consultores & Mentores de Bem-Estar NeoLife</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">Moçambique · África do Sul · Angola · Zimbabwe</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    'Informação educativa sobre saúde e bem-estar',
                    'Resposta a dúvidas sem compromisso',
                    'Acompanhamento personalizado',
                    'Rede ativa em 4 países africanos',
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 leading-snug">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-600 italic">
                    "A melhor decisão é uma decisão informada. Estamos aqui para garantir que a sua o seja."
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-800 mt-1">
                    - José Sarmento Machado & Ofélia Alfredo Machado
                  </p>
                </div>
              </div>

              {/* Decorative badge */}
              <div className="absolute -bottom-4 -right-4 bg-emerald-600 text-white rounded-2xl px-5 py-3 shadow-lg">
                <p className="text-xs font-medium opacity-80">Sempre disponíveis</p>
                <p className="text-sm font-bold">via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="temas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              <WordByWordText 
                text="Escolha o Seu Interesse"
                speed={150}
              />
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              <SlideUpText 
                text="Selecione o tema que mais lhe interessa e receba informações personalizadas."
                delay={800}
              />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme, index) => {
              const themeKey = theme._id || theme.id || theme.slug;
              return (
                <Link key={themeKey} href={`/interesse?tema=${theme.slug}`}>
                  <Card className="h-full hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group border border-gray-100">
                    <CardHeader>
                      {theme.image ? (
                        <img
                          src={theme.image}
                          alt={theme.title}
                          className="aspect-video w-full object-cover rounded-lg mb-4 group-hover:opacity-95 transition-opacity"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="aspect-video bg-emerald-50/50 rounded-lg mb-4 flex items-center justify-center border border-emerald-100/50">
                          <span className="text-emerald-700 text-sm font-medium">NeoLife {theme.title}</span>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                        <SlideUpText 
                          text={theme.title}
                          delay={index * 100}
                        />
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">
                        {theme.description}
                      </p>
                      <Button variant="outline" fullWidth>
                        Quero Saber Mais
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <VideoSection />

      {/* Business Opportunity Teaser */}
      <section className="py-16 bg-emerald-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-emerald-300 text-sm font-semibold uppercase tracking-wider mb-2">Para quem procura mais</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Conheça a Oportunidade de Negócio
              </h2>
              <p className="text-emerald-100 leading-relaxed max-w-xl">
                Saúde e bem-estar podem ser também a base de um rendimento suplementar ou até de um negócio a tempo inteiro. Sem pressão - apenas informação.
              </p>
            </div>
            <Link href="/oportunidade" className="shrink-0">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-8 whitespace-nowrap">
                Saber Como Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white via-emerald-50/20 to-emerald-50/40 border-t border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              <TypewriterText 
                text="Pronto para Começar?"
                speed={100}
              />
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              <SlideUpText 
                text="Não perca tempo. Escolha um tema acima e receba informações personalizadas agora mesmo."
                delay={500}
              />
            </p>
            <Link href="#temas">
              <Button size="lg">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}