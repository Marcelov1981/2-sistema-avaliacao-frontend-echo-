import React, { createContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projectData, setProjectData] = useState({
    cliente: null,
    projeto: null,
    orcamento: null,
    avaliacao: null,
    laudo: null
  });

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedProjectData = localStorage.getItem('currentProjectData');
    if (savedProjectData) {
      try {
        const parsedData = JSON.parse(savedProjectData);
        setProjectData(parsedData);
        setCurrentProject(parsedData.projeto);
      } catch (error) {
        console.error('Erro ao carregar dados do projeto:', error);
        localStorage.removeItem('currentProjectData');
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    if (currentProject || Object.values(projectData).some(data => data !== null)) {
      localStorage.setItem('currentProjectData', JSON.stringify(projectData));
    }
  }, [projectData, currentProject]);

  const updateProjectData = (type, data) => {
    setProjectData(prev => ({
      ...prev,
      [type]: data
    }));

    // Se estamos atualizando o projeto, também atualizamos o currentProject
    if (type === 'projeto') {
      setCurrentProject(data);
    }
  };

  const setProject = (projeto) => {
    setCurrentProject(projeto);
    setProjectData(prev => ({
      ...prev,
      projeto: projeto
    }));
  };

  const clearProjectData = () => {
    setCurrentProject(null);
    setProjectData({
      cliente: null,
      projeto: null,
      orcamento: null,
      avaliacao: null,
      laudo: null
    });
    localStorage.removeItem('currentProjectData');
  };

  const getProjectDataForForm = (formType) => {
    const baseData = {};

    // Se temos um projeto atual, preencher dados relacionados
    if (currentProject) {
      switch (formType) {
        case 'cliente':
          if (projectData.cliente) {
            return {
              nome: projectData.cliente.nome || '',
              email: projectData.cliente.email || '',
              telefone: projectData.cliente.telefone || '',
              documento: projectData.cliente.documento || '',
              tipo_pessoa: projectData.cliente.tipo_pessoa || 'fisica',
              endereco: projectData.cliente.endereco || '',
              cidade: projectData.cliente.cidade || '',
              estado: projectData.cliente.estado || '',
              cep: projectData.cliente.cep || '',
              registroProfissional: projectData.cliente.registroProfissional || '',
              tipoRegistro: projectData.cliente.tipoRegistro || '',
              observacoes: projectData.cliente.observacoes || '',
              status: projectData.cliente.status || 'ativo'
            };
          }
          break;

        case 'projeto':
          return {
            nome: currentProject.nome || '',
            cliente_id: currentProject.cliente_id || '',
            tipo_imovel: currentProject.tipo_imovel || 'residencial',
            endereco_imovel: currentProject.endereco_imovel || '',
            cidade_imovel: currentProject.cidade_imovel || '',
            estado_imovel: currentProject.estado_imovel || '',
            cep_imovel: currentProject.cep_imovel || '',
            area_terreno: currentProject.area_terreno || '',
            area_construida: currentProject.area_construida || '',
            finalidade_avaliacao: currentProject.finalidade_avaliacao || 'compra_venda',
            prazo_entrega: currentProject.prazo_entrega || '',
            observacoes: currentProject.observacoes || ''
          };

        case 'orcamento':
          if (projectData.orcamento) {
            return {
              projetoId: currentProject.id || '',
              descricao: projectData.orcamento.descricao || '',
              tipoAvaliacao: projectData.orcamento.tipoAvaliacao || '',
              valorEstimado: projectData.orcamento.valorEstimado || '',
              prazoEntrega: projectData.orcamento.prazoEntrega || '',
              metodologia: projectData.orcamento.metodologia || '',
              observacoes: projectData.orcamento.observacoes || ''
            };
          } else {
            return {
              projetoId: currentProject.id || '',
              descricao: '',
              tipoAvaliacao: '',
              valorEstimado: '',
              prazoEntrega: '',
              metodologia: '',
              observacoes: ''
            };
          }

        case 'avaliacao':
          if (projectData.avaliacao) {
            return {
              orcamentoId: projectData.orcamento?.id || '',
              dataAvaliacao: projectData.avaliacao.dataAvaliacao || '',
              metodologia: projectData.avaliacao.metodologia || '',
              valorAvaliado: projectData.avaliacao.valorAvaliado || '',
              observacoes: projectData.avaliacao.observacoes || '',
              status: projectData.avaliacao.status || 'em_andamento'
            };
          } else {
            return {
              orcamentoId: projectData.orcamento?.id || '',
              dataAvaliacao: '',
              metodologia: '',
              valorAvaliado: '',
              observacoes: '',
              status: 'em_andamento'
            };
          }

        case 'laudo':
          if (projectData.laudo) {
            return {
              avaliacaoId: projectData.avaliacao?.id || '',
              numeroLaudo: projectData.laudo.numeroLaudo || '',
              dataEmissao: projectData.laudo.dataEmissao || '',
              finalidade: projectData.laudo.finalidade || '',
              tipoLaudo: projectData.laudo.tipoLaudo || '',
              valorFinal: projectData.laudo.valorFinal || '',
              observacoes: projectData.laudo.observacoes || '',
              status: projectData.laudo.status || 'rascunho'
            };
          } else {
            return {
              avaliacaoId: projectData.avaliacao?.id || '',
              numeroLaudo: '',
              dataEmissao: '',
              finalidade: '',
              tipoLaudo: '',
              valorFinal: '',
              observacoes: '',
              status: 'rascunho'
            };
          }

        default:
          return baseData;
      }
    }

    return baseData;
  };

  const value = {
    currentProject,
    projectData,
    setProject,
    updateProjectData,
    clearProjectData,
    getProjectDataForForm,
    hasActiveProject: !!currentProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;