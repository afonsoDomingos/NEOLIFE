import connectDB from './mongodb';
import Banner, { IBanner } from './models/Banner';

export const createBanner = async (bannerData: {
  title: string;
  description: string;
  image: string;
  link?: string;
  buttonText?: string;
  active?: boolean;
  order?: number;
  startDate?: Date;
  endDate?: Date;
}) => {
  try {
    await connectDB();
    
    const banner = new Banner({
      ...bannerData,
      active: bannerData.active !== undefined ? bannerData.active : true,
      order: bannerData.order || 0,
    });
    
    await banner.save();
    return banner;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

export const updateBanner = async (id: string, updates: Partial<IBanner>) => {
  try {
    await connectDB();
    
    const banner = await Banner.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    
    return banner;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

export const deleteBanner = async (id: string) => {
  try {
    await connectDB();
    
    await Banner.findByIdAndDelete(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

export const getBannerById = async (id: string) => {
  try {
    await connectDB();
    
    const banner = await Banner.findById(id);
    return banner;
  } catch (error) {
    console.error('Error fetching banner:', error);
    throw error;
  }
};

export const getAllBanners = async () => {
  try {
    await connectDB();
    
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    return banners;
  } catch (error) {
    console.error('Error fetching all banners:', error);
    throw error;
  }
};

export const getActiveBanners = async () => {
  try {
    await connectDB();
    
    const now = new Date();
    
    const banners = await Banner.find({
      active: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ],
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    }).sort({ order: 1, createdAt: -1 });
    
    return banners;
  } catch (error) {
    console.error('Error fetching active banners:', error);
    throw error;
  }
};