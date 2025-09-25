import api from '../config/api';

/**
 * Serviço para gerenciar relacionamentos entre entidades do sistema
 */
class RelationshipService {
  /**
   * Busca projeto com seus orçamentos e avaliações relacionados
   */
  async getProjectWithRelations(projectId) {
    try {
      const [projectResponse, orcamentosResponse, avaliacoesResponse] = await Promise.all([
        api.get(`/projetos/${projectId}`),
        api.get('/orcamentos'),
        api.get('/avaliacoes')
      ]);

      const project = projectResponse.data.data;
      const allOrcamentos = orcamentosResponse.data.data || [];
      const allAvaliacoes = avaliacoesResponse.data.data || [];

      // Filtrar orçamentos do projeto
      const projectOrcamentos = allOrcamentos.filter(o => o.projeto_id === projectId);
      
      // Filtrar avaliações do projeto
      const projectAvaliacoes = allAvaliacoes.filter(a => a.projeto_id === projectId);

      return {
        ...project,
        orcamentos: projectOrcamentos,
        avaliacoes: projectAvaliacoes
      };
    } catch (error) {
      console.error('Erro ao buscar projeto com relacionamentos:', error);
      throw error;
    }
  }

  /**
   * Busca orçamento com projeto e avaliações relacionados
   */
  async getOrcamentoWithRelations(orcamentoId) {
    try {
      const [orcamentoResponse, projetosResponse, avaliacoesResponse] = await Promise.all([
        api.get(`/orcamentos/${orcamentoId}`),
        api.get('/projetos'),
        api.get('/avaliacoes')
      ]);

      const orcamento = orcamentoResponse.data.data;
      const allProjetos = projetosResponse.data.data || [];
      const allAvaliacoes = avaliacoesResponse.data.data || [];

      // Buscar projeto relacionado
      const relatedProject = allProjetos.find(p => p.id === orcamento.projeto_id);
      
      // Filtrar avaliações do orçamento
      const orcamentoAvaliacoes = allAvaliacoes.filter(a => a.orcamento_id === orcamentoId);

      return {
        ...orcamento,
        projeto: relatedProject,
        avaliacoes: orcamentoAvaliacoes
      };
    } catch (error) {
      console.error('Erro ao buscar orçamento com relacionamentos:', error);
      throw error;
    }
  }

  /**
   * Busca avaliação com projeto e orçamento relacionados
   */
  async getAvaliacaoWithRelations(avaliacaoId) {
    try {
      const [avaliacaoResponse, projetosResponse, orcamentosResponse] = await Promise.all([
        api.get(`/avaliacoes/${avaliacaoId}`),
        api.get('/projetos'),
        api.get('/orcamentos')
      ]);

      const avaliacao = avaliacaoResponse.data.data;
      const allProjetos = projetosResponse.data.data || [];
      const allOrcamentos = orcamentosResponse.data.data || [];

      // Buscar projeto e orçamento relacionados
      const relatedProject = allProjetos.find(p => p.id === avaliacao.projeto_id);
      const relatedOrcamento = allOrcamentos.find(o => o.id === avaliacao.orcamento_id);

      return {
        ...avaliacao,
        projeto: relatedProject,
        orcamento: relatedOrcamento
      };
    } catch (error) {
      console.error('Erro ao buscar avaliação com relacionamentos:', error);
      throw error;
    }
  }

  /**
   * Busca todos os dados relacionados de um usuário
   */
  async getUserCompleteData() {
    try {
      const [projetosResponse, clientesResponse, orcamentosResponse, avaliacoesResponse] = await Promise.all([
        api.get('/projetos'),
        api.get('/clientes'),
        api.get('/orcamentos'),
        api.get('/avaliacoes')
      ]);

      const projetos = projetosResponse.data.data || [];
      const clientes = clientesResponse.data.data || [];
      const orcamentos = orcamentosResponse.data.data || [];
      const avaliacoes = avaliacoesResponse.data.data || [];

      // Criar mapa de relacionamentos
      const projectsWithRelations = projetos.map(projeto => {
        const projectOrcamentos = orcamentos.filter(o => o.projeto_id === projeto.id);
        const projectAvaliacoes = avaliacoes.filter(a => a.projeto_id === projeto.id);
        const relatedClient = clientes.find(c => c.id === projeto.cliente_id);

        return {
          ...projeto,
          cliente: relatedClient,
          orcamentos: projectOrcamentos,
          avaliacoes: projectAvaliacoes
        };
      });

      return {
        projetos: projectsWithRelations,
        clientes,
        orcamentos,
        avaliacoes
      };
    } catch (error) {
      console.error('Erro ao buscar dados completos do usuário:', error);
      throw error;
    }
  }

  /**
   * Cria um novo orçamento associado a um projeto
   */
  async createOrcamentoForProject(projectId, orcamentoData) {
    try {
      const response = await api.post('/orcamentos', {
        ...orcamentoData,
        projeto_id: projectId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar orçamento para projeto:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova avaliação associada a um projeto e orçamento
   */
  async createAvaliacaoForOrcamento(projectId, orcamentoId, avaliacaoData) {
    try {
      const response = await api.post('/avaliacoes', {
        ...avaliacaoData,
        projeto_id: projectId,
        orcamento_id: orcamentoId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar avaliação para orçamento:', error);
      throw error;
    }
  }

  /**
    * Cria uma nova avaliação com todos os relacionamentos
    */
   async createEvaluationWithRelations(evaluationData) {
     try {
       // Criar avaliação com todos os relacionamentos
       const response = await api.post('/avaliacoes', evaluationData);
       
       if (response.data.success) {
         // Buscar dados relacionados para retornar avaliação completa
         const completeEvaluation = await this.getAvaliacaoWithRelations(response.data.data.id);
         return {
           ...response,
           data: {
             ...response.data,
             data: completeEvaluation
           }
         };
       }
       
       return response;
     } catch (error) {
       console.error('Erro ao criar avaliação com relacionamentos:', error);
       throw error;
     }
   }

   /**
    * Cria um novo cliente com relacionamentos
    */
   async createClientWithRelations(clientData) {
     try {
       const response = await api.post('/clientes', clientData);
       return response;
     } catch (error) {
       console.error('Erro ao criar cliente:', error);
       throw error;
     }
   }

   /**
    * Cria um novo projeto com relacionamentos
    */
   async createProjectWithRelations(projectData) {
     try {
       const response = await api.post('/projetos', projectData);
       return response;
     } catch (error) {
       console.error('Erro ao criar projeto:', error);
       throw error;
     }
   }

  /**
   * Busca estatísticas de relacionamentos
   */
  async getRelationshipStats() {
    try {
      const data = await this.getUserCompleteData();
      
      const stats = {
        totalProjetos: data.projetos.length,
        totalClientes: data.clientes.length,
        totalOrcamentos: data.orcamentos.length,
        totalAvaliacoes: data.avaliacoes.length,
        projetosComOrcamentos: data.projetos.filter(p => p.orcamentos.length > 0).length,
        projetosComAvaliacoes: data.projetos.filter(p => p.avaliacoes.length > 0).length,
        orcamentosSemAvaliacoes: data.orcamentos.filter(o => 
          !data.avaliacoes.some(a => a.orcamento_id === o.id)
        ).length
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de relacionamentos:', error);
      throw error;
    }
  }
}

export default new RelationshipService();