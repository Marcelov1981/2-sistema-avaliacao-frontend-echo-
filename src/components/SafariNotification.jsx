import React, { useState, useEffect } from 'react';
import SafariCompatibility from '../utils/SafariCompatibility.js';

const SafariNotification = ({ 
  action = 'usar esta funcionalidade',
  showOnMount = true,
  autoHide = true,
  hideDelay = 10000 // 10 segundos
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Verifica se deve mostrar a notificação
    if (showOnMount && SafariCompatibility.isSafari() && !isDismissed) {
      setIsVisible(true);
      
      // Auto-hide se configurado
      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, hideDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [showOnMount, autoHide, hideDelay, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleShowInstructions = () => {
    SafariCompatibility.showSafariInstructions(action);
  };

  if (!SafariCompatibility.isSafari() || !isVisible) {
    return null;
  }

  const isMobile = SafariCompatibility.isSafariMobile();

  return (
    <div style={styles.notification}>
      <div style={styles.content}>
        <div style={styles.icon}>
          {isMobile ? '📱' : '🌐'}
        </div>
        <div style={styles.message}>
          <strong>Safari Detectado</strong>
          <p style={styles.text}>
            {isMobile 
              ? `Para melhor experiência ao ${action}, recomendamos usar Chrome ou Firefox no iOS.`
              : `Algumas funcionalidades podem ter comportamento diferente no Safari.`
            }
          </p>
        </div>
        <div style={styles.actions}>
          <button 
            onClick={handleShowInstructions}
            style={styles.helpButton}
          >
            💡 Ajuda
          </button>
          <button 
            onClick={handleDismiss}
            style={styles.closeButton}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    maxWidth: '400px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 9999,
    animation: 'slideIn 0.3s ease-out'
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px',
    gap: '12px'
  },
  icon: {
    fontSize: '24px',
    flexShrink: 0
  },
  message: {
    flex: 1,
    minWidth: 0
  },
  text: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#856404',
    lineHeight: '1.4'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flexShrink: 0
  },
  helpButton: {
    background: '#007AFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#856404',
    padding: '4px',
    borderRadius: '4px'
  }
};

// Adiciona animação CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

export default SafariNotification;