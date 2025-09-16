import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const CustomHeader = ({ showInReports = false, className = '' }) => {
  const [logoConfig, setLogoConfig] = useState({
    logoUrl: '',
    logoSize: 100,
    logoPosition: 'top-right',
    logoOpacity: 100,
    showInPages: true,
    showInReports: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogoConfig();
  }, []);

  const loadLogoConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/configuracoes/logo`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setLogoConfig(data.data);
            setLoading(false);
            return;
          }
        }
      }
    } catch {
      console.log('Carregando configurações do localStorage');
    }
    
    // Fallback para localStorage
    const savedConfig = {
      logoUrl: localStorage.getItem('logoUrl') || '',
      logoSize: parseInt(localStorage.getItem('logoSize')) || 100,
      logoPosition: localStorage.getItem('logoPosition') || 'top-right',
      logoOpacity: parseInt(localStorage.getItem('logoOpacity')) || 100,
      showInPages: localStorage.getItem('showInPages') !== 'false',
      showInReports: localStorage.getItem('showInReports') !== 'false'
    };
    setLogoConfig(savedConfig);
    setLoading(false);
  };

  // Determinar se deve mostrar o logo personalizado
  const shouldShowCustomLogo = showInReports ? logoConfig.showInReports : logoConfig.showInPages;
  
  // Determinar se deve mostrar a marca GeoMind (sempre nas páginas, condicionalmente nos relatórios)
  const shouldShowGeoMind = !showInReports;

  if (loading) {
    return null;
  }

  return (
    <div className={`custom-header ${className}`} style={{ position: 'relative', width: '100%', minHeight: '60px' }}>
      {/* Logo Personalizado */}
      {shouldShowCustomLogo && logoConfig.logoUrl && (
        <img
          src={logoConfig.logoUrl}
          alt="Logo Personalizado"
          style={{
            position: 'absolute',
            width: `${logoConfig.logoSize}px`,
            height: 'auto',
            opacity: logoConfig.logoOpacity / 100,
            zIndex: 10,
            ...getPositionStyles(logoConfig.logoPosition)
          }}
        />
      )}
      
      {/* Marca GeoMind */}
      {shouldShowGeoMind && (
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            GeoMind
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para calcular posição da logo (reutilizada do ConfiguracaoLogo)
const getPositionStyles = (position) => {
  const styles = {};
  
  switch (position) {
    case 'top-left':
      styles.top = '10px';
      styles.left = '10px';
      break;
    case 'top-center':
      styles.top = '10px';
      styles.left = '50%';
      styles.transform = 'translateX(-50%)';
      break;
    case 'top-right':
      styles.top = '10px';
      styles.right = '10px';
      break;
    case 'center-left':
      styles.top = '50%';
      styles.left = '10px';
      styles.transform = 'translateY(-50%)';
      break;
    case 'center':
      styles.top = '50%';
      styles.left = '50%';
      styles.transform = 'translate(-50%, -50%)';
      break;
    case 'center-right':
      styles.top = '50%';
      styles.right = '10px';
      styles.transform = 'translateY(-50%)';
      break;
    case 'bottom-left':
      styles.bottom = '10px';
      styles.left = '10px';
      break;
    case 'bottom-center':
      styles.bottom = '10px';
      styles.left = '50%';
      styles.transform = 'translateX(-50%)';
      break;
    case 'bottom-right':
      styles.bottom = '10px';
      styles.right = '10px';
      break;
    default:
      styles.top = '10px';
      styles.right = '10px';
  }
  
  return styles;
};

export default CustomHeader;