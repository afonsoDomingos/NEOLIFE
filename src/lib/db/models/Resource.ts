import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link' | 'guide';
  url: string;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'guide'],
      default: 'link',
    },
    url: { type: String, required: true, trim: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ResourceSchema.index({ published: 1, order: 1 });

const Resource: Model<IResource> =
  mongoose.models.Resource ||
  mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;

