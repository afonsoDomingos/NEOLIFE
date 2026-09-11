import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Resource from '@/lib/db/models/Resource';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const resources = await Resource.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching member resources:', error);
    return NextResponse.json({ error: 'Erro ao carregar recursos.' }, { status: 500 });
  }
}
