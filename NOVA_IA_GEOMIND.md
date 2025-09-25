# IA Personalizada GeoMind - Análise Avançada de Imagens Imobiliárias

## 🚀 Visão Geral

A nova IA Personalizada GeoMind substitui o Google Gemini com funcionalidades avançadas de análise de imagens imobiliárias, incluindo:

- **Extração de Metadados EXIF**: Geolocalização, data/hora, informações da câmera
- **Geolocalização Reversa**: Conversão de coordenadas em endereços detalhados
- **Análise de Mercado**: Busca de imóveis similares e tendências de preços
- **Multi-Provider IA**: Suporte a OpenAI, Anthropic, Google Vision e Azure
- **Scraping Inteligente**: Busca em portais imobiliários (ZAP, Viva Real, etc.)

## 📋 Funcionalidades Principais

### 1. Análise de Metadados EXIF
- Extração automática de coordenadas GPS
- Data e hora da captura
- Informações da câmera (marca, modelo, configurações)
- Dados técnicos da imagem

### 2. Geolocalização Avançada
- Conversão de coordenadas em endereços
- Identificação de bairro, cidade, CEP
- Múltiplas APIs de geolocalização (OpenCage, Mapbox, Google Maps)
- Fallback automático entre provedores

### 3. Análise de Mercado Imobiliário
- Busca de imóveis similares por localização
- Análise de preços na região
- Tendências de mercado
- Comparação com propriedades próximas

### 4. Análise Visual com IA
- Suporte a múltiplos provedores de IA
- Análise detalhada de ambientes
- Avaliação de estado de conservação
- Identificação de características especiais

## 🛠️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as chaves de API:

```bash
cp .env.example .env
```

#### APIs de IA (Configure pelo menos uma):
```env
# OpenAI GPT-4 Vision (Recomendado)
VITE_OPENAI_API_KEY=sk-proj-your-key-here

# Anthropic Claude Vision
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Google Vision API
VITE_GOOGLE_VISION_KEY=your-google-vision-key

# Azure Computer Vision
VITE_AZURE_VISION_KEY=your-azure-key
VITE_AZURE_VISION_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
```

#### APIs de Geolocalização (Configure pelo menos uma):
```env
# OpenCage Geocoding (Recomendado)
VITE_OPENCAGE_API_KEY=your-opencage-key

# Mapbox
VITE_MAPBOX_API_KEY=pk.your-mapbox-key

# Google Maps Geocoding
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 2. Obtenção das Chaves de API

#### OpenAI (Recomendado para análise visual)
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie uma conta e configure billing
3. Gere uma API key em "API Keys"
4. Certifique-se de ter acesso ao GPT-4 Vision

#### OpenCage (Recomendado para geolocalização)
1. Acesse [OpenCage Geocoding](https://opencagedata.com/)
2. Crie uma conta gratuita (2.500 requests/dia)
3. Obtenha sua API key no dashboard

#### Anthropic Claude
1. Acesse [Anthropic Console](https://console.anthropic.com/)
2. Crie uma conta e configure billing
3. Gere uma API key

#### Google Vision API
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a Vision API
3. Crie credenciais (API Key)

#### Azure Computer Vision
1. Acesse [Azure Portal](https://portal.azure.com/)
2. Crie um recurso "Computer Vision"
3. Obtenha a chave e endpoint

## 🎯 Como Usar

### 1. Interface Principal (AIImageAnalysisV2)

```jsx
import AIImageAnalysisV2 from './components/AIImageAnalysisV2';

// Uso no seu componente
<AIImageAnalysisV2 />
```

### 2. Uso Programático

```javascript
import CustomAIService from './utils/CustomAIService';

// Análise completa de uma imagem
const result = await CustomAIService.analyzeImageWithLocation(
  imageFile,
  'Análise detalhada para avaliação imobiliária',
  {
    includeMarketAnalysis: true,
    searchRadius: 2000, // 2km
    maxResults: 10
  }
);

// Análise de múltiplas imagens
const results = await CustomAIService.analyzeMultipleImages(
  imageFiles,
  'Análise de conjunto de imóveis',
  propertyInfo
);
```

### 3. Configurações Avançadas

```javascript
// Configurar provedor de IA preferido
const config = {
  aiProvider: 'openai', // 'openai', 'claude', 'google', 'azure'
  includeMarketAnalysis: true,
  searchRadius: 2000, // metros
  maxSimilarProperties: 10
};
```

## 📊 Estrutura de Resposta

```javascript
{
  // Metadados EXIF extraídos
  metadata: {
    dateTime: '2024-01-15T10:30:00Z',
    location: {
      latitude: -23.5505,
      longitude: -46.6333
    },
    camera: {
      make: 'Apple',
      model: 'iPhone 15 Pro'
    }
  },
  
  // Dados de geolocalização
  locationData: {
    address: 'Rua Augusta, 123',
    neighborhood: 'Consolação',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    postalCode: '01305-000'
  },
  
  // Análise visual da IA
  visualAnalysis: {
    provider: 'OpenAI GPT-4 Vision',
    analysis: 'Análise detalhada...',
    confidence: 0.95
  },
  
  // Análise de mercado
  marketAnalysis: {
    averagePrice: 850000,
    priceRange: { min: 650000, max: 1200000 },
    trend: 'Valorização de 8% nos últimos 12 meses'
  },
  
  // Imóveis similares encontrados
  similarProperties: [
    {
      title: 'Apartamento 2 quartos',
      price: 780000,
      area: 65,
      location: 'Consolação, São Paulo'
    }
  ],
  
  // Recomendações
  recommendations: 'Recomendações baseadas na análise...'
}
```

## 🔧 Migração do Gemini

A migração do Google Gemini para a IA Personalizada foi realizada automaticamente:

### Alterações Realizadas:
1. **AIImageAnalysis.jsx**: Substituição do `GeminiService` por `CustomAIService`
2. **PDFGenerator.js**: Atualização das referências de modelo de IA
3. **Variáveis de ambiente**: Adição de novas chaves de API

### Compatibilidade:
- ✅ Todas as funcionalidades existentes mantidas
- ✅ Interface de usuário inalterada
- ✅ Formato de resposta compatível
- ✅ Geração de PDFs atualizada

## 🚨 Troubleshooting

### Erro: "API Key não configurada"
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Certifique-se de que o arquivo `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento após alterar o `.env`

### Erro: "Falha na geolocalização"
- Configure pelo menos uma API de geolocalização
- Verifique se as chaves de API estão válidas
- O sistema tentará múltiplos provedores automaticamente

### Erro: "Análise de IA falhou"
- Verifique se pelo menos uma API de IA está configurada
- Confirme se há créditos/quota disponível na API
- O sistema fará fallback para análise local básica

### Imagens sem metadados EXIF
- Nem todas as imagens possuem dados de geolocalização
- O sistema funcionará normalmente, mas sem dados de localização
- Considere usar imagens tiradas com smartphones modernos

## 📈 Benefícios da Nova IA

1. **Análise Mais Completa**: Combina análise visual + metadados + mercado
2. **Maior Precisão**: Múltiplos provedores de IA para melhor resultado
3. **Dados Contextuais**: Informações de localização e mercado imobiliário
4. **Flexibilidade**: Configuração de diferentes provedores e parâmetros
5. **Escalabilidade**: Suporte a múltiplas APIs com fallback automático

## 🔮 Próximos Passos

- [ ] Implementar cache de resultados para otimização
- [ ] Adicionar suporte a mais portais imobiliários
- [ ] Integrar análise de tendências históricas
- [ ] Implementar machine learning para melhorar precisão
- [ ] Adicionar suporte a análise de vídeos

---

**Desenvolvido para o SaaS GeoMind** | Versão 2.0 | Janeiro 2024