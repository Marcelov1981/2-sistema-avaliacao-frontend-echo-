import relationshipService from './relationshipService';

/**
 * Serviço de validação para garantir consistência de dados entre entidades
 */
const validationService = {
  /**
   * Valida se um cliente existe e pertence ao usuário atual
   */
  async validateClientExists(clienteId) {
    try {
      const data = await relationshipService.getUserCompleteData();
      const cliente = data.clientes.find(c => c.id === clienteId);
      
      if (!cliente) {
        throw new Error('Cliente não encontrado ou não pertence ao usuário atual');
      }
      
      return cliente;
    } catch (error) {
      console.error('Erro ao validar cliente:', error);
      throw error;
    }
  },

  /**
   * Valida se um projeto existe e pertence ao cliente especificado
   */
  async validateProjectBelongsToClient(projetoId, clienteId) {
    try {
      const data = await relationshipService.getUserCompleteData();
      const projeto = data.projetos.find(p => p.id === projetoId);
      
      if (!projeto) {
        throw new Error('Projeto não encontrado');
      }
      
      if (projeto.cliente_id !== clienteId) {
        throw new Error('Projeto não pertence ao cliente especificado');
      }
      
      return projeto;
    } catch (error) {
      console.error('Erro ao validar projeto:', error);
      throw error;
    }
  },

  /**
   * Valida se um orçamento existe e pertence ao projeto especificado
   */
  async validateBudgetBelongsToProject(orcamentoId, projetoId) {
    try {
      const data = await relationshipService.getUserCompleteData();
      const orcamento = data.orcamentos.find(o => o.id === orcamentoId);
      
      if (!orcamento) {
        throw new Error('Orçamento não encontrado');
      }
      
      if (orcamento.projeto_id !== projetoId) {
        throw new Error('Orçamento não pertence ao projeto especificado');
      }
      
      return orcamento;
    } catch (error) {
      console.error('Erro ao validar orçamento:', error);
      throw error;
    }
  },

  /**
   * Valida se uma avaliação existe e pertence ao orçamento especificado
   */
  async validateEvaluationBelongsToBudget(avaliacaoId, orcamentoId) {
    try {
      const data = await relationshipService.getUserCompleteData();
      const avaliacao = data.avaliacoes.find(a => a.id === avaliacaoId);
      
      if (!avaliacao) {
        throw new Error('Avaliação não encontrada');
      }
      
      if (avaliacao.orcamento_id !== orcamentoId) {
        throw new Error('Avaliação não pertence ao orçamento especificado');
      }
      
      return avaliacao;
    } catch (error) {
      console.error('Erro ao validar avaliação:', error);
      throw error;
    }
  },

  /**
   * Valida toda a cadeia de relacionamentos: Cliente -> Projeto -> Orçamento -> Avaliação
   */
  async validateCompleteChain(clienteId, projetoId, orcamentoId, avaliacaoId = null) {
    try {
      // Validar cliente
      const cliente = await this.validateClientExists(clienteId);
      
      // Validar projeto pertence ao cliente
      const projeto = await this.validateProjectBelongsToClient(projetoId, clienteId);
      
      // Validar orçamento pertence ao projeto
      const orcamento = await this.validateBudgetBelongsToProject(orcamentoId, projetoId);
      
      let avaliacao = null;
      if (avaliacaoId) {
        // Validar avaliação pertence ao orçamento
        avaliacao = await this.validateEvaluationBelongsToBudget(avaliacaoId, orcamentoId);
      }
      
      return {
        cliente,
        projeto,
        orcamento,
        avaliacao,
        isValid: true
      };
    } catch (error) {
      console.error('Erro na validação da cadeia completa:', error);
      throw error;
    }
  },

  /**
   * Valida dados de entrada para criação de cliente
   */
  validateClientData(clientData) {
    const errors = [];
    
    if (!clientData.nome || clientData.nome.trim().length < 2) {
      errors.push('Nome do cliente deve ter pelo menos 2 caracteres');
    }
    
    if (clientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      errors.push('Email deve ter um formato válido');
    }
    
    if (clientData.telefone && !/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(clientData.telefone)) {
      errors.push('Telefone deve ter um formato válido');
    }
    
    if (errors.length > 0) {
      throw new Error(`Dados do cliente inválidos: ${errors.join(', ')}`);
    }
    
    return true;
  },

  /**
   * Valida dados de entrada para criação de projeto
   */
  validateProjectData(projectData) {
    const errors = [];
    
    if (!projectData.nome || projectData.nome.trim().length < 3) {
      errors.push('Nome do projeto deve ter pelo menos 3 caracteres');
    }
    
    if (!projectData.cliente_id) {
      errors.push('ID do cliente é obrigatório');
    }
    
    if (!projectData.endereco || projectData.endereco.trim().length < 10) {
      errors.push('Endereço do projeto deve ter pelo menos 10 caracteres');
    }
    
    if (errors.length > 0) {
      throw new Error(`Dados do projeto inválidos: ${errors.join(', ')}`);
    }
    
    return true;
  },

  /**
   * Valida dados de entrada para criação de orçamento
   */
  validateBudgetData(budgetData) {
    const errors = [];
    
    if (!budgetData.descricao || budgetData.descricao.trim().length < 5) {
      errors.push('Descrição do orçamento deve ter pelo menos 5 caracteres');
    }
    
    if (!budgetData.valor || budgetData.valor <= 0) {
      errors.push('Valor do orçamento deve ser maior que zero');
    }
    
    if (!budgetData.projeto_id) {
      errors.push('ID do projeto é obrigatório');
    }
    
    if (errors.length > 0) {
      throw new Error(`Dados do orçamento inválidos: ${errors.join(', ')}`);
    }
    
    return true;
  },

  /**
   * Valida dados de entrada para criação de avaliação
   */
  validateEvaluationData(evaluationData) {
    const errors = [];
    
    if (!evaluationData.metodologia_utilizada || evaluationData.metodologia_utilizada.trim().length < 3) {
      errors.push('Metodologia utilizada deve ter pelo menos 3 caracteres');
    }
    
    if (!evaluationData.valor_final || evaluationData.valor_final <= 0) {
      errors.push('Valor final da avaliação deve ser maior que zero');
    }
    
    if (!evaluationData.orcamento_id) {
      errors.push('ID do orçamento é obrigatório');
    }
    
    if (!evaluationData.data_avaliacao) {
      errors.push('Data da avaliação é obrigatória');
    }
    
    const metodologiasValidas = [
      'Análise de Imagens com IA',
      'Avaliação Presencial',
      'Análise Documental',
      'Comparativo de Mercado'
    ];
    
    if (!metodologiasValidas.includes(evaluationData.metodologia_utilizada)) {
      errors.push('Metodologia deve ser uma das opções válidas');
    }
    
    if (errors.length > 0) {
      throw new Error(`Dados da avaliação inválidos: ${errors.join(', ')}`);
    }
    
    return true;
  },

  /**
   * Verifica se há conflitos de dados antes de criar/atualizar entidades
   */
  async checkDataConsistency() {
    try {
      const data = await relationshipService.getUserCompleteData();
      const issues = [];
      
      // Verificar projetos órfãos (sem cliente válido)
      const orphanProjects = data.projetos.filter(projeto => 
        !data.clientes.find(cliente => cliente.id === projeto.cliente_id)
      );
      
      if (orphanProjects.length > 0) {
        issues.push(`${orphanProjects.length} projeto(s) sem cliente válido`);
      }
      
      // Verificar orçamentos órfãos (sem projeto válido)
      const orphanBudgets = data.orcamentos.filter(orcamento => 
        !data.projetos.find(projeto => projeto.id === orcamento.projeto_id)
      );
      
      if (orphanBudgets.length > 0) {
        issues.push(`${orphanBudgets.length} orçamento(s) sem projeto válido`);
      }
      
      // Verificar avaliações órfãs (sem orçamento válido)
      const orphanEvaluations = data.avaliacoes.filter(avaliacao => 
        !data.orcamentos.find(orcamento => orcamento.id === avaliacao.orcamento_id)
      );
      
      if (orphanEvaluations.length > 0) {
        issues.push(`${orphanEvaluations.length} avaliação(ões) sem orçamento válido`);
      }
      
      return {
        isConsistent: issues.length === 0,
        issues,
        data: {
          totalClientes: data.clientes.length,
          totalProjetos: data.projetos.length,
          totalOrcamentos: data.orcamentos.length,
          totalAvaliacoes: data.avaliacoes.length,
          orphanProjects: orphanProjects.length,
          orphanBudgets: orphanBudgets.length,
          orphanEvaluations: orphanEvaluations.length
        }
      };
    } catch (error) {
      console.error('Erro ao verificar consistência dos dados:', error);
      throw error;
    }
  },

  /**
   * Gera relatório de integridade dos dados
   */
  async generateIntegrityReport() {
    try {
      const consistencyCheck = await this.checkDataConsistency();
      const stats = await relationshipService.getRelationshipStats();
      
      return {
        timestamp: new Date().toISOString(),
        consistency: consistencyCheck,
        statistics: stats,
        recommendations: this.generateRecommendations(consistencyCheck)
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de integridade:', error);
      throw error;
    }
  },

  /**
   * Gera recomendações baseadas nos problemas encontrados
   */
  generateRecommendations(consistencyCheck) {
    const recommendations = [];
    
    if (!consistencyCheck.isConsistent) {
      if (consistencyCheck.data.orphanProjects > 0) {
        recommendations.push('Revisar projetos sem cliente válido e associá-los ou removê-los');
      }
      
      if (consistencyCheck.data.orphanBudgets > 0) {
        recommendations.push('Revisar orçamentos sem projeto válido e associá-los ou removê-los');
      }
      
      if (consistencyCheck.data.orphanEvaluations > 0) {
        recommendations.push('Revisar avaliações sem orçamento válido e associá-las ou removê-las');
      }
    } else {
      recommendations.push('Todos os dados estão consistentes e bem relacionados');
    }
    
    return recommendations;
  }
};

export default validationService;