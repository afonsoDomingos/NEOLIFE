import connectDB from './mongodb';
import Video, { IVideo } from './models/Video';
import { extractYouTubeId, getEmbedUrl, getThumbnail } from '@/lib/utils/video';

export { extractYouTubeId, getEmbedUrl, getThumbnail };

const defaultVideos = [
  {
    title: 'Conheça a NeoLife - A Nossa História e Missão',
    description: 'Descubra a história da NeoLife, a nossa visão de saúde global e como transformamos vidas em mais de 50 países.',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop',
    category: 'Apresentação',
    featured: true,
    active: true,
    order: 1,
  },
  {
    title: 'Oportunidade de Negócio NeoLife - Como Funciona',
    description: 'Aprenda como construir o seu negócio independente, gerar rendimento extra e alcançar a liberdade financeira com a NeoLife.',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    category: 'Negócio',
    featured: false,
    active: true,
    order: 2,
  },
  {
    title: 'Ciência & Nutrição - A Qualidade dos Produtos NeoLife',
    description: 'Conheça o Conselho Científico Consultivo (SAB) da NeoLife e os rigorosos padrões de pureza e eficácia nutricional.',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=450&fit=crop',
    category: 'Produtos',
    featured: false,
    active: true,
    order: 3,
  },
];

const seedDefaultVideosIfEmpty = async () => {
  try {
    const count = await Video.countDocuments();
    if (count === 0) {
      console.log('Seeding default videos into MongoDB...');
      await Video.insertMany(defaultVideos);
      console.log('Default videos seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding default videos:', error);
  }
};

export const getAllVideos = async () => {
  try {
    await connectDB();
    await seedDefaultVideosIfEmpty();
    return await Video.find().sort({ order: 1, createdAt: -1 });
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return defaultVideos as any[];
  }
};

export const getActiveVideos = async () => {
  try {
    await connectDB();
    await seedDefaultVideosIfEmpty();
    return await Video.find({ active: true }).sort({ order: 1, createdAt: -1 });
  } catch (error) {
    console.error('Error fetching active videos:', error);
    return defaultVideos.filter(v => v.active) as any[];
  }
};

export const createVideo = async (videoData: {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
}) => {
  try {
    await connectDB();
    const thumbnail = getThumbnail(videoData.videoUrl, videoData.thumbnailUrl);
    const video = new Video({
      ...videoData,
      thumbnailUrl: thumbnail,
      active: videoData.active !== undefined ? videoData.active : true,
      order: videoData.order || 0,
    });
    await video.save();
    return video;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

export const updateVideo = async (id: string, updates: Partial<IVideo>) => {
  try {
    await connectDB();
    if (updates.videoUrl && !updates.thumbnailUrl) {
      updates.thumbnailUrl = getThumbnail(updates.videoUrl);
    }

    const mongoose = await import('mongoose');
    const isValidObjectId = mongoose.default.Types.ObjectId.isValid(id);

    let video = null;
    if (isValidObjectId) {
      video = await Video.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
    }

    if (!video) {
      video = await Video.findOneAndUpdate(
        { $or: [{ videoUrl: updates.videoUrl }, { title: updates.title }] },
        { ...updates, updatedAt: new Date() },
        { new: true, upsert: true }
      );
    }

    return video;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const deleteVideo = async (id: string) => {
  try {
    await connectDB();
    await Video.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};
