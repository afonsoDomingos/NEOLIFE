# Configuração Cloudinary - NeoLife Website

## ✅ Configuração Completa

O Cloudinary foi configurado com sucesso para upload de imagens no projeto NeoLife.

## 🔧 Configurações Realizadas

### 1. Instalação do Pacote
```bash
npm install cloudinary
```
✅ Cloudinary v2.11.0 instalado

### 2. Variáveis de Ambiente
Adicionadas ao `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dnvnftvky
CLOUDINARY_API_KEY=259851568455899
CLOUDINARY_API_SECRET=3hRsXzUVd3pnwn9IKQWN7UAeJLc
```

### 3. Utilitários Cloudinary
Criado `src/lib/utils/cloudinary.ts`:
- `uploadImage()` - Upload de imagens para Cloudinary
- `deleteImage()` - Remoção de imagens
- `getImageUrl()` - Obter URL de imagem
- `getOptimizedImageUrl()` - Obter URL otimizada

### 4. Componente de Upload
Criado `src/components/ui/ImageUpload.tsx`:
- Interface visual para upload de imagens
- Preview de imagens
- Validação de tipo e tamanho
- Suporte para drag & drop
- Tratamento de erros

### 5. API de Upload
Criado `src/app/api/upload/route.ts`:
- Endpoint POST para upload
- Integração com Cloudinary
- Tratamento de erros

### 6. Integração no Admin
Atualizado `src/app/admin/themes/page.tsx`:
- Campo de upload de imagem no formulário de temas
- Preview de imagem na lista de temas
- Suporte para editar e remover imagens

### 7. Atualização de Tipos
Atualizado `src/types/index.ts`:
- Adicionado `publicId` ao tipo `Theme` para gestão de imagens

### 8. Imagens de Exemplo
Atualizado `src/data/themes.ts`:
- Substituídos placeholders por imagens reais do Unsplash
- Todos os temas agora têm imagens

### 9. Homepage Atualizada
Atualizado `src/app/page.tsx`:
- Cards de temas agora exibem as imagens reais
- Fallback para placeholder se não houver imagem

### 10. Next.js Config
Atualizado `next.config.ts`:
- Variáveis de ambiente expostas para o cliente
- Configuração de ambiente Cloudinary

## 🎯 Como Usar

### Upload de Imagens no Admin

1. **Aceda à gestão de temas:**
   ```
   http://localhost:3000/admin/themes
   ```

2. **Clique em "+ Novo Tema" ou "Editar" num tema existente**

3. **Use o componente de upload:**
   - Clique em "Selecionar imagem"
   - Escolha uma imagem do seu computador
   - Ou arraste uma imagem para a área de upload

4. **Valideções automáticas:**
   - Apenas imagens (JPG, PNG, WebP)
   - Máximo 5MB
   - Otimização automática

5. **Preview imediato:**
   - A imagem é exibida antes do upload
   - Pode remover se não gostar

6. **Submita o formulário:**
   - A imagem é enviada para o Cloudinary
   - URL é guardada no tema
   - Imagem fica disponível no website

## 📊 Estrutura de Armazenamento

### Cloudinary Folders
```
neolife/
├── themes/          # Imagens dos temas
├── countries/       # Imagens dos países (futuro)
├── products/        # Imagens dos produtos (futuro)
└── testimonials/    # Imagens de testemunhos (futuro)
```

### Otimizações Automáticas
- Formato automático (WebP preferido)
- Qualidade automática
- Redimensionamento inteligente
- Compressão sem perda de qualidade

## 🔒 Segurança

### Variáveis de Ambiente
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Pública (necessária no cliente)
- `CLOUDINARY_API_KEY` - Privada (apenas servidor)
- `CLOUDINARY_API_SECRET` - Privada (apenas servidor)

### Proteções
- Validação de tipo de ficheiro
- Limite de tamanho (5MB)
- Apenas formatos permitidos
- Upload apenas via API autenticada

## 🎨 Benefícios

### Performance
- Imagens servidas via CDN global
- Otimização automática
- Lazy loading nativo
- Formatos modernos (WebP)

### Gestão
- Upload fácil via interface admin
- Preview em tempo real
- Gestão de versões
- Eliminação de imagens não usadas

### Escalabilidade
- Armazenamento ilimitado
- CDN global
- Backup automático
- Transformações on-the-fly

## 🚀 Próximos Passos

### Expandir para Outros Secções
1. **Países** - Adicionar bandeiras/imagens
2. **Produtos** - Galeria de produtos
3. **Testemunhos** - Fotos de clientes
4. **Blog** - Imagens de artigos

### Funcionalidades Adicionais
1. **Galeria de imagens** - Seleção múltipla
2. **Crop e resize** - Editor de imagens
3. **Filtros** - Efeitos visuais
4. **Backup local** - Cópia de segurança

## 📝 Notas Importantes

### Desenvolvimento vs Produção
- Em desenvolvimento: usa as credenciais fornecidas
- Em produção: deve usar credenciais da conta Cloudinary oficial

### Custos
- Cloudinary tem plano gratuito generoso
- Plano Free: 25GB de armazenamento
- 25GB de bandwidth mensal
- Suficiente para desenvolvimento e pequeno projeto

### Alternativas
Se necessário, pode alternar para:
- AWS S3 + CloudFront
- Firebase Storage
- Supabase Storage
- R2 Cloudflare

## ✅ Status Atual

**Configuração Cloudinary: 100% COMPLETA**

- ✅ Pacote instalado
- ✅ Variáveis de ambiente configuradas
- ✅ Utilitários criados
- ✅ Componente de upload funcional
- ✅ API de upload operacional
- ✅ Integração no admin completa
- ✅ Imagens de exemplo adicionadas
- ✅ Homepage atualizada
- ✅ Next.js config atualizado

O sistema de upload de imagens está totalmente funcional e pronto para uso! 🎯