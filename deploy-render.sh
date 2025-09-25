#!/bin/bash

# Script de Deploy para Render
# Execute este script após criar os repositórios no GitHub

echo "🚀 Script de Deploy para Render"
echo "================================"

# Verificar se o usuário forneceu o username do GitHub
if [ -z "$1" ]; then
    echo "❌ Erro: Forneça seu username do GitHub"
    echo "Uso: ./deploy-render.sh SEU_USERNAME_GITHUB"
    exit 1
fi

GITHUB_USER=$1

echo "📦 Configurando repositório do Backend..."
cd backend

# Verificar se já existe remote origin
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote origin já existe. Removendo..."
    git remote remove origin
fi

# Adicionar remote do backend
git remote add origin https://github.com/$GITHUB_USER/sistema-avaliacao-backend.git
git branch -M main

echo "🔄 Fazendo push do backend..."
if git push -u origin main; then
    echo "✅ Backend enviado com sucesso!"
else
    echo "❌ Erro ao enviar backend. Verifique se o repositório existe no GitHub."
    exit 1
fi

cd ..

echo "📦 Configurando repositório do Frontend..."

# Verificar se já existe remote origin
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote origin já existe. Removendo..."
    git remote remove origin
fi

# Adicionar remote do frontend
git remote add origin https://github.com/$GITHUB_USER/sistema-avaliacao-frontend.git
git branch -M main

echo "🔄 Fazendo push do frontend..."
if git push -u origin main; then
    echo "✅ Frontend enviado com sucesso!"
else
    echo "❌ Erro ao enviar frontend. Verifique se o repositório existe no GitHub."
    exit 1
fi

echo ""
echo "🎉 Repositórios enviados com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse https://render.com"
echo "2. Crie um Web Service para o backend:"
echo "   - Repositório: $GITHUB_USER/sistema-avaliacao-backend"
echo "   - Nome: sistema-avaliacao-backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "3. Crie um Static Site para o frontend:"
echo "   - Repositório: $GITHUB_USER/sistema-avaliacao-frontend"
echo "   - Nome: sistema-avaliacao-frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: dist"
echo ""
echo "4. Configure as variáveis de ambiente conforme o guia:"
echo "   📖 GUIA_DEPLOY_RENDER_PASSO_A_PASSO.md"
echo ""
echo "🔗 URLs dos repositórios:"
echo "Backend: https://github.com/$GITHUB_USER/sistema-avaliacao-backend"
echo "Frontend: https://github.com/$GITHUB_USER/sistema-avaliacao-frontend"