/**
 * Sistema de Permissões Granulares para Proteção de Dados
 * Implementa controles de acesso baseados em LGPD
 */

class PermissionsManager {
  constructor() {
    this.permissions = this.loadPermissions();
    this.dataTypes = {
      PERSONAL_DATA: 'dados_pessoais',
      FINANCIAL_DATA: 'dados_financeiros',
      CONTACT_DATA: 'dados_contato',
      USAGE_DATA: 'dados_uso',
      MARKETING_DATA: 'dados_marketing',
      TECHNICAL_DATA: 'dados_tecnicos'
    };
    
    this.actions = {
      READ: 'READ',
      write: 'WRITE',
      update: 'UPDATE',
      delete: 'DELETE',
      export: 'EXPORT',
      share: 'SHARE'
    };
  }

  /**
   * Carrega permissões do localStorage
   */
  loadPermissions() {
    try {
      const saved = localStorage.getItem('user_permissions');
      return saved ? JSON.parse(saved) : this.getDefaultPermissions();
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      return this.getDefaultPermissions();
    }
  }

  /**
   * Salva permissões no localStorage
   */
  savePermissions() {
    try {
      localStorage.setItem('user_permissions', JSON.stringify(this.permissions));
      this.logPermissionChange('PERMISSIONS_SAVED', 'Permissões salvas pelo usuário');
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
    }
  }

  /**
   * Retorna permissões padrão (mais restritivas)
   */
  getDefaultPermissions() {
    return {
      [this.dataTypes.PERSONAL_DATA]: {
        [this.actions.read]: true,
        [this.actions.write]: true,
        [this.actions.update]: true,
        [this.actions.delete]: false,
        [this.actions.export]: false,
        [this.actions.share]: false
      },
      [this.dataTypes.FINANCIAL_DATA]: {
        [this.actions.read]: true,
        [this.actions.write]: true,
        [this.actions.update]: true,
        [this.actions.delete]: false,
        [this.actions.export]: false,
        [this.actions.share]: false
      },
      [this.dataTypes.CONTACT_DATA]: {
        [this.actions.read]: true,
        [this.actions.write]: true,
        [this.actions.update]: true,
        [this.actions.delete]: false,
        [this.actions.export]: false,
        [this.actions.share]: false
      },
      [this.dataTypes.USAGE_DATA]: {
        [this.actions.read]: false,
        [this.actions.write]: false,
        [this.actions.update]: false,
        [this.actions.delete]: false,
        [this.actions.export]: false,
        [this.actions.share]: false
      },
      [this.dataTypes.MARKETING_DATA]: {
        [this.actions.read]: false,
        [this.actions.write]: false,
        [this.actions.update]: false,
        [this.actions.delete]: false,
        [this.actions.export]: false,
        [this.actions.share]: false
      },
      [this.dataTypes.TECHNICAL_DATA]: {
        [this.actions.read]: true,
        [this.actions.write]: true,
        [this.actions.update]: true,
        [this.actions.delete]: false,
        [this.actions.export]: false,
        [this.actions.share]: false
      }
    };
  }

  /**
   * Verifica se uma ação é permitida para um tipo de dado
   */
  hasPermission(dataType, action) {
    try {
      const permission = this.permissions[dataType]?.[action] || false;
      
      // Log da verificação de permissão
      this.logPermissionCheck(dataType, action, permission);
      
      return permission;
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  }

  /**
   * Define uma permissão específica
   */
  setPermission(dataType, action, allowed) {
    try {
      if (!this.permissions[dataType]) {
        this.permissions[dataType] = {};
      }
      
      const oldValue = this.permissions[dataType][action];
      this.permissions[dataType][action] = allowed;
      
      this.savePermissions();
      
      // Log da mudança
      this.logPermissionChange(
        'PERMISSION_CHANGED',
        `${dataType}.${action}: ${oldValue} → ${allowed}`
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao definir permissão:', error);
      return false;
    }
  }

  /**
   * Atualiza múltiplas permissões de uma vez
   */
  updatePermissions(newPermissions) {
    try {
      this.permissions = { ...this.permissions, ...newPermissions };
      
      this.savePermissions();
      
      // Log da atualização em lote
      this.logPermissionChange(
        'BULK_PERMISSION_UPDATE',
        `Permissões atualizadas em lote`
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      return false;
    }
  }

  /**
   * Retorna todas as permissões atuais
   */
  getAllPermissions() {
    return { ...this.permissions };
  }

  /**
   * Reseta permissões para o padrão
   */
  resetToDefault() {
    try {
      this.permissions = this.getDefaultPermissions();
      this.savePermissions();
      
      this.logPermissionChange(
        'PERMISSIONS_RESET',
        'Permissões resetadas para o padrão'
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao resetar permissões:', error);
      return false;
    }
  }

  /**
   * Verifica se dados podem ser processados baseado nas permissões
   */
  canProcessData(dataType, requiredActions = []) {
    try {
      if (!Array.isArray(requiredActions)) {
        requiredActions = [requiredActions];
      }
      
      for (const action of requiredActions) {
        if (!this.hasPermission(dataType, action)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar processamento de dados:', error);
      return false;
    }
  }

  /**
   * Filtra dados baseado nas permissões
   */
  filterDataByPermissions(data, dataTypeMapping) {
    try {
      const filteredData = {};
      
      for (const [key, value] of Object.entries(data)) {
        const dataType = dataTypeMapping[key];
        
        if (dataType && this.hasPermission(dataType, this.actions.read)) {
          filteredData[key] = value;
        }
      }
      
      return filteredData;
    } catch (error) {
      console.error('Erro ao filtrar dados:', error);
      return {};
    }
  }

  /**
   * Valida se uma operação pode ser executada
   */
  validateOperation(operation) {
    try {
      const { dataType, action } = operation;
      
      // Verificar permissão básica
      if (!this.hasPermission(dataType, action)) {
        return {
          allowed: false,
          reason: `Permissão negada para ${action} em ${dataType}`
        };
      }
      
      // Verificações adicionais baseadas no tipo de operação
      if (action === this.actions.delete && dataType === this.dataTypes.PERSONAL_DATA) {
        return {
          allowed: false,
          reason: 'Exclusão de dados pessoais requer processo especial'
        };
      }
      
      if (action === this.actions.share && !this.hasUserConsent('data_sharing')) {
        return {
          allowed: false,
          reason: 'Compartilhamento requer consentimento específico'
        };
      }
      
      return { allowed: true };
    } catch (error) {
      console.error('Erro ao validar operação:', error);
      return {
        allowed: false,
        reason: 'Erro interno na validação'
      };
    }
  }

  /**
   * Verifica consentimento do usuário
   */
  hasUserConsent(consentType) {
    try {
      const consents = JSON.parse(localStorage.getItem('lgpd_consentimentos') || '{}');
      return consents[consentType] || false;
    } catch (error) {
      console.error('Erro ao verificar consentimento:', error);
      return false;
    }
  }

  /**
   * Registra verificação de permissão
   */
  logPermissionCheck(dataType, action, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'PERMISSION_CHECK',
      dataType,
      action,
      result,
      userAgent: navigator.userAgent
    };
    
    this.saveLog(logEntry);
  }

  /**
   * Registra mudança de permissão
   */
  logPermissionChange(action, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'PERMISSION_CHANGE',
      action,
      details,
      userAgent: navigator.userAgent
    };
    
    this.saveLog(logEntry);
  }

  /**
   * Salva log de auditoria
   */
  saveLog(logEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('permission_logs') || '[]');
      logs.push(logEntry);
      
      // Manter apenas os últimos 1000 logs
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      localStorage.setItem('permission_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Erro ao salvar log:', error);
    }
  }

  /**
   * Retorna logs de auditoria
   */
  getAuditLogs(limit = 100) {
    try {
      const logs = JSON.parse(localStorage.getItem('permission_logs') || '[]');
      return logs.slice(-limit).reverse();
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      return [];
    }
  }

  /**
   * Limpa logs antigos
   */
  clearOldLogs(daysToKeep = 30) {
    try {
      const logs = JSON.parse(localStorage.getItem('permission_logs') || '[]');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const filteredLogs = logs.filter(log => {
        return new Date(log.timestamp) > cutoffDate;
      });
      
      localStorage.setItem('permission_logs', JSON.stringify(filteredLogs));
      
      this.logPermissionChange(
        'LOGS_CLEANED',
        `Logs anteriores a ${cutoffDate.toISOString()} foram removidos`
      );
      
      return logs.length - filteredLogs.length;
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
      return 0;
    }
  }

  /**
   * Exporta configurações de permissões
   */
  exportPermissions() {
    try {
      const exportData = {
        permissions: this.permissions,
        dataTypes: this.dataTypes,
        actions: this.actions,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      this.logPermissionChange(
        'PERMISSIONS_EXPORTED',
        'Configurações de permissões exportadas'
      );
      
      return exportData;
    } catch (error) {
      console.error('Erro ao exportar permissões:', error);
      return null;
    }
  }

  /**
   * Importa configurações de permissões
   */
  importPermissions(importData) {
    try {
      if (!importData.permissions || !importData.version) {
        throw new Error('Formato de importação inválido');
      }
      
      this.permissions = importData.permissions;
      this.savePermissions();
      
      this.logPermissionChange(
        'PERMISSIONS_IMPORTED',
        `Permissões importadas da versão ${importData.version}`
      );
      
      return true;
    } catch (error) {
      console.error('Erro ao importar permissões:', error);
      return false;
    }
  }
}

// Instância singleton
const permissionsManager = new PermissionsManager();

export default permissionsManager;
export { PermissionsManager };