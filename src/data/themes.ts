import { Theme } from '@/types';

export const themes: Theme[] = [
  {
    id: 'conheca-neolife',
    title: 'Conheça a NeoLife',
    description: 'Descubra quem somos, a nossa missão e como podemos ajudar a transformar a sua vida.',
    slug: 'conheca-neolife',
    active: true,
    order: 1,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop'
  },
  {
    id: 'como-funciona',
    title: 'Como Funciona',
    description: 'Entenda o funcionamento do nosso modelo de negócio e como pode começar.',
    slug: 'como-funciona',
    active: true,
    order: 2,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
  },
  {
    id: 'produtos',
    title: 'Nossos Produtos',
    description: 'Conheça a linha de produtos de alta qualidade que oferecemos.',
    slug: 'produtos',
    active: true,
    order: 3,
    image: 'https://images.unsplash.com/photo-1556228578-cca67002c5b4?w=800&h=600&fit=crop'
  },
  {
    id: 'oportunidade',
    title: 'Oportunidade de Negócio',
    description: 'Descubra como pode construir o seu próprio negócio com a NeoLife.',
    slug: 'oportunidade',
    active: true,
    order: 4,
    image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop'
  },
  {
    id: 'beneficios',
    title: 'Benefícios',
    description: 'Conheça todos os benefícios de fazer parte da família NeoLife.',
    slug: 'beneficios',
    active: true,
    order: 5,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
  },
  {
    id: 'como-comecar',
    title: 'Como Começar',
    description: 'Passo a passo simples para iniciar a sua jornada com a NeoLife.',
    slug: 'como-comecar',
    active: true,
    order: 6,
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop'
  },
  {
    id: 'historias',
    title: 'Histórias de Sucesso',
    description: 'Inspire-se com histórias reais de pessoas que transformaram as suas vidas.',
    slug: 'historias',
    active: true,
    order: 7,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop'
  }
];

export const getActiveThemes = (): Theme[] => {
  return themes
    .filter(theme => theme.active)
    .sort((a, b) => a.order - b.order);
};

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getThemeBySlug = (slug: string): Theme | undefined => {
  return themes.find(theme => theme.slug === slug);
};