import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LaudoPDF from './LaudoPDF';
import { API_ENDPOINTS } from '../config/api';

const Avaliacao = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);
  const [showAvaliacaoForm, setShowAvaliacaoForm] = useState(false);
  const [avaliacaoData, setAvaliacaoData] = useState({
    orcamentoId: '',
    consideracoes: '',
    valorFinal: '',
    metodologiaUtilizada: '',
    observacoesTecnicas: '',
    status: 'em_analise'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orcamentosResponse, avaliacoesResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.orcamentos.base),
        axios.get(API_ENDPOINTS.avaliacoes.base)
      ]);
      setOrcamentos(orcamentosResponse.data || []);
      setAvaliacoes(avaliacoesResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAvaliacaoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API_ENDPOINTS.avaliacoes.base,
        {
          ...avaliacaoData,
          valorFinal: parseFloat(avaliacaoData.valorFinal) || 0
        }
      );

      if (response.status === 201 || response.status === 200) {
        setAvaliacaoData({
          orcamentoId: '',
          consideracoes: '',
          valorFinal: '',
          metodologiaUtilizada: '',
          observacoesTecnicas: '',
          status: 'em_analise'
        });
        setShowAvaliacaoForm(false);
        setSelectedOrcamento(null);
        fetchData();
      }
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      setError('Erro ao criar avaliação');
    }
  };

  const iniciarAvaliacao = (orcamento) => {
    setSelectedOrcamento(orcamento);
    setAvaliacaoData(prev => ({
      ...prev,
      orcamentoId: orcamento.id,
      valorFinal: orcamento.valorEstimado || ''
    }));
    setShowAvaliacaoForm(true);
  };

  const [showLaudoPDF, setShowLaudoPDF] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);

  const gerarLaudo = async (avaliacao) => {
    try {
      setSelectedAvaliacao(avaliacao);
      setShowLaudoPDF(true);
    } catch (error) {
      console.error('Erro ao gerar laudo:', error);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1f2937'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #e5e7eb',
      fontWeight: '600',
      color: '#374151'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #e5e7eb'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    successButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none'
    },
    textarea: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      outline: 'none'
    },
    select: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end'
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db'
    },
    status: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    },
    statusPendente: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    statusAnalise: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    statusConcluida: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Módulo de Avaliação</h1>
      </div>

      {error && (
        <div style={{...styles.card, backgroundColor: '#fef2f2', color: '#dc2626'}}>
          {error}
        </div>
      )}

      {/* Orçamentos Pendentes de Avaliação */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Orçamentos Pendentes de Avaliação</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Projeto</th>
              <th style={styles.tableHeader}>Cliente</th>
              <th style={styles.tableHeader}>Tipo</th>
              <th style={styles.tableHeader}>Valor Estimado</th>
              <th style={styles.tableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.filter(orc => !avaliacoes.find(av => av.orcamentoId === orc.id)).map(orcamento => (
              <tr key={orcamento.id}>
                <td style={styles.tableCell}>{orcamento.projeto?.nome || 'N/A'}</td>
                <td style={styles.tableCell}>{orcamento.projeto?.cliente?.nome || 'N/A'}</td>
                <td style={styles.tableCell}>{orcamento.tipoAvaliacao}</td>
                <td style={styles.tableCell}>R$ {orcamento.valorEstimado?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td style={styles.tableCell}>
                  <button
                    style={{...styles.button, ...styles.primaryButton}}
                    onClick={() => iniciarAvaliacao(orcamento)}
                  >
                    Iniciar Avaliação
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Avaliações em Andamento/Concluídas */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Avaliações</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Projeto</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Valor Final</th>
              <th style={styles.tableHeader}>Data</th>
              <th style={styles.tableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map(avaliacao => (
              <tr key={avaliacao.id}>
                <td style={styles.tableCell}>{avaliacao.orcamento?.projeto?.nome || 'N/A'}</td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.status,
                    ...(avaliacao.status === 'concluida' ? styles.statusConcluida :
                        avaliacao.status === 'em_analise' ? styles.statusAnalise : styles.statusPendente)
                  }}>
                    {avaliacao.status === 'concluida' ? 'Concluída' :
                     avaliacao.status === 'em_analise' ? 'Em Análise' : 'Pendente'}
                  </span>
                </td>
                <td style={styles.tableCell}>R$ {avaliacao.valorFinal?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td style={styles.tableCell}>{new Date(avaliacao.createdAt).toLocaleDateString('pt-BR')}</td>
                <td style={styles.tableCell}>
                  {avaliacao.status === 'concluida' && (
                    <button
                      style={{...styles.button, ...styles.successButton}}
                      onClick={() => gerarLaudo(avaliacao)}
                    >
                      Gerar Laudo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulário de Avaliação */}
      {showAvaliacaoForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Avaliação Técnica</h3>
            
            <form onSubmit={handleSubmitAvaliacao} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Projeto</label>
                <input
                  type="text"
                  value={selectedOrcamento?.projeto?.nome || ''}
                  style={styles.input}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Considerações Técnicas *</label>
                <textarea
                  name="consideracoes"
                  value={avaliacaoData.consideracoes}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Descreva suas considerações técnicas sobre a avaliação..."
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Metodologia Utilizada *</label>
                <select
                  name="metodologiaUtilizada"
                  value={avaliacaoData.metodologiaUtilizada}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Selecione a metodologia</option>
                  <option value="Método Comparativo Direto">Método Comparativo Direto</option>
                  <option value="Método da Renda">Método da Renda</option>
                  <option value="Método do Custo">Método do Custo</option>
                  <option value="Método Evolutivo">Método Evolutivo</option>
                  <option value="Método Involutivo">Método Involutivo</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Valor Final da Avaliação (R$) *</label>
                <input
                  type="number"
                  name="valorFinal"
                  value={avaliacaoData.valorFinal}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Observações Técnicas</label>
                <textarea
                  name="observacoesTecnicas"
                  value={avaliacaoData.observacoesTecnicas}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Observações adicionais, limitações, premissas..."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status *</label>
                <select
                  name="status"
                  value={avaliacaoData.status}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="em_analise">Em Análise</option>
                  <option value="concluida">Concluída</option>
                </select>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAvaliacaoForm(false);
                    setSelectedOrcamento(null);
                  }}
                  style={{...styles.button, ...styles.cancelButton}}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{...styles.button, ...styles.primaryButton}}
                >
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Geração de Laudo */}
      {showLaudoPDF && selectedAvaliacao && (
        <LaudoPDF
          avaliacao={selectedAvaliacao}
          onClose={() => {
            setShowLaudoPDF(false);
            setSelectedAvaliacao(null);
          }}
        />
      )}
    </div>
  );
};

export default Avaliacao;