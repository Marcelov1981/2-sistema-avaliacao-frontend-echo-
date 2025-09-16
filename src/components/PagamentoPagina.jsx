import React, { useState } from 'react';

const PagamentoPagina = ({ plano: planoSelecionado, onNavigate }) => {

  const [formData, setFormData] = useState({
    nomeCartao: '',
    numeroCartao: '',
    validadeCartao: '',
    cvv: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const enderecoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [enderecoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatarNumeroCartao = (value) => {
    // Remove todos os caracteres não numéricos
    const numeros = value.replace(/\D/g, '');
    // Adiciona espaços a cada 4 dígitos
    return numeros.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatarValidadeCartao = (value) => {
    // Remove todos os caracteres não numéricos
    const numeros = value.replace(/\D/g, '');
    // Adiciona barra após 2 dígitos
    if (numeros.length >= 2) {
      return numeros.substring(0, 2) + '/' + numeros.substring(2, 4);
    }
    return numeros;
  };

  const formatarCPF = (value) => {
    const numeros = value.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (value) => {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nomeCartao.trim()) {
      novosErros.nomeCartao = 'Nome no cartão é obrigatório';
    }

    if (!formData.numeroCartao.replace(/\s/g, '')) {
      novosErros.numeroCartao = 'Número do cartão é obrigatório';
    } else if (formData.numeroCartao.replace(/\s/g, '').length < 16) {
      novosErros.numeroCartao = 'Número do cartão deve ter 16 dígitos';
    }

    if (!formData.validadeCartao) {
      novosErros.validadeCartao = 'Validade é obrigatória';
    }

    if (!formData.cvv) {
      novosErros.cvv = 'CVV é obrigatório';
    } else if (formData.cvv.length < 3) {
      novosErros.cvv = 'CVV deve ter 3 ou 4 dígitos';
    }

    if (!formData.cpf) {
      novosErros.cpf = 'CPF é obrigatório';
    }

    if (!formData.email) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a integração com o gateway de pagamento
      console.log('Dados do pagamento:', {
        plano: planoSelecionado,
        dadosCartao: formData
      });
      
      // Redirecionar para página de sucesso
      if (onNavigate) {
        onNavigate('pagamento-sucesso');
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    voltarButton: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '500',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1.1rem'
    },
    planoInfo: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '30px',
      textAlign: 'center'
    },
    planoNome: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '8px'
    },
    planoPreco: {
      fontSize: '2rem',
      fontWeight: '800'
    },
    form: {
      display: 'grid',
      gap: '20px'
    },
    section: {
      marginBottom: '30px'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e5e7eb'
    },
    inputGroup: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '16px'
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '16px'
    },
    inputField: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    input: {
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    inputFocus: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '4px'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '20px'
    },
    submitButtonDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed'
    },
    securityInfo: {
      background: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    securityIcon: {
      color: '#0ea5e9',
      fontSize: '1.5rem'
    },
    securityText: {
      color: '#0c4a6e',
      fontSize: '0.9rem'
    }
  };

  if (!planoSelecionado) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.card}>
            <div style={styles.header}>
              <h1 style={styles.title}>Erro</h1>
              <p style={styles.subtitle}>Nenhum plano foi selecionado.</p>
              <button 
                style={styles.submitButton}
                onClick={() => onNavigate && onNavigate('planos-assinatura')}
              >
                Voltar aos Planos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button 
        style={styles.voltarButton}
        onClick={() => onNavigate && onNavigate('planos-assinatura')}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.2)';
        }}
      >
        ← Voltar
      </button>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Finalizar Assinatura</h1>
            <p style={styles.subtitle}>Complete seus dados para ativar sua assinatura</p>
          </div>

          <div style={styles.planoInfo}>
            <div style={styles.planoNome}>Plano {planoSelecionado.nome}</div>
            <div style={styles.planoPreco}>{planoSelecionado.preco}{planoSelecionado.periodo}</div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>💳 Dados do Cartão</h3>
              
              <div style={styles.inputGroup}>
                <div style={styles.inputField}>
                  <label style={styles.label}>Nome no Cartão *</label>
                  <input
                    type="text"
                    name="nomeCartao"
                    value={formData.nomeCartao}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.nomeCartao ? styles.inputError : {})
                    }}
                    placeholder="Nome como está no cartão"
                  />
                  {errors.nomeCartao && <span style={styles.errorText}>{errors.nomeCartao}</span>}
                </div>

                <div style={styles.inputField}>
                  <label style={styles.label}>Número do Cartão *</label>
                  <input
                    type="text"
                    name="numeroCartao"
                    value={formatarNumeroCartao(formData.numeroCartao)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '');
                      if (value.length <= 16) {
                        handleInputChange({ target: { name: 'numeroCartao', value } });
                      }
                    }}
                    style={{
                      ...styles.input,
                      ...(errors.numeroCartao ? styles.inputError : {})
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errors.numeroCartao && <span style={styles.errorText}>{errors.numeroCartao}</span>}
                </div>

                <div style={styles.inputRow}>
                  <div style={styles.inputField}>
                    <label style={styles.label}>Validade *</label>
                    <input
                      type="text"
                      name="validadeCartao"
                      value={formatarValidadeCartao(formData.validadeCartao)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          handleInputChange({ target: { name: 'validadeCartao', value } });
                        }
                      }}
                      style={{
                        ...styles.input,
                        ...(errors.validadeCartao ? styles.inputError : {})
                      }}
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                    {errors.validadeCartao && <span style={styles.errorText}>{errors.validadeCartao}</span>}
                  </div>

                  <div style={styles.inputField}>
                    <label style={styles.label}>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          handleInputChange({ target: { name: 'cvv', value } });
                        }
                      }}
                      style={{
                        ...styles.input,
                        ...(errors.cvv ? styles.inputError : {})
                      }}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvv && <span style={styles.errorText}>{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>👤 Dados Pessoais</h3>
              
              <div style={styles.inputGroup}>
                <div style={styles.inputField}>
                  <label style={styles.label}>CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formatarCPF(formData.cpf)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        handleInputChange({ target: { name: 'cpf', value } });
                      }
                    }}
                    style={{
                      ...styles.input,
                      ...(errors.cpf ? styles.inputError : {})
                    }}
                    placeholder="000.000.000-00"
                    maxLength="14"
                  />
                  {errors.cpf && <span style={styles.errorText}>{errors.cpf}</span>}
                </div>

                <div style={styles.inputField}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      ...styles.input,
                      ...(errors.email ? styles.inputError : {})
                    }}
                    placeholder="seu@email.com"
                  />
                  {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                </div>

                <div style={styles.inputField}>
                  <label style={styles.label}>Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formatarTelefone(formData.telefone)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 11) {
                        handleInputChange({ target: { name: 'telefone', value } });
                      }
                    }}
                    style={styles.input}
                    placeholder="(11) 99999-9999"
                    maxLength="15"
                  />
                </div>
              </div>
            </div>

            <div style={styles.securityInfo}>
              <span style={styles.securityIcon}>🔒</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Seus dados estão seguros</div>
                <div style={styles.securityText}>
                  Utilizamos criptografia SSL de 256 bits para proteger suas informações. 
                  Seus dados de cartão são processados de forma segura e não são armazenados em nossos servidores.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? '🔄 Processando...' : '💳 Finalizar Assinatura'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PagamentoPagina;