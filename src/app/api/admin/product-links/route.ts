import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/utils/auth';
import {
  getAllProductLinks,
  upsertProductLink,
  deleteProductLink,
  updateProductAvailability,
} from '@/lib/db/product-links-mongodb';

// GET - Obter todos os links de produtos
export async function GET() {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await getAllProductLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching product links:', error);
    return NextResponse.json({ error: 'Failed to fetch product links' }, { status: 500 });
  }
}

// POST - Criar novo link de produto
export async function POST(request: NextRequest) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const link = await upsertProductLink(data);

    if (!link) {
      return NextResponse.json({ error: 'Failed to create product link' }, { status: 500 });
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error creating product link:', error);
    return NextResponse.json({ error: 'Failed to create product link' }, { status: 500 });
  }
}

// PUT - Atualizar link de produto
export async function PUT(request: NextRequest) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const link = await upsertProductLink(data);

    if (!link) {
      return NextResponse.json({ error: 'Failed to update product link' }, { status: 500 });
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error updating product link:', error);
    return NextResponse.json({ error: 'Failed to update product link' }, { status: 500 });
  }
}

// DELETE - Deletar link de produto
export async function DELETE(request: NextRequest) {
  try {
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const success = await deleteProductLink(productId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete product link' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product link:', error);
    return NextResponse.json({ error: 'Failed to delete product link' }, { status: 500 });
  }
}