import { Theme } from '@/types';

export const themes: Theme[] = [
  {
    id: 'saude',
    title: 'Saúde & Nutrição Celular',
    description: 'Eleve a forma como você cuida da sua saúde, de dentro para fora, através da nutrição celular.',
    slug: 'saude',
    active: true,
    order: 1,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop'
  },
  {
    id: 'liberdade-renda',
    title: 'Liberdade e Renda',
    description: 'Construa uma nova fonte de renda através do marketing de rede e transforme seu negócio em liberdade para escolher como viver.',
    slug: 'liberdade-renda',
    active: true,
    order: 2,
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop'
  },
  {
    id: 'mundo-experiencias',
    title: 'Mundo e Experiências',
    description: 'Expanda seus horizontes, conheça o mundo e transforme seu negócio em novas experiências de vida.',
    slug: 'mundo-experiencias',
    active: true,
    order: 3,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'
  },
  {
    id: 'conheca-neolife',
    title: 'Conheça a NeoLife',
    description: 'Descubra quem somos, a nossa missão e como podemos ajudar a transformar a sua vida.',
    slug: 'conheca-neolife',
    active: true,
    order: 4,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop'
  },
  {
    id: 'produtos',
    title: 'Nossos Produtos',
    description: 'Conheça a linha de produtos de nutrição celular e suplementação de alta qualidade.',
    slug: 'produtos',
    active: true,
    order: 5,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop'
  },
  {
    id: 'oportunidade',
    title: 'Oportunidade de Negócio',
    description: 'Descubra como pode construir o seu próprio negócio independente com a NeoLife.',
    slug: 'oportunidade',
    active: true,
    order: 6,
    image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop'
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