import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary inline to guarantee env vars are loaded
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'neolife';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro fornecido.' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de ficheiro não suportado: ${file.type}. Use JPG, PNG ou WebP.` },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Ficheiro demasiado grande. Máximo 5MB.' },
        { status: 400 }
      );
    }

    // Check Cloudinary config
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary env vars:', { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
      return NextResponse.json(
        { error: 'Configuração do Cloudinary em falta. Verifique as variáveis de ambiente.' },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ public_id: string; secure_url: string; url: string; width: number; height: number; format: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: 'image',
              allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
              transformation: [
                { quality: 'auto', fetch_format: 'auto' },
                { width: 1200, height: 800, crop: 'fill' },
              ],
            },
            (error, uploadResult) => {
              if (error) {
                console.error('Cloudinary upload_stream error:', error);
                reject(error);
              } else {
                resolve({
                  public_id: uploadResult!.public_id,
                  secure_url: uploadResult!.secure_url,
                  url: uploadResult!.url,
                  width: uploadResult!.width,
                  height: uploadResult!.height,
                  format: uploadResult!.format,
                });
              }
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao fazer upload da imagem.' },
      { status: 500 }
    );
  }
}