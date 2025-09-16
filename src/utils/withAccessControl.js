import React from 'react';
import { verificarAcesso } from './AccessControl';
import { AccessDeniedCard } from '../components/ProtectedComponent';

/**
 * Higher-Order Component para controle de acesso
 * @param {React.Component} WrappedComponent - Componente a ser protegido
 * @param {string} requiredFunctionality - Funcionalidade necessária
 * @param {Object} options - Opções de configuração
 * @returns {React.Component} Componente protegido
 */
export const withAccessControl = (WrappedComponent, requiredFunctionality, options = {}) => {
  const {
    fallbackComponent: FallbackComponent = AccessDeniedCard,
    showFallback = true,
    redirectTo = null,
    onAccessDenied = null
  } = options;

  const ProtectedComponent = (props) => {
    const hasAccess = verificarAcesso(requiredFunctionality);

    if (!hasAccess) {
      // Executar callback personalizado se fornecido
      if (onAccessDenied) {
        onAccessDenied(requiredFunctionality);
      }

      // Redirecionar se especificado
      if (redirectTo) {
        window.location.href = redirectTo;
        return null;
      }

      // Mostrar componente de fallback
      if (showFallback && FallbackComponent) {
        return <FallbackComponent funcionalidade={requiredFunctionality} />;
      }

      // Não renderizar nada
      return null;
    }

    // Renderizar componente original se tiver acesso
    return <WrappedComponent {...props} />;
  };

  // Definir nome do componente para debugging
  ProtectedComponent.displayName = `withAccessControl(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
};

export default withAccessControl;