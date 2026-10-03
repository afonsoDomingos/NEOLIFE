import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllPillarCards } from '@/lib/db/pillar-cards-mongodb';

export async function GET(request: NextRequest) {
  try {
    const cards = await getAllPillarCards();
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching pillar cards:', error);
    return NextResponse.json({ error: 'Error fetching pillar cards' }, { status: 500 });
  }
}
