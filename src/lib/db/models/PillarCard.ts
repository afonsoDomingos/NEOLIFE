import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPillarCard extends Document {
  pillarId: 'saude' | 'business' | 'experiencias';
  image: string;
  altText?: string;
  updatedAt: Date;
}

const PillarCardSchema: Schema = new Schema(
  {
    pillarId: {
      type: String,
      required: true,
      unique: true,
      enum: ['saude', 'business', 'experiencias'],
    },
    image: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PillarCard: Model<IPillarCard> =
  mongoose.models.PillarCard ||
  mongoose.model<IPillarCard>('PillarCard', PillarCardSchema);

export default PillarCard;
