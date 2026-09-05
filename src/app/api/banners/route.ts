import { NextRequest, NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db/banners-mongodb';

export async function GET(request: NextRequest) {
  try {
    const banners = await getActiveBanners();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return NextResponse.json(
      { error: 'Error fetching active banners' },
      { status: 500 }
    );
  }
}