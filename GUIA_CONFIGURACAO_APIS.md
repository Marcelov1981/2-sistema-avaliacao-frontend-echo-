# 🔧 Guia de Configuração das APIs

Este guia explica como obter e configurar as chaves de API necessárias para o funcionamento completo da avaliação por imagem.

## 📋 Status Atual

✅ **Google Gemini** - Configurado e funcionando  
❌ **OpenAI GPT-4 Vision** - Não configurado  
❌ **Anthropic Claude** - Não configurado  
❌ **Azure Vision** - Não configurado  
❌ **Google Vision** - Não configurado  
❌ **APIs de Geolocalização** - Não configuradas  

## 🚀 APIs Prioritárias (Recomendadas)

### 1. OpenAI GPT-4 Vision (Altamente Recomendado)
**Por que usar:** Análises mais detalhadas e precisas de imagens imobiliárias

**Como obter:**
1. Acesse: https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave gerada
5. Cole no arquivo `.env`: `VITE_OPENAI_API_KEY=sua_chave_aqui`

**Custo:** ~$0.01 por análise de imagem

### 2. OpenCage Geocoding (Para Geolocalização)
**Por que usar:** Análise de localização e contexto geográfico

**Como obter:**
1. Acesse: https://opencagedata.com/api
2. Crie uma conta gratuita
3. Obtenha sua chave de API
4. Cole no arquivo `.env`: `VITE_OPENCAGE_API_KEY=sua_chave_aqui`

**Custo:** Gratuito até 2.500 consultas/dia

## 🔄 APIs Alternativas

### Anthropic Claude
**Como obter:**
1. Acesse: https://console.anthropic.com/
2. Crie uma conta
3. Gere uma chave de API
4. Configure: `VITE_ANTHROPIC_API_KEY=sua_chave_aqui`

### Google Vision API
**Como obter:**
1. Acesse: https://console.cloud.google.com/
2. Crie um projeto
3. Ative a Vision API
4. Crie credenciais de API
5. Configure: `VITE_GOOGLE_VISION_KEY=sua_chave_aqui`

### Azure Computer Vision
**Como obter:**
1. Acesse: https://portal.azure.com/
2. Crie um recurso Computer Vision
3. Obtenha a chave de API
4. Configure: `VITE_AZURE_VISION_KEY=sua_chave_aqui`

### Mapbox (Geolocalização)
**Como obter:**
1. Acesse: https://account.mapbox.com/access-tokens/
2. Crie uma conta
3. Gere um token de acesso
4. Configure: `VITE_MAPBOX_API_KEY=sua_chave_aqui`

### Google Maps API (Geolocalização)
**Como obter:**
1. Acesse: https://console.cloud.google.com/
2. Ative a Maps JavaScript API
3. Crie credenciais
4. Configure: `VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui`

## ⚡ Configuração Rápida (Mínima)

Para começar rapidamente, configure apenas:

1. **OpenAI GPT-4 Vision** (análises detalhadas)
2. **OpenCage Geocoding** (geolocalização gratuita)

```env
VITE_OPENAI_API_KEY=sk-proj-...
VITE_OPENCAGE_API_KEY=...
```

## 🔄 Sistema de Fallback

O sistema funciona em ordem de prioridade:

1. **Google GenAI** (já configurado) ✅
2. **OpenAI GPT-4 Vision** (se configurado)
3. **Anthropic Claude** (se configurado)
4. **Google Vision** (se configurado)
5. **Análise Local** (fallback final)

## 🧪 Testando as Configurações

Após configurar as APIs:

1. Reinicie o servidor de desenvolvimento
2. Acesse a funcionalidade de avaliação por imagem
3. Faça upload de uma imagem
4. Verifique o console do navegador para logs de sucesso

## 💡 Dicas Importantes

- **Segurança:** Nunca compartilhe suas chaves de API
- **Custos:** Monitore o uso para evitar cobranças inesperadas
- **Backup:** Mantenha múltiplas APIs configuradas para redundância
- **Teste:** Sempre teste após configurar novas APIs

## 🆘 Solução de Problemas

### Erro: "API key not configured"
- Verifique se a chave está no arquivo `.env`
- Certifique-se de que não há espaços extras
- Reinicie o servidor após mudanças

### Erro: "Invalid API key"
- Verifique se a chave foi copiada corretamente
- Confirme se a API está ativa na plataforma
- Verifique se há cotas ou limites atingidos

### Análises muito básicas
- Configure APIs adicionais além do Gemini
- OpenAI oferece análises mais detalhadas
- Geolocalização melhora contexto das análises

---

**Status do Sistema:** Funcional com Google Gemini + Análise Local  
**Próximo Passo:** Configurar OpenAI para análises mais detalhadas