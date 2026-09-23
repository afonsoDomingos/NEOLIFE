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
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching health products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create or update product data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      type,
      // Pack fields
      titlePt, titleEn, badgePt, badgeEn, tagPt, tagEn, descPt, descEn,
      productsPt, productsEn, benefitsPt, benefitsEn, notePt, noteEn, featured,
      // Supplement fields
      name, subtitlePt, subtitleEn, descPt: suppDescPt, descEn: suppDescEn, tag,
      // Common
      image
    } = body;

    if (!id || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: id, type' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const collection = database.collection('health_products');

    // Check if product already exists
    const existing = await collection.findOne({ id });
    
    const productData: any = {
      id,
      type,
      image: image || '',
      updatedAt: new Date(),
    };

    if (type === 'pack') {
      productData.titlePt = titlePt || '';
      productData.titleEn = titleEn || '';
      productData.badgePt = badgePt || '';
      productData.badgeEn = badgeEn || '';
      productData.tagPt = tagPt || '';
      productData.tagEn = tagEn || '';
      productData.descPt = descPt || '';
      productData.descEn = descEn || '';
      productData.productsPt = productsPt || [];
      productData.productsEn = productsEn || [];
      productData.benefitsPt = benefitsPt || [];
      productData.benefitsEn = benefitsEn || [];
      productData.notePt = notePt || '';
      productData.noteEn = noteEn || '';
      productData.featured = featured || false;
    } else if (type === 'supplement') {
      productData.name = name || '';
      productData.subtitlePt = subtitlePt || '';
      productData.subtitleEn = subtitleEn || '';
      productData.descPt = suppDescPt || '';
      productData.descEn = suppDescEn || '';
      productData.tag = tag || '';
    }

    if (existing) {
      // Update existing
      const result = await collection.updateOne(
        { id },
        { $set: productData }
      );
      const updated = await collection.findOne({ id });
      return NextResponse.json(updated);
    } else {
      // Create new
      productData.createdAt = new Date();
      const result = await collection.insertOne(productData);
      return NextResponse.json(
        { ...productData, _id: result.insertedId },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error saving health product:', error);
    return NextResponse.json(
      { error: 'Failed to save product' },
      { status: 500 }
    );
  }
}