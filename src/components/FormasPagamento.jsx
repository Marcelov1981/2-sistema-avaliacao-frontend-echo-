import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import GerenciamentoCartoes from './GerenciamentoCartoes';

const FormasPagamento = ({ onPagamentoConfigurado, planoSelecionado = null }) => {
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCartaoForm, setShowCartaoForm] = useState(false);
  const [dadosPix, setDadosPix] = useState({
    chavePix: '',
    tipoPix: 'cpf' // cpf, cnpj, email, telefone, aleatoria
  });

  const metodosPagamento = [
    {
      id: 'pix',
      nome: 'PIX',
      descricao: 'Pagamento instantâneo via PIX',
      icon: '💳',
      disponivel: true
    },
    {
      id: 'cartao_credito',
      nome: 'Cartão de Crédito',
      descricao: 'Pagamento com cartão de crédito',
      icon: '💳',
      disponivel: true
    },
    {
      id: 'cartao_debito',
      nome: 'Cartão de Débito',
      descricao: 'Pagamento com cartão de débito',
      icon: '💳',
      disponivel: true
    }
  ];

  const handleMetodoChange = (metodo) => {
    setMetodoPagamento(metodo);
    setError('');
    setSuccess('');
    
    if (metodo === 'cartao_credito' || metodo === 'cartao_debito') {
      setShowCartaoForm(true);
    } else {
      setShowCartaoForm(false);
    }
  };

  const handlePixSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const dadosEnvio = {
        metodoPagamento: 'pix',
        dadosPix,
        planoId: planoSelecionado?.id
      };
      
      await axios.post(`${API_ENDPOINTS.usuarios.base}/formas-pagamento`, dadosEnvio);
      
      setSuccess('Forma de pagamento PIX configurada com sucesso!');
      
      if (onPagamentoConfigurado) {
        onPagamentoConfigurado({
          metodo: 'pix',
          dados: dadosPix
        });
      }
      
    } catch (error) {
      console.error('Erro ao configurar PIX:', error);
      setError(error.response?.data?.message || 'Erro ao configurar PIX');
    } finally {
      setLoading(false);
    }
  };

  const handleCartaoConfigurado = (dadosCartao) => {
    setSuccess(`Cartão ${metodoPagamento === 'cartao_credito' ? 'de crédito' : 'de débito'} configurado com sucesso!`);
    setShowCartaoForm(false);
    
    if (onPagamentoConfigurado) {
      onPagamentoConfigurado({
        metodo: metodoPagamento,
        dados: dadosCartao
      });
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '10px',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '30px',
      textAlign: 'center'
    },
    metodosGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    metodoCard: {
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      backgroundColor: '#ffffff'
    },
    metodoCardActive: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)'
    },
    metodoIcon: {
      fontSize: '48px',
      marginBottom: '15px'
    },
    metodoNome: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px'
    },
    metodoDescricao: {
      fontSize: '14px',
      color: '#6b7280'
    },
    formSection: {
      marginTop: '30px',
      padding: '25px',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    },
    formTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    submitButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #fecaca'
    },
    success: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #bbf7d0'
    },
    planoInfo: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '25px'
    },
    planoTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '5px'
    },
    planoValor: {
      fontSize: '14px',
      color: '#3730a3'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Formas de Pagamento</h2>
        <p style={styles.subtitle}>
          Escolha sua forma de pagamento preferida para usar o GeoMind
        </p>

        {planoSelecionado && (
          <div style={styles.planoInfo}>
            <div style={styles.planoTitle}>Plano Selecionado: {planoSelecionado.nome}</div>
            <div style={styles.planoValor}>Valor: R$ {planoSelecionado.valor}</div>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <div style={styles.metodosGrid}>
          {metodosPagamento.map((metodo) => (
            <div
              key={metodo.id}
              style={{
                ...styles.metodoCard,
                ...(metodoPagamento === metodo.id ? styles.metodoCardActive : {}),
                ...(metodo.disponivel ? {} : { opacity: 0.5, cursor: 'not-allowed' })
              }}
              onClick={() => metodo.disponivel && handleMetodoChange(metodo.id)}
            >
              <div style={styles.metodoIcon}>{metodo.icon}</div>
              <div style={styles.metodoNome}>{metodo.nome}</div>
              <div style={styles.metodoDescricao}>{metodo.descricao}</div>
              {!metodo.disponivel && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                  Em breve
                </div>
              )}
            </div>
          ))}
        </div>

        {metodoPagamento === 'pix' && (
          <div style={styles.formSection}>
            <h3 style={styles.formTitle}>Configurar PIX</h3>
            <form onSubmit={handlePixSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Chave PIX</label>
                <select
                  value={dadosPix.tipoPix}
                  onChange={(e) => setDadosPix(prev => ({ ...prev, tipoPix: e.target.value }))}
                  style={styles.select}
                >
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">Email</option>
                  <option value="telefone">Telefone</option>
                  <option value="aleatoria">Chave Aleatória</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Chave PIX</label>
                <input
                  type="text"
                  value={dadosPix.chavePix}
                  onChange={(e) => setDadosPix(prev => ({ ...prev, chavePix: e.target.value }))}
                  style={styles.input}
                  placeholder={`Digite sua chave PIX (${dadosPix.tipoPix})`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !dadosPix.chavePix}
                style={{
                  ...styles.submitButton,
                  ...(loading || !dadosPix.chavePix ? styles.submitButtonDisabled : {})
                }}
              >
                {loading ? 'Configurando...' : 'Configurar PIX'}
              </button>
            </form>
          </div>
        )}

        {showCartaoForm && (metodoPagamento === 'cartao_credito' || metodoPagamento === 'cartao_debito') && (
          <div style={styles.formSection}>
            <h3 style={styles.formTitle}>
              Configurar {metodoPagamento === 'cartao_credito' ? 'Cartão de Crédito' : 'Cartão de Débito'}
            </h3>
            <GerenciamentoCartoes 
              onCartaoAdicionado={handleCartaoConfigurado}
              tipoCartao={metodoPagamento}
              showTitle={false}
            />
          </div>
        )}

        {!metodoPagamento && (
          <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
            Selecione uma forma de pagamento acima para continuar
          </div>
        )}
      </div>
    </div>
  );
};

export default FormasPagamento;