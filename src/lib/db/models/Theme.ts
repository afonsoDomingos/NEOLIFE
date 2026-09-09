import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITheme extends Document {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publicId?: string;
  active: boolean;
  order: number;
  content?: string;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
ThemeSchema.index({ slug: 1 });
ThemeSchema.index({ active: 1, order: 1 });

const Theme: Model<ITheme> = mongoose.models.Theme || mongoose.model<ITheme>('Theme', ThemeSchema);

export default Theme;
