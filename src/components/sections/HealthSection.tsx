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
  const [productImages, setProductImages] = useState<Record<string, any[]>>({});

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
          const imagesMap: Record<string, any[]> = {};
          if (Array.isArray(data)) {
            data.forEach((img: any) => {
              // Store all images per product
              if (!imagesMap[img.productId]) {
                imagesMap[img.productId] = [];
              }
              imagesMap[img.productId].push(img);

              // Keep featured as main for backward compatibility
              if (!productsMap[img.productId] || img.featured) {
                productsMap[img.productId] = img;
              }
            });
          }
          setDynamicProducts(productsMap);
          setProductImages(imagesMap);
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
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 mb-16 overflow-hidden shadow-2xl border border-emerald-500/30">
          {/* Background Image with Multilayer Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/sections/fundo-nutricao-celular.jpg')" }}
          >
            {/* Dark gradient preserving the living cells while keeping high contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/92 via-emerald-950/85 to-emerald-950/95" />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300 bg-emerald-900/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-400/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isPt ? 'Fundamento Biológico' : 'Biological Foundation'}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-3 tracking-tight drop-shadow-md">
                {isPt ? 'Nutrição para a Célula: 4 Suplementos Essenciais' : 'Cellular Nutrition: 4 Foundational Supplements'}
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto drop-shadow">
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
                  className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg hover:shadow-2xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
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
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
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

          {/* Packs Grid - Modern, Attractive Cards with Large Hero Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                  className="group bg-white rounded-3xl border border-gray-200 hover:border-emerald-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Large Prominent Hero Image Container */}
                  <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-gray-50/90 via-white to-emerald-50/20 p-5 flex items-center justify-center overflow-hidden border-b border-gray-100">
                    {mergedPack.image ? (
                      <div
                        className="relative w-full h-full flex items-center justify-center cursor-pointer"
                        onClick={() => setFullscreenImage(mergedPack.image)}
                      >
                        <img
                          src={mergedPack.image}
                          alt={isPt ? mergedPack.titlePt : mergedPack.titleEn}
                          className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover Zoom Icon */}
                        <div
                          className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 group-hover:text-emerald-700 transition-colors"
                          title={isPt ? 'Ampliar imagem' : 'Enlarge image'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-emerald-800/70 uppercase tracking-wider">NeoLife Solução</span>
                      </div>
                    )}

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[75%] pointer-events-none">
                      <span className="text-[10px] font-extrabold text-emerald-950 bg-emerald-100/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-300 shadow-xs uppercase tracking-wider">
                        {isPt ? mergedPack.badgePt : mergedPack.badgeEn}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-gray-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-gray-200 shadow-xs uppercase tracking-wider">
                        {isPt ? mergedPack.tagPt : mergedPack.tagEn}
                      </span>
                      {productImages[pack.id] && productImages[pack.id].length > 1 && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold rounded-full px-2 py-0.5 shadow-xs">
                          +{productImages[pack.id].length}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="text-xl font-extrabold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors mb-2">
                      {isPt ? mergedPack.titlePt : mergedPack.titleEn}
                    </h4>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {isPt ? mergedPack.descPt : mergedPack.descEn}
                    </p>

                    {/* What is Included Box */}
                    <div className="mb-4 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {isPt ? 'O Pack Inclui:' : 'Pack Includes:'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const newExpanded = new Set(expandedPacks);
                            if (newExpanded.has(pack.id)) {
                              newExpanded.delete(pack.id);
                            } else {
                              newExpanded.add(pack.id);
                            }
                            setExpandedPacks(newExpanded);
                          }}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
                        >
                          <span>{isExpanded ? (isPt ? 'Menos detalhes ▲' : 'Less details ▲') : (isPt ? 'Ver benefícios ▼' : 'View benefits ▼')}</span>
                        </button>
                      </div>
                      <ul className="space-y-1.5">
                        {(isPt ? mergedPack.productsPt : mergedPack.productsEn).map((prod: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-800 font-medium">
                            <span className="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{prod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expandable Details (Benefits & Additional Photos) */}
                    {isExpanded && (
                      <div className="space-y-4 mb-4 pt-1 border-t border-gray-100">
                        {/* Key Benefits */}
                        <div>
                          <p className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-2">
                            {isPt ? 'Benefícios Principais:' : 'Key Benefits:'}
                          </p>
                          <ul className="space-y-1.5">
                            {(isPt ? mergedPack.benefitsPt : mergedPack.benefitsEn).map((ben: string, i: number) => (
                              <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Extra Gallery Photos */}
                        {productImages[pack.id] && productImages[pack.id].length > 1 && (
                          <div>
                            <p className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                              {isPt ? 'Galeria de Fotos:' : 'Photo Gallery:'}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {productImages[pack.id].map((img: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 hover:border-emerald-500 cursor-pointer shadow-xs transition-all"
                                  onClick={() => setFullscreenImage(img.imageUrl)}
                                >
                                  <img
                                    src={img.imageUrl}
                                    alt={img.altText || `${isPt ? mergedPack.titlePt : mergedPack.titleEn} ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA Purchase / Order Button */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      {isLoading ? (
                        <button
                          disabled
                          className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200 flex items-center justify-center gap-2"
                        >
                          <span>{isPt ? 'Carregando...' : 'Loading...'}</span>
                        </button>
                      ) : linkData?.available && linkData.purchaseUrl ? (
                        <a
                          href={linkData.purchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                          onClick={() => trackProductClick(pack.id, 'pack', mergedPack.titlePt)}
                        >
                          <button
                            type="button"
                            className="w-full py-3.5 px-5 rounded-2xl text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                          >
                            <span>{isPt ? 'Comprar Agora' : 'Buy Now'}</span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">➔</span>
                          </button>
                        </a>
                      ) : (
                        <a
                          href={`https://wa.me/258823056900?text=${encodeURIComponent(
                            isPt
                              ? `Olá José e Ofélia, tenho interesse no ${mergedPack.titlePt} e gostaria de saber o valor e como encomendar.`
                              : `Hello, I am interested in ${mergedPack.titleEn} and would like to know the price and ordering details.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                          onClick={() => trackProductClick(pack.id, 'pack', mergedPack.titlePt)}
                        >
                          <button
                            type="button"
                            className="w-full py-3.5 px-5 rounded-2xl text-sm font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                          >
                            <span>{isPt ? 'Consultar / Encomendar' : 'Inquire / Order'}</span>
                            <span className="group-hover/btn:translate-x-1 transition-transform">➔</span>
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
