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

// PATCH - Update product image
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { image, name, type } = body;

    const database = await getDatabase();
    const collection = database.collection('health_product_images');

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (image !== undefined) updateData.image = image;
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;

    const result = await collection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product image not found' },
        { status: 404 }
      );
    }

    const updated = await collection.findOne({ id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating health product image:', error);
    return NextResponse.json(
      { error: 'Failed to update product image' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const database = await getDatabase();
    const collection = database.collection('health_product_images');

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting health product image:', error);
    return NextResponse.json(
      { error: 'Failed to delete product image' },
      { status: 500 }
    );
  }
}