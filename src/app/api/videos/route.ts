import { NextResponse } from 'next/server';
import { getActiveVideos } from '@/lib/db/videos-mongodb';

export async function GET() {
  try {
    const videos = await getActiveVideos();
    return NextResponse.json(Array.isArray(videos) ? videos : []);
  } catch (error) {
    console.error('Error in /api/videos, returning empty fallback:', error);
    return NextResponse.json([]);
  }
}
