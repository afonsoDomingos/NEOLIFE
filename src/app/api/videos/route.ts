import { NextResponse } from 'next/server';
import { getActiveVideos } from '@/lib/db/videos-mongodb';

export async function GET() {
  try {
    const videos = await getActiveVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error in /api/videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
