'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { getActiveThemes } from '@/data/themes';
import { TypewriterText, SlideUpText, WordByWordText } from '@/components/ui/AnimatedText';
import Link from 'next/link';

export default function Home() {
  const themes = getActiveThemes();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
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
            {themes.map((theme, index) => (
              <Link key={theme.id} href={`/interesse?tema=${theme.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    {theme.image ? (
                      <img
                        src={theme.image}
                        alt={theme.title}
                        className="aspect-video w-full object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Imagem do tema</span>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-black mb-2">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
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