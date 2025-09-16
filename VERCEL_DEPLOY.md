# Deploy no Vercel - GeoMind

## Problema da Tela em Branco

Se a aplicação estiver mostrando uma tela em branco no Vercel, siga estas instruções:

## Configuração das Variáveis de Ambiente

### 1. No Dashboard do Vercel

1. Acesse o projeto no dashboard do Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:

```
VITE_API_BASE_URL=https://seu-backend-url.com/api/v1
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
```

### 2. Se Não Tiver Backend

Se você não tem um backend configurado ainda, a aplicação funcionará apenas com localStorage. Neste caso:

- **NÃO** configure a variável `VITE_API_BASE_URL`
- Ou configure como: `VITE_API_BASE_URL=offline`

## Correções Implementadas

As seguintes correções foram feitas para evitar a tela em branco:

1. **CustomHeader.jsx**: Evita requisições para URLs placeholder
2. **LogoUtils.jsx**: Funciona offline quando backend não disponível
3. **ConfiguracaoLogo.jsx**: Usa localStorage como fallback

## Verificação

Após o deploy:

1. Abra o console do navegador (F12)
2. Verifique se não há erros de rede para URLs inválidas
3. A aplicação deve carregar normalmente

## Estrutura de Fallback

A aplicação foi configurada para:
- Tentar carregar dados da API se disponível
- Usar localStorage como backup
- Funcionar completamente offline se necessário

## Comandos Úteis

```bash
# Build local para testar
npm run build
npm run preview

# Deploy manual (se necessário)
vercel --prod
```

## Troubleshooting

Se ainda houver problemas:

1. Verifique os logs do Vercel
2. Confirme que as variáveis de ambiente estão configuradas
3. Teste localmente com `npm run build && npm run preview`
4. Verifique se não há erros no console do navegador