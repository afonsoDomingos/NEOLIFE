'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { getAvailableCountries, getCountryById } from '@/data/countries';
import { getThemeBySlug } from '@/data/themes';
import { TypewriterText, SlideUpText } from '@/components/ui/AnimatedText';
import Link from 'next/link';

export default function InteressePage() {
  const searchParams = useSearchParams();
  const themeSlug = searchParams.get('tema');
  const campaign = searchParams.get('campanha');
  
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [unavailableCountry, setUnavailableCountry] = useState(false);

  const theme = themeSlug ? getThemeBySlug(themeSlug) : null;
  const availableCountries = getAvailableCountries();

  useEffect(() => {
    if (selectedCountry) {
      const country = getCountryById(selectedCountry);
      if (country && !country.available) {
        setUnavailableCountry(true);
      } else {
        setUnavailableCountry(false);
      }
    }
  }, [selectedCountry]);

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    setUnavailableCountry(false);
  };

  const handleContinue = () => {
    if (selectedCountry && theme) {
      const params = new URLSearchParams();
      params.set('tema', theme.slug);
      params.set('pais', selectedCountry);
      if (campaign) {
        params.set('campanha', campaign);
      }
      window.location.href = `/formulario?${params.toString()}`;
    }
  };

  if (!theme) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Tema não encontrado</h1>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            <TypewriterText 
              text={theme.title}
              speed={60}
            />
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            <SlideUpText 
              text={theme.description}
              delay={500}
            />
          </p>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-700">
              Passo 1 de 2: Selecionar País
            </span>
          </div>
        </div>

        {/* Country Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-black mb-6 text-center">
            <SlideUpText 
              text="Em que país você está?"
              delay={300}
            />
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableCountries.map((country, index) => (
              <Card
                key={country.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCountry === country.id
                    ? 'border-black border-2 bg-gray-50'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => handleCountrySelect(country.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <span className="text-lg font-medium text-black">
                        {country.name}
                      </span>
                    </div>
                    {selectedCountry === country.id && (
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Unavailable Country Message */}
        {unavailableCountry && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="text-red-600">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  País Indisponível
                </h3>
                <p className="text-red-700">
                  Actualmente, a NeoLife não está disponível neste país. 
                  Estamos a trabalhar para expandir a nossa presença. Por favor, 
                  seleccione um país disponível da lista acima.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" fullWidth>
              Voltar
            </Button>
          </Link>
          <Button
            onClick={handleContinue}
            disabled={!selectedCountry || unavailableCountry}
            fullWidth
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}