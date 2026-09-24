'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';
import {
  cellular4Supplements,
  healthSolutionPacks,
} from '@/data/health-solutions';

export const HealthSection: React.FC = () => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const {
    customHealthNeed,
    setCustomHealthNeed
  } = useSelection();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [needSaved, setNeedSaved] = useState(false);
  const [expandedSupplements, setExpandedSupplements] = useState<Set<number>>(new Set());
  const [expandedShake, setExpandedShake] = useState(false);
  const [expandedPacks, setExpandedPacks] = useState<Set<string>>(new Set());
  const [productLinks, setProductLinks] = useState<Record<string, { available: boolean; purchaseUrl: string | null; customMessage?: string }>>({});
  const [loadingLinks, setLoadingLinks] = useState<Set<string>>(new Set());
  const [dynamicProducts, setDynamicProducts] = useState<Record<string, any>>({});

  const categories = [
    { id: 'all', labelPt: 'Todos os Pacotes', labelEn: 'All Packs' },
    { id: 'weight', labelPt: 'Pequeno Almoço & Peso', labelEn: 'Breakfast & Weight' },
    { id: 'cell', labelPt: 'Nutrição Celular & Ómega-3', labelEn: 'Cellular & Omega-3' },
    { id: 'gender', labelPt: 'Homem, Mulher & Maternidade', labelEn: 'Men, Women & Mother' },
    { id: 'energy', labelPt: 'Energia & Foco Mental', labelEn: 'Energy & Mental Focus' },
    { id: 'joints', labelPt: 'Articulações & Mobilidade', labelEn: 'Joints & Mobility' },
    { id: 'digest', labelPt: 'Digestão & Programa Detox', labelEn: 'Digestion & Detox' },
    { id: 'immunity', labelPt: 'Imunidade PhytoDefence', labelEn: 'Immunity PhytoDefence' },
    { id: 'kids', labelPt: 'Crianças & Jovens', labelEn: 'Kids & Youth' },
  ];

  const [dynamicPacks, setDynamicPacks] = useState<Record<string, any>>({});
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Use dynamic packs if available, otherwise fall back to static
  const allPacks = Object.keys(dynamicPacks).length > 0 
    ? Object.values(dynamicPacks) as any[]
    : healthSolutionPacks;

  const filteredPacks =
    selectedCategory === 'all'
      ? allPacks
      : allPacks.filter((p) => p.category === selectedCategory);

  // Load dynamic product data from database
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        // Load product images
        const imagesResponse = await fetch('/api/admin/product-images');
        if (imagesResponse.ok) {
          const data = await imagesResponse.json();
          const productsMap: Record<string, any> = {};
          if (Array.isArray(data)) {
            data.forEach((img: any) => {
              if (!productsMap[img.productId] || img.featured) {
                productsMap[img.productId] = img;
              }
            });
          }
          setDynamicProducts(productsMap);
        }

        // Load dynamic packs from MongoDB
        const packsResponse = await fetch('/api/admin/health-products');
        if (packsResponse.ok) {
          const data = await packsResponse.json();
          const packsMap: Record<string, any> = {};
          if (Array.isArray(data)) {
            data.forEach((pack: any) => {
              packsMap[pack.id] = pack;
            });
          }
          setDynamicPacks(packsMap);
        }
      } catch (error) {
        console.error('Error loading dynamic data:', error);
      }
    };
    loadDynamicData();
  }, []);

  // Helper function to merge dynamic data with static data
  const getMergedPack = (pack: any) => {
    const dynamicImageData = dynamicProducts[pack.id];
    const dynamicPackData = dynamicPacks[pack.id];
    
    // If there's dynamic pack data, use it entirely
    if (dynamicPackData) {
      return {
        ...dynamicPackData,
        // Override with image from product-images if available
        image: dynamicImageData?.imageUrl || dynamicPackData.image,
      };
    }
    
    // Otherwise use static data with image override
    if (dynamicImageData) {
      return {
        ...pack,
        image: dynamicImageData.imageUrl || pack.image,
      };
    }
    
    return pack;
  };

  const getMergedSupplement = (supp: any, index: number) => {
    const supplementId = `supplement-${index}`;
    const dynamicData = dynamicProducts[supplementId];
    if (!dynamicData) return supp;
    
    return {
      ...supp,
      image: dynamicData.image || supp.image,
      name: dynamicData.name || supp.name,
      subtitlePt: dynamicData.subtitlePt || supp.subtitlePt,
      subtitleEn: dynamicData.subtitleEn || supp.subtitleEn,
      descPt: dynamicData.descPt || supp.descPt,
      descEn: dynamicData.descEn || supp.descEn,
      tag: dynamicData.tag || supp.tag,
    };
  };

  const handleSaveCustomNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHealthNeed.trim()) return;
    setNeedSaved(true);
    setTimeout(() => setNeedSaved(false), 5000);
  };

  const loadProductLink = async (productId: string) => {
    if (productLinks[productId]) return; // Já carregado
    if (typeof window === 'undefined') return; // Não carregar durante build estático

    setLoadingLinks(prev => new Set(prev).add(productId));
    try {
      const response = await fetch(`/api/product-links?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProductLinks(prev => ({ ...prev, [productId]: data }));
      }
    } catch (error) {
      console.error('Error loading product link:', error);
    } finally {
      setLoadingLinks(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const trackProductClick = async (productId: string, productType: 'pack' | 'supplement', productName: string) => {
    try {
      // Get campaign data from URL
      const searchParams = new URLSearchParams(window.location.search);
      const campaign = searchParams.get('campanha') || searchParams.get('campaign') || undefined;
      const source = searchParams.get('source') || searchParams.get('utm_source') || undefined;
      
      // Get country from selection context if available
      const country = typeof window !== 'undefined' ? localStorage.getItem('selectedCountry') : undefined;

      await fetch('/api/product-clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productType,
          productName,
          country,
          source,
          campaign,
        }),
      });
    } catch (error) {
      console.error('Error tracking product click:', error);
      // Don't block the user action if tracking fails
    }
  };

  return (
    <section id="saude" className="py-20 md:py-28 bg-white border-t border-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {isPt ? 'Pilar 01 • Soluções de Saúde Neolife' : 'Pillar 01 • Neolife Health Solutions'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cellular4Supplements.map((supp, index) => {
              const isExpanded = expandedSupplements.has(index);
              const mergedSupp = getMergedSupplement(supp, index);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 overflow-hidden"
                >
                  {/* Compact Header - Always Visible */}
                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedSupplements);
                      if (newExpanded.has(index)) {
                        newExpanded.delete(index);
                      } else {
                        newExpanded.add(index);
                      }
                      setExpandedSupplements(newExpanded);
                    }}
                    className="w-full p-4 text-left flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          0{index + 1}
                        </span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                          {mergedSupp.tag}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
                        {mergedSupp.name}
                      </h4>
                    </div>
                    <svg
                      className={`w-5 h-5 text-emerald-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expandable Content */}
                  <div
                    className={`px-4 pb-4 transition-all duration-300 ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    {mergedSupp.image && (
                      <div className="mb-3">
                        <img
                          src={mergedSupp.image}
                          alt={mergedSupp.name}
                          className="w-full h-32 object-cover rounded-lg border border-emerald-100"
                        />
                      </div>
                    )}
                    <p className="text-xs font-semibold text-emerald-700 mb-2">
                      {isPt ? mergedSupp.subtitlePt : mergedSupp.subtitleEn}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {isPt ? mergedSupp.descPt : mergedSupp.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 2.2 PROTEÍNA DIÁRIA — NEOLIFESHAKE ── */}
          <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs overflow-hidden">
            {/* Compact Header - Always Visible */}
            <button
              onClick={() => setExpandedShake(!expandedShake)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                  <span>{isPt ? 'Nutrição Diária Deliciosa' : 'Daily Wholesome Protein'}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  NeolifeShake • Proteína, Fibras & Vitaminas
                </h4>
              </div>
              <svg
                className={`w-6 h-6 text-emerald-600 transition-transform duration-300 ${expandedShake ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expandable Content */}
            <div
              className={`px-5 sm:p-6 pb-6 transition-all duration-300 ${
                expandedShake ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {isPt
                      ? 'A proteína é essencial para a manutenção dos músculos, tecidos, enzimas e hormonas. O NeolifeShake combina proteínas vegetais puras (soja e ervilha), fibras digestivas, 22 aminoácidos e 25 vitaminas e minerais com tecnologia de controlo glicémico.'
                      : 'Protein is vital for muscle tissue, enzymatic balance, and cellular repair. NeolifeShake delivers wholesome plant protein (soy & pea), dietary fibers, 22 amino acids, and 25 vitamins & minerals.'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-emerald-800">
                    <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Saciedade Saudável</span>
                    <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Massa Muscular</span>
                    <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Controlo Glicémico</span>
                    <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Deliciosos Sabores</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                  <a 
                    href="#catalogo-pacotes" 
                    className="w-full"
                    onClick={(e) => {
                      trackProductClick('neolife-shake-cta', 'pack', 'NeolifeShake CTA');
                    }}
                  >
                    <Button size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold whitespace-nowrap">
                      {isPt ? 'Ver Packs com NeolifeShake ↓' : 'See Packs with NeolifeShake ↓'}
                    </Button>
                  </a>
                  <Link href="/formulario?tema=produtos&pais=mz-pt" className="w-full">
                    <Button variant="outline" size="sm" className="w-full border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold whitespace-nowrap">
                      {isPt ? 'Pedir Informações' : 'Request Info'}
                    </Button>
                  </Link>
                </div>
              </div>
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

          {/* Packs Grid - Simplified: Only titles, expandable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPacks.map((pack) => {
              const isExpanded = expandedPacks.has(pack.id);
              const linkData = productLinks[pack.id];
              const isLoading = loadingLinks.has(pack.id);
              const mergedPack = getMergedPack(pack);

              // Carregar link se ainda não foi carregado
              if (!linkData && !isLoading) {
                loadProductLink(pack.id);
              }

              return (
                <div
                  key={pack.id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Compact Header - Always Visible */}
                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedPacks);
                      if (newExpanded.has(pack.id)) {
                        newExpanded.delete(pack.id);
                      } else {
                        newExpanded.add(pack.id);
                      }
                      setExpandedPacks(newExpanded);
                    }}
                    className="w-full p-5 text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {mergedPack.image && (
                        <div 
                          className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200 cursor-pointer hover:border-emerald-400 transition-colors"
                          onClick={() => setFullscreenImage(mergedPack.image)}
                        >
                          <img
                            src={mergedPack.image}
                            alt={isPt ? mergedPack.titlePt : mergedPack.titleEn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {isPt ? mergedPack.badgePt : mergedPack.badgeEn}
                          </span>
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                            {isPt ? mergedPack.tagPt : mergedPack.tagEn}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
                          {isPt ? mergedPack.titlePt : mergedPack.titleEn}
                        </h4>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-emerald-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} shrink-0`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expandable Content */}
                  <div
                    className={`px-5 pb-5 transition-all duration-300 ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {isPt ? mergedPack.descPt : mergedPack.descEn}
                    </p>

                    {/* Included Products List */}
                    <div className="mb-4 bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        {isPt ? 'O Pack Inclui:' : 'Pack Includes:'}
                      </p>
                      <ul className="space-y-1">
                        {(isPt ? mergedPack.productsPt : mergedPack.productsEn).map((prod: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-800">
                            <span className="text-emerald-600 font-bold shrink-0">•</span>
                            <span>{prod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Benefits */}
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                        {isPt ? 'Benefícios Principais:' : 'Key Benefits:'}
                      </p>
                      <ul className="space-y-1">
                        {(isPt ? mergedPack.benefitsPt : mergedPack.benefitsEn).slice(0, 3).map((ben: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Purchase Button */}
                    <div className="pt-3 border-t border-gray-100">
                      {isLoading ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200 flex items-center justify-center gap-2"
                        >
                          <span>{isPt ? 'Carregando...' : 'Loading...'}</span>
                        </button>
                      ) : !linkData || !linkData.available ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <span>
                            {linkData?.customMessage || (isPt ? 'Produto Indisponível' : 'Product Unavailable')}
                          </span>
                        </button>
                      ) : (
                        <a
                          href={linkData.purchaseUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                          onClick={() => trackProductClick(pack.id, 'pack', mergedPack.titlePt)}
                        >
                          <button
                            type="button"
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-300 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            <span>{isPt ? 'Comprar' : 'Buy'}</span>
                            <span>➔</span>
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

            <form onSubmit={handleSaveCustomNeed} className="space-y-4">
              <textarea
                rows={3}
                value={customHealthNeed}
                onChange={(e) => setCustomHealthNeed(e.target.value)}
                placeholder={
                  isPt
                    ? 'Escreva aqui a sua necessidade, dúvida de saúde ou produto que procura (fica salvo automaticamente)...'
                    : 'Write your specific wellness need, health question, or product inquiry here (saved automatically)...'
                }
                className="w-full text-sm p-4 rounded-2xl bg-white/10 border border-emerald-400/40 text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all shadow-inner"
              />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto py-3 px-8 rounded-xl text-sm font-bold bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {needSaved ? (
                    <span>{isPt ? 'Guardado no Seu Pedido!' : 'Saved to Your Selection!'}</span>
                  ) : (
                    <span>{isPt ? 'Confirmar Pedido Especial' : 'Save Special Request'}</span>
                  )}
                </button>

                <Link
                  href="/formulario?origem=outras-solucoes"
                  className="w-full sm:w-auto py-3 px-6 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all text-center"
                >
                  {isPt ? 'Concluir no Formulário ➔' : 'Complete in Form ➔'}
                </Link>

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

        {/* Fullscreen Image Modal */}
        {fullscreenImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setFullscreenImage(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImage(null);
                }}
                className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={fullscreenImage}
                alt="Fullscreen product image"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
