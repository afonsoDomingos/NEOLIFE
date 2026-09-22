import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductLink extends Document {
  productId: string; // ID do produto/pack (ex: pack-vitality, tre-en-en)
  productType: 'pack' | 'supplement' | 'shake';
  purchaseUrl: string; // URL de compra configurada pelo admin
  available: boolean; // Se o produto está disponível para compra
  customMessage?: string; // Mensagem personalizada quando não disponível
  country?: string; // Código do país (opcional, para links específicos por país)
  createdAt: Date;
  updatedAt: Date;
}

const ProductLinkSchema: Schema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true, // Um link por produto
    },
    productType: {
      type: String,
      enum: ['pack', 'supplement', 'shake'],
      required: true,
    },
    purchaseUrl: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    customMessage: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index para queries rápidas
ProductLinkSchema.index({ productId: 1 });
ProductLinkSchema.index({ productType: 1 });
ProductLinkSchema.index({ available: 1 });

const ProductLink: Model<IProductLink> = mongoose.models.ProductLink || mongoose.model<IProductLink>('ProductLink', ProductLinkSchema);

export default ProductLink;