'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { TypewriterText, SlideUpText, WordByWordText } from '@/components/ui/AnimatedText';
import Link from 'next/link';

export default function ConfirmacaoPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            <TypewriterText 
              text="Obrigado pelo seu Interesse!"
              speed={80}
            />
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            <SlideUpText 
              text="O conteúdo solicitado foi enviado para o seu e-mail. Em breve, um dos nossos consultores entrará em contacto consigo para fornecer mais informações personalizadas."
              delay={500}
            />
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-black mb-3">
              <WordByWordText 
                text="O que acontece a seguir?"
                speed={200}
              />
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <p className="text-gray-600">
                  Receberá um e-mail com as informações solicitadas
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <p className="text-gray-600">
                  Um consultor entrará em contacto via WhatsApp ou telefone
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p className="text-gray-600">
                  Terá uma apresentação personalizada das oportunidades
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">4</span>
                </div>
                <p className="text-gray-600">
                  Receberá acompanhamento até alcançar os seus objetivos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button size="lg" fullWidth className="bg-green-600 hover:bg-green-700">
              Falar Connosco pelo WhatsApp
            </Button>
          </a>
          
          <Link href="/">
            <Button size="lg" variant="outline" fullWidth>
              Voltar ao Início
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            <SlideUpText 
              text="Precisa de ajuda imediata?"
              delay={300}
            />
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="mailto:contato@neolife.com"
              className="text-gray-600 hover:text-black transition-colors"
            >
              E-mail
            </a>
            <a
              href="tel:+1234567890"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Telefone
            </a>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="text-gray-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-1">
                Os seus dados estão seguros
              </h4>
              <p className="text-sm text-gray-600">
                A NeoLife valoriza a sua privacidade. Os seus dados serão utilizados 
                exclusivamente para fornecer as informações solicitadas e não serão 
                partilhados com terceiros sem o seu consentimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}