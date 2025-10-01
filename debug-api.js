// Script de debug para testar a configuração da API
console.log('=== DEBUG API CONFIGURATION ===');

// Simular as variáveis de ambiente
const VITE_API_BASE_URL = 'https://sistema-avaliacao-backend.onrender.com/api/v1';
const VITE_BACKEND_URL = 'https://sistema-avaliacao-backend.onrender.com';

console.log('VITE_API_BASE_URL:', VITE_API_BASE_URL);
console.log('VITE_BACKEND_URL:', VITE_BACKEND_URL);

// Simular a lógica de configuração do api.js
const API_BASE_URL_DEV = 'http://localhost:3001';
const API_BASE_URL_PROD = VITE_API_BASE_URL || 'https://your-backend-url.com';

const DEV_CONFIG = {
  baseURL: API_BASE_URL_DEV,
  timeout: 30000,
};

const PROD_CONFIG = {
  baseURL: API_BASE_URL_PROD,
  timeout: 30000,
};

// Simular a condição de seleção
const MODE = 'development'; // ou 'production'
const config = (MODE === 'production' || VITE_API_BASE_URL) ? PROD_CONFIG : DEV_CONFIG;
const API_BASE_URL = config.baseURL;

console.log('MODE:', MODE);
console.log('Condição (MODE === "production" || VITE_API_BASE_URL):', (MODE === 'production' || VITE_API_BASE_URL));
console.log('Config selecionada:', config);
console.log('API_BASE_URL final:', API_BASE_URL);

// Construir URL do endpoint de clientes
const clientesEndpoint = `${API_BASE_URL}/clientes`;
console.log('URL do endpoint de clientes:', clientesEndpoint);

// Verificar token no localStorage (simulado)
console.log('Token no localStorage:', 'saas_auth_token');