import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('VITE_GEMINI_API_KEY não está configurada. Verifique seu arquivo .env');
    }
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Converte arquivo para base64
  async fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Analisa uma única imagem
  async analyzeImage(imageFile, prompt = '', propertyInfo = null, retries = 3) {
    try {

      
      const imagePart = await this.fileToGenerativePart(imageFile);
      
      // Construir informações do imóvel se fornecidas
      let propertyContext = '';
      if (propertyInfo && Object.keys(propertyInfo).some(key => propertyInfo[key])) {
        propertyContext = `
        **INFORMAÇÕES DO PROJETO E CLIENTE:**
        ${propertyInfo.clientName ? `- Cliente: ${propertyInfo.clientName}` : ''}
        ${propertyInfo.projectName ? `- Projeto: ${propertyInfo.projectName}` : ''}
        ${propertyInfo.projectAddress || propertyInfo.endereco ? `- Endereço: ${propertyInfo.projectAddress || propertyInfo.endereco}` : ''}
        ${propertyInfo.projectCity || propertyInfo.cidade ? `- Cidade: ${propertyInfo.projectCity || propertyInfo.cidade}` : ''}
        ${propertyInfo.projectState ? `- Estado: ${propertyInfo.projectState}` : ''}
        ${propertyInfo.projectCep ? `- CEP: ${propertyInfo.projectCep}` : ''}
        ${propertyInfo.projectType || propertyInfo.tipo ? `- Tipo: ${propertyInfo.projectType || propertyInfo.tipo}` : ''}
        ${propertyInfo.projectPurpose || propertyInfo.finalidade ? `- Finalidade da Avaliação: ${propertyInfo.projectPurpose || propertyInfo.finalidade}` : ''}
        ${propertyInfo.landArea || propertyInfo.areaTerreno ? `- Área do Terreno: ${propertyInfo.landArea || propertyInfo.areaTerreno} m²` : ''}
        ${propertyInfo.builtArea || propertyInfo.areaConstruida ? `- Área Construída: ${propertyInfo.builtArea || propertyInfo.areaConstruida} m²` : ''}
        ${propertyInfo.estimatedValue ? `- Valor Estimado: R$ ${propertyInfo.estimatedValue?.toLocaleString('pt-BR')}` : ''}
        ${propertyInfo.budgetValue ? `- Valor do Orçamento: R$ ${propertyInfo.budgetValue?.toLocaleString('pt-BR')}` : ''}
        ${propertyInfo.observations ? `- Observações: ${propertyInfo.observations}` : ''}
        
        **IMPORTANTE:** Use essas informações do projeto e cliente para contextualizar sua análise e fornecer avaliações mais precisas e relevantes.
        `;
        
      }
      
      const defaultPrompt = `${propertyContext}
        Analise esta imagem de imóvel e forneça um relatório detalhado incluindo:
        
        1. **Descrição Geral**:
           - Tipo de imóvel (casa, apartamento, terreno, etc.)
           - Estilo arquitetônico
           - Condições gerais aparentes
           ${propertyInfo?.tipo ? `- Verificar se corresponde ao tipo informado: ${propertyInfo.tipo}` : ''}
        
        2. **Características Estruturais**:
           - Estado da fachada
           - Condições do telhado
           - Qualidade das janelas e portas
           - Acabamentos visíveis
        
        3. **Aspectos Positivos**:
           - Pontos fortes do imóvel
           - Características que agregam valor
           ${propertyInfo?.finalidade ? `- Adequação para ${propertyInfo.finalidade}` : ''}
        
        4. **Pontos de Atenção**:
           - Possíveis problemas identificados
           - Áreas que necessitam manutenção
        
        5. **Avaliação de Conservação** (1-10):
           - Nota geral do estado de conservação
           - Justificativa da nota
           ${propertyInfo?.finalidade ? `- Considerações específicas para ${propertyInfo.finalidade}` : ''}
        
        6. **Recomendações**:
           - Sugestões de melhorias
           - Estimativa de investimentos necessários
           ${propertyInfo?.cidade ? `- Considerações do mercado local de ${propertyInfo.cidade}` : ''}
        
        Seja detalhado e técnico na análise.
      `;
      
      const finalPrompt = prompt.trim() || defaultPrompt;
      

      
      const result = await this.model.generateContent([finalPrompt, imagePart]);
      const response = await result.response;
      
      return {
        success: true,
        analysis: response.text(),
        timestamp: new Date().toISOString(),
        imageInfo: {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        }
      };
    } catch (error) {
      console.error('Erro na análise da imagem:', error);
      
      // Se for erro 503 (modelo sobrecarregado) e ainda temos tentativas
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (retries > 0) {
          console.log(`Modelo sobrecarregado. Tentando novamente em 2 segundos... (${retries} tentativas restantes)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.analyzeImage(imageFile, prompt, retries - 1);
        } else {
          return {
            success: false,
            error: 'O modelo Gemini está temporariamente sobrecarregado. Tente novamente em alguns minutos.',
            timestamp: new Date().toISOString()
          };
        }
      }
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Analisa múltiplas imagens
  async analyzeMultipleImages(imageFiles, prompt = '', propertyInfo = null, retries = 3) {
    try {
      const imageParts = await Promise.all(
        imageFiles.map(file => this.fileToGenerativePart(file))
      );
      
      // Construir informações do imóvel se fornecidas
      let propertyContext = '';
      if (propertyInfo && Object.keys(propertyInfo).some(key => propertyInfo[key])) {
        propertyContext = `
        **INFORMAÇÕES DO PROJETO E CLIENTE:**
        ${propertyInfo.clientName ? `- Cliente: ${propertyInfo.clientName}` : ''}
        ${propertyInfo.projectName ? `- Projeto: ${propertyInfo.projectName}` : ''}
        ${propertyInfo.projectAddress || propertyInfo.endereco ? `- Endereço: ${propertyInfo.projectAddress || propertyInfo.endereco}` : ''}
        ${propertyInfo.projectCity || propertyInfo.cidade ? `- Cidade: ${propertyInfo.projectCity || propertyInfo.cidade}` : ''}
        ${propertyInfo.projectState ? `- Estado: ${propertyInfo.projectState}` : ''}
        ${propertyInfo.projectCep ? `- CEP: ${propertyInfo.projectCep}` : ''}
        ${propertyInfo.projectType || propertyInfo.tipo ? `- Tipo: ${propertyInfo.projectType || propertyInfo.tipo}` : ''}
        ${propertyInfo.projectPurpose || propertyInfo.finalidade ? `- Finalidade da Avaliação: ${propertyInfo.projectPurpose || propertyInfo.finalidade}` : ''}
        ${propertyInfo.landArea || propertyInfo.areaTerreno ? `- Área do Terreno: ${propertyInfo.landArea || propertyInfo.areaTerreno} m²` : ''}
        ${propertyInfo.builtArea || propertyInfo.areaConstruida ? `- Área Construída: ${propertyInfo.builtArea || propertyInfo.areaConstruida} m²` : ''}
        ${propertyInfo.estimatedValue ? `- Valor Estimado: R$ ${propertyInfo.estimatedValue?.toLocaleString('pt-BR')}` : ''}
        ${propertyInfo.budgetValue ? `- Valor do Orçamento: R$ ${propertyInfo.budgetValue?.toLocaleString('pt-BR')}` : ''}
        ${propertyInfo.observations ? `- Observações: ${propertyInfo.observations}` : ''}
        
        **IMPORTANTE:** Use essas informações do projeto e cliente para contextualizar sua análise e fornecer avaliações mais precisas e relevantes.
        `;
      }
      
      const defaultPrompt = `${propertyContext}
        Analise estas imagens de imóvel e forneça um relatório comparativo detalhado:
        
        1. **Análise Comparativa**:
           - Compare as diferentes perspectivas/ambientes
           - Identifique consistências e discrepâncias
           ${propertyInfo?.tipo ? `- Verifique se todas as imagens correspondem ao tipo: ${propertyInfo.tipo}` : ''}
        
        2. **Avaliação Geral do Imóvel**:
           - Estado geral baseado em todas as imagens
           - Padrão de qualidade observado
           ${propertyInfo?.finalidade ? `- Adequação geral para ${propertyInfo.finalidade}` : ''}
        
        3. **Análise por Ambiente/Área**:
           - Descrição específica de cada área mostrada
           - Condições particulares de cada ambiente
           ${propertyInfo?.areaTerreno || propertyInfo?.areaConstruida ? `- Verificar se as áreas visíveis condizem com as informadas` : ''}
        
        4. **Pontos Críticos Identificados**:
           - Problemas recorrentes nas imagens
           - Áreas que necessitam atenção especial
        
        5. **Avaliação Final** (1-10):
           - Nota consolidada baseada em todas as imagens
           - Justificativa detalhada
           ${propertyInfo?.finalidade ? `- Considerações específicas para ${propertyInfo.finalidade}` : ''}
        
        6. **Recomendações Prioritárias**:
           - Ações imediatas necessárias
           - Investimentos recomendados por ordem de prioridade
           ${propertyInfo?.cidade ? `- Considerações do mercado local de ${propertyInfo.cidade}` : ''}
        
        Forneça uma análise técnica e abrangente.
      `;
      
      const finalPrompt = prompt.trim() || defaultPrompt;
      
      const content = [finalPrompt, ...imageParts];
      const result = await this.model.generateContent(content);
      const response = await result.response;
      
      return {
        success: true,
        analysis: response.text(),
        timestamp: new Date().toISOString(),
        imagesInfo: imageFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };
    } catch (error) {
      console.error('Erro na análise das imagens:', error);
      
      // Se for erro 503 (modelo sobrecarregado) e ainda temos tentativas
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (retries > 0) {
          console.log(`Modelo sobrecarregado. Tentando novamente em 2 segundos... (${retries} tentativas restantes)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.analyzeMultipleImages(imageFiles, prompt, retries - 1);
        } else {
          return {
            success: false,
            error: 'O modelo Gemini está temporariamente sobrecarregado. Tente novamente em alguns minutos.',
            timestamp: new Date().toISOString()
          };
        }
      }
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Gera análise comparativa entre dois conjuntos de imagens
  async comparePropertyImages(images1, images2, prompt = '', propertyInfo = null, retries = 3) {
    try {

      const imageParts1 = await Promise.all(
        images1.map(file => this.fileToGenerativePart(file))
      );
      const imageParts2 = await Promise.all(
        images2.map(file => this.fileToGenerativePart(file))
      );
      
      // Construir informações do imóvel se fornecidas
      let propertyContext = '';
      if (propertyInfo && Object.keys(propertyInfo).some(key => propertyInfo[key])) {
        propertyContext = `
        **INFORMAÇÕES DO PROJETO E CLIENTE EM ANÁLISE:**
        ${propertyInfo.clientName ? `- Cliente: ${propertyInfo.clientName}` : ''}
        ${propertyInfo.projectName ? `- Projeto: ${propertyInfo.projectName}` : ''}
        ${propertyInfo.projectAddress || propertyInfo.endereco ? `- Endereço: ${propertyInfo.projectAddress || propertyInfo.endereco}` : ''}
        ${propertyInfo.projectCity || propertyInfo.cidade ? `- Cidade: ${propertyInfo.projectCity || propertyInfo.cidade}` : ''}
        ${propertyInfo.projectState ? `- Estado: ${propertyInfo.projectState}` : ''}
        ${propertyInfo.projectCep ? `- CEP: ${propertyInfo.projectCep}` : ''}
        ${propertyInfo.projectType || propertyInfo.tipo ? `- Tipo: ${propertyInfo.projectType || propertyInfo.tipo}` : ''}
        ${propertyInfo.projectPurpose || propertyInfo.finalidade ? `- Finalidade da Avaliação: ${propertyInfo.projectPurpose || propertyInfo.finalidade}` : ''}
        ${propertyInfo.landArea || propertyInfo.areaTerreno ? `- Área do Terreno: ${propertyInfo.landArea || propertyInfo.areaTerreno} m²` : ''}
        ${propertyInfo.builtArea || propertyInfo.areaConstruida ? `- Área Construída: ${propertyInfo.builtArea || propertyInfo.areaConstruida} m²` : ''}
        ${propertyInfo.estimatedValue ? `- Valor Estimado: R$ ${propertyInfo.estimatedValue?.toLocaleString('pt-BR')}` : ''}
        ${propertyInfo.budgetValue ? `- Valor do Orçamento: R$ ${propertyInfo.budgetValue?.toLocaleString('pt-BR')}` : ''}
        ${propertyInfo.observations ? `- Observações: ${propertyInfo.observations}` : ''}
        
        **IMPORTANTE:** Use essas informações do projeto e cliente para contextualizar sua comparação e fornecer análises mais precisas.
        `;
      }
      
      const defaultPrompt = `${propertyContext}
        Compare estes dois conjuntos de imagens de imóveis e forneça uma análise comparativa:
        
        **PRIMEIRO CONJUNTO DE IMAGENS:**
        [Imagens do primeiro imóvel]
        
        **SEGUNDO CONJUNTO DE IMAGENS:**
        [Imagens do segundo imóvel]
        
        **ANÁLISE COMPARATIVA:**
        
        1. **Comparação Estrutural**:
           - Estado de conservação de cada imóvel
           - Qualidade dos acabamentos
           - Padrão construtivo
           ${propertyInfo?.tipo ? `- Adequação ao tipo de imóvel: ${propertyInfo.tipo}` : ''}
        
        2. **Análise de Valor**:
           - Qual imóvel apresenta melhor custo-benefício
           - Fatores que influenciam o valor de cada um
           ${propertyInfo?.finalidade ? `- Considerações específicas para ${propertyInfo.finalidade}` : ''}
           ${propertyInfo?.cidade ? `- Contexto do mercado de ${propertyInfo.cidade}` : ''}
        
        3. **Pontos Fortes e Fracos**:
           - Vantagens de cada imóvel
           - Desvantagens identificadas
           ${propertyInfo?.areaTerreno || propertyInfo?.areaConstruida ? `- Análise das áreas em relação ao informado` : ''}
        
        4. **Recomendação**:
           - Qual imóvel é mais recomendado e por quê
           - Considerações para a decisão
           ${propertyInfo?.finalidade ? `- Melhor adequação para ${propertyInfo.finalidade}` : ''}
        
        5. **Notas Comparativas** (1-10):
           - Nota para cada imóvel
           - Justificativa das notas
        
        Seja imparcial e técnico na comparação.
      `;
      
      const finalPrompt = prompt.trim() || defaultPrompt;
      
      const content = [finalPrompt, ...imageParts1, ...imageParts2];
      const result = await this.model.generateContent(content);
      const response = await result.response;
      
      return {
        success: true,
        comparison: response.text(),
        timestamp: new Date().toISOString(),
        property1Info: images1.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        property2Info: images2.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };
    } catch (error) {
      console.error('Erro na comparacao das imagens:', error);
      
      // Se for erro 503 (modelo sobrecarregado) e ainda temos tentativas
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (retries > 0) {
          console.log(`Modelo sobrecarregado. Tentando novamente em 2 segundos... (${retries} tentativas restantes)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.comparePropertyImages(images1, images2, prompt, retries - 1);
        } else {
          return {
            success: false,
            error: 'O modelo Gemini está temporariamente sobrecarregado. Tente novamente em alguns minutos.',
            timestamp: new Date().toISOString()
          };
        }
      }
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default new GeminiService();