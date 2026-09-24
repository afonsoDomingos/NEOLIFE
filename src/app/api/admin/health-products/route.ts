import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db, ObjectId } from 'mongodb';

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

interface HealthProductPack {
  id: string;
  slug: string;
  category: 'cell' | 'weight' | 'gender' | 'energy' | 'digest' | 'joints' | 'immunity' | 'kids' | 'other';
  titlePt: string;
  titleEn: string;
  badgePt: string;
  badgeEn: string;
  tagPt: string;
  tagEn: string;
  descPt: string;
  descEn: string;
  productsPt: string[];
  productsEn: string[];
  benefitsPt: string[];
  benefitsEn: string[];
  notePt?: string;
  noteEn?: string;
  featured?: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    const database = await getDatabase();
    const collection = database.collection('healthProducts');

    let query: any = {};
    if (id) query.id = id;
    if (category) query.category = category;

    const products = await collection.find(query).sort({ featured: -1, titlePt: 1 }).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching health products:', error);
    return NextResponse.json({ error: 'Failed to fetch health products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      slug,
      category,
      titlePt,
      titleEn,
      badgePt,
      badgeEn,
      tagPt,
      tagEn,
      descPt,
      descEn,
      productsPt,
      productsEn,
      benefitsPt,
      benefitsEn,
      notePt,
      noteEn,
      featured,
      image,
    } = body;

    if (!id || !slug || !category || !titlePt || !titleEn) {
      return NextResponse.json(
        { error: 'id, slug, category, titlePt, and titleEn are required' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const collection = database.collection('healthProducts');

    // Check if product with same id already exists
    const existing = await collection.findOne({ id });
    if (existing) {
      return NextResponse.json(
        { error: 'Product with this id already exists' },
        { status: 409 }
      );
    }

    const newProduct: HealthProductPack = {
      id,
      slug,
      category,
      titlePt,
      titleEn,
      badgePt: badgePt || '',
      badgeEn: badgeEn || '',
      tagPt: tagPt || '',
      tagEn: tagEn || '',
      descPt,
      descEn,
      productsPt: productsPt || [],
      productsEn: productsEn || [],
      benefitsPt: benefitsPt || [],
      benefitsEn: benefitsEn || [],
      notePt,
      noteEn,
      featured: featured || false,
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    return NextResponse.json(
      { ...newProduct, _id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating health product:', error);
    return NextResponse.json({ error: 'Failed to create health product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: '_id is required' }, { status: 400 });
    }

    const database = await getDatabase();
    const collection = database.collection('healthProducts');

    const result = await collection.updateOne(
      { _id: typeof _id === 'string' ? new ObjectId(_id) : _id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Health product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating health product:', error);
    return NextResponse.json({ error: 'Failed to update health product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get('_id');

    if (!_id) {
      return NextResponse.json({ error: '_id is required' }, { status: 400 });
    }

    const database = await getDatabase();
    const collection = database.collection('healthProducts');

    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Health product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting health product:', error);
    return NextResponse.json({ error: 'Failed to delete health product' }, { status: 500 });
  }
}