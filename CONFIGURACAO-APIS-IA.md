# 🤖 Configuração de APIs de Inteligência Artificial

## 📋 Visão Geral

Este documento descreve como configurar as APIs de IA para habilitar a análise completa de imagens no sistema. Atualmente, o sistema opera em **modo fallback** (análise local) devido às APIs não estarem configuradas.

## 🔧 Status Atual

- ❌ **APIs Externas**: Não configuradas (usando placeholders)
- ✅ **Análise Local**: Funcionando como fallback
- ⚠️ **Limitações**: Análise baseada apenas em metadados do arquivo

## 🚀 APIs Suportadas

### 1. OpenAI GPT-4 Vision
**Recomendada para análise detalhada**

```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

**Como obter:**
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta ou faça login
3. Vá para "API Keys" no menu
4. Clique em "Create new secret key"
5. Copie a chave e substitua no arquivo `.env`

**Custo aproximado:** $0.01-0.03 por imagem

### 2. Anthropic Claude Vision
**Excelente para análise contextual**

```env
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key-here
```

**Como obter:**
1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma conta
3. Vá para "API Keys"
4. Gere uma nova chave
5. Substitua no arquivo `.env`

**Custo aproximado:** $0.008-0.024 por imagem

### 3. Google Gemini Vision
**Boa opção gratuita com limitações**

```env
GOOGLE_GEMINI_API_KEY=your-actual-gemini-key-here
```

**Como obter:**
1. Acesse [makersuite.google.com](https://makersuite.google.com)
2. Faça login com conta Google
3. Vá para "Get API Key"
4. Crie uma nova chave
5. Substitua no arquivo `.env`

**Limitações atuais:** API sobrecarregada (erro 503)

### 4. Azure Computer Vision
**Para empresas que usam Azure**

```env
AZURE_VISION_KEY=your-azure-vision-key
AZURE_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
```

### 5. Google Cloud Vision
**Para análise técnica avançada**

```env
GOOGLE_VISION_API_KEY=your-google-cloud-vision-key
```

## 🔄 Sistema de Fallback

O sistema tenta as APIs na seguinte ordem:

1. **OpenAI GPT-4 Vision** (primeira escolha)
2. **Anthropic Claude** (segunda opção)
3. **Google Gemini** (terceira opção)
4. **Azure Vision** (quarta opção)
5. **Google Vision** (quinta opção)
6. **Análise Local** (fallback final)

## ⚙️ Configuração Passo a Passo

### 1. Editar arquivo .env

Abra o arquivo `.env` na raiz do projeto:

```bash
# APIs de IA - SUBSTITUA OS VALORES PLACEHOLDER
OPENAI_API_KEY=your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key-here
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
AZURE_VISION_KEY=your-azure-vision-key-here
AZURE_VISION_ENDPOINT=your-azure-endpoint-here
GOOGLE_VISION_API_KEY=your-google-vision-key-here
```

### 2. Reiniciar o servidor

Após configurar as chaves:

```bash
# Parar o servidor atual
Ctrl + C

# Reiniciar
npm run dev
```

### 3. Testar a configuração

1. Acesse a aplicação
2. Vá para "Análise de Imagens"
3. Faça upload de uma imagem
4. Verifique os logs no console do navegador
5. Confirme se a análise não está mais usando "Análise Local"

## 🧪 Scripts de Teste

### Testar API do Gemini
```bash
node test-gemini.js
```

### Testar cenários de análise
```bash
node test-image-analysis.js
```

## 📊 Monitoramento

### Logs importantes

Verifique estes logs no console:

```
✅ Análise visual concluída - provider: OpenAI GPT-4 Vision
❌ Erro na API - fallback para próxima opção
🔧 Executando análise local avançada... (fallback final)
```

### Indicadores de sucesso

- ✅ Provider diferente de "Análise Local"
- ✅ Confiança > 70%
- ✅ Análise detalhada do conteúdo visual
- ✅ Tempo de processamento < 10 segundos

## 💰 Custos Estimados

| API | Custo por Imagem | Limite Gratuito | Recomendação |
|-----|------------------|-----------------|---------------|
| OpenAI | $0.01-0.03 | $5 créditos | ⭐ Melhor qualidade |
| Anthropic | $0.008-0.024 | $5 créditos | ⭐ Boa alternativa |
| Gemini | Gratuito* | 60 req/min | ⚠️ Limitado |
| Azure | $0.001-0.01 | $200 créditos | 🏢 Empresarial |
| Google Vision | $0.0015-0.006 | $300 créditos | 🔧 Técnica |

*Gemini: Gratuito mas com limitações de uso

## 🚨 Solução de Problemas

### Erro: "API key inválida"
- Verifique se a chave foi copiada corretamente
- Confirme se não há espaços extras
- Teste a chave na documentação oficial da API

### Erro: "Quota exceeded"
- Verifique os limites da sua conta
- Considere upgrade do plano
- Use uma API alternativa temporariamente

### Erro: "Service unavailable" (503)
- API temporariamente indisponível
- Sistema automaticamente tentará próxima API
- Aguarde alguns minutos e tente novamente

### Análise sempre local
- Confirme que pelo menos uma API está configurada
- Verifique os logs de erro no console
- Reinicie o servidor após configurar as chaves

## 📞 Suporte

Se precisar de ajuda:

1. Verifique os logs detalhados no console
2. Execute os scripts de teste
3. Confirme as configurações do arquivo `.env`
4. Teste uma API por vez para identificar problemas

## 🔄 Próximas Atualizações

- [ ] Suporte para mais APIs de IA
- [ ] Cache de resultados para otimização
- [ ] Interface para gerenciar configurações
- [ ] Métricas de uso e custos
- [ ] Análise em lote de múltiplas imagens

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0.0