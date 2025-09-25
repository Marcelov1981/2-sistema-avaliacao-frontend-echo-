# 🚀 Guia Completo de Deploy no Render - Passo a Passo

## 📋 Pré-requisitos
- Conta no GitHub
- Conta no Render.com
- Código já preparado (✅ CONCLUÍDO)

## 🎯 PASSO 1: Criar Repositórios no GitHub

### 1.1 Repositório do Backend
1. Acesse [GitHub.com](https://github.com) e faça login
2. Clique em "New repository"
3. Configure:
   - **Nome**: `sistema-avaliacao-backend`
   - **Descrição**: `Backend do Sistema de Avaliação Imobiliária`
   - **Visibilidade**: Public ou Private
   - **NÃO** inicialize com README, .gitignore ou license
4. Clique em "Create repository"

### 1.2 Fazer Push do Backend
```bash
# No terminal, vá para a pasta backend
cd /Users/marcelovasconcelos/Desktop/saas-frontend/backend

# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/sistema-avaliacao-backend.git

# Faça o push
git branch -M main
git push -u origin main
```

### 1.3 Repositório do Frontend
1. No GitHub, clique em "New repository" novamente
2. Configure:
   - **Nome**: `sistema-avaliacao-frontend`
   - **Descrição**: `Frontend do Sistema de Avaliação Imobiliária`
   - **Visibilidade**: Public ou Private
   - **NÃO** inicialize com README, .gitignore ou license
3. Clique em "Create repository"

### 1.4 Fazer Push do Frontend
```bash
# No terminal, vá para a pasta raiz do projeto
cd /Users/marcelovasconcelos/Desktop/saas-frontend

# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/sistema-avaliacao-frontend.git

# Faça o push
git branch -M main
git push -u origin main
```

## 🎯 PASSO 2: Deploy do Backend no Render

### 2.1 Acessar Render
1. Acesse [render.com](https://render.com)
2. Faça login ou crie uma conta
3. Conecte sua conta do GitHub

### 2.2 Criar Web Service para Backend
1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte o repositório `sistema-avaliacao-backend`
4. Configure:
   - **Name**: `sistema-avaliacao-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon (US West)` ou mais próximo
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 2.3 Configurar Variáveis de Ambiente do Backend
Na seção "Environment Variables", adicione:
```
NODE_ENV=production
JWT_SECRET=sua_chave_secreta_jwt_super_segura_aqui_123456
PORT=10000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
BACKUP_DIR=backups
BACKUP_RETENTION_DAYS=30
AUTO_BACKUP_ENABLED=true
AUTO_BACKUP_FREQUENCY=daily
```

### 2.4 Finalizar Deploy do Backend
1. Clique em "Create Web Service"
2. Aguarde o deploy (pode levar alguns minutos)
3. Anote a URL gerada (ex: `https://sistema-avaliacao-backend.onrender.com`)

## 🎯 PASSO 3: Deploy do Frontend no Render

### 3.1 Criar Static Site para Frontend
1. No dashboard do Render, clique em "New +"
2. Selecione "Static Site"
3. Conecte o repositório `sistema-avaliacao-frontend`
4. Configure:
   - **Name**: `sistema-avaliacao-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 3.2 Configurar Variáveis de Ambiente do Frontend
Na seção "Environment Variables", adicione (substitua a URL do backend pela URL real gerada no passo 2.4):
```
VITE_API_BASE_URL=https://sistema-avaliacao-backend.onrender.com/api/v1
VITE_GEMINI_API_KEY=AIzaSyCc3gYZ6IYcJxdLAQJqa8fDMVc2uptAhTg
VITE_BACKEND_URL=https://sistema-avaliacao-backend.onrender.com
```

### 3.3 Finalizar Deploy do Frontend
1. Clique em "Create Static Site"
2. Aguarde o deploy (pode levar alguns minutos)
3. Anote a URL gerada (ex: `https://sistema-avaliacao-frontend.onrender.com`)

## 🎯 PASSO 4: Testar a Aplicação

### 4.1 Testar Backend
```bash
curl https://sistema-avaliacao-backend.onrender.com/health
```

### 4.2 Testar Login
```bash
curl -X POST https://sistema-avaliacao-backend.onrender.com/api/v1/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teste.com","senha":"123456"}'
```

### 4.3 Testar Frontend
1. Acesse a URL do frontend no navegador
2. Faça login com:
   - **Email**: admin@teste.com
   - **Senha**: 123456

## 🔧 Troubleshooting

### Se o Backend não funcionar:
1. Verifique os logs no dashboard do Render
2. Confirme se todas as variáveis de ambiente estão corretas
3. Verifique se o `render.yaml` está na raiz do repositório

### Se o Frontend não funcionar:
1. Verifique se a URL do backend está correta nas variáveis de ambiente
2. Confirme se o build foi bem-sucedido
3. Verifique os logs de build no dashboard do Render

## ✅ URLs Finais
- **Backend**: https://sistema-avaliacao-backend.onrender.com
- **Frontend**: https://sistema-avaliacao-frontend.onrender.com
- **API Docs**: https://sistema-avaliacao-backend.onrender.com/

## 🔑 Credenciais de Teste
- **Email**: admin@teste.com
- **Senha**: 123456