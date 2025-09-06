// Estilos do componente App
export const appStyles = {
  appContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden'
  },
  loginContainer: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box'
  },
  loginCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  logoContainer: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #10b981, #0d9488)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '16px',
    color: '#1e293b',
    outline: 'none',
    marginBottom: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  },
  button: {
    width: '100%',
    background: 'linear-gradient(135deg, #059669, #0d9488)',
    color: 'white',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  mainAppContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)',
    overflow: 'hidden'
  },
  pageHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  }
};

export const otherStyles = {
  // Estilos adicionais específicos do componente
    pageTitle: {
      fontSize: '42px',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: '0 0 12px 0'
    },
    pageSubtitle: {
      color: '#64748b',
      fontSize: '18px',
      margin: 0
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    cardContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    cardInfo: {
      flex: 1
    },
    cardTitle: {
      color: '#64748b',
      fontSize: '14px',
      fontWeight: '500',
      margin: '0 0 8px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    cardValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#1e293b',
      margin: 0
    },
    cardIcon: {
      padding: '16px',
      borderRadius: '12px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    },
    tableHeader: {
      textAlign: 'left',
      padding: '12px 8px',
      background: '#f8fafc',
      fontWeight: '600',
      color: '#1e293b',
      borderBottom: '1px solid #e2e8f0',
      borderRight: '1px solid #e2e8f0',
      fontSize: '14px'
    },
    tableCell: {
      padding: '12px 8px',
      borderBottom: '1px solid #e2e8f0',
      borderRight: '1px solid #e2e8f0',
      color: '#64748b',
      fontSize: '14px'
    },
    statusBadge: {
      background: '#dcfce7',
      color: '#166534',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    },
    actionButton: {
      background: 'linear-gradient(135deg, #059669, #0d9488)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      fontSize: '16px'
    },
    iconButton: {
      padding: '8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      color: 'inherit',
      transition: 'background-color 0.2s'
    }
}

// Função para estilos dinâmicos da sidebar
export const getSidebarStyles = (sidebarOpen) => ({
  sidebar: {
    width: sidebarOpen ? '260px' : '70px',
    height: '100vh',
    background: '#1e293b',
    color: 'white',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: sidebarOpen ? 'space-between' : 'center',
    minHeight: '60px'
  },
  sidebarNav: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
  },
  sidebarItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#cbd5e1',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '16px',
    textAlign: 'left'
  },
  sidebarItemActive: {
    background: '#059669',
    color: 'white',
    boxShadow: '0 4px 8px rgba(5, 150, 105, 0.3)'
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid #475569'
  },
  mainContent: {
    flex: 1,
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  contentArea: {
    flex: 1,
    padding: '30px',
    overflow: 'auto'
  }
});