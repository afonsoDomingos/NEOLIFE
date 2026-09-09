import connectDB from './mongodb';
import mongoose from 'mongoose';

/** Returns true if the string is a valid MongoDB ObjectId */
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
import Theme, { ITheme } from './models/Theme';
import { themes as defaultThemes } from '@/data/themes';
import { deleteImage } from '@/lib/utils/cloudinary';

/**
 * Seeds default themes if collection is empty
 */
const seedDefaultThemesIfEmpty = async () => {
  try {
    const count = await Theme.countDocuments();
    if (count === 0) {
      console.log('Seeding default themes into MongoDB...');
      const themesToInsert = defaultThemes.map(t => ({
        title: t.title,
        description: t.description,
        slug: t.slug,
        image: t.image || '',
        publicId: t.publicId || '',
        active: t.active !== undefined ? t.active : true,
        order: t.order || 0,
        content: t.content || '',
      }));
      await Theme.insertMany(themesToInsert);
      console.log('Default themes seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding default themes:', error);
  }
};

export const createTheme = async (themeData: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publicId?: string;
  videoUrl?: string;
  active?: boolean;
  order?: number;
  content?: string;
}) => {
  try {
    await connectDB();

    const theme = new Theme({
      ...themeData,
      active: themeData.active !== undefined ? themeData.active : true,
      order: themeData.order || 0,
    });

    await theme.save();
    return theme;
  } catch (error) {
    console.error('Error creating theme:', error);
    throw error;
  }
};

export const updateTheme = async (
  id: string,
  updates: Partial<ITheme> & { image?: string; publicId?: string }
) => {
  try {
    await connectDB();

    // Determine the query — if id is not a valid ObjectId, treat it as a slug
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    // If changing image, clean up old Cloudinary image
    if (updates.publicId) {
      const existing = await Theme.findOne(query);
      if (existing?.publicId && existing.publicId !== updates.publicId) {
        try {
          await deleteImage(existing.publicId);
        } catch (imgErr) {
          console.warn('Failed to delete old image from Cloudinary:', imgErr);
        }
      }
    }

    // findOneAndUpdate with upsert: if theme doesn't exist in DB yet (from static data), create it
    const theme = await Theme.findOneAndUpdate(
      query,
      { ...updates, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return theme;
  } catch (error) {
    console.error('Error updating theme:', error);
    throw error;
  }
};

export const deleteTheme = async (id: string) => {
  try {
    await connectDB();

    // Determine the query — if id is not a valid ObjectId, treat it as a slug
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const theme = await Theme.findOne(query);
    if (theme?.publicId) {
      try {
        await deleteImage(theme.publicId);
      } catch (imgErr) {
        console.warn('Failed to delete theme image from Cloudinary:', imgErr);
      }
    }

    await Theme.findOneAndDelete(query);
    return { success: true };
  } catch (error) {
    console.error('Error deleting theme:', error);
    throw error;
  }
};

export const getThemeById = async (id: string) => {
  try {
    await connectDB();
    const theme = await Theme.findById(id);
    return theme;
  } catch (error) {
    console.error('Error fetching theme by ID:', error);
    throw error;
  }
};

export const getThemeBySlug = async (slug: string) => {
  try {
    await connectDB();
    await seedDefaultThemesIfEmpty();
    const theme = await Theme.findOne({ slug });
    return theme;
  } catch (error) {
    console.error('Error fetching theme by slug:', error);
    throw error;
  }
};

export const getAllThemes = async () => {
  try {
    await connectDB();
    await seedDefaultThemesIfEmpty();
    const themes = await Theme.find({}).sort({ order: 1, createdAt: 1 });
    return themes;
  } catch (error) {
    console.error('Error fetching all themes:', error);
    throw error;
  }
};

export const getActiveThemes = async () => {
  try {
    await connectDB();
    await seedDefaultThemesIfEmpty();
    const themes = await Theme.find({ active: true }).sort({ order: 1, createdAt: 1 });
    return themes;
  } catch (error) {
    console.error('Error fetching active themes:', error);
    throw error;
  }
};
