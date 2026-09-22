import ProductLink, { IProductLink } from '@/lib/db/models/ProductLink';
import { connectDB } from './mongodb';

// Obter link de compra por produto ID
export async function getProductLink(productId: string): Promise<IProductLink | null> {
  try {
    await connectDB();
    return await ProductLink.findOne({ productId });
  } catch (error) {
    console.error('Error fetching product link:', error);
    return null;
  }
}

// Obter todos os links de produtos
export async function getAllProductLinks(): Promise<IProductLink[]> {
  try {
    await connectDB();
    return await ProductLink.find({}).sort({ productType: 1, productId: 1 });
  } catch (error) {
    console.error('Error fetching all product links:', error);
    return [];
  }
}

// Criar ou atualizar link de produto
export async function upsertProductLink(data: {
  productId: string;
  productType: 'pack' | 'supplement' | 'shake';
  purchaseUrl: string;
  available?: boolean;
  customMessage?: string;
  country?: string;
}): Promise<IProductLink | null> {
  try {
    await connectDB();
    return await ProductLink.findOneAndUpdate(
      { productId: data.productId },
      data,
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error upserting product link:', error);
    return null;
  }
}

// Deletar link de produto
export async function deleteProductLink(productId: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await ProductLink.deleteOne({ productId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting product link:', error);
    return false;
  }
}

// Atualizar disponibilidade de produto
export async function updateProductAvailability(productId: string, available: boolean): Promise<IProductLink | null> {
  try {
    await connectDB();
    return await ProductLink.findOneAndUpdate(
      { productId },
      { available },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating product availability:', error);
    return null;
  }
}