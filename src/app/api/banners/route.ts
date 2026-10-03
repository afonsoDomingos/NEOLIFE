import { NextRequest, NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db/banners-mongodb';

const fallbackBanner = [
  {
    _id: 'default-banner-01',
    title: 'Build Your Own Business with NeoLife in Africa',
    description: 'Discover how to transform your health, wellness, and achieve financial independence working from anywhere.',
    image: '/banner01.jpg',
    link: '/#temas',
    buttonText: 'Learn More',
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