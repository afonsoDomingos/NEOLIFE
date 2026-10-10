import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisit extends Document {
  path: string;
  visitorId: string;
  referrer?: string;
  device?: string;
  country?: string;
  createdAt: Date;
}

const VisitSchema: Schema = new Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    referrer: {
      type: String,
      trim: true,
    },
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'other'],
      default: 'desktop',
    },
    country: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

VisitSchema.index({ createdAt: -1 });
VisitSchema.index({ path: 1, createdAt: -1 });
VisitSchema.index({ visitorId: 1, createdAt: -1 });

const Visit: Model<IVisit> = mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);

export default Visit;
