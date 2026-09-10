import connectDB from './mongodb';
import mongoose from 'mongoose';
import Theme, { ITheme } from './models/Theme';
import { themes as defaultThemes } from '@/data/themes';
import { deleteImage } from '@/lib/utils/cloudinary';

/** Returns true if the string is a valid MongoDB ObjectId */
const isValidObjectId = (id: string) =>
  mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

/**
 * Ensures all default themes exist in MongoDB using $setOnInsert (never overwriting existing edits)
 */
const seedDefaultThemesIfEmpty = async () => {
  try {
    for (const t of defaultThemes) {
      await Theme.findOneAndUpdate(
        { slug: t.slug },
        {
          $setOnInsert: {
            title: t.title,
            description: t.description,
            slug: t.slug,
            image: t.image || '',
            publicId: t.publicId || '',
            active: t.active !== undefined ? t.active : true,
            order: t.order || 0,
            content: t.content || '',
            videoUrl: t.videoUrl || '',
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
  } catch (error) {
    console.error('Error seeding/syncing default themes:', error);
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

    const decodedId = decodeURIComponent(id);

    // Sanitize updates to prevent immutable field errors (_id, id)
    const sanitizedUpdates = { ...updates };
    delete (sanitizedUpdates as any)._id;
    delete (sanitizedUpdates as any).id;

    // Determine query: if valid ObjectId search by _id, otherwise search by slug
    const query = isValidObjectId(decodedId) ? { _id: decodedId } : { slug: decodedId };

    // If changing image, safely attempt cleanup of old Cloudinary image
    if (sanitizedUpdates.publicId) {
      try {
        const existing = await Theme.findOne(query);
        if (existing?.publicId && existing.publicId !== sanitizedUpdates.publicId) {
          await deleteImage(existing.publicId);
        }
      } catch (imgErr) {
        console.warn('Failed to delete old image from Cloudinary:', imgErr);
      }
    }

    // Use $set and returnDocument: 'after' for clean Mongoose 8/9 compatibility
    const theme = await Theme.findOneAndUpdate(
      query,
      { $set: { ...sanitizedUpdates, updatedAt: new Date() } },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
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

    const decodedId = decodeURIComponent(id);
    const query = isValidObjectId(decodedId) ? { _id: decodedId } : { slug: decodedId };

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
