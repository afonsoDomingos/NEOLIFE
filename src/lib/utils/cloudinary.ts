import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export const uploadImage = async (
  file: File,
  folder: string = 'neolife'
): Promise<UploadResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          max_file_size: 5000000, // 5MB
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1200, height: 630, crop: 'fill' }, // OG image size
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result!.public_id,
              url: result!.url,
              secure_url: result!.secure_url,
              width: result!.width,
              height: result!.height,
              format: result!.format,
            });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

export const getImageUrl = (
  publicId: string,
  transformations: Record<string, any> = {}
): string => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
};

export const getOptimizedImageUrl = (
  publicId: string,
  width: number = 800,
  height: number = 600
): string => {
  return getImageUrl(publicId, {
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { width, height, crop: 'fill' },
    ],
  });
};