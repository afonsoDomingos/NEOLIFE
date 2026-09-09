import { NextRequest, NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db/banners-mongodb';

const fallbackBanner = [
  {
    _id: 'default-banner-01',
    title: 'Construa o Seu Próprio Negócio com a NeoLife em África',
    description: 'Descubra como transformar a sua saúde, bem-estar e conquistar a sua independência financeira trabalhando a partir de qualquer lugar.',
    image: '/banner01.jpg',
    link: '/#temas',
    buttonText: 'Quero Saber Mais',
    active: true,
    order: 1,
  }
];

export async function GET(request: NextRequest) {
  try {
    const banners = await getActiveBanners();
    if (Array.isArray(banners) && banners.length > 0) {
      return NextResponse.json(banners);
    }
    return NextResponse.json(fallbackBanner);
  } catch (error) {
    console.error('Error fetching active banners, using fallback banner01:', error);
    return NextResponse.json(fallbackBanner);
  }
}