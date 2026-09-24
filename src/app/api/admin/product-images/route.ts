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

interface ProductImage {
  productId: string;
  productType: 'pack' | 'supplement' | 'shake';
  imageUrl: string;
  altText?: string;
  country?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const productType = searchParams.get('productType');

    const database = await getDatabase();
    const collection = database.collection('productImages');

    let query: any = {};
    if (productId) query.productId = productId;
    if (productType) query.productType = productType;

    const images = await collection.find(query).sort({ featured: -1, createdAt: -1 }).toArray();

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return NextResponse.json({ error: 'Failed to fetch product images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productType, imageUrl, altText, country, featured } = body;

    if (!productId || !productType || !imageUrl) {
      return NextResponse.json(
        { error: 'productId, productType, and imageUrl are required' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const collection = database.collection('productImages');

    const newImage: ProductImage = {
      productId,
      productType,
      imageUrl,
      altText,
      country,
      featured: featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newImage);

    return NextResponse.json(
      { ...newImage, _id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product image:', error);
    return NextResponse.json({ error: 'Failed to create product image' }, { status: 500 });
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
    const collection = database.collection('productImages');

    const result = await collection.updateOne(
      { _id: typeof _id === 'string' ? new ObjectId(_id) : _id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product image not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product image:', error);
    return NextResponse.json({ error: 'Failed to update product image' }, { status: 500 });
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
    const collection = database.collection('productImages');

    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product image not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product image:', error);
    return NextResponse.json({ error: 'Failed to delete product image' }, { status: 500 });
  }
}