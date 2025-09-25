/**
 * Script de teste para Google Vision API
 * Identifica problemas na configuração e conectividade
 */

import fs from 'fs';

class GoogleVisionTester {
  constructor() {
    // Lê a chave da API do arquivo .env
    this.apiKey = this.readEnvVariable('VITE_GOOGLE_VISION_KEY');
    this.endpoint = 'https://vision.googleapis.com/v1/images:annotate';
  }

  /**
   * Lê variável do arquivo .env
   */
  readEnvVariable(varName) {
    try {
      const envContent = fs.readFileSync('.env', 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        if (line.startsWith(`${varName}=`)) {
          return line.split('=')[1];
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao ler arquivo .env:', error.message);
      return null;
    }
  }

  /**
   * Testa a configuração da API
   */
  testConfiguration() {
    console.log('🔧 Testando configuração da Google Vision API...');
    console.log('📋 Status das configurações:');
    console.log(`   API Key: ${this.apiKey ? '✅ Configurada' : '❌ Não configurada'}`);
    console.log(`   Endpoint: ${this.endpoint}`);
    
    if (!this.apiKey || this.apiKey === 'your_google_vision_api_key_here') {
      console.log('\n❌ PROBLEMA IDENTIFICADO:');
      console.log('   A chave da API Google Vision não está configurada corretamente.');
      console.log('   Verifique o arquivo .env e configure VITE_GOOGLE_VISION_KEY');
      return false;
    }
    
    return true;
  }

  /**
   * Converte imagem para base64
   */
  async imageToBase64(imagePath) {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      return imageBuffer.toString('base64');
    } catch (error) {
      console.error('❌ Erro ao converter imagem:', error.message);
      return null;
    }
  }

  /**
   * Testa conectividade com a API
   */
  async testConnectivity() {
    console.log('\n🌐 Testando conectividade com Google Vision API...');
    
    try {
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' // 1x1 pixel transparente
            },
            features: [{ type: 'LABEL_DETECTION', maxResults: 1 }]
          }]
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Conectividade OK - API respondeu corretamente');
        console.log('📊 Resposta da API:', JSON.stringify(data, null, 2));
        return true;
      } else {
        console.log('❌ Erro na API:');
        console.log('   Status:', response.status);
        console.log('   Resposta:', JSON.stringify(data, null, 2));
        return false;
      }
    } catch (error) {
      console.log('❌ Erro de conectividade:', error.message);
      return false;
    }
  }

  /**
   * Testa análise com imagem real
   */
  async testImageAnalysis() {
    console.log('\n🖼️ Testando análise de imagem...');
    
    // Cria uma imagem de teste simples (quadrado colorido)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFYSURBVBiVY/z//z8DJQAggBhJVQcQQIykqgMIIEZS1QEEECO56gACiJFcdQABxEiuOoAAYiRXHUAAMZKrDiCAGMlVBxBAjOSqAwggRnLVAQQQI7nqAAKIkVx1AAHESKo6gABiJFUdQAAxkqoOIIAYSVUHEECMpKoDCCBGUtUBBBAjqeoAAoiRVHUAAcRIqjqAAGIkVR1AADGSLA4ggBhJVQcQQIykqgMIIEZS1QEEECO56gACiJFcdQABxEiuOoAAYiRXHUAAMZKrDiCAGMlVBxBAjOSqAwggRnLVAQQQI7nqAAKIkVx1AAHESKo6gABiJFUdQAAxkqoOIIAYSVUHEECMpKoDCCBGUtUBBBAjqeoAAoiRVHUAAcRIqjqAAGIkVR1AADGSLA4ggBhJVQcQQIykqgMIIEZS1QEEECO56gACiJFcdQABxEiuOoAAYiRXHUAAMZKrDiCAGAEAF2AjjX8j7v4AAAAASUVORK5CYII=';
    
    try {
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: testImageBase64
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'TEXT_DETECTION' },
              { type: 'SAFE_SEARCH_DETECTION' },
              { type: 'IMAGE_PROPERTIES' }
            ]
          }]
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Análise de imagem bem-sucedida!');
        console.log('📊 Resultados da análise:');
        
        const annotations = data.responses[0];
        
        if (annotations.labelAnnotations) {
          console.log('   🏷️ Labels detectados:', annotations.labelAnnotations.length);
          annotations.labelAnnotations.slice(0, 3).forEach(label => {
            console.log(`      - ${label.description}: ${(label.score * 100).toFixed(1)}%`);
          });
        }
        
        if (annotations.imagePropertiesAnnotation) {
          console.log('   🎨 Propriedades da imagem: ✅');
        }
        
        if (annotations.safeSearchAnnotation) {
          console.log('   🛡️ Safe Search: ✅');
        }
        
        return true;
      } else {
        console.log('❌ Erro na análise de imagem:');
        console.log('   Status:', response.status);
        console.log('   Resposta:', JSON.stringify(data, null, 2));
        return false;
      }
    } catch (error) {
      console.log('❌ Erro na análise de imagem:', error.message);
      return false;
    }
  }

  /**
   * Executa todos os testes
   */
  async runAllTests() {
    console.log('🧪 INICIANDO TESTES DA GOOGLE VISION API\n');
    console.log('=' .repeat(50));
    
    const configOk = this.testConfiguration();
    if (!configOk) {
      console.log('\n❌ TESTE FALHOU: Configuração inválida');
      return;
    }
    
    const connectivityOk = await this.testConnectivity();
    if (!connectivityOk) {
      console.log('\n❌ TESTE FALHOU: Problema de conectividade');
      return;
    }
    
    const analysisOk = await this.testImageAnalysis();
    if (!analysisOk) {
      console.log('\n❌ TESTE FALHOU: Problema na análise de imagem');
      return;
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ TODOS OS TESTES PASSARAM!');
    console.log('🎉 Google Vision API está funcionando corretamente!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Verifique se o sistema está usando a API corretamente');
    console.log('   2. Confirme se não há problemas no código de integração');
    console.log('   3. Teste com imagens reais do sistema');
  }
}

// Executa os testes
const tester = new GoogleVisionTester();
tester.runAllTests().catch(console.error);