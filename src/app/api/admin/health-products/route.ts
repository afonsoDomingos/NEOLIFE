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
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching health product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images' },
      { status: 500 }
    );
  }
}

// POST - Create new product image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, image, type } = body;

    if (!id || !name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, type' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const collection = database.collection('health_product_images');

    // Check if product already exists
    const existing = await collection.findOne({ id });
    if (existing) {
      return NextResponse.json(
        { error: 'Product image already exists' },
        { status: 409 }
      );
    }

    const newProductImage = {
      id,
      name,
      image: image || '',
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newProductImage);

    return NextResponse.json(
      { ...newProductImage, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating health product image:', error);
    return NextResponse.json(
      { error: 'Failed to create product image' },
      { status: 500 }
    );
  }
}