import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';

let db: Db;

async function getDatabase(): Promise<Db> {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    db = client.db('neolife');
  }
  return db;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const collection = database.collection('eventRsvps');

    const rsvp = {
      eventId: id,
      name,
      email,
      phone,
      createdAt: new Date(),
    };

    await collection.insertOne(rsvp);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json({ error: 'Failed to create RSVP' }, { status: 500 });
  }
}
