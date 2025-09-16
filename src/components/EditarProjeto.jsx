import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import CepService from '../utils/CepService';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import authService from '../services/authService';

const EditarProjeto = ({ isOpen, onClose, onSuccess, projeto }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cliente_id: '',
    tipo_imovel: '',
    finalidade: '',
    endereco_imovel: '',
    cidade_imovel: '',
    estado_imovel: '',
    cep_imovel: '',
    area_terreno: '',
    area_construida: '',
    valor_estimado: '',
    prazo_entrega: '',
    observacoes: ''
  });
  
  const [clientes, setClientes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const tiposImovel = [
    'Residencial',
    'Comercial',
    'Industrial',
    'Rural',
    'Terreno',
    'Apartamento',
    'Casa',
    'Galpão',
    'Loja',
    'Sala Comercial'
  ];

  const finalidades = [
    'Compra e Venda',
    'Financiamento',
    'Seguro',
    'Inventário',
    'Partilha',
    'Garantia',
    'Locação',
    'Judicial',
    'Administrativa'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
      if (projeto) {
        setFormData({
          nome: projeto.nome || '',
          cliente_id: projeto.cliente_id || '',
          tipo_imovel: projeto.tipo_imovel || '',
          finalidade: projeto.finalidade || '',
          endereco_imovel: projeto.endereco_imovel || '',
          cidade_imovel: projeto.cidade_imovel || '',
          estado_imovel: projeto.estado_imovel || '',
          cep_imovel: projeto.cep_imovel || '',
          area_terreno: projeto.area_terreno || '',
          area_construida: projeto.area_construida || '',
          valor_estimado: projeto.valor_estimado || '',
          prazo_entrega: projeto.prazo_entrega || '',
          observacoes: projeto.observacoes || ''
        });
        setImages(projeto.images || []);
      }
    }
  }, [isOpen, projeto]);

  const fetchClientes = async () => {
    try {
      // Verificar se está autenticado
      if (!authService.isAuthenticated()) {
        console.error('Usuário não autenticado');
        setError('Usuário não autenticado');
        return;
      }
      
      const response = await axios.get(API_ENDPOINTS.clientes.base, {
        headers: getAuthHeaders()
      });
      
      // Verificar se a resposta tem o formato esperado
      if (response.data.success) {
        setClientes(response.data.data || []);
      } else {
        setClientes(response.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Erro ao carregar lista de clientes');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatar CEP automaticamente
    if (name === 'cep_imovel') {
      const cepFormatado = CepService.formatarCep(value);
      setFormData(prev => ({
        ...prev,
        [name]: cepFormatado
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const buscarEnderecoPorCep = async () => {
    if (!formData.cep_imovel || !CepService.validarCep(formData.cep_imovel)) {
      alert('Por favor, digite um CEP válido');
      return;
    }
    
    setCepLoading(true);
    
    try {
      const resultado = await CepService.buscarEnderecoPorCep(formData.cep_imovel);
      
      if (resultado.success) {
        setFormData(prev => ({
          ...prev,
          endereco_imovel: resultado.data.endereco,
          cidade_imovel: resultado.data.cidade,
          estado_imovel: resultado.data.estado
        }));
        alert('Endereço encontrado e preenchido automaticamente!');
      } else {
        alert(`Erro ao buscar CEP: ${resultado.error}`);
      }
    } catch {
      alert('Erro ao buscar endereço. Tente novamente.');
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projetoData = {
        ...formData,
        images: images
      };

      // Verificar se está autenticado
      if (!authService.isAuthenticated()) {
        setError('Usuário não autenticado');
        return;
      }
      
      await axios.put(`${API_ENDPOINTS.projetos.base}/${projeto.id}`, projetoData, {
        headers: getAuthHeaders()
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        nome: '',
        cliente_id: '',
        tipo_imovel: '',
        finalidade: '',
        endereco_imovel: '',
        cidade_imovel: '',
        estado_imovel: '',
        cep_imovel: '',
        area_terreno: '',
        area_construida: '',
        valor_estimado: '',
        prazo_entrega: '',
        observacoes: ''
      });
      setImages([]);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError(error.response?.data?.message || 'Erro ao atualizar projeto');
      }
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
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s',
      outline: 'none'
    },
    select: {
      padding: '12px',
      border: '2px solid #e5e7eb',
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
      backgroundColor: '#0d9488',
      color: 'white'
    },
    error: {
      color: '#dc2626',
      fontSize: '14px',
      padding: '12px',
      backgroundColor: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e5e7eb'
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Projeto">
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.sectionTitle}>Informações do Projeto</div>
        
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome do Projeto *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              style={styles.input}
              required
              placeholder="Ex: Avaliação Residencial - Rua das Flores"
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cliente *</label>
            <select
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleInputChange}
              style={styles.select}
              required
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo do Imóvel *</label>
            <select
              name="tipo_imovel"
              value={formData.tipo_imovel}
              onChange={handleInputChange}
              style={styles.select}
              required
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="">Selecione o tipo</option>
              {tiposImovel.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
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
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="">Selecione a finalidade</option>
              {finalidades.map(finalidade => (
                <option key={finalidade} value={finalidade}>{finalidade}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.sectionTitle}>Localização do Imóvel</div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Endereço *</label>
          <input
            type="text"
            name="endereco_imovel"
            value={formData.endereco_imovel}
            onChange={handleInputChange}
            style={styles.input}
            required
            onFocus={(e) => e.target.style.borderColor = '#0d9488'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cidade *</label>
            <input
              type="text"
              name="cidade_imovel"
              value={formData.cidade_imovel}
              onChange={handleInputChange}
              style={styles.input}
              required
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Estado *</label>
            <input
              type="text"
              name="estado_imovel"
              value={formData.estado_imovel}
              onChange={handleInputChange}
              style={styles.input}
              required
              maxLength="2"
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CEP</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                name="cep_imovel"
                value={formData.cep_imovel}
                onChange={handleInputChange}
                style={{ ...styles.input, flex: 1 }}
                placeholder="00000-000"
                maxLength="9"
                onFocus={(e) => e.target.style.borderColor = '#0d9488'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="button"
                onClick={buscarEnderecoPorCep}
                disabled={cepLoading || !formData.cep_imovel || !CepService.validarCep(formData.cep_imovel)}
                style={{
                  ...styles.button,
                  backgroundColor: cepLoading ? '#9ca3af' : '#0d9488',
                  cursor: cepLoading ? 'not-allowed' : 'pointer',
                  padding: '8px 16px',
                  fontSize: '14px',
                  minWidth: '80px'
                }}
              >
                {cepLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
        </div>

        <div style={styles.sectionTitle}>Características do Imóvel</div>
        
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Área do Terreno (m²)</label>
            <input
              type="number"
              name="area_terreno"
              value={formData.area_terreno}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="0"
              step="0.01"
              min="0"
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Área Construída (m²)</label>
            <input
              type="number"
              name="area_construida"
              value={formData.area_construida}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="0"
              step="0.01"
              min="0"
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Valor Estimado (R$)</label>
            <input
              type="number"
              name="valor_estimado"
              value={formData.valor_estimado}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="0,00"
              step="0.01"
              min="0"
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prazo de Entrega</label>
            <input
              type="date"
              name="prazo_entrega"
              value={formData.prazo_entrega}
              onChange={handleInputChange}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#0d9488'}
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
            placeholder="Informações adicionais sobre o projeto de avaliação..."
            onFocus={(e) => e.target.style.borderColor = '#0d9488'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <ImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={10}
          label="Anexar Imagens do Projeto"
        />

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
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0f766e')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#0d9488')}
          >
            {loading ? 'Atualizando...' : 'Atualizar Projeto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarProjeto;