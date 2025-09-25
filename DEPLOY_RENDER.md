# Deploy no Render - Sistema de Avaliação Imobiliária

## Instruções para Deploy

### 1. Backend
1. Crie um repositório no GitHub para o backend (pasta `backend/`)
2. No Render.com:
   - Conecte o repositório do backend
   - Configure como Web Service
   - Use as configurações do arquivo `render.yaml`
   - Nome sugerido: `sistema-avaliacao-backend`

### 2. Frontend
1. Crie um repositório no GitHub para o frontend (pasta raiz)
2. No Render.com:
   - Conecte o repositório do frontend
   - Configure como Static Site
   - Use as configurações do arquivo `render.yaml`
   - Nome sugerido: `sistema-avaliacao-frontend`

### 3. Variáveis de Ambiente

#### Backend:
- `NODE_ENV=production`
- `JWT_SECRET=sua_chave_secreta_jwt`
- `PORT=10000`
- `MAX_FILE_SIZE=10485760`
- `UPLOAD_DIR=uploads`
- `BACKUP_DIR=backups`
- `BACKUP_RETENTION_DAYS=30`
- `AUTO_BACKUP_ENABLED=true`
- `AUTO_BACKUP_FREQUENCY=daily`

#### Frontend:
- `VITE_API_BASE_URL=https://sistema-avaliacao-backend.onrender.com/api/v1`
- `VITE_GEMINI_API_KEY=AIzaSyCc3gYZ6IYcJxdLAQJqa8fDMVc2uptAhTg`
- `VITE_BACKEND_URL=https://sistema-avaliacao-backend.onrender.com`

### 4. URLs Finais
- Backend: `https://sistema-avaliacao-backend.onrender.com`
- Frontend: `https://sistema-avaliacao-frontend.onrender.com`

### 5. Credenciais de Teste
- Email: admin@teste.com
- Senha: 123456