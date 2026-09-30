import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Video from '@/lib/db/models/Video';
import { getActiveVideos } from '@/lib/db/videos-mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const categories = searchParams.get('categories');
    const page = searchParams.get('page');

    await connectDB();

    // Destination page filter
    if (page === 'experiencias') {
      const expCategories = ['Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'];
      const videos = await Video.find({ active: true, category: { $in: expCategories } }).sort({ order: 1, createdAt: -1 });
      return NextResponse.json(Array.isArray(videos) ? videos : []);
    }

    if (page === 'business') {
      const busCategories = ['Business', 'Negócio', 'Negocio', 'Tutoriais', 'Apresentação'];
      const videos = await Video.find({ active: true, category: { $in: busCategories } }).sort({ order: 1, createdAt: -1 });
      return NextResponse.json(Array.isArray(videos) ? videos : []);
    }

    if (categories) {
      const list = categories.split(',').map((c) => c.trim()).filter(Boolean);
      const videos = await Video.find({ active: true, category: { $in: list } }).sort({ order: 1 });
      return NextResponse.json(Array.isArray(videos) ? videos : []);
    }

    if (category) {
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
