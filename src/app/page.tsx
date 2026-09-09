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

      {/* Themes Section */}
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