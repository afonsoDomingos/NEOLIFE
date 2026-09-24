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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {isPt ? 'Antes de Continuar' : 'Before You Continue'}
          </h1>
          <p className="text-gray-600 text-xs max-w-xs mx-auto mb-3">
            {isPt
              ? 'Para proporcionar um atendimento personalizado, precisamos de alguns dados básicos.'
              : 'To provide personalized service, we need some basic information.'}
          </p>

          {/* Pillar Preview Card */}
          <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 00 11-18 0 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {isPt ? 'Você está acessando:' : 'You are accessing:'}
                </p>
                <p className="text-xs font-bold text-gray-900">
                  {pillarTitles[pillar as keyof typeof pillarTitles]}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-left">
              {pillarDescriptions[pillar as keyof typeof pillarDescriptions]}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-lg">
          
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
                    label={`${isPt ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'} (${country.dialCode})`}
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
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-3">
          <a
            href="/"
            className="text-xs font-semibold text-gray-600 hover:text-emerald-700 underline"
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