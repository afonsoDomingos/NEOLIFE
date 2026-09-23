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

// GET - Fetch all product data
export async function GET() {
  try {
    const database = await getDatabase();
    const collection = database.collection('health_products');
    const products = await collection.find({}).toArray();
    
    // Transform to a map for easy lookup
    const productMap: Record<string, any> = {};
    products.forEach((prod: any) => {
      productMap[prod.id] = prod;
    });
    
    return NextResponse.json(productMap);
  } catch (error) {
    console.error('Error fetching health products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}