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

const defaultBannersData = [
  {
    titlePt: 'Construa o Seu Próprio Negócio com a NeoLife em África',
    titleEn: 'Build Your Own Business with NeoLife in Africa',
    descriptionPt: 'Descubra como transformar a sua saúde, bem-estar e conquistar a sua independência financeira trabalhando a partir de qualquer lugar.',
    descriptionEn: 'Discover how to transform your health, wellness, and achieve financial independence working from anywhere.',
    image: '/banner01.jpg',
    link: '/#temas',
    buttonTextPt: 'Quero Saber Mais',
    buttonTextEn: 'Learn More',
    active: true,
    order: 1,
  },
  {
    titlePt: 'Saúde, Vitalidade e Liberdade Financeira',
    titleEn: 'Health, Vitality, and Financial Freedom',
    descriptionPt: 'Junte-se à família NeoLife e descubra o poder da nutrição celular de alta qualidade científica, ao lado da mentoria de José e Ofélia Machado.',
    descriptionEn: 'Join the NeoLife family and discover the power of high-quality scientific cellular nutrition, alongside the mentorship of José and Ofélia Machado.',
    image: '/banneroficial.png',
    link: '/oportunidade',
    buttonTextPt: 'Conhecer a Oportunidade',
    buttonTextEn: 'Discover the Opportunity',
    active: true,
    order: 2,
  },
];

const seedDefaultBannerIfEmpty = async () => {
  try {
    const count = await Banner.countDocuments();
    if (count === 0) {
      console.log('Seeding default banners into MongoDB...');
      await Banner.insertMany(defaultBannersData);
      console.log('Default banners seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding default banner:', error);
  }
};

export const getAllBanners = async () => {
  try {
    await connectDB();
    await seedDefaultBannerIfEmpty();
    
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
    await seedDefaultBannerIfEmpty();
    
    const now = new Date();
    
    const banners = await Banner.find({
      active: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: now } }
          ]
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
          ]
        }
      ]
    }).sort({ order: 1, createdAt: -1 });
    
    return banners;
  } catch (error) {
    console.error('Error fetching active banners:', error);
    throw error;
  }
};