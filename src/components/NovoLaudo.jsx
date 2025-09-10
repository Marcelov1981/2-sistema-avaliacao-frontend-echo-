import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const NovoLaudo = ({ isOpen, onClose, onLaudoCreated }) => {
  const [formData, setFormData] = useState({
    avaliacaoId: '',
    numeroLaudo: '',
    dataEmissao: '',
    finalidade: '',
    tipoLaudo: '',
    valorFinal: '',
    observacoes: '',
    status: 'rascunho'
  });

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);

  const tiposLaudo = [
    'Laudo de Avaliação',
    'Parecer Técnico',
    'Laudo de Vistoria',
    'Laudo Judicial',
    'Laudo Administrativo',
    'Laudo para Garantia'
  ];

  const finalidades = [
    'Compra e Venda',
    'Garantia de Financiamento',
    'Seguro',
    'Judicial',
    'Sucessão',
    'Dissolução de Sociedade',
    'Desapropriação',
    'Outras'
  ];

  const statusOptions = [
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'em_revisao', label: 'Em Revisão' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'entregue', label: 'Entregue' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchAvaliacoes();
    }
  }, [isOpen]);

  const fetchAvaliacoes = async () => {
    console.log('Iniciando carregamento de avaliações...');
    setLoadingAvaliacoes(true);
    try {
      const response = await axios.get('https://geomind-service-production.up.railway.app/api/v1/avaliacoes');
      console.log('Resposta da API:', response.data);
      setAvaliacoes(response.data || []);
      console.log('Avaliações carregadas:', response.data?.length || 0);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      // Dados mock para teste enquanto a API não está funcionando
      const mockAvaliacoes = [
        {
          id: 1,
          orcamento: { descricao: 'Avaliação Residencial - Casa 3 quartos' },
          valorAvaliado: 450000
        },
        {
          id: 2,
          orcamento: { descricao: 'Avaliação Comercial - Loja Centro' },
          valorAvaliado: 280000
        },
        {
          id: 3,
          orcamento: { descricao: 'Avaliação Rural - Fazenda 50 hectares' },
          valorAvaliado: 1200000
        }
      ];
      setAvaliacoes(mockAvaliacoes);
      console.log('Usando dados mock:', mockAvaliacoes.length, 'avaliações');
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateNumeroLaudo = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `LAU-${year}-${timestamp}`;
  };

  useEffect(() => {
    if (isOpen && !formData.numeroLaudo) {
      setFormData(prev => ({
        ...prev,
        numeroLaudo: generateNumeroLaudo()
      }));
    }
  }, [isOpen, formData.numeroLaudo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://geomind-service-production.up.railway.app/api/v1/laudos',
        {
          ...formData,
          valorFinal: parseFloat(formData.valorFinal) || 0
        }
      );

      if (response.status === 201 || response.status === 200) {
        // Reset form
        setFormData({
          avaliacaoId: '',
          numeroLaudo: '',
          dataEmissao: '',
          finalidade: '',
          tipoLaudo: '',
          valorFinal: '',
          observacoes: '',
          status: 'rascunho'
        });
        
        onLaudoCreated && onLaudoCreated();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar laudo:', error);
      setError(error.response?.data?.message || 'Erro ao criar laudo');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Laudo">
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Avaliação *</label>
          {loadingAvaliacoes ? (
            <div style={styles.loading}>Carregando avaliações...</div>
          ) : (
            <select
              name="avaliacaoId"
              value={formData.avaliacaoId}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecione uma avaliação</option>
              {avaliacoes.map(avaliacao => (
                <option key={avaliacao.id} value={avaliacao.id}>
                  {avaliacao.orcamento?.descricao || 'Avaliação'} - R$ {avaliacao.valorAvaliado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número do Laudo *</label>
            <input
              type="text"
              name="numeroLaudo"
              value={formData.numeroLaudo}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="LAU-2024-123456"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Data de Emissão *</label>
            <input
              type="date"
              name="dataEmissao"
              value={formData.dataEmissao}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Laudo *</label>
            <select
              name="tipoLaudo"
              value={formData.tipoLaudo}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecione o tipo</option>
              {tiposLaudo.map((tipo, index) => (
                <option key={index} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Finalidade *</label>
            <select
              name="finalidade"
              value={formData.finalidade}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecione a finalidade</option>
              {finalidades.map((finalidade, index) => (
                <option key={index} value={finalidade}>
                  {finalidade}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Valor Final (R$) *</label>
            <input
              type="number"
              name="valorFinal"
              value={formData.valorFinal}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="0,00"
              step="0.01"
              min="0"
              required
            />
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
          <label style={styles.label}>Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleInputChange}
            style={styles.textarea}
            placeholder="Observações adicionais sobre o laudo..."
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
            {loading ? 'Criando...' : 'Criar Laudo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NovoLaudo;