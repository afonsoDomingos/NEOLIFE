'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = '/admin/dashboard';
      } else {
        const data = await response.json();
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/logo-neolife.png"
            alt="NeoLife"
            className="h-16 w-auto object-contain rounded-lg shadow-sm mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Neo<span className="text-emerald-600">Life</span> Admin
          </h1>
          <p className="text-gray-500 text-sm">Painel de Gestão e Captação</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-black text-center">
              Iniciar Sessão
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nome de Utilizador"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Digite o seu nome de utilizador"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite a sua password"
                required
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'A entrar...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-black">
                Voltar ao website
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500">
            Área restrita a utilizadores autorizados.
          </p>
          <a
            href="https://www.wehosthere.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors pt-2"
          >
            <span>Powered by</span>
            <span className="font-semibold text-gray-600">WeHostHere</span>
            <img
              src="/logo-wehosthere.png"
              alt="WeHostHere"
              className="h-4 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
}