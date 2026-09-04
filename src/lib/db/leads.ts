import { Lead, LeadStatus } from '@/types';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'src/data/leads.json');

export const loadLeads = (): Lead[] => {
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(data);
    return leads.map((lead: any) => ({
      ...lead,
      createdAt: new Date(lead.createdAt),
      updatedAt: new Date(lead.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading leads:', error);
    return [];
  }
};

export const saveLeads = (leads: Lead[]): void => {
  try {
    const data = JSON.stringify(leads, null, 2);
    fs.writeFileSync(LEADS_FILE, data, 'utf-8');
  } catch (error) {
    console.error('Error saving leads:', error);
    throw error;
  }
};

export const createLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Lead => {
  const leads = loadLeads();
  const newLead: Lead = {
    ...leadData,
    id: generateId(),
    status: 'novo',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  leads.push(newLead);
  saveLeads(leads);
  return newLead;
};

export const updateLead = (id: string, updates: Partial<Lead>): Lead | null => {
  const leads = loadLeads();
  const index = leads.findIndex(lead => lead.id === id);
  
  if (index === -1) return null;
  
  leads[index] = {
    ...leads[index],
    ...updates,
    updatedAt: new Date()
  };
  
  saveLeads(leads);
  return leads[index];
};

export const getLeadById = (id: string): Lead | null => {
  const leads = loadLeads();
  return leads.find(lead => lead.id === id) || null;
};

export const getLeadsByFilters = (filters: {
  country?: string;
  theme?: string;
  status?: LeadStatus;
  campaign?: string;
  startDate?: Date;
  endDate?: Date;
}): Lead[] => {
  const leads = loadLeads();
  
  return leads.filter(lead => {
    if (filters.country && lead.country !== filters.country) return false;
    if (filters.theme && lead.theme !== filters.theme) return false;
    if (filters.status && lead.status !== filters.status) return false;
    if (filters.campaign && lead.campaign !== filters.campaign) return false;
    if (filters.startDate && lead.createdAt < filters.startDate) return false;
    if (filters.endDate && lead.createdAt > filters.endDate) return false;
    return true;
  });
};

export const getLeadStats = () => {
  const leads = loadLeads();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayLeads = leads.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    leadDate.setHours(0, 0, 0, 0);
    return leadDate.getTime() === today.getTime();
  });
  
  const byCountry: Record<string, number> = {};
  const byTheme: Record<string, number> = {};
  const byCampaign: Record<string, number> = {};
  const byStatus: Record<LeadStatus, number> = {
    novo: 0,
    contactado: 0,
    acompanhamento: 0,
    interessado: 0,
    convertido: 0,
    nao_interessado: 0
  };
  
  leads.forEach(lead => {
    byCountry[lead.country] = (byCountry[lead.country] || 0) + 1;
    byTheme[lead.theme] = (byTheme[lead.theme] || 0) + 1;
    if (lead.campaign) {
      byCampaign[lead.campaign] = (byCampaign[lead.campaign] || 0) + 1;
    }
    byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
  });
  
  return {
    total: leads.length,
    today: todayLeads.length,
    byCountry,
    byTheme,
    byCampaign,
    byStatus
  };
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};