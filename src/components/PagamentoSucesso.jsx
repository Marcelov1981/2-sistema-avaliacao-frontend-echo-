import React from 'react';

const PagamentoSucesso = ({ plano, onNavigate }) => {
  const email = 'usuario@exemplo.com'; // Placeholder para email

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '60px 40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '500px',
      width: '100%'
    },
    successIcon: {
      fontSize: '4rem',
      marginBottom: '24px',
      display: 'block'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#6b7280',
      marginBottom: '32px',
      lineHeight: '1.6'
    },
    planoInfo: {
      background: '#f0f9ff',
      border: '2px solid #0ea5e9',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '32px'
    },
    planoNome: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#0c4a6e',
      marginBottom: '8px'
    },
    planoPreco: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#0ea5e9'
    },
    infoList: {
      textAlign: 'left',
      marginBottom: '32px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      fontSize: '0.95rem',
      color: '#374151'
    },
    checkIcon: {
      color: '#10b981',
      marginRight: '12px',
      fontSize: '1.2rem'
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      flexDirection: 'column'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    secondaryButton: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '12px',
      padding: '14px 32px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    emailInfo: {
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      fontSize: '0.9rem',
      color: '#92400e'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.successIcon}>🎉</span>
        
        <h1 style={styles.title}>Assinatura Ativada!</h1>
        
        <p style={styles.subtitle}>
          Parabéns! Sua assinatura foi processada com sucesso e já está ativa. 
          Agora você tem acesso a todos os recursos do seu plano.
        </p>

        {plano && (
          <div style={styles.planoInfo}>
            <div style={styles.planoNome}>Plano {plano.nome}</div>
            <div style={styles.planoPreco}>{plano.preco}{plano.periodo}</div>
          </div>
        )}

        {email && (
          <div style={styles.emailInfo}>
            📧 Um email de confirmação foi enviado para <strong>{email}</strong> com todos os detalhes da sua assinatura.
          </div>
        )}

        <div style={styles.infoList}>
          <div style={styles.infoItem}>
            <span style={styles.checkIcon}>✓</span>
            Acesso imediato a todos os recursos do plano
          </div>
          <div style={styles.infoItem}>
            <span style={styles.checkIcon}>✓</span>
            Cobrança automática no mesmo dia do próximo mês
          </div>
          <div style={styles.infoItem}>
            <span style={styles.checkIcon}>✓</span>
            Suporte técnico disponível conforme seu plano
          </div>
          <div style={styles.infoItem}>
            <span style={styles.checkIcon}>✓</span>
            Cancelamento disponível a qualquer momento
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryButton}
            onClick={() => onNavigate && onNavigate('dashboard')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🚀 Começar a Usar Agora
          </button>
          
          <button
            style={styles.secondaryButton}
            onClick={() => onNavigate && onNavigate('planos-assinatura')}
            onMouseEnter={(e) => {
              e.target.style.background = '#667eea';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#667eea';
            }}
          >
            Ver Outros Planos
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagamentoSucesso;