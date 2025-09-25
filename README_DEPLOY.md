# 🚀 Deploy no Render - Sistema de Avaliação Imobiliária

## ⚡ Deploy Rápido

### 1. Criar Repositórios no GitHub

Primeiro, crie dois repositórios no GitHub:
- `sistema-avaliacao-backend`
- `sistema-avaliacao-frontend`

### 2. Executar Script de Deploy

```bash
./deploy-render.sh SEU_USERNAME_GITHUB
```

**Exemplo:**
```bash
./deploy-render.sh marcelovasconcelos
```

### 3. Configurar no Render

Acesse [render.com](https://render.com) e crie os serviços:

#### Backend (Web Service)
- **Repository:** `SEU_USERNAME/sistema-avaliacao-backend`
- **Name:** `sistema-avaliacao-backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

**Variáveis de Ambiente:**
```
NODE_ENV=production
PORT=10000
GEMINI_API_KEY=sua_chave_gemini_aqui
CORS_ORIGIN=https://sistema-avaliacao-frontend.onrender.com
```

#### Frontend (Static Site)
- **Repository:** `SEU_USERNAME/sistema-avaliacao-frontend`
- **Name:** `sistema-avaliacao-frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Plan:** Free

**Variáveis de Ambiente:**
```
VITE_API_BASE_URL=https://sistema-avaliacao-backend.onrender.com
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
VITE_BACKEND_URL=https://sistema-avaliacao-backend.onrender.com
```

## 🔗 URLs Finais

Após o deploy:
- **Frontend:** https://sistema-avaliacao-frontend.onrender.com
- **Backend:** https://sistema-avaliacao-backend.onrender.com

## 🧪 Teste do Sistema

Use estas credenciais para testar:
- **Email:** admin@teste.com
- **Senha:** 123456

## 📚 Documentação Completa

Para instruções detalhadas, consulte:
- `GUIA_DEPLOY_RENDER_PASSO_A_PASSO.md`
- `MIGRACAO_RENDER_COMPLETA.md`

## ⚠️ Importante

- O primeiro deploy pode demorar alguns minutos
- Aguarde o backend estar online antes de testar o frontend
- Verifique se as variáveis de ambiente estão corretas
- As URLs do Render podem variar se os nomes já estiverem em uso