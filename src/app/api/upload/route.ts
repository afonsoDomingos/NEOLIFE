import { NextRequest, NextResponse } from 'next/server';

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
        { error: `Tipo não suportado: ${file.type}. Use JPG, PNG ou WebP.` },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ficheiro demasiado grande. Máximo 5MB.' }, { status: 400 });
    }

    // Support both naming conventions (Vercel uses CLOUDINARY_CLOUD_NAME, local uses NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('[upload] Missing Cloudinary env:', { cloudName, hasKey: !!apiKey, hasSecret: !!apiSecret });
      return NextResponse.json(
        { error: `Cloudinary não configurado. cloud_name=${cloudName}, api_key=${!!apiKey}, api_secret=${!!apiSecret}` },
        { status: 500 }
      );
    }

    // Upload via Cloudinary REST API (unsigned upload alternative)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Use Cloudinary's upload API directly via fetch (avoids module initialization issues)
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

    // Create signature using crypto
    const crypto = await import('crypto');
    const signature = crypto
      .createHash('sha256')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    const uploadFormData = new FormData();
    uploadFormData.append('file', dataUri);
    uploadFormData.append('folder', folder);
    uploadFormData.append('timestamp', String(timestamp));
    uploadFormData.append('api_key', apiKey);
    uploadFormData.append('signature', signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadFormData }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error('[upload] Cloudinary error:', uploadData);
      return NextResponse.json(
        { error: uploadData.error?.message || 'Erro ao fazer upload no Cloudinary.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      public_id: uploadData.public_id,
      secure_url: uploadData.secure_url,
      url: uploadData.url,
      width: uploadData.width,
      height: uploadData.height,
      format: uploadData.format,
    });
  } catch (error: any) {
    console.error('[upload] Unexpected error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro inesperado ao fazer upload.' },
      { status: 500 }
    );
  }
}