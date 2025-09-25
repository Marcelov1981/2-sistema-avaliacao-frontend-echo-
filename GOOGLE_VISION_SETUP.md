# Configuração da Google Vision API

## Problema Identificado

❌ **A API do Google Vision não está funcionando porque a chave de API não está configurada corretamente.**

Atualmente no arquivo `.env`:
```
VITE_GOOGLE_VISION_KEY=your_google_vision_api_key_here
```

Este é um valor placeholder que precisa ser substituído por uma chave real da API.

## Como Resolver

### Passo 1: Criar Projeto no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Cloud Vision API**:
   - Vá para "APIs & Services" > "Library"
   - Procure por "Cloud Vision API"
   - Clique em "Enable"

### Passo 2: Criar Credenciais

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "API Key"
3. Copie a chave gerada
4. **Importante**: Configure restrições de segurança:
   - Clique na chave criada
   - Em "Application restrictions", selecione "HTTP referrers"
   - Adicione seus domínios (localhost:5173, seu domínio de produção)
   - Em "API restrictions", selecione "Cloud Vision API"

### Passo 3: Configurar no Projeto

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua a linha:
   ```
   VITE_GOOGLE_VISION_KEY=your_google_vision_api_key_here
   ```
   Por:
   ```
   VITE_GOOGLE_VISION_KEY=SUA_CHAVE_REAL_AQUI
   ```

### Passo 4: Testar a Configuração

Execute o script de teste:
```bash
node test-google-vision.js
```

Se configurado corretamente, você verá:
```
✅ TODOS OS TESTES PASSARAM!
🎉 Google Vision API está funcionando corretamente!
```

## Alternativas Gratuitas

Se você não quiser configurar a Google Vision API, o sistema já possui fallbacks funcionais:

### 1. Google Gemini (Já Configurado) ✅
- **Status**: Funcionando
- **Limite**: 60 requisições/minuto grátis
- **Capacidade**: Análise de imagens com IA generativa

### 2. Análise Local (Sempre Disponível) ✅
- **Status**: Sempre funciona
- **Limite**: Ilimitado
- **Capacidade**: Análise básica de cores, brilho, contraste

## Como o Sistema Funciona Atualmente

O sistema tenta as APIs nesta ordem:
1. **OpenAI Vision** (não configurada)
2. **Anthropic Claude** (não configurada)
3. **Google Vision** (não configurada - ESTE É O PROBLEMA)
4. **Google Gemini** (configurada e funcionando) ✅
5. **Análise Local** (sempre disponível) ✅

## Recomendação

**Para uso imediato**: O sistema já está funcionando com Google Gemini, que oferece análise de imagens de alta qualidade.

**Para melhor cobertura**: Configure pelo menos uma API adicional (Google Vision, OpenAI ou Anthropic) seguindo os guias na documentação `CONFIGURACAO-APIS-IA.md`.

## Verificação do Status

Para verificar qual API está sendo usada, observe os logs no console do navegador:
```javascript
// Logs típicos quando funcionando:
🤖 Usando fallback: Google Gemini...
✅ Análise Gemini (fallback) concluída com sucesso
```

## Custos

- **Google Vision**: $1.50 por 1.000 imagens (primeiras 1.000/mês grátis)
- **Google Gemini**: Grátis até 60 req/min
- **Análise Local**: Sempre grátis

## Próximos Passos

1. ✅ **Imediato**: Continue usando o sistema - está funcionando com Gemini
2. 🔧 **Opcional**: Configure Google Vision seguindo este guia
3. 📈 **Futuro**: Configure APIs adicionais para redundância

---

**Resumo**: A API do Google não está fazendo análise porque a chave não está configurada, mas o sistema está funcionando normalmente com Google Gemini como fallback.