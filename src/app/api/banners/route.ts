import { NextRequest, NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db/banners-mongodb';

const fallbackBanner = [
  {
    _id: 'default-banner-01',
    titleEn: 'Build Your Own Business with NeoLife in Africa',
    titlePt: 'Construa o Seu Próprio Negócio com a NeoLife em África',
    descriptionEn: 'Discover how to transform your health, wellness, and achieve financial independence working from anywhere.',
    descriptionPt: 'Descubra como transformar a sua saúde, bem-estar e conquistar a sua independência financeira trabalhando a partir de qualquer lugar.',
    image: '/banner01.jpg',
    link: '/#temas',
    buttonTextEn: 'Learn More',
    buttonTextPt: 'Quero Saber Mais',
    active: true,
    order: 1,
  },
  {
    _id: 'default-banner-02',
    titleEn: 'Health, Vitality, and Financial Freedom',
    titlePt: 'Saúde, Vitalidade e Liberdade Financeira',
    descriptionEn: 'Join the NeoLife family and discover the power of high-quality scientific cellular nutrition, alongside the mentorship of José and Ofélia Machado.',
    descriptionPt: 'Junte-se à família NeoLife e descubra o poder da nutrição celular de alta qualidade científica, ao lado da mentoria de José e Ofélia Machado.',
    image: '/banneroficial.png',
    link: '/oportunidade',
    buttonTextEn: 'Discover the Opportunity',
    buttonTextPt: 'Conhecer a Oportunidade',
    active: true,
    order: 2,
  },
  {
    _id: 'default-banner-03',
    titleEn: 'Superior Nutrition & Cellular Vitality for Your Whole Family',
    titlePt: 'Nutrição Superior & Vitalidade Celular para Toda a Família',
    descriptionEn: 'Based in Nature and Backed by Science. Discover premium quality supplements formulated to optimize your daily well-being.',
    descriptionPt: 'Baseada na Natureza e Apoiada pela Ciência. Descubra suplementos de qualidade máxima formulados para otimizar o seu bem-estar diário.',
    image: '/banner01.jpg',
    link: '/saude',
    buttonTextEn: 'Explore Health Solutions',
    buttonTextPt: 'Explorar Soluções de Saúde',
    active: true,
    order: 3,
  }
];

export async function GET(request: NextRequest) {
  try {
    const banners = await getActiveBanners();
    if (Array.isArray(banners) && banners.length > 0) {
      // Check if banners have bilingual fields
      const hasBilingualFields = banners.some(
        (b: any) => b.titleEn || b.titlePt || b.descriptionEn || b.descriptionPt
      );

      // If banners don't have bilingual fields, use fallback
      if (!hasBilingualFields) {
        console.log('Banners in MongoDB lack bilingual fields, using fallback');
        return NextResponse.json(fallbackBanner);
      }

      return NextResponse.json(banners);
    }
    return NextResponse.json(fallbackBanner);
  } catch (error) {
    console.error('Error fetching active banners, using fallback banner01:', error);
    return NextResponse.json(fallbackBanner);
  }
}