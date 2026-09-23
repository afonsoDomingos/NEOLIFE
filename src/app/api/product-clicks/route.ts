import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';

// Database connection
let db: Db;

async function getDatabase(): Promise<Db> {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    db = client.db('neolife');
  }
  return db;
}

// POST - Register a product click
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productType, productName, country, source, campaign } = body;

    if (!productId || !productType || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, productType, productName' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const collection = database.collection('product_clicks');

    const clickData = {
      productId,
      productType, // 'pack' or 'supplement'
      productName,
      timestamp: new Date(),
      country: country || null,
      source: source || null,
      campaign: campaign || null,
      userAgent: request.headers.get('user-agent') || null,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
    };

    const result = await collection.insertOne(clickData);

    return NextResponse.json(
      { success: true, clickId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering product click:', error);
    return NextResponse.json(
      { error: 'Failed to register click' },
      { status: 500 }
    );
  }
}