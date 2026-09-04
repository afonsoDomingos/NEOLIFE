import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  country: string;
  name: string;
  phone: string;
  email: string;
  theme: string;
  whatsapp?: string;
  source?: string;
  campaign?: string;
  notes?: string;
  status: 'novo' | 'contactado' | 'acompanhamento' | 'interessado' | 'convertido' | 'nao_interessado';
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    theme: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
    },
    source: {
      type: String,
    },
    campaign: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['novo', 'contactado', 'acompanhamento', 'interessado', 'convertido', 'nao_interessado'],
      default: 'novo',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
LeadSchema.index({ email: 1 });
LeadSchema.index({ phone: 1 });
LeadSchema.index({ country: 1 });
LeadSchema.index({ theme: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;