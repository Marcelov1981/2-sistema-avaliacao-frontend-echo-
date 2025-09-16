import React from 'react';
import { Card, Button, Typography, Space, Tag } from 'antd';
import { LockOutlined, CrownOutlined, UpgradeOutlined } from '@ant-design/icons';
import { obterNomePlano, PRECOS_PLANO } from '../utils/AccessControl';

const { Title, Text, Paragraph } = Typography;



/**
 * Componente que exibe quando o acesso é negado
 */
const AccessDeniedCard = ({ 
  funcionalidade, 
  planoAtual, 
  nomePlano, 
  customMessage, 
  redirectToPlans,
  onUpgrade 
}) => {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade({ funcionalidade, planoAtual });
    } else if (redirectToPlans) {
      // Aqui você pode implementar a navegação para a página de planos
      console.log('Redirecionando para planos...');
    }
  };

  const getRecommendedPlan = () => {
    // Lógica simplificada para recomendar um plano
    switch (funcionalidade) {
      case 'comparacao_propriedades':
      case 'dashboard_avancado':
        return 'intermediario';
      case 'api_integracao':
      case 'analise_batch':
        return 'full';
      default:
        return 'basico';
    }
  };

  const recommendedPlan = getRecommendedPlan();
  const recommendedPrice = PRECOS_PLANO[recommendedPlan];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '300px',
      padding: '20px'
    }}>
      <Card
        style={{ 
          maxWidth: '500px', 
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <LockOutlined 
              style={{ 
                fontSize: '48px', 
                color: '#faad14',
                marginBottom: '16px'
              }} 
            />
            <Title level={3} style={{ margin: 0 }}>Acesso Restrito</Title>
          </div>

          <div>
            <Tag color="blue">{nomePlano}</Tag>
            <Paragraph style={{ margin: '16px 0', fontSize: '16px' }}>
              {customMessage || 
                'Esta funcionalidade não está disponível no seu plano atual. '
              }
              Faça upgrade para ter acesso a recursos avançados.
            </Paragraph>
          </div>

          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: '6px',
            padding: '16px',
            margin: '16px 0'
          }}>
            <CrownOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text strong>Plano Recomendado: </Text>
            <Text>{obterNomePlano(recommendedPlan)}</Text>
            <br />
            <Text type="secondary">
              A partir de R$ {(recommendedPrice / 100).toFixed(2)}/mês
            </Text>
          </div>

          <Space>
            <Button 
              type="primary" 
              icon={<UpgradeOutlined />}
              size="large"
              onClick={handleUpgrade}
            >
              Fazer Upgrade
            </Button>
            <Button size="large">
              Ver Planos
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
};



export { AccessDeniedCard };