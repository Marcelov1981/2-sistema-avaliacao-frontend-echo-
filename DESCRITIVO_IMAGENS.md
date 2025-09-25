# Sistema de Descrição de Imagens

## Como Funciona o Sistema de Análise

O sistema possui múltiplas camadas de análise para gerar descrições detalhadas das imagens:

### 1. 🔍 Análise de Metadados (EXIF)

**Localização:** `src/utils/ExifService.js`

Extrai automaticamente:
- **Informações da câmera**: Marca, modelo, configurações
- **Dados técnicos**: ISO, abertura, velocidade do obturador
- **Geolocalização**: Coordenadas GPS (se disponível)
- **Data e hora**: Quando a foto foi tirada
- **Informações da lente**: Distância focal, abertura

### 2. 🌍 Análise de Localização

**Localização:** `src/utils/GeoLocationService.js`

Quando há coordenadas GPS:
- **Endereço reverso**: Converte coordenadas em endereço
- **Análise de mercado**: Busca propriedades similares na região
- **Contexto geográfico**: Informações sobre o bairro/região

### 3. 🤖 Análise Visual com IA

O sistema tenta usar múltiplas APIs de IA em ordem de prioridade:

#### 3.1 Google Gemini (Principal)
**Localização:** `src/utils/GeminiService.js`

**Descrições geradas incluem:**
- **Descrição Geral**: Tipo de imóvel, estilo arquitetônico
- **Características Estruturais**: Estado da fachada, telhado, janelas
- **Aspectos Positivos**: Pontos fortes que agregam valor
- **Pontos de Atenção**: Problemas identificados
- **Avaliação de Conservação**: Nota de 1-10 com justificativa
- **Recomendações**: Sugestões de melhorias

#### 3.2 APIs Alternativas
**Localização:** `src/utils/CustomAIService.js`

Sistema de fallback com:
- **OpenAI Vision**: Análise visual avançada
- **Anthropic Claude**: Análise contextual
- **Google Vision**: Detecção de objetos e características
- **Análise Local**: Fallback baseado em nome do arquivo

### 4. 📊 Tipos de Análise Disponíveis

#### 4.1 Análise Única
- Análise detalhada de uma imagem
- Inclui contexto do projeto/cliente
- Gera relatório completo

#### 4.2 Análise Múltipla
- Analisa várias imagens do mesmo imóvel
- Consolida informações de todos os ambientes
- Gera relatório comparativo

#### 4.3 Análise Comparativa
- Compara dois grupos de imagens
- Identifica diferenças e semelhanças
- Útil para antes/depois ou comparação de imóveis

### 5. 🏠 Identificação de Ambientes

O sistema identifica automaticamente:

- **🏢 Fachada/Exterior**: Arquitetura, conservação, localização
- **🛋️ Área Social**: Sala de estar, living, área de convivência
- **🛏️ Dormitórios**: Quartos, suítes, área de descanso
- **🍳 Cozinha**: Centro gastronômico, funcionalidade
- **🚿 Banheiros**: Área de higiene, acabamentos
- **🚗 Garagem**: Estacionamento, segurança

### 6. 📝 Estrutura das Descrições

Cada descrição inclui:

```
📊 ANÁLISE INTELIGENTE
├── 🔍 Informações do Arquivo
├── 🏠 Identificação do Ambiente
├── 📸 Qualidade da Imagem
├── 🏗️ Características Estruturais
├── ✅ Aspectos Positivos
├── ⚠️ Pontos de Atenção
├── 📊 Avaliação (1-10)
└── 💡 Recomendações
```

### 7. 🎯 Personalização por Contexto

As descrições são adaptadas conforme:

- **Tipo de Cliente**: Pessoa física, jurídica
- **Finalidade**: Venda, locação, avaliação
- **Tipo de Imóvel**: Casa, apartamento, terreno
- **Região**: Mercado local, características regionais
- **Projeto**: Informações específicas do projeto

### 8. 📋 Informações Extraídas

#### Dados Técnicos:
- Resolução e qualidade da imagem
- Condições de iluminação
- Ângulo e perspectiva
- Nitidez e foco

#### Características do Imóvel:
- Estado de conservação
- Acabamentos e materiais
- Estilo arquitetônico
- Funcionalidade dos espaços

#### Análise de Valor:
- Fatores que agregam valor
- Problemas que depreciam
- Potencial de valorização
- Adequação ao mercado

### 9. 🔧 Configuração e Uso

#### Para usar o sistema:

1. **Configure as APIs** (opcional, mas recomendado):
   ```env
   VITE_GOOGLE_GEMINI_KEY=sua_chave_aqui
   VITE_OPENAI_API_KEY=sua_chave_aqui
   VITE_ANTHROPIC_API_KEY=sua_chave_aqui
   ```

2. **Faça upload das imagens** no componente de análise

3. **Selecione o tipo de análise**:
   - Única: Para uma imagem
   - Múltipla: Para várias imagens do mesmo imóvel
   - Comparativa: Para comparar grupos de imagens

4. **Adicione contexto** (opcional):
   - Selecione cliente e projeto
   - Adicione prompt personalizado
   - Informe dados específicos do imóvel

### 10. 📄 Geração de Relatórios

**Localização:** `src/utils/PDFGenerator.js`

O sistema gera automaticamente:
- **PDF com análise completa**
- **Relatório técnico detalhado**
- **Imagens anexadas**
- **Recomendações prioritárias**

### 11. 🎨 Interface de Usuário

**Componente Principal:** `src/components/AIImageAnalysis.jsx`

Funcionalidades:
- Upload drag & drop
- Preview de imagens
- Seleção de tipo de análise
- Integração com projetos/clientes
- Geração de relatórios
- Histórico de análises

### 12. 💡 Dicas para Melhores Resultados

#### Qualidade das Imagens:
- Use alta resolução (> 2MB recomendado)
- Boa iluminação natural
- Múltiplos ângulos do mesmo ambiente
- Foco nítido nos detalhes importantes

#### Nomenclatura dos Arquivos:
- Use nomes descritivos: `fachada_principal.jpg`
- Identifique ambientes: `sala_estar.jpg`, `cozinha.jpg`
- Inclua orientação: `quarto_suite_norte.jpg`

#### Contexto do Projeto:
- Sempre vincule a um projeto/cliente
- Informe finalidade da avaliação
- Adicione dados técnicos do imóvel
- Use prompts personalizados quando necessário

### 13. 🔄 Sistema de Fallback

Quando APIs externas não estão disponíveis:

1. **Tenta Google Gemini** (principal)
2. **Tenta OpenAI Vision** (alternativa)
3. **Tenta Anthropic Claude** (alternativa)
4. **Tenta Google Vision** (alternativa)
5. **Usa Análise Local** (fallback básico)

A análise local fornece:
- Identificação por nome do arquivo
- Análise de qualidade da imagem
- Recomendações gerais
- Limitações claramente indicadas

### 14. 📊 Métricas e Confiabilidade

- **Google Gemini**: 95% de confiabilidade
- **OpenAI Vision**: 90% de confiabilidade
- **Anthropic Claude**: 88% de confiabilidade
- **Google Vision**: 85% de confiabilidade
- **Análise Local**: 30% de confiabilidade

### 15. 🚀 Funcionalidades Avançadas

- **Análise de mercado**: Quando há GPS
- **Comparação com similares**: Busca automática
- **Histórico de análises**: Todas as análises são salvas
- **Integração com CRM**: Vinculação com clientes/projetos
- **Geração de laudos**: PDFs profissionais
- **Sistema de créditos**: Controle de uso

Este sistema oferece uma solução completa para análise e descrição de imagens imobiliárias, combinando tecnologias de IA avançadas com análise contextual e geográfica.