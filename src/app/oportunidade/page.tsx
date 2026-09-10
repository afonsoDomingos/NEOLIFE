'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const faqs = [
  {
    q: 'O que é exactamente a oportunidade de negócio NeoLife?',
    a: 'A NeoLife é uma empresa líder mundial em nutrição celular e suplementação de alta qualidade. A oportunidade de negócio consiste em partilhar os produtos com outras pessoas, criar a sua própria rede de clientes e parceiros, e construir uma fonte de rendimento suplementar - ou mesmo principal - com flexibilidade total de horário e localização.',
  },
  {
    q: 'Tenho de vender para ganhar dinheiro?',
    a: 'Não necessariamente no sentido tradicional. A base do negócio é recomendar produtos que funcionam para si próprio e que usa no dia-a-dia. Quando os seus conhecidos querem experimentar, fazem-no através de si. É mais partilha do que venda convencional.',
  },
  {
    q: 'Preciso de investimento inicial?',
    a: 'O investimento inicial é muito reduzido. O essencial é começar a usar os produtos e conhecê-los bem para poder partilhá-los com convicção. A nossa equipa dá-lhe todo o acompanhamento e formação necessários para começar.',
  },
  {
    q: 'Posso fazer isto a partir de qualquer país?',
    a: 'A NeoLife está operacional em Moçambique, África do Sul, Angola e Zimbabwe. A expansão para outros países africanos está em curso. Se reside num destes países, pode começar hoje.',
  },
  {
    q: 'Quanto tempo preciso de dedicar?',
    a: 'Pode começar em part-time, nas suas horas livres. Muitos dos nossos parceiros começaram a trabalhar apenas 5 a 10 horas por semana. À medida que os resultados crescem, cada um decide como equilibrar o negócio com a sua vida pessoal e profissional.',
  },
  {
    q: 'Vou ter apoio e formação?',
    a: 'Sim, absolutamente. Fazemos questão de acompanhar cada pessoa que decide juntar-se a nós. Isso inclui formação sobre os produtos, suporte na comunicação, estratégias de partilha digital e reuniões periódicas de equipa.',
  },
];

export default function OportunidadePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 py-24 md:py-32 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Oportunidade de Negócio - NeoLife África
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Construa uma Vida com{' '}
            <span className="text-emerald-300">Mais Liberdade</span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            A NeoLife oferece-lhe a possibilidade de criar uma fonte de rendimento partilhando
            produtos de excelência em nutrição e bem-estar - com apoio real, formação contínua
            e uma equipa que acompanha cada passo da sua jornada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formulario?tema=oportunidade-negocio&pais=mz">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-8">
                Quero Saber Mais
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button size="lg" variant="outline" className="border-emerald-400 text-emerald-200 hover:bg-emerald-700/40 px-8">
                Como Funciona
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── 3 Pillars ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Porquê a NeoLife?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Três razões concretas que fazem desta uma oportunidade diferente das demais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Produtos de Excelência',
                desc: 'Mais de 60 anos de investigação científica em nutrição celular. Produtos reconhecidos mundialmente, usados por atletas de elite e famílias comuns com resultados comprovados.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Apoio Real de Equipa',
                desc: 'Não está sozinho. A nossa equipa fornece formação contínua, materiais de comunicação, reuniões regulares e acompanhamento personalizado desde o primeiro dia.',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Rendimento Flexível',
                desc: 'Comece em part-time, ao seu ritmo. Os seus ganhos crescem à medida que a sua rede e confiança crescem. Não há teto - há pessoas no nosso grupo que substituíram o seu salário em menos de 2 anos.',
              },
            ].map((card, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Funciona</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Um processo simples e replicável para construir um negócio sustentável.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Conhece os Produtos',
                desc: 'Começa por experimentar os produtos NeoLife. Quando sente os resultados, a partilha torna-se genuína e natural - não é "venda", é recomendação de algo em que acredita.',
              },
              {
                step: '02',
                title: 'Partilha o que Descobriu',
                desc: 'Conta a sua experiência a família, amigos e conhecidos. Usa os materiais e estratégias que a equipa fornece. Alguns querem saber mais - acompanha-os.',
              },
              {
                step: '03',
                title: 'Constrói a Sua Rede',
                desc: 'Quem gosta dos produtos pode também tornar-se parceiro. Ajuda essas pessoas a começar, tal como alguém te ajudou a si. A rede cresce e os rendimentos multiplicam.',
              },
              {
                step: '04',
                title: 'Ganha e Cresce',
                desc: 'Recebe as suas comissões mensalmente. Com dedicação e consistência, o negócio cresce, os resultados aumentam e a liberdade financeira torna-se uma realidade possível.',
              },
            ].map((item, i) => (
              <div key={i}
                className="flex gap-6 items-start p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">
                <div className="text-4xl font-black text-emerald-200 select-none leading-none w-12 shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600 text-lg">
              Respondemos às dúvidas mais comuns. Se a sua não estiver aqui, fale connosco.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-emerald-300 transition-colors">
                <button
                  id={`faq-btn-${i}`}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-gray-900 text-base">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-emerald-600 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-emerald-50/60 border-t border-emerald-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pronto para Dar o Primeiro Passo?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Sem compromisso. Sem pressão. Apenas uma conversa para perceber se faz sentido para si.
            Deixe os seus contactos e nós chegamos até si.
          </p>
          <Link href="/interesse?tema=oportunidade-negocio">
            <Button size="lg" className="px-10">
              Quero Receber Mais Informação
            </Button>
          </Link>
          <p className="mt-6 text-sm text-gray-500">
            Disponível em 🇲🇿 Moçambique · 🇿🇦 África do Sul · 🇦🇴 Angola · 🇿🇼 Zimbabwe
          </p>
        </div>
      </section>
    </div>
  );
}
