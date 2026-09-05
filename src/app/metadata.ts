export const siteConfig = {
  name: 'NeoLife',
  description: 'Descubra como a NeoLife pode transformar a sua vida através da saúde, bem-estar e oportunidades de negócio em África.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://neolife.com', // Update with actual URL
  ogImage: '/og-image.jpg', // Add actual OG image
  links: {
    twitter: 'https://twitter.com/neolife',
    facebook: 'https://facebook.com/neolife',
    instagram: 'https://instagram.com/neolife',
  },
};

export const seoConfig = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Transformando Vidas`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'NeoLife',
    'saúde',
    'bem-estar',
    'negócio',
    'oportunidades',
    'África',
    'Moçambique',
    'Angola',
    'África do Sul',
    'network marketing',
    'suplementos',
    'nutrição',
  ],
  authors: [{ name: 'NeoLife' }],
  creator: 'NeoLife',
  publisher: 'NeoLife',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@neolife',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'your-google-verification-code', // Add actual verification code
    yandex: 'your-yandex-verification-code', // Add if needed
  },
};