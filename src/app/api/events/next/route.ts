import { NextRequest, NextResponse } from 'next/server';
import { getNextEvent } from '@/lib/db/events-mongodb';

export async function GET() {
  try {
    const nextEvent = await getNextEvent();
    return NextResponse.json(nextEvent);
  } catch (error) {
    console.error('Error fetching next event:', error);
    return NextResponse.json({ error: 'Failed to fetch next event' }, { status: 500 });
  }
}
