# Configuração MongoDB - NeoLife Website

## ✅ Configuração Completa

O MongoDB foi configurado com sucesso para substituir o sistema JSON local.

## 🔧 Configurações Realizadas

### 1. Instalação do Mongoose
```bash
npm install mongoose
```
✅ Mongoose v9.9.4 instalado

### 2. Variáveis de Ambiente
Adicionadas ao `.env.local`:
```env
MONGODB_URI=mongodb+srv://karinganastudio23:VIbemongodb@cluster0.oe0akin.mongodb.net/neolifedb?retryWrites=true&w=majority
```

### 3. Conexão MongoDB
Criado `src/lib/db/mongodb.ts`:
- Conexão com caching para hot reload
- Tratamento de erros
- Configuração otimizada

### 4. Model Mongoose
Criado `src/lib/db/models/Lead.ts`:
- Schema de Lead com todos os campos
- Índices para performance
- Validações automáticas
- Timestamps automáticos

### 5. Funções de Banco de Dados
Criado `src/lib/db/leads-mongodb.ts`:
- `createLead()` - Criar novo lead
- `updateLead()` - Atualizar lead existente
- `getLeadById()` - Obter lead por ID
- `getLeadsByFilters()` - Filtrar leads
- `getAllLeads()` - Obter todos os leads
- `getLeadStats()` - Estatísticas agregadas

### 6. Atualização de APIs
Atualizadas todas as APIs para usar MongoDB:
- `POST /api/leads` - Criação de leads
- `GET /api/admin/leads` - Listagem com filtros
- `PATCH /api/admin/leads/[id]` - Atualização
- `GET /api/admin/stats` - Estatísticas

### 7. Atualização de Componentes
Atualizado `src/app/admin/leads/page.tsx`:
- Adaptação para MongoDB IDs (_id)
- Filtros funcionais
- Compatibilidade com Mongoose

### 8. Remoção de Sistema JSON
Removido `src/lib/db/leads.ts` (sistema JSON antigo)

### 9. Next.js Config
Atualizado `next.config.ts`:
- Exposição de MONGODB_URI

## 🎯 Estrutura do Banco de Dados

### Coleção: leads
```javascript
{
  _id: ObjectId,
  country: String,
  name: String,
  phone: String,
  email: String,
  theme: String,
  whatsapp: String (opcional),
  source: String (opcional),
  campaign: String (opcional),
  notes: String (opcional),
  status: Enum ['novo', 'contactado', 'acompanhamento', 'interessado', 'convertido', 'nao_interessado'],
  createdAt: Date,
  updatedAt: Date
}
```

### Índices Criados
- `email` - Para busca rápida por email
- `phone` - Para busca rápida por telefone
- `country` - Para agregações por país
- `theme` - Para agregações por tema
- `status` - Para filtros por estado
- `createdAt` - Para ordenação temporal

## 🚀 Benefícios da Migração

### Performance
- Consultas otimizadas com índices
- Agregações no nível do banco
- Caching de conexão
- Escalabilidade horizontal

### Funcionalidades
- Consultas complexas com filtros
- Agregações e estatísticas
- Validações no nível do schema
- Relacionamentos futuros

### Manutenção
- Backup automático pelo MongoDB Atlas
- Escalabilidade automática
- Monitoramento via MongoDB Atlas
- Recuperação de desastres

## 📊 Capacidades do MongoDB Atlas

### Plano Gratuito (M0)
- 512 MB de armazenamento
- Compartilhado
- Replicação automática
- Backup automático
- Monitoramento básico

### Plano Atual (Cluster0)
- Banco de dados: `neolifedb`
- Cluster: `oe0akin`
- Região: Configurada no Atlas
- Replica set automático

## 🔒 Segurança

### Proteções Implementadas
- Variável de ambiente protegida
- Conexão via MongoDB Atlas (segura)
- Validações no schema
- Sanitização automática do Mongoose

### Boas Práticas
- Never commitar `.env.local`
- Usar variáveis de ambiente
- Conexão via string de conexão segura
- Índices para performance

## 🎨 Funcionalidades Disponíveis

### CRUD Completo
- ✅ Create - Criar leads via formulário
- ✅ Read - Listar todos os leads
- ✅ Read - Filtrar leads por múltiplos critérios
- ✅ Update - Atualizar estado do lead
- ✅ Delete - (Pode ser adicionado se necessário)

### Agregações
- ✅ Total de leads
- ✅ Leads de hoje
- ✅ Leads por país
- ✅ Leads por tema
- ✅ Leads por campanha
- ✅ Leads por estado

### Filtros Avançados
- ✅ Busca por nome, email, telefone
- ✅ Filtro por país
- ✅ Filtro por tema
- ✅ Filtro por estado
- ✅ Filtro por período (data)

## 🔄 Compatibilidade com Sistema Antigo

### Mantido Compatível
- A interface permanece a mesma
- APIs retornam o mesmo formato
- Componentes não precisaram de grandes alterações
- Experiência do usuário inalterada

### Melhorias
- IDs agora são ObjectId do MongoDB
- Timestamps automáticos
- Validações no banco
- Performance superior

## 📝 Próximos Passos Opcionais

### Expansões Possíveis
1. **Coleções adicionais:**
   - `users` - Utilizadores admin
   - `themes` - Temas dinâmicos
   - `countries` - Países dinâmicos
   - `campaigns` - Campanhas

2. **Relacionamentos:**
   - Leads com campanhas
   - Leads com follow-ups
   - Histórico de alterações

3. **Funcionalidades avançadas:**
   - Full-text search
   - Geolocalização
   - Analytics avançados
   - Export de dados

## ✅ Status Atual

**Configuração MongoDB: 100% COMPLETA**

- ✅ Mongoose instalado
- ✅ Variáveis de ambiente configuradas
- ✅ Conexão MongoDB funcional
- ✅ Schema de Lead criado
- ✅ Funções CRUD implementadas
- ✅ APIs atualizadas
- ✅ Componentes adaptados
- ✅ Sistema JSON removido
- ✅ Índices criados
- ✅ Next.js config atualizado

O sistema agora usa MongoDB Atlas para armazenamento de dados com performance e escalabilidade superiores! 🎯