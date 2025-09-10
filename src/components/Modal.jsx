import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '0',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      position: 'relative'
    },
    header: {
      padding: '24px 24px 16px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#64748b',
      padding: '4px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px'
    },
    content: {
      padding: '24px',
      maxHeight: 'calc(90vh - 120px)',
      overflow: 'auto'
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;