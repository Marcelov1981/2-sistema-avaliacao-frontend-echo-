import axios from 'axios';

class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api/v1';
    this.tokenKey = 'saas_auth_token';
    this.userKey = 'saas_user_data';
    
    // Configurar interceptor para adicionar token automaticamente
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Interceptor para requisições - adicionar token
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para respostas - tratar erros de autenticação
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Token inválido ou expirado
          this.logout();
          window.location.reload(); // Recarregar para mostrar tela de login
        }
        return Promise.reject(error);
      }
    );
  }

  // Fazer login
  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/usuarios/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        // Salvar token e dados do usuário
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        
        return { success: true, user };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  }

  // Fazer logout
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Verificar se está autenticado
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Obter token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Obter dados do usuário
  getUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Registrar novo usuário
  async register(userData) {
    try {
      const response = await axios.post(`${this.baseURL}/usuarios/register`, userData);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao registrar usuário' 
      };
    }
  }

  // Atualizar perfil do usuário
  async updateProfile(userData) {
    try {
      const response = await axios.put(`${this.baseURL}/usuarios/perfil`, userData);
      
      if (response.data.success) {
        // Atualizar dados locais
        const updatedUser = { ...this.getUser(), ...response.data.user };
        localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
        
        return { success: true, user: updatedUser };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao atualizar perfil' 
      };
    }
  }

  // Alterar senha
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axios.put(`${this.baseURL}/usuarios/senha`, {
        currentPassword,
        newPassword
      });
      
      return { 
        success: response.data.success, 
        message: response.data.message 
      };
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao alterar senha' 
      };
    }
  }

  // Obter logs de auditoria do usuário (para LGPD)
  async getUserAuditLogs(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axios.get(`${this.baseURL}/usuarios/audit-logs`, { params });
      
      return { 
        success: response.data.success, 
        data: response.data.data 
      };
    } catch (error) {
      console.error('Erro ao obter logs de auditoria:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao obter logs' 
      };
    }
  }

  // Solicitar exclusão de dados (LGPD)
  async requestDataDeletion(reason = '') {
    try {
      const response = await axios.post(`${this.baseURL}/usuarios/delete-request`, {
        reason
      });
      
      return { 
        success: response.data.success, 
        message: response.data.message 
      };
    } catch (error) {
      console.error('Erro ao solicitar exclusão:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao solicitar exclusão' 
      };
    }
  }

  // Exportar dados do usuário (LGPD)
  async exportUserData() {
    try {
      const response = await axios.get(`${this.baseURL}/usuarios/export-data`);
      
      return { 
        success: response.data.success, 
        data: response.data.data 
      };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao exportar dados' 
      };
    }
  }
}

// Exportar instância única
const authService = new AuthService();
export default authService;

// Exportar também a classe
export { AuthService };