import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Apresentação',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

VideoSchema.index({ active: 1, order: 1 });
VideoSchema.index({ category: 1 });

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
