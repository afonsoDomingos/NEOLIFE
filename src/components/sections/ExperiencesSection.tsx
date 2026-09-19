'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';

export const ExperiencesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const { toggleExperienceInterest, isExperienceInterestSelected } = useSelection();

  const items = [
    {
      id: 'motivation',
      title: t.experiences.items.motivation.title,
      desc: t.experiences.items.motivation.desc,
      tag: t.experiences.items.motivation.tag,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      color: 'amber',
    },
    {
      id: 'growth',
      title: t.experiences.items.growth.title,
      desc: t.experiences.items.growth.desc,
      tag: t.experiences.items.growth.tag,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
      color: 'teal',
    },
    {
      id: 'travel',
      title: t.experiences.items.travel.title,
      desc: t.experiences.items.travel.desc,
      tag: t.experiences.items.travel.tag,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      ),
      color: 'sky',
    },
    {
      id: 'recognition',
      title: t.experiences.items.recognition.title,
      desc: t.experiences.items.recognition.desc,
      tag: t.experiences.items.recognition.tag,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004 0A4.5 4.5 0 0015 9.75V6.75A2.25 2.25 0 0012.75 4.5h-1.5A2.25 2.25 0 009 6.75v3c0 1.914 1.196 3.55 2.876 4.125m3.128 0h-3.128" />
        </svg>
      ),
      color: 'yellow',
    },
    {
      id: 'events',
      title: t.experiences.items.events.title,
      desc: t.experiences.items.events.desc,
      tag: t.experiences.items.events.tag,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      color: 'indigo',
    },
    {
      id: 'international',
      title: t.experiences.items.international.title,
      desc: t.experiences.items.international.desc,
      tag: t.experiences.items.international.tag,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
      ),
      color: 'emerald',
    },
  ];

  return (
    <section id="experiencias" className="py-20 md:py-28 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4 border border-teal-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            {t.experiences.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {t.experiences.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
            {t.experiences.subtitle}
          </p>

          {/* Development Notice Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>{t.experiences.comingSoonBanner}</span>
          </div>
        </div>

        {/* 6 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50/70 hover:bg-white rounded-3xl p-7 border border-gray-100 hover:border-teal-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100/70 text-teal-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-xs">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-teal-800 border border-teal-200 shadow-xs">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200/50 flex flex-col gap-2">
                {(() => {
                  const isSelected = isExperienceInterestSelected(item.title);
                  return (
                    <button
                      type="button"
                      onClick={() => toggleExperienceInterest(item.title)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-500'
                          : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      <span>{isSelected ? (isPt ? '✓ Tenho Interesse' : '✓ Interested') : (isPt ? '+ Quero Saber Mais' : '+ Add Interest')}</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Community Callout */}
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-200">
          <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Quer fazer parte desta comunidade internacional?
          </h4>
          <p className="text-gray-600 text-sm max-w-xl mx-auto mb-6">
            Acompanhe de perto as novidades, convenções e viagens que partilhamos com os nossos parceiros.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/formulario?tema=mundo-experiencias&pais=mz">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white font-semibold">
                Quero Receber Atualizações
              </Button>
            </Link>
            <a
              href="https://wa.me/258823056900"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-teal-300 text-teal-800 hover:bg-teal-50">
                Falar com Ofélia & José
              </Button>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
