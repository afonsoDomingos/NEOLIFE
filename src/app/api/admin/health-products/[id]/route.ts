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

// PATCH - Update product data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      type,
      // Pack fields
      titlePt, titleEn, badgePt, badgeEn, tagPt, tagEn, descPt, descEn,
      productsPt, productsEn, benefitsPt, benefitsEn, notePt, noteEn, featured,
      // Supplement fields
      name, subtitlePt, subtitleEn, descPt: suppDescPt, descEn: suppDescEn, tag,
      // Common
      image
    } = body;

    const database = await getDatabase();
    const collection = database.collection('health_products');

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (type !== undefined) updateData.type = type;
    if (image !== undefined) updateData.image = image;

    if (type === 'pack' || titlePt !== undefined || titleEn !== undefined) {
      if (titlePt !== undefined) updateData.titlePt = titlePt;
      if (titleEn !== undefined) updateData.titleEn = titleEn;
      if (badgePt !== undefined) updateData.badgePt = badgePt;
      if (badgeEn !== undefined) updateData.badgeEn = badgeEn;
      if (tagPt !== undefined) updateData.tagPt = tagPt;
      if (tagEn !== undefined) updateData.tagEn = tagEn;
      if (descPt !== undefined) updateData.descPt = descPt;
      if (descEn !== undefined) updateData.descEn = descEn;
      if (productsPt !== undefined) updateData.productsPt = productsPt;
      if (productsEn !== undefined) updateData.productsEn = productsEn;
      if (benefitsPt !== undefined) updateData.benefitsPt = benefitsPt;
      if (benefitsEn !== undefined) updateData.benefitsEn = benefitsEn;
      if (notePt !== undefined) updateData.notePt = notePt;
      if (noteEn !== undefined) updateData.noteEn = noteEn;
      if (featured !== undefined) updateData.featured = featured;
    }

    if (type === 'supplement' || name !== undefined) {
      if (name !== undefined) updateData.name = name;
      if (subtitlePt !== undefined) updateData.subtitlePt = subtitlePt;
      if (subtitleEn !== undefined) updateData.subtitleEn = subtitleEn;
      if (suppDescPt !== undefined) updateData.descPt = suppDescPt;
      if (suppDescEn !== undefined) updateData.descEn = suppDescEn;
      if (tag !== undefined) updateData.tag = tag;
    }

    const result = await collection.updateOne(
      { id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updated = await collection.findOne({ id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating health product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const database = await getDatabase();
    const collection = database.collection('health_products');

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting health product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}