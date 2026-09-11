import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Announcement from '@/lib/db/models/Announcement';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const announcements = await Announcement.find({
      active: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching member announcements:', error);
    return NextResponse.json({ error: 'Erro ao carregar anúncios.' }, { status: 500 });
  }
}
