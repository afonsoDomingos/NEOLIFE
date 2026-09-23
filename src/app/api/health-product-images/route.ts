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

// GET - Fetch all product images
export async function GET() {
  try {
    const database = await getDatabase();
    const collection = database.collection('health_product_images');
    const images = await collection.find({}).toArray();
    
    // Transform to a map for easy lookup
    const imageMap: Record<string, string> = {};
    images.forEach((img: any) => {
      if (img.image) {
        imageMap[img.id] = img.image;
      }
    });
    
    return NextResponse.json(imageMap);
  } catch (error) {
    console.error('Error fetching health product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images' },
      { status: 500 }
    );
  }
}