'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { getCountryById, getAllowedDialCodes, countries } from '@/data/countries';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Country } from '@/types';

function GateContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/saude';
  const pillar = searchParams.get('pillar') || 'saude';

  const { language } = useLanguage();
  const isPt = language === 'pt';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [selectedCountryId, setSelectedCountryId] = useState('mz-pt');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [copiedWA, setCopiedWA] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const totalSteps = 3;

  const country: Country = getCountryById(selectedCountryId) || getCountryById('mz-pt') || {
    id: 'mz-pt',
    name: 'Moçambique (Português)',
    code: 'MZ',
    flag: '🇲🇿',
    dialCode: '+258',
    available: true,
  };

  // Auto-detect user location and select country
  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        // Try to get country from timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Map timezones to countries
        const timezoneToCountry: Record<string, string> = {
          'Africa/Maputo': 'mz-pt',
          'Africa/Johannesburg': 'za',
          'America/New_York': 'us-en',
          'America/Los_Angeles': 'us-en',
          'America/Chicago': 'us-en',
          'America/Toronto': 'ca-en',
          'America/Vancouver': 'ca-en',
          'Europe/London': 'gb',
          'Europe/Paris': 'fr',
          'Europe/Berlin': 'de',
          'Europe/Madrid': 'es',
          'Europe/Rome': 'it',
          'Asia/Tokyo': 'jp',
          'Asia/Singapore': 'sg',
          'Asia/Manila': 'ph',
          'Australia/Sydney': 'au',
          'Pacific/Auckland': 'nz',
        };

        const detectedCountryId = timezoneToCountry[timezone];
        
        if (detectedCountryId) {
          const detectedCountry = getCountryById(detectedCountryId);
          if (detectedCountry && detectedCountry.available) {
            setSelectedCountryId(detectedCountryId);
            // Also update phone dial code
            if (detectedCountry.dialCode) {
              setFormData(prev => ({ ...prev, phone: `${detectedCountry.dialCode} ` }));
            }
          }
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to default country
      } finally {
        setIsDetectingLocation(false);
      }
    };

    detectUserCountry();
  }, []);

  const pillarTitles = {
    saude: isPt ? 'Soluções de Saúde' : 'Health Solutions',
    business: isPt ? 'Oportunidade de Negócio' : 'Business Opportunity',
    experiencias: isPt ? 'Experiências & Viagens' : 'Experiences & Travel',
  };

  const pillarDescriptions = {
    saude: isPt
      ? 'Explore suplementos com base científica, produtos de higiene pessoal e soluções de limpeza ecológica.'
      : 'Discover science-backed supplements, personal care, and eco-friendly home cleaning solutions.',
    business: isPt
      ? 'Conheça o modelo passo a passo, veja os vídeos explicativos e selecione os seus objetivos de negócio.'
      : 'Understand the business model step by step, watch explanatory videos, and select your business goals.',
    experiencias: isPt
      ? 'Descubra viagens exclusivas, reconhecimento global e experiências de comunidade internacional.'
      : 'Discover exclusive travel, global recognition, and international community experiences.',
  };

  const pillarBackgrounds: Record<string, string> = {
    saude: '/images/sections/fundo-nutricao-celular.jpg',
    business: '/images/sections/fundo-business-mentoria.jpg',
    experiencias: '/images/sections/pilar-experiencias.jpg',
  };
  const bgImage = pillarBackgrounds[pillar] || '/images/sections/fundo-nutricao-celular.jpg';

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isPhoneFromAllowedCountry = (phone: string): boolean => {
    const allowedCodes = getAllowedDialCodes();
    const cleaned = phone.trim().replace(/\s+/g, '');
    return allowedCodes.some((code) => cleaned.startsWith(code));
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const copyToClipboard = async (text: string, type: 'wa' | 'email') => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      if (type === 'wa') {
        setCopiedWA(true);
        setTimeout(() => setCopiedWA(false), 2200);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = isPt ? 'Nome é obrigatório' : 'Name is required';
      }
    }

    if (step === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = isPt ? 'Telefone é obrigatório' : 'Phone is required';
      } else if (!isPhoneFromAllowedCountry(formData.phone)) {
        newErrors.phone = isPt
          ? `O número deve começar com o indicativo do seu país (ex: ${country.dialCode}).`
          : `Phone number must start with country dial code (e.g. ${country.dialCode}).`;
      }

      if (!formData.email.trim()) {
        newErrors.email = isPt ? 'E-mail é obrigatório' : 'Email is required';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = isPt ? 'E-mail inválido' : 'Invalid email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    return validateStep(1) && validateStep(2);
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Save to leads API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountryId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          theme: `gate-${pillar}`,
          source: 'website-gate',
          notes: `Usuário acessou o gate para o pilar: ${pillar}`,
        }),
      });

      if (response.ok) {
        // Save gate completion to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('neolife_gate_completed', 'true');
          localStorage.setItem('neolife_gate_timestamp', Date.now().toString());
          localStorage.setItem('neolife_gate_email', formData.email);
          localStorage.setItem('neolife_gate_name', formData.name);
          localStorage.setItem('neolife_gate_phone', formData.phone);
          localStorage.setItem('neolife_gate_country', selectedCountryId);
        }

        setSubmitSuccess(true);
        
        // Redirect to intro page after success
        setTimeout(() => {
          const introUrl = `/intro?pillar=${pillar}&redirect=${encodeURIComponent(redirectTo)}`;
          window.location.href = introUrl;
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao submeter formulário. Por favor, tente novamente.');
      }
    } catch (error: any) {
      console.error('Error submitting gate form:', error);
      setErrors({ submit: error.message || 'Erro ao enviar formulário. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] py-12 flex items-center justify-center p-4 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgImage}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/92 via-emerald-950/85 to-emerald-950/95" />
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPt ? 'Acesso Liberado!' : 'Access Granted!'}
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            {isPt
              ? 'Redirecionando para o conteúdo...'
              : 'Redirecting to content...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-10 sm:py-16 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Multilayer Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/92 via-emerald-950/85 to-emerald-950/95" />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30 shadow-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            NeoLife
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
            {isPt ? 'Antes de Continuar' : 'Before You Continue'}
          </h1>
          <p className="text-emerald-100/90 text-xs max-w-xs mx-auto mb-3 drop-shadow">
            {isPt
              ? 'Para proporcionar um atendimento personalizado, precisamos de alguns dados básicos.'
              : 'To provide personalized service, we need some basic information.'}
          </p>

          {/* Pillar Preview Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-white/60 shadow-xl mb-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 00 11-18 0 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left min-w-0">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  {isPt ? 'Você está acessando:' : 'You are accessing:'}
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {pillarTitles[pillar as keyof typeof pillarTitles]}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {pillarDescriptions[pillar as keyof typeof pillarDescriptions]}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/98 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/70 shadow-2xl">
          
          {/* Progress Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                    step === currentStep
                      ? 'bg-emerald-600 text-white scale-110'
                      : step < currentStep
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-1 mx-1 rounded transition-all ${
                      step < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">
                {isPt ? `Passo ${currentStep} de ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
              </p>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (currentStep < totalSteps) {
              handleNextStep();
            } else {
              handleSubmit(e);
            }
          }} className="space-y-3">
            
            {/* Step 1: Country & Name */}
            {currentStep === 1 && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isPt ? 'País de Residência' : 'Country of Residence'}
                  </label>
                  <select
                    value={selectedCountryId}
                    onChange={(e) => {
                      setSelectedCountryId(e.target.value);
                      const newC = getCountryById(e.target.value);
                      if (newC && newC.dialCode && !formData.phone.startsWith(newC.dialCode)) {
                        setFormData((prev) => ({ ...prev, phone: `${newC.dialCode} ` }));
                      }
                    }}
                    disabled={isDetectingLocation}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDetectingLocation ? (
                      <option value="">
                        {isPt ? 'Detectando localização...' : 'Detecting location...'}
                      </option>
                    ) : (
                      countries.filter((c) => c.available).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.name} ({c.dialCode})
                        </option>
                      ))
                    )}
                  </select>
                  {isDetectingLocation && (
                    <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isPt ? 'Detectando seu país automaticamente...' : 'Automatically detecting your country...'}
                    </p>
                  )}
                </div>

                <Input
                  label={isPt ? 'Nome Completo' : 'Full Name'}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={isPt ? 'Digite o seu nome completo' : 'Enter your full name'}
                  error={errors.name}
                  required
                  inputSize="sm"
                />
              </div>
            )}

            {/* Step 2: Phone & Email */}
            {currentStep === 2 && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <Input
                    label={`${isPt ? 'WhatsApp' : 'WhatsApp'} (${country.dialCode})`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={`${country.dialCode} 84 000 0000`}
                    error={errors.phone}
                    required
                    inputSize="sm"
                  />
                  {!errors.phone && (
                    <p className="mt-1 text-xs text-gray-500">
                      {isPt ? 'Indicativo oficial:' : 'Dial code:'} <span className="font-mono font-bold text-emerald-800">{country.dialCode}</span>
                    </p>
                  )}
                </div>

                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={isPt ? 'exemplo@email.com' : 'example@email.com'}
                  error={errors.email}
                  required
                  inputSize="sm"
                />
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <h3 className="text-xs font-bold text-emerald-900 mb-2">
                    {isPt ? 'Confirme seus dados:' : 'Confirm your details:'}
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isPt ? 'Nome:' : 'Name:'}</span>
                      <span className="font-semibold text-gray-900">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isPt ? 'País:' : 'Country:'}</span>
                      <span className="font-semibold text-gray-900">{country.flag} {country.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isPt ? 'Telefone:' : 'Phone:'}</span>
                      <span className="font-semibold text-gray-900">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">E-mail:</span>
                      <span className="font-semibold text-gray-900">{formData.email}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  {isPt ? 'Ao continuar, você concorda em receber informações da NeoLife.' : 'By continuing, you agree to receive information from NeoLife.'}
                </p>
              </div>
            )}

            {errors.submit && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {errors.submit}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-2 pt-1">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 rounded-lg text-xs"
                >
                  {isPt ? '← Voltar' : '← Back'}
                </Button>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-2 rounded-lg shadow-md text-xs ${
                  currentStep === 1 ? 'ml-auto' : ''
                }`}
              >
                {isSubmitting
                  ? (isPt ? 'A Processar...' : 'Processing...')
                  : currentStep === totalSteps
                  ? (isPt ? 'Concluir ➔' : 'Complete ➔')
                  : (isPt ? 'Próximo →' : 'Next →')}
              </Button>
            </div>

            <p className="text-center pt-1 text-xs text-gray-500">
              {isPt ? 'Seus dados estão seguros e não serão compartilhados.' : 'Your data is safe and will not be shared.'}
            </p>

            {/* Manual Direct Contact Options with WhatsApp & Email */}
            {(currentStep === 3 || errors.submit) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-200/80">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <p className="text-xs font-bold text-emerald-950">
                      {isPt ? 'Contacto direto com Ofélio & José Machado:' : 'Direct contact with Ofélio & José Machado:'}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-2.5 leading-snug">
                    {isPt
                      ? 'Pode copiar o WhatsApp ou o e-mail abaixo para enviar os seus dados diretamente de forma manual:'
                      : 'You can copy the WhatsApp number or email below to send your details directly and manually:'}
                  </p>

                  <div className="space-y-2">
                    {/* WhatsApp */}
                    <div className="bg-white rounded-lg p-2.5 border border-emerald-100 flex items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2z"/>
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block leading-none mb-0.5">WhatsApp</span>
                          <span className="text-xs font-bold text-gray-900 select-all block truncate">+258 82 305 6900</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard('+258 82 305 6900', 'wa')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                            copiedWA
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 border border-emerald-200'
                          }`}
                          title={isPt ? 'Copiar número de WhatsApp' : 'Copy WhatsApp number'}
                        >
                          {copiedWA ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              <span>{isPt ? 'Copiado!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                              </svg>
                              <span>{isPt ? 'Copiar' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                        <a
                          href={`https://wa.me/258823056900?text=${encodeURIComponent(
                            isPt
                              ? `Olá Ofélio e José Machado, os meus dados são:\nNome: ${formData.name || '---'}\nTelefone: ${formData.phone || '---'}\nEmail: ${formData.email || '---'}\nInteresse: ${pillarTitles[pillar as keyof typeof pillarTitles] || 'NeoLife'}`
                              : `Hello Ofélio and José Machado, here are my details:\nName: ${formData.name || '---'}\nPhone: ${formData.phone || '---'}\nEmail: ${formData.email || '---'}\nInterest: ${pillarTitles[pillar as keyof typeof pillarTitles] || 'NeoLife'}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          title={isPt ? 'Abrir no WhatsApp' : 'Open in WhatsApp'}
                        >
                          {isPt ? 'Abrir ➔' : 'Open ➔'}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="bg-white rounded-lg p-2.5 border border-emerald-100 flex items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block leading-none mb-0.5">E-mail</span>
                          <span className="text-xs font-bold text-gray-900 select-all block truncate">jmachado@intra.co.mz</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard('jmachado@intra.co.mz', 'email')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                            copiedEmail
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
                          }`}
                          title={isPt ? 'Copiar e-mail' : 'Copy email'}
                        >
                          {copiedEmail ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              <span>{isPt ? 'Copiado!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                              </svg>
                              <span>{isPt ? 'Copiar' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                        <a
                          href={`mailto:jmachado@intra.co.mz?subject=${encodeURIComponent(
                            isPt ? `Contacto NeoLife - ${formData.name || 'Interesse'}` : `NeoLife Contact - ${formData.name || 'Interest'}`
                          )}&body=${encodeURIComponent(
                            isPt
                              ? `Olá Ofélio e José Machado,\n\nNome: ${formData.name || '---'}\nTelefone: ${formData.phone || '---'}\nEmail: ${formData.email || '---'}\nPaís: ${country.name}\nInteresse: ${pillarTitles[pillar as keyof typeof pillarTitles] || 'NeoLife'}`
                              : `Hello Ofélio and José Machado,\n\nName: ${formData.name || '---'}\nPhone: ${formData.phone || '---'}\nEmail: ${formData.email || '---'}\nCountry: ${country.name}\nInterest: ${pillarTitles[pillar as keyof typeof pillarTitles] || 'NeoLife'}`
                          )}`}
                          className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                          title={isPt ? 'Enviar e-mail' : 'Send email'}
                        >
                          {isPt ? 'Enviar ➔' : 'Email ➔'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-3">
          <a
            href="/"
            className="text-xs font-semibold text-emerald-200 hover:text-white transition-colors underline drop-shadow"
          >
            {isPt ? '← Voltar para a página inicial' : '← Back to home page'}
          </a>
        </div>

      </div>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">A carregar...</p>
          </div>
        </div>
      }
    >
      <GateContent />
    </Suspense>
  );
}