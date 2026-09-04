'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Country } from '@/types';

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const response = await fetch('/api/admin/countries');
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCountryAvailability = async (countryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/countries/${countryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !currentStatus }),
      });

      if (response.ok) {
        loadCountries();
      }
    } catch (error) {
      console.error('Error updating country:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar países...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-black">
                ← Voltar
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-black">Gestão de Países</h1>
            </div>
            <div className="text-sm text-gray-600">
              {countries.filter(c => c.available).length} de {countries.length} disponíveis
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-black">Países Africanos</h2>
            <p className="text-sm text-gray-600">
              Configure quais países estão disponíveis para captação de leads.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country) => (
                <div
                  key={country.id}
                  className={`p-4 border rounded-lg ${
                    country.available 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <h3 className="font-semibold text-black">{country.name}</h3>
                        <p className="text-xs text-gray-500">{country.code}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      country.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {country.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={country.available ? 'outline' : 'primary'}
                    fullWidth
                    onClick={() => toggleCountryAvailability(country.id, country.available)}
                  >
                    {country.available ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600">
                  <svg
                    className="w-5 h-5"
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
                  <h4 className="font-semibold text-yellow-800 mb-1">Nota</h4>
                  <p className="text-sm text-yellow-700">
                    Para adicionar ou editar países permanentemente, edite o ficheiro 
                    <code className="bg-yellow-100 px-1 py-0.5 rounded">src/data/countries.ts</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}