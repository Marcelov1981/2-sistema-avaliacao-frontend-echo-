# Correlação Completa do Sistema SaaS - GeoMind

## 📋 Visão Geral do Sistema

O **GeoMind** é um sistema SaaS completo para análise de imóveis com IA, oferecendo funcionalidades de avaliação, comparação e geração de relatórios técnicos.

---

## 🏗️ Arquitetura do Sistema

### Frontend (React + Vite)
- **Framework**: React 19.1.0 com Vite 7.0.4
- **UI Library**: Ant Design 5.27.3 + Lucide React
- **Estado**: Context API + localStorage
- **Requisições**: Axios 1.11.0
- **PDF**: jsPDF + html2canvas
- **IA**: Google Generative AI (@google/generative-ai)

### Backend (Node.js + Express)
- **Runtime**: Node.js com ES Modules
- **Framework**: Express.js
- **Autenticação**: JWT + bcryptjs
- **Validação**: express-validator
- **Segurança**: helmet + cors
- **Logging**: morgan
- **Storage**: Arquivos JSON + uploads estáticos

---

## 📊 Estrutura de Dados e Relacionamentos

### Entidades Principais

#### 1. **Usuários** (`/backend/data/usuarios.json`)
```json
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "senha": "hash_bcrypt",
  "cpfCnpj": "string",
  "telefone": "string",
  "endereco": "object",
  "plano": "string",
  "status": "ativo|inativo",
  "data_criacao": "ISO_date",
  "ultimo_login": "ISO_date"
}
```

#### 2. **Clientes** (`/backend/data/clientes.json`)
```json
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "telefone": "string",
  "cpfCnpj": "string",
  "endereco": "object",
  "data_criacao": "ISO_date",
  "usuario_id": "uuid" // FK para usuários
}
```

#### 3. **Projetos** (`/backend/data/projetos.json`)
```json
{
  "id": "uuid",
  "nome": "string",
  "cliente_id": "uuid", // FK para clientes
  "tipo_imovel": "string",
  "endereco_imovel": "object",
  "area_terreno": "number",
  "area_construida": "number",
  "valor_estimado": "number",
  "finalidade_avaliacao": "string",
  "status": "string",
  "data_criacao": "ISO_date",
  "imagens": "array"
}
```

#### 4. **Orçamentos** (`/backend/data/orcamentos.json`)
```json
{
  "id": "uuid",
  "projeto_id": "uuid", // FK para projetos
  "valor": "number",
  "descricao": "string",
  "status": "pendente|aprovado|rejeitado",
  "data_criacao": "ISO_date",
  "data_vencimento": "ISO_date"
}
```

#### 5. **Avaliações** (`/backend/data/avaliacoes.json`)
```json
{
  "id": "uuid",
  "projeto_id": "uuid", // FK para projetos
  "tipo_analise": "single|multiple|comparison",
  "resultado_ia": "string",
  "imagens_analisadas": "array",
  "data_criacao": "ISO_date",
  "usuario_id": "uuid" // FK para usuários
}
```

### Relacionamentos
- **Usuário** → **Clientes** (1:N)
- **Cliente** → **Projetos** (1:N)
- **Projeto** → **Orçamentos** (1:N)
- **Projeto** → **Avaliações** (1:N)
- **Usuário** → **Avaliações** (1:N)

---

## 🔐 Sistema de Autenticação e Autorização

### Fluxo de Autenticação
1. **Login**: `POST /api/v1/usuarios/login`
   - Validação email/senha
   - Geração JWT token
   - Armazenamento no localStorage

2. **Middleware de Autenticação**:
   ```javascript
   const authenticateToken = (req, res, next) => {
     const token = req.headers['authorization']?.split(' ')[1];
     jwt.verify(token, JWT_SECRET, callback);
   }
   ```

3. **Interceptors Axios**:
   - Adiciona token automaticamente
   - Trata erros 401/403
   - Logout automático em caso de token inválido

### Sistema de Planos e Controle de Acesso

#### Planos Disponíveis (`/src/utils/AccessControl.js`)
- **CONSULTA_AVULSA**: R$ 5,00 por consulta
- **BASICO**: R$ 29,00/mês (50 consultas)
- **INTERMEDIARIO**: R$ 59,00/mês (200 consultas)
- **FULL**: R$ 99,00/mês (ilimitado)

#### Funcionalidades por Plano
```javascript
const PERMISSOES_PLANO = {
  CONSULTA_AVULSA: ['analise_imagem'],
  BASICO: ['analise_imagem', 'relatorio_pdf', 'historico_consultas'],
  INTERMEDIARIO: [...BASICO, 'comparacao_propriedades', 'dashboard_avancado'],
  FULL: [...INTERMEDIARIO, 'api_integracao', 'suporte_prioritario']
}
```

---

## 🔗 Correlação Frontend ↔ Backend

### Endpoints da API

| Componente Frontend | Endpoint Backend | Método | Funcionalidade |
|-------------------|------------------|--------|----------------|
| `Cliente.jsx` | `/api/v1/clientes` | GET/POST/PUT/DELETE | CRUD clientes |
| `Projetos.jsx` | `/api/v1/projetos` | GET/POST/PUT/DELETE | CRUD projetos |
| `Orçamentos.jsx` | `/api/v1/orcamentos` | GET/POST/PUT/DELETE | CRUD orçamentos |
| `Avaliacao.jsx` | `/api/v1/avaliacoes` | GET/POST/PUT/DELETE | CRUD avaliações |
| `Laudos.jsx` | `/api/v1/laudos` | GET/POST/PUT/DELETE | CRUD laudos |
| `Autenticacao.jsx` | `/api/v1/usuarios/login` | POST | Login |
| `CadastroUsuario.jsx` | `/api/v1/usuarios/register` | POST | Registro |
| `PerfilUsuario.jsx` | `/api/v1/usuarios/perfil` | GET/PUT | Perfil |
| `ConfiguracoesGerais.jsx` | `/api/v1/configuracoes` | GET/PUT | Configurações |
| `ConfiguracaoLogo.jsx` | `/api/v1/configuracoes/logo` | GET/POST | Logo |

### Configuração da API (`/src/config/api.js`)
```javascript
export const API_ENDPOINTS = {
  base: 'http://localhost:3001/api/v1',
  clientes: { base: '/api/v1/clientes' },
  projetos: { base: '/api/v1/projetos' },
  // ... outros endpoints
}
```

---

## 🤖 Integração com IA (Google Gemini)

### Serviço Principal (`/src/utils/GeminiService.js`)

#### Tipos de Análise
1. **Análise Única**: `analyzeImage(imageFile, prompt, propertyInfo)`
2. **Análise Múltipla**: `analyzeMultipleImages(imageFiles, prompt, propertyInfo)`
3. **Comparação**: `comparePropertyImages(images1, images2, prompt, propertyInfo)`

#### Fluxo de Análise
```javascript
// 1. Validação de imagens
if (analysisType === 'single' && images.length !== 1) {
  setError('Para análise única, selecione exatamente 1 imagem.');
  return;
}

// 2. Enriquecimento de dados
const enrichedPropertyInfo = {
  clientName: selectedClient?.nome,
  projectName: selectedProject?.nome,
  // ... outros dados do projeto
};

// 3. Chamada para Gemini
const result = await GeminiService.analyzeImage(
  images[0], 
  customPrompt, 
  enrichedPropertyInfo
);
```

### Componente de Análise (`/src/components/AIImageAnalysis.jsx`)
- Upload de imagens com validação
- Seleção de projeto/cliente para contexto
- Tipos de análise: single, multiple, comparison
- Geração de PDF com resultados
- Integração com sistema de créditos

---

## 💳 Sistema de Pagamentos e Monetização

### PaymentSystem (`/src/utils/PaymentSystem.js`)

#### Tipos de Transação
- `CONSULTA_AVULSA`: Pagamento por uso
- `ASSINATURA_MENSAL`: Planos mensais
- `UPGRADE_PLANO`: Mudança de plano
- `CREDITO_ADICIONAL`: Recarga de créditos

#### Métodos de Pagamento
- `CARTAO_CREDITO`: Cartão de crédito
- `PIX`: Pagamento instantâneo
- `BOLETO`: Boleto bancário
- `CREDITOS`: Saldo em conta

#### Fluxo de Cobrança
```javascript
// 1. Verificação de plano
const podeRealizar = paymentSystem.podeRealizarConsulta();

// 2. Processamento de pagamento
if (plano === 'CONSULTA_AVULSA') {
  const resultado = await paymentSystem.processarConsultaAvulsa({
    tipo: 'analise_imagem',
    valor: PRECOS_PLANO.CONSULTA_AVULSA
  });
}

// 3. Registro da consulta
paymentSystem.registrarConsultaRealizada(dadosConsulta, transacaoId);
```

### Componentes de Pagamento
- `PlanosAssinatura.jsx`: Seleção de planos
- `PagamentoPagina.jsx`: Processamento de pagamento
- `GerenciamentoCreditos.jsx`: Gestão de saldo
- `GerenciamentoCartoes.jsx`: Cartões salvos

---

## 📁 Sistema de Upload e Processamento de Imagens

### Componente ImageUpload (`/src/components/ImageUpload.jsx`)

#### Funcionalidades
- Drag & drop de arquivos
- Validação de tipo (JPEG, PNG, GIF, WebP)
- Validação de tamanho (máx. 5MB)
- Preview de imagens
- Remoção individual
- Limite configurável de imagens

#### Integração
```javascript
// Uso em formulários
<ImageUpload
  images={images}
  onImagesChange={setImages}
  maxImages={10}
  label="Anexar Imagens do Projeto"
/>
```

### Backend - Arquivos Estáticos
```javascript
// server.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));
```

### Compatibilidade Safari (`/src/utils/SafariCompatibility.js`)
- Detecção de Safari/iOS
- Download seguro de arquivos
- Fallbacks para funcionalidades não suportadas

---

## ⚙️ Sistema de Configurações e Cache

### Configurações Gerais (`/backend/data/configuracoes.json`)
```json
{
  "sistema": {
    "nome_empresa": "GeoMind",
    "versao": "1.0.0",
    "manutencao": false
  },
  "usuario": {
    "tema": "claro",
    "idioma": "pt-BR",
    "notificacoes": true
  },
  "integracao": {
    "gemini_api_key": "encrypted",
    "backup_automatico": true
  }
}
```

### Context de Projeto (`/src/contexts/ProjectContext.jsx`)
- Estado global do projeto atual
- Persistência no localStorage
- Sincronização entre componentes

### Cache e Persistência
- **localStorage**: Tokens, configurações, dados temporários
- **sessionStorage**: Estado da sessão
- **Context API**: Estado global da aplicação

---

## 🔄 Integrações e APIs Externas

### Rotas de Integração (`/backend/routes/integracoes.js`)

#### APIs Externas
```json
{
  "nome": "string",
  "url": "string",
  "tipo": "rest|graphql|soap",
  "headers": "object",
  "auth": "object",
  "ativo": "boolean"
}
```

#### Webhooks
```json
{
  "nome": "string",
  "url": "string",
  "eventos": "array",
  "secret": "string",
  "ativo": "boolean"
}
```

#### Endpoints Disponíveis
- `GET /api/v1/integracoes` - Listar integrações
- `POST /api/v1/integracoes/apis` - Criar API externa
- `POST /api/v1/integracoes/webhooks` - Criar webhook
- `POST /api/v1/integracoes/test/:tipo/:id` - Testar integração

### Serviços Integrados
1. **Google Gemini AI**: Análise de imagens
2. **CEP Service**: Busca de endereços
3. **Payment Gateway**: Processamento de pagamentos (simulado)
4. **Email Service**: Notificações (configurado)

---

## 🛡️ Sistema de Auditoria e Segurança

### Middleware de Auditoria (`/backend/middleware/auditoria.js`)

#### Logs de Atividade
```json
{
  "id": "timestamp_string",
  "userId": "uuid",
  "action": "CREATE|READ|UPDATE|DELETE",
  "resource": "clientes|projetos|orcamentos",
  "resourceId": "uuid",
  "timestamp": "ISO_date",
  "ip": "string",
  "userAgent": "string",
  "details": "object"
}
```

#### Implementação
```javascript
// Uso em rotas
router.post('/', authenticateToken, auditMiddleware('CREATE', 'clientes'), handler);

// Log automático
export const auditMiddleware = (action, resource) => {
  return (req, res, next) => {
    logActivity(req.user.id, action, resource, req.params.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    next();
  };
};
```

### Segurança Implementada
- **Helmet**: Headers de segurança
- **CORS**: Controle de origem
- **JWT**: Tokens seguros
- **bcryptjs**: Hash de senhas
- **express-validator**: Validação de entrada
- **Rate Limiting**: Controle de requisições

---

## 💾 Sistema de Backup e Recuperação

### Backup Service (`/backend/routes/backup.js`)

#### Funcionalidades
- Backup automático de todos os dados JSON
- Versionamento com UUID
- Restauração seletiva
- Limpeza de backups antigos
- Configuração de retenção

#### Estrutura do Backup
```json
{
  "id": "uuid",
  "timestamp": "ISO_date",
  "version": "1.0.0",
  "data": {
    "configuracoes": {},
    "usuarios": [],
    "clientes": [],
    "projetos": [],
    "orcamentos": [],
    "avaliacoes": []
  }
}
```

#### Endpoints
- `POST /api/v1/backup` - Criar backup
- `GET /api/v1/backup` - Listar backups
- `POST /api/v1/backup/:id/restore` - Restaurar backup
- `DELETE /api/v1/backup/:id` - Deletar backup

---

## 📊 Fluxos Principais do Sistema

### 1. Fluxo de Análise de Imóvel
```mermaid
Usuário → Upload Imagens → Seleção Projeto/Cliente → 
Configuração Análise → Processamento IA → Geração Relatório → 
Salvamento Avaliação → Download PDF
```

### 2. Fluxo de Pagamento
```mermaid
Seleção Plano → Dados Pagamento → Validação → 
Processamento → Confirmação → Ativação Plano → 
Notificação Usuário
```

### 3. Fluxo de Projeto
```mermaid
Criação Cliente → Novo Projeto → Upload Imagens → 
Geração Orçamento → Aprovação → Análise IA → 
Geração Laudo → Entrega
```

---

## 🔧 Dependências e Tecnologias

### Frontend Dependencies
```json
{
  "@google/generative-ai": "^0.24.1",
  "antd": "^5.27.3",
  "axios": "^1.11.0",
  "jspdf": "^3.0.2",
  "lucide-react": "^0.536.0",
  "react": "^19.1.0"
}
```

### Backend Dependencies
```json
{
  "express": "latest",
  "jsonwebtoken": "latest",
  "bcryptjs": "latest",
  "express-validator": "latest",
  "helmet": "latest",
  "cors": "latest",
  "morgan": "latest"
}
```

---

## 🚀 Pontos de Extensão e Melhorias

### Próximas Implementações
1. **Database Real**: Migração para PostgreSQL/MongoDB
2. **Redis Cache**: Cache distribuído
3. **Microserviços**: Separação de responsabilidades
4. **Docker**: Containerização
5. **CI/CD**: Pipeline de deploy
6. **Monitoring**: Logs centralizados
7. **Tests**: Cobertura de testes
8. **API Gateway**: Controle de acesso unificado

### Integrações Futuras
1. **Payment Gateways**: Stripe, PagSeguro, Mercado Pago
2. **Email Service**: SendGrid, AWS SES
3. **Storage**: AWS S3, Google Cloud Storage
4. **Analytics**: Google Analytics, Mixpanel
5. **CRM**: Integração com Salesforce, HubSpot

---

## 📈 Métricas e Monitoramento

### KPIs do Sistema
- **Usuários Ativos**: Diário/Mensal
- **Análises Realizadas**: Por período
- **Taxa de Conversão**: Free → Paid
- **Tempo de Resposta**: APIs e IA
- **Uptime**: Disponibilidade do sistema
- **Satisfação**: NPS dos usuários

### Logs e Auditoria
- **Ações de Usuário**: CRUD operations
- **Transações**: Pagamentos e créditos
- **Erros**: Sistema e IA
- **Performance**: Tempo de resposta
- **Segurança**: Tentativas de acesso

---

## 🎯 Conclusão

O sistema **GeoMind** apresenta uma arquitetura bem estruturada e modular, com clara separação de responsabilidades entre frontend e backend. A correlação entre os componentes é bem definida, permitindo escalabilidade e manutenibilidade.

### Pontos Fortes
✅ **Arquitetura Modular**: Componentes bem separados
✅ **Segurança Robusta**: JWT + Auditoria + Validações
✅ **Sistema de Pagamentos**: Múltiplos planos e métodos
✅ **IA Integrada**: Google Gemini para análises
✅ **UX Completa**: Upload, preview, relatórios
✅ **Backup Automático**: Proteção de dados
✅ **Compatibilidade**: Safari e mobile

### Oportunidades de Melhoria
🔄 **Database**: Migração para BD relacional
🔄 **Cache**: Implementação de Redis
🔄 **Tests**: Cobertura de testes automatizados
🔄 **Monitoring**: Observabilidade completa
🔄 **Deployment**: CI/CD e containerização

O sistema está pronto para produção com as funcionalidades core implementadas e pode ser expandido conforme as necessidades do negócio.