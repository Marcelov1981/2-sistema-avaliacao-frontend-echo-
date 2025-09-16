// Utilitários para componentes de controle de acesso
import React, { useState, useEffect } from 'react';
import { obterInfoPlano, PRECOS_PLANO } from './AccessControl';

/**
 * Hook personalizado para controle de acesso em componentes
 */
export const useAccessControlComponent = () => {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPlan = () => {
      try {
        const planInfo = obterInfoPlano();
        setUserPlan(planInfo);
      } catch (error) {
        console.error('Erro ao carregar plano do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPlan();
  }, []);

  return { userPlan, loading };
};

/**
 * Componente para exibir informações de limite de uso
 */
export const UsageLimitInfo = ({ funcionalidade, usado, limite }) => {
  const porcentagem = limite > 0 ? (usado / limite) * 100 : 0;
  const isNearLimit = porcentagem >= 80;
  const isOverLimit = usado >= limite;

  return (
    <div className="usage-limit-info">
      <div className="usage-text">
        <span>{funcionalidade}: </span>
        <span className={isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}>
          {usado}/{limite === -1 ? '∞' : limite}
        </span>
      </div>
      {limite > 0 && (
        <div className="usage-bar">
          <div 
            className={`usage-progress ${
              isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(porcentagem, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Componente para exibir badge do plano
 */
export const PlanBadge = ({ plano }) => {
  const planColors = {
    'consultas_avulsas': 'bg-gray-100 text-gray-800',
    'basico': 'bg-blue-100 text-blue-800',
    'intermediario': 'bg-purple-100 text-purple-800',
    'full': 'bg-gold-100 text-gold-800'
  };

  const planNames = {
    'consultas_avulsas': 'Consultas Avulsas',
    'basico': 'Plano Básico',
    'intermediario': 'Plano Intermediário',
    'full': 'Pacote Full'
  };

  return (
    <span className={`plan-badge ${planColors[plano] || 'bg-gray-100 text-gray-800'}`}>
      {planNames[plano] || plano}
      {PRECOS_PLANO[plano] && (
        <span className="plan-price"> - R$ {PRECOS_PLANO[plano]}/mês</span>
      )}
    </span>
  );
};