// Configurações da API

// Configuração base da API usando variáveis de ambiente
const API_BASE_URL_DEV = 'http://localhost:3001';
const API_BASE_URL_PROD = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.com';

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
// Se VITE_API_BASE_URL estiver definida, usar configuração de produção mesmo em desenvolvimento
const config = (import.meta.env.MODE === 'production' || import.meta.env.VITE_API_BASE_URL) ? PROD_CONFIG : DEV_CONFIG;
const API_BASE_URL = config.baseURL;

export const API_BASE_URL_EXPORT = config.baseURL;

// URL base da API local (mantido para compatibilidade)
export { API_BASE_URL_EXPORT as API_BASE_URL };

// URLs dos endpoints
export const API_ENDPOINTS = {
  // Configurações
  configuracoes: {
    base: `${API_BASE_URL}/api/v1/configuracoes`,
    geral: `${API_BASE_URL}/api/v1/configuracoes/geral`,
    logo: `${API_BASE_URL}/api/v1/configuracoes/logo`,
  },

  // Usuários
  usuarios: {
    base: `${API_BASE_URL}/api/v1/usuarios`,
    register: `${API_BASE_URL}/api/v1/usuarios/register`,
    login: `${API_BASE_URL}/api/v1/usuarios/login`,
    profile: `${API_BASE_URL}/api/v1/usuarios/perfil`,
    updatePassword: `${API_BASE_URL}/api/v1/usuarios/senha`,
    primeiroLogin: `${API_BASE_URL}/api/v1/usuarios/primeiro-login`,
    colaborador: `${API_BASE_URL}/api/v1/usuarios/colaborador`,
    colaboradores: `${API_BASE_URL}/api/v1/usuarios/colaboradores`,
  },
  
  // Backup
  backup: {
    base: `${API_BASE_URL}/api/v1/backup`,
    create: `${API_BASE_URL}/api/v1/backup`,
    list: `${API_BASE_URL}/api/v1/backup`,
    restore: (id) => `${API_BASE_URL}/api/v1/backup/${id}/restore`,
    delete: (id) => `${API_BASE_URL}/api/v1/backup/${id}`,
    autoConfig: `${API_BASE_URL}/api/v1/backup/auto-config`,
    cleanup: `${API_BASE_URL}/api/v1/backup/cleanup`,
  },
  
  // Integrações
  integracoes: {
    base: `${API_BASE_URL}/api/v1/integracoes`,
    apis: `${API_BASE_URL}/api/v1/integracoes/apis`,
    webhooks: `${API_BASE_URL}/api/v1/integracoes/webhooks`,
    test: `${API_BASE_URL}/api/v1/integracoes/test`,
    logs: `${API_BASE_URL}/api/v1/integracoes/logs`,
  },
  
  // Orçamentos
  orcamentos: {
    base: `${API_BASE_URL}/api/v1/orcamentos`,
    byId: (id) => `${API_BASE_URL}/api/v1/orcamentos/${id}`,
  },
  
  // Laudos
  laudos: {
    base: `${API_BASE_URL}/api/v1/laudos`,
    byId: (id) => `${API_BASE_URL}/api/v1/laudos/${id}`,
  },
  
  // Avaliações
  avaliacoes: {
    base: `${API_BASE_URL}/api/v1/avaliacoes`,
    byId: (id) => `${API_BASE_URL}/api/v1/avaliacoes/${id}`,
  },
  
  // Clientes
  clientes: {
    base: `${API_BASE_URL}/api/v1/clientes`,
    byId: (id) => `${API_BASE_URL}/api/v1/clientes/${id}`,
  },
  
  // Projetos
  projetos: {
    base: `${API_BASE_URL}/api/v1/projetos`,
    byId: (id) => `${API_BASE_URL}/api/v1/projetos/${id}`,
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
  return localStorage.getItem('saas_auth_token');
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