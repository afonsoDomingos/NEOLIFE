import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Video from '@/lib/db/models/Video';
import { getActiveVideos } from '@/lib/db/videos-mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category) {
      await connectDB();
      const videos = await Video.find({ active: true, category }).sort({ order: 1 });
      return NextResponse.json(Array.isArray(videos) ? videos : []);
    }

    const videos = await getActiveVideos();
    return NextResponse.json(Array.isArray(videos) ? videos : []);
  } catch (error) {
    console.error('Error in /api/videos, returning empty fallback:', error);
    return NextResponse.json([]);
  }
}
