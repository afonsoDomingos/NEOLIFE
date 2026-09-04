'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import Link from 'next/link';
import { LeadStatus } from '@/types';

interface MongoLead {
  _id: string;
  country: string;
  name: string;
  phone: string;
  email: string;
  theme: string;
  whatsapp?: string;
  source?: string;
  campaign?: string;
  notes?: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<MongoLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<MongoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    theme: '',
    status: ''
  });

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
        setFilteredLeads(data);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.phone.includes(search)
      );
    }

    if (filters.country) {
      filtered = filtered.filter(lead => lead.country === filters.country);
    }

    if (filters.theme) {
      filtered = filtered.filter(lead => lead.theme === filters.theme);
    }

    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    setFilteredLeads(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    applyFilters();
  };

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadLeads();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const getStatusColor = (status: LeadStatus): string => {
    const colors = {
      novo: 'bg-blue-100 text-blue-800',
      contactado: 'bg-yellow-100 text-yellow-800',
      acompanhamento: 'bg-purple-100 text-purple-800',
      interessado: 'bg-green-100 text-green-800',
      convertido: 'bg-emerald-100 text-emerald-800',
      nao_interessado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: LeadStatus): string => {
    const labels = {
      novo: 'Novo',
      contactado: 'Contactado',
      acompanhamento: 'Em Acompanhamento',
      interessado: 'Interessado',
      convertido: 'Convertido',
      nao_interessado: 'Não Interessado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar leads...</p>
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
              <h1 className="text-xl font-bold text-black">Gestão de Leads</h1>
            </div>
            <div className="text-sm text-gray-600">
              {filteredLeads.length} de {leads.length} leads
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-black">Filtros</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Pesquisar por nome, email ou telefone"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />

              <Select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
              >
                <option value="">Todos os países</option>
                <option value="mz">Moçambique</option>
                <option value="za">África do Sul</option>
                <option value="ao">Angola</option>
                <option value="zw">Zimbabwe</option>
              </Select>

              <Select
                name="theme"
                value={filters.theme}
                onChange={handleFilterChange}
              >
                <option value="">Todos os temas</option>
                <option value="conheca-neolife">Conheça a NeoLife</option>
                <option value="como-funciona">Como Funciona</option>
                <option value="produtos">Produtos</option>
                <option value="oportunidade">Oportunidade de Negócio</option>
                <option value="beneficios">Benefícios</option>
                <option value="como-comecar">Como Começar</option>
                <option value="historias">Histórias de Sucesso</option>
              </Select>

              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos os estados</option>
                <option value="novo">Novo</option>
                <option value="contactado">Contactado</option>
                <option value="acompanhamento">Em Acompanhamento</option>
                <option value="interessado">Interessado</option>
                <option value="convertido">Convertido</option>
                <option value="nao_interessado">Não Interessado</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Nenhum lead encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black">{lead.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{lead.country}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{lead.phone}</div>
                          <div className="text-xs text-gray-400">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{lead.theme}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {getStatusLabel(lead.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {new Date(lead.createdAt).toLocaleDateString('pt-PT')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead._id.toString(), e.target.value as LeadStatus)}
                            className="text-sm"
                          >
                            <option value="novo">Novo</option>
                            <option value="contactado">Contactado</option>
                            <option value="acompanhamento">Em Acompanhamento</option>
                            <option value="interessado">Interessado</option>
                            <option value="convertido">Convertido</option>
                            <option value="nao_interessado">Não Interessado</option>
                          </Select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}