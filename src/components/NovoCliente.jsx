import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const NovoCliente = ({ isOpen, onClose, onClienteCreated }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    tipo_pessoa: 'fisica', // fisica ou juridica
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    registroProfissional: '',
    tipoRegistro: '',
    observacoes: '',
    status: 'ativo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        'https://geomind-service-production.up.railway.app/api/v1/clientes',
        formData
      );
      
      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        documento: '',
        tipo_pessoa: 'fisica',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        registroProfissional: '',
        tipoRegistro: '',
        observacoes: '',
        status: 'ativo'
      });
      
      // Callback para atualizar lista
      if (onClienteCreated) {
        onClienteCreated(response.data);
      }
      
      onClose();
    } catch (err) {
      setError('Erro ao criar cliente. Tente novamente.');
      console.error('Erro ao criar cliente:', err);
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
    row: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: '200px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
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
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      resize: 'vertical',
      minHeight: '80px',
      outline: 'none'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s'
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    submitButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    error: {
      color: '#dc2626',
      fontSize: '14px',
      padding: '12px',
      backgroundColor: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca'
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cliente">
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Pessoa *</label>
            <select
              name="tipo_pessoa"
              value={formData.tipo_pessoa}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="fisica">Pessoa Física</option>
              <option value="juridica">Pessoa Jurídica</option>
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Telefone *</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            {formData.tipo_pessoa === 'fisica' ? 'CPF *' : 'CNPJ *'}
          </label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleInputChange}
            style={styles.input}
            required
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Endereço *</label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleInputChange}
            style={styles.input}
            required
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cidade *</label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleInputChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Estado *</label>
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              style={styles.input}
              required
              maxLength="2"
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP *</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Registro Profissional</label>
            <select
              name="tipoRegistro"
              value={formData.tipoRegistro}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="">Selecione o tipo</option>
              <option value="CREA">CREA - Conselho Regional de Engenharia e Agronomia</option>
              <option value="CAU">CAU - Conselho de Arquitetura e Urbanismo</option>
              <option value="CRECI">CRECI - Conselho Regional de Corretores de Imóveis</option>
              <option value="IBAPE">IBAPE - Instituto Brasileiro de Avaliações e Perícias</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Número do Registro</label>
            <input
              type="text"
              name="registroProfissional"
              value={formData.registroProfissional}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Ex: 123456789-0"
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleInputChange}
            style={styles.textarea}
            placeholder="Informações adicionais sobre o cliente..."
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            style={{ ...styles.button, ...styles.cancelButton }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
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
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#10b981')}
          >
            {loading ? 'Criando...' : 'Criar Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NovoCliente;