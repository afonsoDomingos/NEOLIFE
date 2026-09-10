'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { DynamicBanner } from '@/components/ui/DynamicBanner';
import { VideoSection } from '@/components/ui/VideoSection';
import { getActiveThemes as getStaticThemes } from '@/data/themes';
import { TypewriterText, SlideUpText, WordByWordText } from '@/components/ui/AnimatedText';
import Link from 'next/link';
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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/25 via-white to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              NeoLife África • Saúde, Vitalidade & Oportunidade
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <TypewriterText 
                text="Transforme a Sua Vida com a NeoLife"
                speed={80}
                className="inline-block"
              />
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              <SlideUpText 
                text="Descubra como a NeoLife pode ajudar a alcançar os seus objetivos de saúde, bem-estar e sucesso financeiro. Junte-se a milhares de pessoas que já transformaram as suas vidas."
                delay={1000}
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#temas">
                <Button size="lg" fullWidth>
                  Quero Saber Mais
                </Button>
              </Link>
              <Link href="#temas">
                <Button size="lg" variant="outline" fullWidth>
                  Receber Mais Informações
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
                Não somos uma empresa. Somos um casal que encontrou na NeoLife uma forma de melhorar a nossa saúde e criar uma fonte de rendimento adicional - e decidimos partilhar essa descoberta com quem à nossa volta.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                A nossa missão é simples: fornecer informação de qualidade, educar sobre bem-estar e nutrição, e acompanhar as pessoas que queiram explorar esta oportunidade - sem pressão, sem jargões de vendas.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Se tiver dúvidas, perguntas ou apenas curiosidade - estamos aqui. A conversa é gratuita e sem compromisso.
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
                {/* Avatar placeholder - replace src with real couple photo */}
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl shrink-0">
                    NL
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Os seus consultores NeoLife</p>
                    <p className="text-sm text-emerald-700 font-medium">Moçambique · África do Sul · Angola · Zimbabwe</p>
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
                  <p className="text-xs text-gray-500 italic">
                    "A melhor decisão é uma decisão informada. Estamos aqui para garantir que a sua o seja."
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