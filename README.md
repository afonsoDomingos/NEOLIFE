# NeoLife Website - Website de Conversão para Mercado Africano

Website profissional e orientado para conversão da NeoLife, focado no mercado africano. O sistema funciona como uma máquina de geração, captação, qualificação e organização de potenciais clientes.

## 🚀 Funcionalidades

### Website Público
- **Homepage** com hero section e lista de temas de interesse
- **Sistema de seleção de país** com países africanos configuráveis
- **Formulário de captação de leads** otimizado para conversão
- **Página de confirmação** com próximos passos
- **Design responsivo** (mobile-first)
- **Sistema de tracking de campanhas** integrado

### Área Administrativa
- **Dashboard** com estatísticas de leads
- **Gestão de leads** com filtros e atualização de estado
- **Gestão de temas** (criar, editar, apagar)
- **Gestão de países** (ativar/desativar disponibilidade)
- **Sistema de autenticação** protegido

### Sistema de Conversão
```
Publicidade → Interesse → Landing Page → País → Tema → Formulário → 
Conteúdo automático → Lead qualificado → CRM → Contacto pessoal → Conversão
```

## 🛠️ Stack Tecnológico

- **Next.js 16** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **React 19** para componentes interativos
- **JSON local** para armazenamento de dados (fácil migração para banco de dados)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd neolife-website
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env.local
```

Edite o ficheiro `.env.local` com as suas configurações:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-measurement-id
NEXT_PUBLIC_META_PIXEL_ID=your-meta-pixel-id
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
NEXT_PUBLIC_PHONE_NUMBER=1234567890
NEXT_PUBLIC_EMAIL=contato@neolife.com
NEXT_PUBLIC_SITE_URL=https://neolife.com
```

## 🏃 Executar o Projeto

### Modo Desenvolvimento
```bash
npm run dev
```
Aceda a http://localhost:3000

### Build de Produção
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js
│   ├── admin/             # Área administrativa
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── leads/         # Gestão de leads
│   │   ├── themes/        # Gestão de temas
│   │   ├── countries/     # Gestão de países
│   │   └── login/         # Login admin
│   ├── api/               # API routes
│   │   ├── admin/         # APIs admin
│   │   └── leads/         # API de leads
│   ├── interesse/         # Página de seleção de país
│   ├── formulario/        # Formulário de captação
│   ├── confirmacao/       # Página de confirmação
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Homepage
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── forms/            # Componentes de formulários
│   └── admin/            # Componentes admin
├── data/                 # Dados estáticos
│   ├── countries.ts      # Configuração de países
│   ├── themes.ts         # Configuração de temas
│   └── leads.json        # Base de dados de leads
├── lib/                  # Utilitários
│   ├── db/              # Camada de dados
│   └── utils/           # Funções auxiliares
└── types/               # TypeScript types
```

## 🔧 Configuração

### Adicionar/Editar Países
Edite o ficheiro `src/data/countries.ts`:

```typescript
export const countries: Country[] = [
  {
    id: 'mz',
    name: 'Moçambique',
    code: 'MZ',
    available: true,
    flag: '🇲🇿'
  },
  // Adicione mais países...
];
```

### Adicionar/Editar Temas
Edite o ficheiro `src/data/themes.ts`:

```typescript
export const themes: Theme[] = [
  {
    id: 'novo-tema',
    title: 'Novo Tema',
    description: 'Descrição do tema',
    slug: 'novo-tema',
    active: true,
    order: 8,
    image: '/images/themes/novo-tema.jpg'
  },
  // Adicione mais temas...
];
```

### Configurar Analytics
No ficheiro `src/app/layout.tsx`, adicione os componentes de analytics:

```typescript
import { GoogleAnalytics } from '@/components/ui/Analytics';
import { MetaPixel } from '@/components/ui/Analytics';

// No componente:
<GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
<MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID!} />
```

## 🎯 Tracking de Campanhas

O sistema suporta tracking de campanhas através de parâmetros URL:

```
/interesse?tema=oportunidade&campanha=facebook-video-01&utm_source=facebook&utm_medium=cpc
```

Parâmetros suportados:
- `campanha` - Identificador da campanha
- `utm_source` - Fonte do tráfego
- `utm_medium` - Meio do tráfego
- `utm_content` - Conteúdo do anúncio
- `utm_term` - Termos de pesquisa

## 🔐 Credenciais Admin

Por defeito:
- **Username:** `admin`
- **Password:** `admin123`

**IMPORTANTE:** Altere estas credenciais em produção!

### Modo Desenvolvimento
Durante o desenvolvimento, a autenticação é **bypassada automaticamente** para facilitar o teste. Pode aceder diretamente às páginas admin sem fazer login:

- **Dashboard:** http://localhost:3000/admin/dashboard
- **Leads:** http://localhost:3000/admin/leads
- **Temas:** http://localhost:3000/admin/themes
- **Países:** http://localhost:3000/admin/countries

Em produção, a autenticação será obrigatória.

## 📱 Responsividade

O website é totalmente responsivo com prioridade mobile:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🌍 SEO e Performance

O website está otimizado para:
- SEO com metadata configurável
- Performance com lazy loading
- Core Web Vitals otimizados
- Imagens otimizadas (adicione as imagens em `/public/images/`)

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Outras Plataformas
O projeto está pronto para deploy em qualquer plataforma que suporte Next.js.

## 📞 Suporte

Para questões ou suporte, contacte:
- Email: contato@neolife.com
- WhatsApp: +1234567890

## 📝 Próximos Passos

Para produção, considere:
1. Migrar de JSON para banco de dados (PostgreSQL/MongoDB)
2. Implementar sistema de autenticação robusto (NextAuth.js)
3. Adicionar integração de email/WhatsApp automática
4. Implementar sistema de upload de imagens
5. Adicionar suporte multi-idiomas
6. Configurar domínio e SSL
7. Implementar testes automatizados
8. Adicionar CI/CD

## 📄 Licença

Copyright © 2026 NeoLife. Todos os direitos reservados.