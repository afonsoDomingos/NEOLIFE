import { NextRequest, NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db/banners-mongodb';

const fallbackBanner = [
  {
    _id: 'default-banner-01',
    titleEn: 'Build Your Own Business with NeoLife in Africa',
    titlePt: 'Construa o Seu Próprio Negócio com a NeoLife em África',
    descriptionEn: 'Discover how to transform your health, wellness, and achieve financial independence working from anywhere.',
    descriptionPt: 'Descubra como transformar a sua saúde, bem-estar e conquistar a sua independência financeira trabalhando a partir de qualquer lugar.',
    image: '/banner01.jpg',
    link: '/#temas',
    buttonTextEn: 'Learn More',
    buttonTextPt: 'Quero Saber Mais',
    active: true,
    order: 1,
  }
];

export async function GET(request: NextRequest) {
  try {
    const banners = await getActiveBanners();
    if (Array.isArray(banners) && banners.length > 0) {
      // Check if banners have bilingual fields
      const hasBilingualFields = banners.some(
        (b: any) => b.titleEn || b.titlePt || b.descriptionEn || b.descriptionPt
      );

      // If banners don't have bilingual fields, use fallback
      if (!hasBilingualFields) {
        console.log('Banners in MongoDB lack bilingual fields, using fallback');
        return NextResponse.json(fallbackBanner);
      }

      return NextResponse.json(banners);
    }
    return NextResponse.json(fallbackBanner);
  } catch (error) {
    console.error('Error fetching active banners, using fallback banner01:', error);
    return NextResponse.json(fallbackBanner);
  }
}