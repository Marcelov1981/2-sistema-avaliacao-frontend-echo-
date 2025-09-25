import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Serviço para integração com a nova biblioteca Google GenAI
 * Baseado na implementação que você estava usando com sucesso
 */
class GoogleGenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCc3gYZ6IYcJxdLAQJqa8fDMVc2uptAhTg';
    
    if (!this.apiKey) {
      throw new Error('VITE_GEMINI_API_KEY não está configurada. Verifique seu arquivo .env');
    }
    
    // Inicializa o cliente usando a nova biblioteca
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('✅ GoogleGenAIService inicializado com sucesso');
  }

  /**
   * Converte arquivo para base64
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Analisa uma única imagem usando a nova biblioteca Google GenAI
   */
  async analyzeImage(imageFile, prompt = '', propertyInfo = null, retries = 3) {
    try {
      console.log('🤖 Iniciando análise com Google GenAI...');
      
      // Converte imagem para base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Constrói o contexto da propriedade se fornecido
      let propertyContext = '';
      if (propertyInfo && Object.keys(propertyInfo).some(key => propertyInfo[key])) {
        propertyContext = `
        **INFORMAÇÕES DO PROJETO E CLIENTE:**
        ${propertyInfo.clientName ? `- Cliente: ${propertyInfo.clientName}` : ''}
        ${propertyInfo.projectName ? `- Projeto: ${propertyInfo.projectName}` : ''}
        ${propertyInfo.projectAddress || propertyInfo.endereco ? `- Endereço: ${propertyInfo.projectAddress || propertyInfo.endereco}` : ''}
        ${propertyInfo.projectCity || propertyInfo.cidade ? `- Cidade: ${propertyInfo.projectCity || propertyInfo.cidade}` : ''}
        ${propertyInfo.projectState ? `- Estado: ${propertyInfo.projectState}` : ''}
        ${propertyInfo.projectType || propertyInfo.tipo ? `- Tipo: ${propertyInfo.projectType || propertyInfo.tipo}` : ''}
        ${propertyInfo.projectPurpose || propertyInfo.finalidade ? `- Finalidade: ${propertyInfo.projectPurpose || propertyInfo.finalidade}` : ''}
        `;
      }
      
      // Prompt padrão ou personalizado
      const analysisPrompt = prompt || `
        ${propertyContext}
        
        **ANÁLISE DETALHADA DA IMAGEM:**
        
        Por favor, analise esta imagem de forma detalhada e estruturada, considerando:
        
        **1. DESCRIÇÃO GERAL:**
        - Tipo de ambiente/cômodo
        - Características principais
        - Estilo arquitetônico
        
        **2. CARACTERÍSTICAS ESTRUTURAIS:**
        - Materiais utilizados
        - Acabamentos
        - Instalações visíveis
        
        **3. ASPECTOS POSITIVOS:**
        - Pontos fortes do ambiente
        - Qualidades destacáveis
        
        **4. PONTOS DE ATENÇÃO:**
        - Aspectos que merecem cuidado
        - Possíveis melhorias
        
        **5. AVALIAÇÃO DE CONSERVAÇÃO:**
        - Estado geral de conservação
        - Sinais de desgaste ou danos
        
        **6. RECOMENDAÇÕES:**
        - Sugestões de manutenção
        - Melhorias recomendadas
        
        Seja específico e técnico na análise, considerando aspectos imobiliários relevantes.
      `;
      
      // Prepara o conteúdo para a API
      const content = {
        parts: [
          {
            text: analysisPrompt
          },
          {
            inline_data: {
              mime_type: imageFile.type || 'image/jpeg',
              data: base64Image
            }
          }
        ]
      };
      
      // Chama a API usando a nova biblioteca
      const response = await this.model.generateContent([content]);
      
      if (response && response.candidates && response.candidates[0]) {
        const analysis = response.candidates[0].content.parts[0].text;
        
        console.log('✅ Análise Google GenAI concluída com sucesso');
        
        return {
          provider: 'Google GenAI',
          analysis: analysis,
          confidence: 0.9,
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Resposta inválida da API Google GenAI');
      }
      
    } catch (error) {
      console.error('❌ Erro na análise Google GenAI:', error);
      
      if (retries > 0) {
        console.log(`🔄 Tentando novamente... (${retries} tentativas restantes)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2 segundos
        return this.analyzeImage(imageFile, prompt, propertyInfo, retries - 1);
      }
      
      throw error;
    }
  }

  /**
   * Analisa múltiplas imagens
   */
  async analyzeMultipleImages(imageFiles, prompt = '', propertyInfo = null) {
    try {
      console.log(`🤖 Iniciando análise de ${imageFiles.length} imagens com Google GenAI...`);
      
      const analyses = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        console.log(`📸 Analisando imagem ${i + 1}/${imageFiles.length}: ${file.name}`);
        
        try {
          const analysis = await this.analyzeImage(file, prompt, propertyInfo);
          analyses.push({
            fileName: file.name,
            fileSize: file.size,
            ...analysis
          });
        } catch (error) {
          console.warn(`⚠️ Erro ao analisar ${file.name}:`, error.message);
          analyses.push({
            fileName: file.name,
            error: error.message,
            provider: 'Google GenAI (Erro)'
          });
        }
        
        // Pequena pausa entre análises para evitar rate limiting
        if (i < imageFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log('✅ Análise múltipla Google GenAI concluída');
      
      return {
        provider: 'Google GenAI',
        totalImages: imageFiles.length,
        successfulAnalyses: analyses.filter(a => !a.error).length,
        analyses: analyses,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erro na análise múltipla Google GenAI:', error);
      throw error;
    }
  }

  /**
   * Compara imagens de propriedades
   */
  async comparePropertyImages(images1, images2, prompt = '', propertyInfo = null) {
    try {
      console.log('🤖 Iniciando comparação de propriedades com Google GenAI...');
      
      // Analisa o primeiro conjunto de imagens
      const analysis1 = await this.analyzeMultipleImages(images1, prompt, {
        ...propertyInfo,
        analysisType: 'Propriedade 1'
      });
      
      // Analisa o segundo conjunto de imagens
      const analysis2 = await this.analyzeMultipleImages(images2, prompt, {
        ...propertyInfo,
        analysisType: 'Propriedade 2'
      });
      
      // Gera análise comparativa
      const comparisonPrompt = `
        Com base nas análises das duas propriedades abaixo, faça uma comparação detalhada:
        
        **PROPRIEDADE 1:**
        ${analysis1.analyses.map(a => a.analysis || 'Erro na análise').join('\n\n')}
        
        **PROPRIEDADE 2:**
        ${analysis2.analyses.map(a => a.analysis || 'Erro na análise').join('\n\n')}
        
        **COMPARAÇÃO SOLICITADA:**
        - Pontos fortes de cada propriedade
        - Aspectos que precisam de atenção em cada uma
        - Recomendação de qual propriedade oferece melhor custo-benefício
        - Considerações para tomada de decisão
      `;
      
      const comparisonResponse = await this.model.generateContent([{
        parts: [{ text: comparisonPrompt }]
      }]);
      
      let comparison = 'Não foi possível gerar comparação';
      if (comparisonResponse && comparisonResponse.candidates && comparisonResponse.candidates[0]) {
        comparison = comparisonResponse.candidates[0].content.parts[0].text;
      }
      
      console.log('✅ Comparação Google GenAI concluída');
      
      return {
        provider: 'Google GenAI',
        property1: analysis1,
        property2: analysis2,
        comparison: comparison,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erro na comparação Google GenAI:', error);
      throw error;
    }
  }

  /**
   * Testa a conectividade com a API
   */
  async testConnection() {
    try {
      console.log('🧪 Testando conexão com Google GenAI...');
      
      const response = await this.model.generateContent([{
        parts: [{
          text: 'Teste simples: responda apenas "API funcionando" se você conseguir processar esta mensagem.'
        }]
      }]);
      
      if (response && response.candidates && response.candidates[0]) {
        const result = response.candidates[0].content.parts[0].text;
        console.log('✅ Google GenAI funcionando!', result);
        return true;
      } else {
        console.error('❌ Resposta inválida do Google GenAI');
        return false;
      }
    } catch (error) {
      console.error('💥 Erro ao testar Google GenAI:', error);
      return false;
    }
  }
}

// Exporta uma instância única do serviço
export default new GoogleGenAIService();