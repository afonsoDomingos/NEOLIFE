import { NextRequest, NextResponse } from 'next/server';
import { getProductLink } from '@/lib/db/product-links-mongodb';

// GET - Obter link de compra de um produto específico (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const link = await getProductLink(productId);

    if (!link) {
      return NextResponse.json({ 
        available: false, 
        message: 'Produto não configurado para compra' 
      }, { status: 404 });
    }

    return NextResponse.json({
      available: link.available,
      purchaseUrl: link.available ? link.purchaseUrl : null,
      customMessage: link.customMessage,
    });
  } catch (error) {
    console.error('Error fetching product link:', error);
    return NextResponse.json({ error: 'Failed to fetch product link' }, { status: 500 });
  }
}