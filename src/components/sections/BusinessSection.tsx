'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';
import { getEmbedUrl } from '@/lib/utils/video';

interface BusinessVideo {
  order: number;
  videoUrl: string;
  title: string;
  active: boolean;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, title, videoUrl }) => {
  if (!isOpen) return null;

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h4 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {title}
          </h4>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="aspect-video w-full bg-black flex items-center justify-center relative">
          {embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=1&rel=0`}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h5 className="text-white font-bold text-lg mb-2">Vídeo em Finalização de Gravação</h5>
              <p className="text-gray-400 text-sm mb-6">
                Este vídeo curto gravado pelo José Sarmento Machado está em fase de upload. Entretanto, pode esclarecer todas as dúvidas diretamente connosco no WhatsApp!
              </p>
              <a
                href="https://wa.me/258823056900?text=Olá José e Ofélia, gostaria de saber mais sobre este tópico de negócio da NeoLife"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                  Falar Agora no WhatsApp
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BusinessSection: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const { toggleBusinessGoal, isBusinessGoalSelected } = useSelection();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [activeModal, setActiveModal] = useState<{ title: string; videoUrl?: string } | null>(null);
  const [businessVideos, setBusinessVideos] = useState<BusinessVideo[]>([]);

  const availableGoals = [
    { id: 'extra-income', labelPt: 'Rendimento Extra Sustentável', labelEn: 'Extra Sustainable Income' },
    { id: 'full-time', labelPt: 'Negócio Próprio / Carreira Independente', labelEn: 'Full-Time Independent Business' },
    { id: 'mentorship', labelPt: 'Mentoria Direta com José e Ofélia', labelEn: 'Direct Mentorship with José & Ofélia' },
    { id: 'time-freedom', labelPt: 'Liberdade de Tempo & Horários Flexíveis', labelEn: 'Time Freedom & Flexible Hours' },
    { id: 'global-scale', labelPt: 'Expansão Internacional (50+ Países)', labelEn: 'Global Business (50+ Countries)' },
  ];

  useEffect(() => {
    fetch('/api/videos?category=Business')
      .then((r) => r.json())
      .then((data: BusinessVideo[]) => {
        if (Array.isArray(data)) setBusinessVideos(data);
      })
      .catch(() => {/* silent */});
  }, []);

  const getVideoUrl = (order: number): string | undefined =>
    businessVideos.find((v) => v.active && v.order === order)?.videoUrl;

  const blocks = [
    {
      id: 'intro',
      number: t.business.blocks.intro.number,
      theme: t.business.blocks.intro.theme,
      text: t.business.blocks.intro.text,
      videoTitle: t.business.blocks.intro.videoTitle,
      cta: t.business.blocks.intro.cta,
      nextAnchor: '#business-block-02',
      badge: 'Fundamentos',
      icon: '🌱',
    },
    {
      id: 'model',
      number: t.business.blocks.model.number,
      theme: t.business.blocks.model.theme,
      text: t.business.blocks.model.text,
      videoTitle: t.business.blocks.model.videoTitle,
      cta: t.business.blocks.model.cta,
      nextAnchor: '#business-block-03',
      badge: 'Funcionamento',
      icon: '⚙️',
    },
    {
      id: 'mentorship',
      number: t.business.blocks.mentorship.number,
      theme: t.business.blocks.mentorship.theme,
      text: t.business.blocks.mentorship.text,
      videoTitle: t.business.blocks.mentorship.videoTitle,
      cta: t.business.blocks.mentorship.cta,
      nextAnchor: '#business-block-04',
      badge: 'Acompanhamento',
      icon: '🤝',
    },
    {
      id: 'earnings',
      number: t.business.blocks.earnings.number,
      theme: t.business.blocks.earnings.theme,
      text: t.business.blocks.earnings.text,
      videoTitle: t.business.blocks.earnings.videoTitle,
      cta: t.business.blocks.earnings.cta,
      nextAnchor: '#business-block-05',
      badge: 'Escala & Ganhos',
      icon: '📈',
    },
    {
      id: 'start',
      number: t.business.blocks.start.number,
      theme: t.business.blocks.start.theme,
      text: t.business.blocks.start.text,
      videoTitle: t.business.blocks.start.videoTitle,
      cta: t.business.blocks.start.cta,
      link: '/formulario?tema=oportunidade-negocio&pais=mz-pt',
      badge: 'Ação Imediata',
      icon: '🚀',
    },
  ];

  return (
    <section id="negocio" className="py-10 md:py-14 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/10 border border-emerald-600/30 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {t.business.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {t.business.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t.business.subtitle}
          </p>
        </div>

        {/* Goals Selector */}
        <div className="mb-6 bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 mb-3 text-center">
            {isPt ? 'O que mais procura alcançar com a NeoLife?' : 'What do you most want to achieve with NeoLife?'}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableGoals.map((goal) => {
              const label = isPt ? goal.labelPt : goal.labelEn;
              const isSelected = isBusinessGoalSelected(label);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleBusinessGoal(label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500'
                      : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {blocks.map((block, index) => {
            const isOpen = activeIndex === index;
            const videoUrl = getVideoUrl(index + 1);

            return (
              <div key={block.id}>
                {/* Tab Header (always visible) */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    isOpen
                      ? 'bg-emerald-50 border-l-4 border-emerald-600'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  {/* Icon + Number */}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 text-base font-black transition-colors ${
                    isOpen ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {block.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isOpen ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {block.badge}
                      </span>
                    </div>
                    <p className={`text-sm font-bold mt-0.5 transition-colors ${
                      isOpen ? 'text-emerald-800' : 'text-gray-800'
                    }`}>
                      {block.theme}
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expandable Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-4 pt-2 bg-emerald-50/50">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {block.text}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {block.link ? (
                        <Link href={block.link}>
                          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 shadow-sm">
                            {block.cta}
                          </Button>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIndex(index + 1 < blocks.length ? index + 1 : null);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          {block.cta}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}

                      {videoUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveModal({ title: block.videoTitle, videoUrl })}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>{block.videoTitle}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing Mentorship Banner */}
        <div className="mt-6 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-200 mb-0.5">
              Mentoria Garantida
            </p>
            <h4 className="text-base font-bold text-white mb-0.5">
              Dúvidas sobre o modelo de negócio?
            </h4>
            <p className="text-emerald-100 text-xs">
              Ofélia e José Machado respondem pessoalmente sem qualquer pressão.
            </p>
          </div>
          <Link href="/formulario?tema=oportunidade-negocio&pais=mz-pt" className="shrink-0">
            <Button size="sm" className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 shadow-md">
              Marcar Conversa Gratuita
            </Button>
          </Link>
        </div>

      </div>

      <VideoModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={activeModal?.title || ''}
        videoUrl={activeModal?.videoUrl}
      />
    </section>
  );
};
