# Sistema de Banners Dinâmicos - NeoLife Website

## ✅ Sistema Implementado

Sistema completo de banners dinâmicos com gestão administrativa, armazenamento em MongoDB e exibição automática no website.

## 🎯 Funcionalidades

### 1. Gestão de Banners (Admin)
- **Criar Banners:** Adicionar novos banners com imagem, título, descrição
- **Editar Banners:** Modificar banners existentes
- **Apagar Banners:** Remover banners não usados
- **Ativar/Desativar:** Controlar visibilidade
- **Ordenação:** Definir ordem de exibição
- **Data Limites:** Configurar período de exibição (opcional)
- **Links e Botões:** Adicionar CTAs com links personalizados

### 2. Exibição Automática (Frontend)
- **Carrossel Automático:** Muda banner a cada 5 segundos
- **Navegação Manual:** Setas e pontos de navegação
- **Animações Suaves:** Transições elegantes
- **Design Responsivo:** Adapta-se a todos os tamanhos
- **Links Inteligentes:** Banner clicável se tiver link definido

### 3. Armazenamento em MongoDB
- **Modelo Banner:** Schema completo com todos os campos
- **Índices Otimizados:** Performance máxima
- **Query Inteligente:** Apenas banners ativos e dentro do período
- **Timestamps Automáticos:** createdAt e updatedAt

## 📁 Estrutura do Sistema

### Model MongoDB
```typescript
interface IBanner {
  title: string;           // Título do banner
  description: string;      // Descrição
  image: string;           // URL da imagem (Cloudinary)
  link?: string;           // Link opcional
  buttonText?: string;     // Texto do botão opcional
  active: boolean;         // Estado de visibilidade
  order: number;           // Ordem de exibição
  startDate?: Date;        // Data de início (opcional)
  endDate?: Date;          // Data de fim (opcional)
  createdAt: Date;         // Data de criação
  updatedAt: Date;         // Data de atualização
}
```

### APIs Criadas

**Admin APIs:**
- `GET /api/admin/banners` - Listar todos os banners
- `POST /api/admin/banners` - Criar novo banner
- `PATCH /api/admin/banners/[id]` - Atualizar banner
- `DELETE /api/admin/banners/[id]` - Apagar banner

**Public API:**
- `GET /api/banners` - Obter banners ativos (público)

### Componentes

**Admin:**
- `/admin/banners` - Página de gestão de banners

**Frontend:**
- `DynamicBanner` - Componente de carrossel de banners
- Integração automática na homepage

## 🎨 Como Usar

### Aceder à Gestão de Banners
1. Vai a: http://localhost:3000/admin/banners
2. Clica em "+ Novo Banner"
3. Preenche o formulário:
   - **Título:** Título do banner
   - **Descrição:** Texto descritivo
   - **Imagem:** Upload via Cloudinary
   - **Link (opcional):** URL para o CTA
   - **Texto do Botão (opcional):** "Saiba Mais", etc.
   - **Data de Início/Fim (opcional):** Período de exibição
   - **Ordem:** Ordem de exibição
   - **Ativo:** Marca se deve ser exibido

### Exibir Banners no Site
- Os banners aparecem automaticamente na homepage
- Apenas banners ativos são exibidos
- Banners fora do período não aparecem
- Banner com link é clicável na íntegra

## 🔧 Configurações

### Animações
O banner já inclui animações CSS no `globals.css`:
- `animate-fade-in` - Fade in suave
- `animate-fade-in-up` - Fade in com slide up
- Transições de 0.6s

### Comportamento do Carrossel
- **Intervalo:** 5 segundos por banner
- **Navegação:** Setas e pontos
- **Transição:** Suave com scale no hover
- **Height:** 96px (mobile) a 500px (desktop)

## 📊 Campos do Banner

### Obrigatórios:
- **title** - Título principal
- **description** - Texto descritivo
- **image** - URL da imagem
- **order** - Ordem de exibição

### Opcionais:
- **link** - URL para redirecionamento
- **buttonText** - Texto do botão CTA
- **startDate** - Data de início da campanha
- **endDate** - Data de fim da campanha

### Automáticos:
- **active** - Padrão: true
- **createdAt** - Gerado automaticamente
- **updatedAt** - Atualizado automaticamente

## 🎯 Exemplos de Uso

### Banner Promocional
```json
{
  "title": "Oferta Especial",
  "description": "Ganhe 50% de desconto no primeiro mês",
  "image": "https://res.cloudinary.com/...",
  "link": "/oferta-especial",
  "buttonText": "Aproveitar Agora",
  "active": true,
  "order": 1,
  "startDate": "2026-09-01",
  "endDate": "2026-09-30"
}
```

### Banner Institucional
```json
{
  "title": "Conheça a NeoLife",
  "description": "Transforme a sua vida com a NeoLife",
  "image": "https://res.cloudinary.com/...",
  "active": true,
  "order": 2
}
```

### Banner de Campanha
```json
{
  "title": "Oportunidade de Negócio",
  "description": "Comece o seu negócio hoje mesmo",
  "image": "https://res.cloudinary.com/...",
  "link": "/interesse?tema=oportunidade",
  "buttonText": "Começar Agora",
  "active": true,
  "order": 3
}
```

## 🔒 Segurança

- **Admin Authentication:** APIs protegidas (bypass em dev)
- **Validation:** Validação de campos obrigatórios
- **MongoDB:** Conexão segura via Atlas
- **Cloudinary:** Upload seguro de imagens

## 📱 Responsividade

**Mobile:**
- Height: 384px (h-96)
- Setas e pontos adaptados
- Texto ajustado automaticamente

**Tablet:**
- Height: ajustado proporcionalmente
- Touch-friendly navigation

**Desktop:**
- Height: 500px
- Animações completas
- Hover effects

## 🚀 Próximas Melhorias

Funcionalidades que podem ser adicionadas:

1. **Analytics de Banners:**
   - Click tracking
   - Impressions counting
   - CTR calculation

2. **A/B Testing:**
   - Múltiplas versões
   - Performance comparison
   - Auto-optimization

3. **Advanced Scheduling:**
   - Time-based scheduling
   - Recurring campaigns
   - Priority rules

4. **Rich Media:**
   - Video banners
   - Animated GIFs
   - Interactive elements

5. **Personalization:**
   - User-based banners
   - Geo-targeting
   - Behavioral targeting

## 📝 Notas Importantes

### Performance
- Imagens servidas via Cloudinary CDN
- Otimização automática de formato
- Lazy loading de banners
- Animações CSS (GPU accelerated)

### Best Practices
- Use imagens otimizadas (WebP preferido)
- Tamanho recomendado: 1920x600px
- Texto legível sobre imagem (overlay escuro)
- CTA claro e action-oriented
- Período definido para campanhas temporárias

### Troubleshooting

**Banner não aparece:**
- Verifica se está ativo
- Confirma se está dentro do período
- Verifica ordem de exibição
- Testa a API `/api/banners`

**Imagem não carrega:**
- Verifica URL do Cloudinary
- Confirma que a imagem existe
- Testa acesso direto à URL

**Navegação não funciona:**
- Verifica se há múltiplos banners
- Confirma que o componente está montado
- Testa clicar nos pontos e setas

## ✅ Status Atual

**Sistema de Banners: 100% COMPLETO**

- ✅ Model MongoDB criado
- ✅ APIs administrativas implementadas
- ✅ API pública para banners ativos
- ✅ Componente de carrossel dinâmico
- ✅ Página de gestão admin
- ✅ Integração na homepage
- ✅ Upload de imagens via Cloudinary
- ✅ Sistema de ordenação
- ✅ Controle de período de exibição
- ✅ Animações e transições
- ✅ Design responsivo
- ✅ Dashboard atualizado

O sistema de banners dinâmicos está totalmente funcional e pronto para uso! 🎯