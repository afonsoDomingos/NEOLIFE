export interface Country {
  id: string;
  name: string;
  code: string;
  available: boolean;
  flag?: string;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  image?: string;
  slug: string;
  active: boolean;
  order: number;
  content?: string;
  publicId?: string; // Cloudinary public ID for image deletion
}

export interface Lead {
  id: string;
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

export type LeadStatus = 
  | 'novo' 
  | 'contactado' 
  | 'acompanhamento' 
  | 'interessado' 
  | 'convertido' 
  | 'nao_interessado';

export interface Campaign {
  id: string;
  name: string;
  theme: string;
  active: boolean;
  createdAt: Date;
}

export interface LeadStats {
  total: number;
  today: number;
  byCountry: Record<string, number>;
  byTheme: Record<string, number>;
  byCampaign: Record<string, number>;
  byStatus: Record<LeadStatus, number>;
}