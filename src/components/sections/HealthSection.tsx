'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import {
  cellular4Supplements,
  healthSolutionPacks,
  HealthSolutionPack,
} from '@/data/health-solutions';

export const HealthSection: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePackModal, setActivePackModal] = useState<HealthSolutionPack | null>(null);
  const [customNeed, setCustomNeed] = useState('');
  const [needSent, setNeedSent] = useState(false);

  const categories = [
    { id: 'all', labelPt: '🌟 Todos os Pacotes', labelEn: '🌟 All Packs' },
    { id: 'weight', labelPt: '⚖️ Pequeno Almoço & Peso', labelEn: '⚖️ Breakfast & Weight' },
    { id: 'cell', labelPt: '🧬 Nutrição Celular & Ómega-3', labelEn: '🧬 Cellular & Omega-3' },
    { id: 'gender', labelPt: '👨🌸 Homem, Mulher & Maternidade', labelEn: '👨🌸 Men, Women & Mother' },
    { id: 'energy', labelPt: '⚡ Energia & Foco Mental', labelEn: '⚡ Energy & Mental Focus' },
    { id: 'joints', labelPt: '🦴 Articulações & Mobilidade', labelEn: '🦴 Joints & Mobility' },
    { id: 'digest', labelPt: '🌿 Digestão & Programa Detox', labelEn: '🌿 Digestion & Detox' },
    { id: 'immunity', labelPt: '🛡️ Imunidade PhytoDefence', labelEn: '🛡️ Immunity PhytoDefence' },
    { id: 'kids', labelPt: '👧 Crianças & Jovens', labelEn: '👧 Kids & Youth' },
  ];

  const filteredPacks =
    selectedCategory === 'all'
      ? healthSolutionPacks
      : healthSolutionPacks.filter((p) => p.category === selectedCategory);

  const handleSendCustomNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNeed.trim()) return;

    const params = new URLSearchParams();
    params.set('tema', 'outras-solucoes');
    params.set('pais', 'mz');
    params.set('notas', customNeed.trim());

    setNeedSent(true);
    setTimeout(() => {
      window.location.href = `/formulario?${params.toString()}`;
    }, 600);
  };

  const getWhatsAppLink = (packTitle: string) => {
    const text = isPt
      ? `Olá José e Ofélia, tenho interesse no "${packTitle}" da NeoLife. Gostaria de saber mais informações e como encomendar.`
      : `Hello José and Ofélia, I am interested in the "${packTitle}" from NeoLife. I would like more details on how to order.`;
    return `https://wa.me/258823056900?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="saude" className="py-20 md:py-28 bg-white border-t border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {isPt ? 'Pilar 01 • Soluções de Saúde NeoLife' : 'Pillar 01 • NeoLife Health Solutions'}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {isPt ? 'Nutrição Celular & Soluções Completas' : 'Cellular Nutrition & Complete Solutions'}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {isPt
              ? 'Organização simples para que cada pessoa consiga identificar rapidamente aquilo que procura para o seu bem-estar, família e lar.'
              : 'A simple, intuitive layout so everyone can immediately find the right solution for their body, family, and lifestyle.'}
          </p>
        </div>

        {/* ── 2.1 NUTRIÇÃO PARA A CÉLULA: 4 SUPLEMENTOS ESSENCIAIS ── */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 rounded-3xl p-6 sm:p-10 border border-emerald-100 mb-16 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
              {isPt ? 'Fundamento Biológico' : 'Biological Foundation'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3 mb-3">
              {isPt ? 'Nutrição para a Célula: 4 Suplementos Essenciais' : 'Cellular Nutrition: 4 Foundational Supplements'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {isPt
                ? 'O nosso corpo é formado por mais de 73 triliões de células. A alimentação moderna muitas vezes não fornece o que elas necessitam diariamente. Cuidar das células hoje é construir uma vida mais saudável amanhã.'
                : 'Our body is made of over 73 trillion cells. Modern diets often lack what they require daily. Nourishing your cells today builds a healthier tomorrow.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cellular4Supplements.map((supp, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-emerald-100/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      0{index + 1}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {supp.tag}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1 leading-snug">
                    {supp.name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-700 mb-3">
                    {isPt ? supp.subtitlePt : supp.subtitleEn}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isPt ? supp.descPt : supp.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── 2.2 PROTEÍNA DIÁRIA — NEOLIFESHAKE ── */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full mb-3">
                <span>🥛</span>
                <span>{isPt ? 'Nutrição Diária Deliciosa' : 'Daily Wholesome Protein'}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                NeoLifeShake • Proteína, Fibras & Vitaminas
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {isPt
                  ? 'A proteína é essencial para a manutenção dos músculos, tecidos, enzimas e hormonas. O NeoLifeShake combina proteínas vegetais puras (soja e ervilha), fibras digestivas, 22 aminoácidos e 25 vitaminas e minerais com tecnologia de controlo glicémico.'
                  : 'Protein is vital for muscle tissue, enzymatic balance, and cellular repair. NeoLifeShake delivers wholesome plant protein (soy & pea), dietary fibers, 22 amino acids, and 25 vitamins & minerals.'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-800">
                <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">✓ Saciedade Saudável</span>
                <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">✓ Massa Muscular</span>
                <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">✓ Controlo Glicémico</span>
                <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">✓ Deliciosos Sabores</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <a href="#catalogo-pacotes" className="w-full">
                <Button size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold whitespace-nowrap">
                  {isPt ? 'Ver Packs com NeoLifeShake ↓' : 'See Packs with NeoLifeShake ↓'}
                </Button>
              </a>
              <Link href="/formulario?tema=produtos&pais=mz" className="w-full">
                <Button variant="outline" size="sm" className="w-full border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold whitespace-nowrap">
                  {isPt ? 'Pedir Informações' : 'Request Info'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2.3 CATÁLOGO DE PACOTES DE SAÚDE SEGMENTADOS ── */}
        <div id="catalogo-pacotes" className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {isPt
                ? 'Pacotes de Saúde para Diferentes Necessidades & Orçamentos'
                : 'Health Packs for Different Needs & Budgets'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {isPt
                ? 'Cada pessoa tem objetivos e rotinas diferentes. Escolha de acordo com o que precisa, o que pretende alcançar e quanto deseja investir.'
                : 'Every individual has unique wellness goals and routines. Explore and choose according to your exact priorities.'}
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-sm scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isPt ? cat.labelPt : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Packs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 hover:border-emerald-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {isPt ? pack.badgePt : pack.badgeEn}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      {isPt ? pack.tagPt : pack.tagEn}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors leading-snug">
                    {isPt ? pack.titlePt : pack.titleEn}
                  </h4>

                  <p className="text-xs text-gray-600 leading-relaxed mb-5">
                    {isPt ? pack.descPt : pack.descEn}
                  </p>

                  {/* Included Products List */}
                  <div className="mb-5 bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {isPt ? 'O Pack Inclui:' : 'Pack Includes:'}
                    </p>
                    <ul className="space-y-1.5">
                      {(isPt ? pack.productsPt : pack.productsEn).map((prod, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-800">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{prod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Benefits */}
                  <div className="mb-6">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                      {isPt ? 'Benefícios Principais:' : 'Key Benefits:'}
                    </p>
                    <ul className="space-y-1">
                      {(isPt ? pack.benefitsPt : pack.benefitsEn).slice(0, 3).map((ben, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePackModal(pack)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold border border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition-colors text-center"
                    >
                      {isPt ? 'Ver Detalhes' : 'View Details'}
                    </button>

                    <a
                      href={getWhatsAppLink(isPt ? pack.titlePt : pack.titleEn)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors text-center shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>{isPt ? 'Quero Este' : 'Order Pack'}</span>
                      <span>➔</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2.4 OUTRAS SOLUÇÕES (Caixa Aberta Interativa) ── */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-850 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-400 shadow-xl max-w-4xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500 text-emerald-950 uppercase tracking-wider mb-4">
              {isPt ? 'Atendimento Personalizado' : 'Custom Consultation'}
            </span>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {isPt ? 'Procura Outras Soluções de Saúde?' : 'Looking for Other Health Solutions?'}
            </h4>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6 italic">
              {isPt
                ? '“Diz-nos o que procuras ou qual é a tua necessidade, e entraremos em contacto contigo para perceber melhor como podemos ajudar.”'
                : '“Tell us what you are looking for or what your specific need is, and we will get in touch to find the best option for you.”'}
            </p>

            <form onSubmit={handleSendCustomNeed} className="space-y-4">
              <textarea
                rows={3}
                value={customNeed}
                onChange={(e) => setCustomNeed(e.target.value)}
                placeholder={
                  isPt
                    ? 'Escreva aqui a sua necessidade, dúvida de saúde ou produto que procura...'
                    : 'Write your specific wellness need, health question, or product inquiry here...'
                }
                className="w-full text-sm p-4 rounded-2xl bg-white/10 border border-emerald-400/40 text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all shadow-inner"
                required
              />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="submit"
                  disabled={needSent}
                  className="w-full sm:w-auto py-3 px-8 rounded-xl text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {needSent ? (
                    <span>{isPt ? 'Mensagem Recebida! A encaminhar...' : 'Message Received! Redirecting...'}</span>
                  ) : (
                    <>
                      <span>{isPt ? 'Enviar a Minha Necessidade' : 'Submit My Request'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </>
                  )}
                </button>

                <a
                  href="https://wa.me/258823056900"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-6 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all text-center"
                >
                  {isPt ? 'Falar no WhatsApp Directo' : 'Direct WhatsApp Chat'}
                </a>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* ── MODAL DE DETALHES DO PACK ── */}
      {activePackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActivePackModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isPt ? activePackModal.badgePt : activePackModal.badgeEn}
            </span>

            <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-2">
              {isPt ? activePackModal.titlePt : activePackModal.titleEn}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {isPt ? activePackModal.descPt : activePackModal.descEn}
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/70">
                <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  {isPt ? 'Produtos Incluídos Neste Pack:' : 'Products Included in This Pack:'}
                </h5>
                <ul className="space-y-1.5">
                  {(isPt ? activePackModal.productsPt : activePackModal.productsEn).map((prod, i) => (
                    <li key={i} className="text-xs text-gray-700 flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{prod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                  {isPt ? 'Todos os Benefícios:' : 'Full Benefits:'}
                </h5>
                <ul className="space-y-1.5">
                  {(isPt ? activePackModal.benefitsPt : activePackModal.benefitsEn).map((ben, i) => (
                    <li key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activePackModal.notePt && (
                <p className="text-xs text-gray-500 italic border-l-2 border-emerald-400 pl-3">
                  {isPt ? activePackModal.notePt : activePackModal.noteEn}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
              <a
                href={getWhatsAppLink(isPt ? activePackModal.titlePt : activePackModal.titleEn)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-6 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white text-center shadow-md transition-all"
              >
                {isPt ? 'Pedir Informações no WhatsApp' : 'Order via WhatsApp'}
              </a>

              <Link
                href={`/formulario?tema=saude&pais=mz&pack=${activePackModal.slug}`}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl text-xs font-bold border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-center transition-all"
              >
                {isPt ? 'Preencher Formulário' : 'Fill Form'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
