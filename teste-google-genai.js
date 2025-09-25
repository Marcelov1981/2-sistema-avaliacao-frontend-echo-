/**
 * Teste da nova integração Google GenAI
 * Demonstra como a nova biblioteca está funcionando no sistema
 */

import GoogleGenAIService from './src/utils/GoogleGenAIService.js';

// Simula um arquivo de imagem para teste
function createMockImageFile() {
  // Cria um canvas pequeno com uma imagem simples
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  // Desenha um retângulo simples
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = '#FFF';
  ctx.font = '16px Arial';
  ctx.fillText('TESTE', 25, 55);
  
  // Converte para blob e depois para File
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      const file = new File([blob], 'teste-imagem.png', { type: 'image/png' });
      resolve(file);
    });
  });
}

// Função principal de teste
async function testarGoogleGenAI() {
  console.log('🧪 === TESTE DA NOVA INTEGRAÇÃO GOOGLE GENAI ===\n');
  
  try {
    // 1. Teste de conectividade
    console.log('1️⃣ Testando conectividade...');
    const conectividade = await GoogleGenAIService.testConnection();
    
    if (!conectividade) {
      console.error('❌ Falha na conectividade. Verifique a API key.');
      return;
    }
    
    console.log('✅ Conectividade OK\n');
    
    // 2. Teste de análise de imagem única
    console.log('2️⃣ Testando análise de imagem única...');
    
    // Simula informações de propriedade
    const propriedadeInfo = {
      clientName: 'João Silva',
      projectName: 'Apartamento Centro',
      projectAddress: 'Rua das Flores, 123',
      projectCity: 'São Paulo',
      projectState: 'SP',
      projectType: 'Apartamento',
      projectPurpose: 'Avaliação para venda'
    };
    
    // Cria arquivo de teste
    const imagemTeste = await createMockImageFile();
    
    const resultadoUnico = await GoogleGenAIService.analyzeImage(
      imagemTeste,
      'Analise esta imagem de teste considerando aspectos imobiliários.',
      propriedadeInfo
    );
    
    console.log('📊 Resultado da análise única:');
    console.log(`   Provider: ${resultadoUnico.provider}`);
    console.log(`   Modelo: ${resultadoUnico.model}`);
    console.log(`   Confiança: ${resultadoUnico.confidence}`);
    console.log(`   Análise: ${resultadoUnico.analysis.substring(0, 200)}...\n`);
    
    // 3. Teste de análise múltipla
    console.log('3️⃣ Testando análise de múltiplas imagens...');
    
    const imagens = [
      await createMockImageFile(),
      await createMockImageFile()
    ];
    
    const resultadoMultiplo = await GoogleGenAIService.analyzeMultipleImages(
      imagens,
      'Analise estas imagens para relatório imobiliário.',
      propriedadeInfo
    );
    
    console.log('📊 Resultado da análise múltipla:');
    console.log(`   Provider: ${resultadoMultiplo.provider}`);
    console.log(`   Total de imagens: ${resultadoMultiplo.totalImages}`);
    console.log(`   Análises bem-sucedidas: ${resultadoMultiplo.successfulAnalyses}`);
    console.log(`   Timestamp: ${resultadoMultiplo.timestamp}\n`);
    
    // 4. Teste de comparação
    console.log('4️⃣ Testando comparação de propriedades...');
    
    const imagens1 = [await createMockImageFile()];
    const imagens2 = [await createMockImageFile()];
    
    const resultadoComparacao = await GoogleGenAIService.comparePropertyImages(
      imagens1,
      imagens2,
      'Compare estas duas propriedades.',
      propriedadeInfo
    );
    
    console.log('📊 Resultado da comparação:');
    console.log(`   Provider: ${resultadoComparacao.provider}`);
    console.log(`   Propriedade 1 - Análises: ${resultadoComparacao.property1.analyses.length}`);
    console.log(`   Propriedade 2 - Análises: ${resultadoComparacao.property2.analyses.length}`);
    console.log(`   Comparação: ${resultadoComparacao.comparison.substring(0, 200)}...\n`);
    
    console.log('🎉 === TODOS OS TESTES PASSARAM! ===');
    console.log('✅ A nova biblioteca Google GenAI está funcionando perfeitamente!');
    console.log('🚀 O sistema agora usa a biblioteca que você estava utilizando com sucesso.');
    
  } catch (error) {
    console.error('💥 Erro durante os testes:', error);
    console.log('\n🔧 Possíveis soluções:');
    console.log('   1. Verifique se a API key está correta no arquivo .env');
    console.log('   2. Confirme que a biblioteca @google/generative-ai está instalada');
    console.log('   3. Verifique a conectividade com a internet');
  }
}

// Executa os testes
if (typeof window !== 'undefined') {
  // Ambiente do navegador
  console.log('🌐 Executando no navegador...');
  testarGoogleGenAI();
} else {
  // Ambiente Node.js
  console.log('⚡ Para testar no navegador, abra o console e execute:');
  console.log('   import("./teste-google-genai.js")');
}

export { testarGoogleGenAI };