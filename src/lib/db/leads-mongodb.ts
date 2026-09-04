import connectDB from './mongodb';
import Lead, { ILead } from './models/Lead';
import { LeadStatus } from '@/types';

export const createLead = async (leadData: {
  country: string;
  name: string;
  phone: string;
  email: string;
  theme: string;
  whatsapp?: string;
  source?: string;
  campaign?: string;
  notes?: string;
}) => {
  try {
    await connectDB();
    
    const lead = new Lead({
      ...leadData,
      status: 'novo' as LeadStatus,
    });
    
    await lead.save();
    return lead;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
};

export const updateLead = async (id: string, updates: Partial<ILead>) => {
  try {
    await connectDB();
    
    const lead = await Lead.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    return lead;
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
};

export const getLeadById = async (id: string) => {
  try {
    await connectDB();
    
    const lead = await Lead.findById(id);
    return lead;
  } catch (error) {
    console.error('Error fetching lead:', error);
    throw error;
  }
};

export const getLeadsByFilters = async (filters: {
  country?: string;
  theme?: string;
  status?: LeadStatus;
  campaign?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}) => {
  try {
    await connectDB();
    
    const query: any = {};
    
    if (filters.country) query.country = filters.country;
    if (filters.theme) query.theme = filters.theme;
    if (filters.status) query.status = filters.status;
    if (filters.campaign) query.campaign = filters.campaign;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return leads;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};

export const getAllLeads = async () => {
  try {
    await connectDB();
    
    const leads = await Lead.find().sort({ createdAt: -1 });
    return leads;
  } catch (error) {
    console.error('Error fetching all leads:', error);
    throw error;
  }
};

export const getLeadStats = async () => {
  try {
    await connectDB();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [
      total,
      todayLeads,
      byCountry,
      byTheme,
      byCampaign,
      byStatus
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: today } }),
      Lead.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $group: { _id: '$theme', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $match: { campaign: { $exists: true, $ne: null } } },
        { $group: { _id: '$campaign', count: { $sum: 1 } } }
      ]),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    
    const byCountryObj: Record<string, number> = {};
    byCountry.forEach((item: any) => {
      byCountryObj[item._id] = item.count;
    });
    
    const byThemeObj: Record<string, number> = {};
    byTheme.forEach((item: any) => {
      byThemeObj[item._id] = item.count;
    });
    
    const byCampaignObj: Record<string, number> = {};
    byCampaign.forEach((item: any) => {
      byCampaignObj[item._id] = item.count;
    });
    
    const byStatusObj: Record<LeadStatus, number> = {
      novo: 0,
      contactado: 0,
      acompanhamento: 0,
      interessado: 0,
      convertido: 0,
      nao_interessado: 0
    };
    byStatus.forEach((item: any) => {
      byStatusObj[item._id as LeadStatus] = item.count;
    });
    
    return {
      total,
      today: todayLeads,
      byCountry: byCountryObj,
      byTheme: byThemeObj,
      byCampaign: byCampaignObj,
      byStatus: byStatusObj
    };
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    throw error;
  }
};