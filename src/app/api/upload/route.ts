import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables and fallback credentials
const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnvnftvky',
    api_key: process.env.CLOUDINARY_API_KEY || '259851568455899',
    api_secret: process.env.CLOUDINARY_API_SECRET || '3hRsXzUVd3pnwn9IKQWN7UAeJLc',
    secure: true,
  });
  return cloudinary;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'neolife';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro fornecido' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cld = getCloudinary();

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadOptions: Record<string, any> = {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        max_file_size: 10000000, // 10MB
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      };

      // Only use OG crop if explicitly a banner/social share
      if (folder === 'banners' || folder === 'og-images') {
        uploadOptions.transformation.push({ width: 1200, height: 630, crop: 'fill' });
      }

      cld.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          console.error('Cloudinary stream error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });

    return NextResponse.json({
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      width: (result as any).width,
      height: (result as any).height,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    const errorMessage = error?.message || 'Falha ao processar upload da imagem';
    return NextResponse.json(
      {
        error: errorMessage,
        details: error?.message || 'Erro desconhecido durante o upload',
      },
      { status: 500 }
    );
  }
}