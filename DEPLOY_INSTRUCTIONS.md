# 🚀 Instruções de Deploy - Resolução de Problemas

## ❌ Problema Identificado

Sua aplicação não consegue acessar a API após o deploy porque:
- A configuração da API está apontando para `localhost:3001` em produção
- O backend precisa estar hospedado em um serviço online
- As variáveis de ambiente não estão configuradas

## ✅ Soluções

### 1. **Deploy do Backend (Obrigatório)**

Seu backend precisa estar online. Opções recomendadas:

#### **Railway (Recomendado)**
```bash
# 1. Acesse railway.app
# 2. Conecte seu repositório GitHub
# 3. Selecione a pasta /backend
# 4. Deploy automático
```

#### **Render**
```bash
# 1. Acesse render.com
# 2. New Web Service
# 3. Conecte GitHub
# 4. Root Directory: backend
# 5. Build Command: npm install
# 6. Start Command: npm start
```

#### **Heroku**
```bash
# 1. Instale Heroku CLI
# 2. Na pasta backend:
heroku create seu-app-backend
git subtree push --prefix backend heroku main
```

### 2. **Configurar Variáveis de Ambiente**

Após o deploy do backend, configure no seu serviço de frontend:

#### **Vercel**
```bash
# No dashboard do Vercel:
# Settings > Environment Variables
VITE_API_BASE_URL=https://seu-backend.railway.app/api/v1
VITE_GEMINI_API_KEY=sua_chave_gemini
```

#### **Netlify**
```bash
# No dashboard do Netlify:
# Site settings > Environment variables
VITE_API_BASE_URL=https://seu-backend.railway.app/api/v1
VITE_GEMINI_API_KEY=sua_chave_gemini
```

### 3. **Configurar CORS no Backend**

No arquivo `backend/server.js`, adicione:

```javascript
// Configurar CORS para produção
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:4173',
    'http://localhost:3000',
    'https://seu-frontend.vercel.app', // Substitua pela URL do seu frontend
    'https://seu-frontend.netlify.app'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

## 🔧 Passos Rápidos

1. **Deploy do Backend:**
   - Acesse [Railway](https://railway.app)
   - Conecte seu repositório
   - Selecione pasta `backend`
   - Anote a URL gerada

2. **Configurar Frontend:**
   - No Vercel/Netlify, adicione:
   - `VITE_API_BASE_URL=https://sua-url-backend/api/v1`

3. **Redeploy:**
   - Faça um novo deploy do frontend
   - Teste a aplicação

## 🆘 Troubleshooting

### Erro de CORS
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```
**Solução:** Configure CORS no backend com a URL do frontend

### Erro 404 na API
```
GET https://seu-backend.com/api/v1/... 404 (Not Found)
```
**Solução:** Verifique se a URL da API está correta e o backend está rodando

### Erro de Environment Variables
```
VITE_API_BASE_URL is not defined
```
**Solução:** Configure as variáveis de ambiente no serviço de deploy

## 📞 Próximos Passos

1. Faça o deploy do backend primeiro
2. Configure as variáveis de ambiente
3. Redeploy o frontend
4. Teste todas as funcionalidades

---

**Importante:** Sem o backend online, sua aplicação não funcionará em produção!