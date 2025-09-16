import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { API_ENDPOINTS } from '../config/api';

const NovaAvaliacao = ({ isOpen, onClose, onAvaliacaoCreated }) => {
  const [formData, setFormData] = useState({
    orcamentoId: '',
    dataAvaliacao: '',
    valorAvaliado: '',
    metodologiaUtilizada: '',
    observacoesTecnicas: '',
    conclusoes: '',
    status: 'em_andamento'
  });

  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingOrcamentos, setLoadingOrcamentos] = useState(false);

  const metodologias = [
    'Método Comparativo Direto',
    'Método da Renda',
    'Método do Custo',
    'Método Evolutivo',
    'Método Involutivo',
    'Método Misto'
  ];

  const statusOptions = [
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'concluida', label: 'Concluída' },
    { value: 'revisao', label: 'Em Revisão' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchOrcamentos();
    }
  }, [isOpen]);

  const fetchOrcamentos = async () => {
    setLoadingOrcamentos(true);
    try {
      const response = await axios.get(API_ENDPOINTS.orcamentos.base);
      setOrcamentos(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      setError('Erro ao carregar lista de orçamentos');
    } finally {
      setLoadingOrcamentos(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        API_ENDPOINTS.avaliacoes.base,
        {
          ...formData,
          valorAvaliado: parseFloat(formData.valorAvaliado) || 0
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Reset form
        setFormData({
          orcamentoId: '',
          dataAvaliacao: '',
          valorAvaliado: '',
          metodologiaUtilizada: '',
          observacoesTecnicas: '',
          conclusoes: '',
          status: 'em_andamento'
        });
        
        onAvaliacaoCreated && onAvaliacaoCreated();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      setError(error.response?.data?.message || 'Erro ao criar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
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
      transition: 'border-color 0.2s',
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
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none'
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db'
    },
    submitButton: {
      backgroundColor: '#8b5cf6',
      color: 'white'
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '8px'
    },
    loading: {
      color: '#6b7280',
      fontSize: '14px',
      fontStyle: 'italic'
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Avaliação">
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Orçamento *</label>
          {loadingOrcamentos ? (
            <div style={styles.loading}>Carregando orçamentos...</div>
          ) : (
            <select
              name="orcamentoId"
              value={formData.orcamentoId}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecione um orçamento</option>
              {orcamentos.map(orcamento => (
                <option key={orcamento.id} value={orcamento.id}>
                  {orcamento.descricao} - {orcamento.projeto?.nome || 'Projeto não informado'}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Data da Avaliação *</label>
            <input
              type="date"
              name="dataAvaliacao"
              value={formData.dataAvaliacao}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Valor Avaliado (R$) *</label>
            <input
              type="number"
              name="valorAvaliado"
              value={formData.valorAvaliado}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="0,00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Metodologia Utilizada *</label>
            <select
              name="metodologiaUtilizada"
              value={formData.metodologiaUtilizada}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecione a metodologia</option>
              {metodologias.map((metodologia, index) => (
                <option key={index} value={metodologia}>
                  {metodologia}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              {statusOptions.map((status, index) => (
                <option key={index} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Observações Técnicas</label>
          <textarea
            name="observacoesTecnicas"
            value={formData.observacoesTecnicas}
            onChange={handleInputChange}
            style={styles.textarea}
            placeholder="Observações técnicas sobre a avaliação..."
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Conclusões</label>
          <textarea
            name="conclusoes"
            value={formData.conclusoes}
            onChange={handleInputChange}
            style={styles.textarea}
            placeholder="Conclusões da avaliação..."
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              ...styles.button, 
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Criando...' : 'Criar Avaliação'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NovaAvaliacao;