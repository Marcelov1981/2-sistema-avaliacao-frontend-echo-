// Configurações da API

// Configuração base da API usando variáveis de ambiente
const API_BASE_URL_DEV = 'http://localhost:3001/api/v1';
const API_BASE_URL_PROD = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.com/api/v1';

// Configuração para desenvolvimento
const DEV_CONFIG = {
  baseURL: API_BASE_URL_DEV,
  timeout: 30000,
};

// Configuração para produção
const PROD_CONFIG = {
  baseURL: API_BASE_URL_PROD,
  timeout: 30000,
};

// Selecionar configuração baseada no ambiente
const config = import.meta.env.MODE === 'production' ? PROD_CONFIG : DEV_CONFIG;
const API_BASE_URL = config.baseURL;

export const API_BASE_URL_EXPORT = config.baseURL;

// URL base da API local (mantido para compatibilidade)
export { API_BASE_URL_EXPORT as API_BASE_URL };

// URLs dos endpoints
export const API_ENDPOINTS = {
  // Configurações
  configuracoes: {
    base: `${API_BASE_URL}/configuracoes`,
    byType: (tipo) => `${API_BASE_URL}/configuracoes/${tipo}`,
    logo: `${API_BASE_URL}/configuracoes/logo`,
  },
  
  // Usuários
  usuarios: {
    base: `${API_BASE_URL}/usuarios`,
    register: `${API_BASE_URL}/usuarios/register`,
    login: `${API_BASE_URL}/usuarios/login`,
    profile: `${API_BASE_URL}/usuarios/profile`,
    updatePassword: `${API_BASE_URL}/usuarios/update-password`,
    list: `${API_BASE_URL}/usuarios/list`,
  },
  
  // Backup
  backup: {
    base: `${API_BASE_URL}/backup`,
    create: `${API_BASE_URL}/backup/create`,
    list: `${API_BASE_URL}/backup/list`,
    restore: (filename) => `${API_BASE_URL}/backup/restore/${filename}`,
    delete: (filename) => `${API_BASE_URL}/backup/delete/${filename}`,
    autoConfig: `${API_BASE_URL}/backup/auto-config`,
    cleanup: `${API_BASE_URL}/backup/cleanup`,
  },
  
  // Integrações
  integracoes: {
    base: `${API_BASE_URL}/integracoes`,
    apis: `${API_BASE_URL}/integracoes/apis`,
    webhooks: `${API_BASE_URL}/integracoes/webhooks`,
    test: `${API_BASE_URL}/integracoes/test`,
    logs: `${API_BASE_URL}/integracoes/logs`,
  },
  
  // Orçamentos
  orcamentos: {
    base: `${API_BASE_URL}/orcamentos`,
    byId: (id) => `${API_BASE_URL}/orcamentos/${id}`,
  },
  
  // Laudos
  laudos: {
    base: `${API_BASE_URL}/laudos`,
    byId: (id) => `${API_BASE_URL}/laudos/${id}`,
  },
  
  // Avaliações (placeholder para futuro)
  avaliacoes: {
    base: `${API_BASE_URL}/avaliacoes`,
    byId: (id) => `${API_BASE_URL}/avaliacoes/${id}`,
  },
  
  // Clientes (placeholder para futuro)
  clientes: {
    base: `${API_BASE_URL}/clientes`,
    byId: (id) => `${API_BASE_URL}/clientes/${id}`,
  },
  
  // Real State (placeholder para futuro)
  realstate: {
    base: `${API_BASE_URL}/realstate`,
    byId: (id) => `${API_BASE_URL}/realstate/${id}`,
  },
  
  // Health check
  health: 'http://localhost:3001/health',
};

// Configurações padrão do axios
export const API_CONFIG = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Função para obter token de autenticação
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Função para configurar headers de autenticação
export const getAuthHeaders = () => {
  const token = localStorage.getItem('saas_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
  getAuthToken,
  getAuthHeaders,
};