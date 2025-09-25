#!/usr/bin/env node

/**
 * Script de Verificação das APIs
 * Verifica quais APIs estão configuradas e funcionando
 */

import fs from 'fs';
import path from 'path';
import process from 'process';

// Função para ler o arquivo .env
function lerEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Erro ao ler arquivo .env:', error.message);
    return {};
  }
}

// Função para verificar se uma API está configurada
function verificarAPI(nome, chave, placeholder = '') {
  const configurada = chave && chave !== placeholder && chave !== '';
  const status = configurada ? '✅' : '❌';
  const valor = configurada ? `${chave.substring(0, 10)}...` : 'Não configurada';
  
  console.log(`${status} ${nome}: ${valor}`);
  return configurada;
}

// Função principal
function verificarAPIs() {
  console.log('🔍 Verificando Configuração das APIs\n');
  
  const env = lerEnv();
  let totalConfiguradas = 0;
  let totalAPIs = 0;
  
  console.log('📊 APIs de IA para Análise de Imagens:');
  totalAPIs++;
  if (verificarAPI('Google Gemini (Legacy)', env.VITE_GEMINI_API_KEY)) totalConfiguradas++;
  
  totalAPIs++;
  if (verificarAPI('OpenAI GPT-4 Vision', env.VITE_OPENAI_API_KEY)) totalConfiguradas++;
  
  totalAPIs++;
  if (verificarAPI('Anthropic Claude', env.VITE_ANTHROPIC_API_KEY)) totalConfiguradas++;
  
  totalAPIs++;
  if (verificarAPI('Azure Computer Vision', env.VITE_AZURE_VISION_KEY)) totalConfiguradas++;
  
  totalAPIs++;
  if (verificarAPI('Google Vision API', env.VITE_GOOGLE_VISION_KEY)) totalConfiguradas++;
  
  console.log('\n🌍 APIs de Geolocalização:');
  totalAPIs++;
  if (verificarAPI('OpenCage Geocoding', env.VITE_OPENCAGE_API_KEY)) totalConfiguradas++;
  
  totalAPIs++;
  if (verificarAPI('Mapbox', env.VITE_MAPBOX_API_KEY)) totalConfiguradas++;
  
  totalAPIs++;
  if (verificarAPI('Google Maps', env.VITE_GOOGLE_MAPS_API_KEY)) totalConfiguradas++;
  
  console.log('\n🔧 Configurações do Sistema:');
  console.log(`✅ Backend URL: ${env.VITE_BACKEND_URL || 'http://localhost:3001'}`);
  
  console.log('\n📈 Resumo:');
  console.log(`APIs Configuradas: ${totalConfiguradas}/${totalAPIs}`);
  
  const porcentagem = Math.round((totalConfiguradas / totalAPIs) * 100);
  console.log(`Completude: ${porcentagem}%`);
  
  if (totalConfiguradas === 0) {
    console.log('\n⚠️  ATENÇÃO: Nenhuma API configurada!');
    console.log('O sistema funcionará apenas com análise local básica.');
  } else if (totalConfiguradas < 3) {
    console.log('\n💡 RECOMENDAÇÃO: Configure mais APIs para melhor funcionalidade.');
    console.log('Priorize: OpenAI GPT-4 Vision e OpenCage Geocoding.');
  } else {
    console.log('\n🎉 EXCELENTE: Boa configuração de APIs!');
  }
  
  console.log('\n📚 Para configurar APIs, consulte: GUIA_CONFIGURACAO_APIS.md');
  
  // Verificar se há problemas comuns
  console.log('\n🔍 Verificação de Problemas:');
  
  if (env.VITE_OPENAI_API_KEY && !env.VITE_OPENAI_API_KEY.startsWith('sk-')) {
    console.log('⚠️  Chave OpenAI pode estar incorreta (deve começar com "sk-")');
  }
  
  if (env.VITE_GEMINI_API_KEY && env.VITE_GEMINI_API_KEY.length < 30) {
    console.log('⚠️  Chave Google Gemini pode estar incorreta (muito curta)');
  }
  
  // Verificar se o arquivo .env existe
  if (Object.keys(env).length === 0) {
    console.log('❌ Arquivo .env não encontrado ou vazio!');
    console.log('Crie o arquivo .env baseado no .env.example');
  }
}

// Executar verificação
verificarAPIs();