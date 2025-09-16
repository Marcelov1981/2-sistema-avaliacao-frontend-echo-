import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, List, Tag, Modal, message } from 'antd';
import { CheckOutlined, CrownOutlined, StarOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const PlanosAssinatura = ({ onSelectPlan, currentPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const planos = [
    {
      id: 'consulta-avulsa',
      nome: 'Consultas Avulsas',
      tipo: 'pay-per-use',
      preco: 15.90,
      unidade: 'por consulta',
      cor: '#52c41a',
      icone: <ThunderboltOutlined />,
      descricao: 'Pague apenas quando usar',
      caracteristicas: [
        'Pagamento por consulta realizada',
        'Sem mensalidade fixa',
        'Acesso a análise básica de imóveis',
        'Relatórios simples em PDF',
        'Suporte por email'
      ],
      limitacoes: [
        'Máximo 5 consultas por dia',
        'Sem armazenamento de histórico',
        'Funcionalidades limitadas'
      ]
    },
    {
      id: 'basico',
      nome: 'Plano Básico',
      tipo: 'subscription',
      preco: 49.90,
      unidade: 'por mês',
      cor: '#1890ff',
      icone: <StarOutlined />,
      descricao: 'Ideal para profissionais iniciantes',
      caracteristicas: [
        'Até 50 consultas por mês',
        'Análise básica de imóveis',
        'Relatórios em PDF personalizáveis',
        'Armazenamento de 100 projetos',
        'Suporte por email',
        'Dashboard básico'
      ],
      limitacoes: [
        'Sem análise de IA avançada',
        'Sem comparação de imagens',
        'Relatórios com marca d\'água'
      ]
    },
    {
      id: 'intermediario',
      nome: 'Plano Intermediário',
      tipo: 'subscription',
      preco: 99.90,
      unidade: 'por mês',
      cor: '#fa8c16',
      icone: <CrownOutlined />,
      descricao: 'Para profissionais em crescimento',
      caracteristicas: [
        'Até 200 consultas por mês',
        'Análise completa com IA',
        'Comparação de imagens',
        'Relatórios profissionais sem marca d\'água',
        'Armazenamento de 500 projetos',
        'Dashboard avançado',
        'Suporte prioritário',
        'Integração com APIs externas'
      ],
      limitacoes: [
        'Sem análise de mercado avançada',
        'Sem relatórios customizados'
      ]
    },
    {
      id: 'full',
      nome: 'Pacote Full',
      tipo: 'subscription',
      preco: 199.90,
      unidade: 'por mês',
      cor: '#722ed1',
      icone: <CrownOutlined />,
      descricao: 'Solução completa para empresas',
      caracteristicas: [
        'Consultas ilimitadas',
        'Todas as funcionalidades de IA',
        'Análise de mercado avançada',
        'Relatórios totalmente customizáveis',
        'Armazenamento ilimitado',
        'Dashboard executivo',
        'Suporte 24/7',
        'API completa',
        'Integração com CRM',
        'Treinamento personalizado',
        'Logomarca personalizada'
      ],
      limitacoes: []
    }
  ];

  const handleSelectPlan = (plano) => {
    setSelectedPlan(plano);
    setConfirmModalVisible(true);
  };

  const confirmPlanSelection = () => {
    if (onSelectPlan) {
      onSelectPlan(selectedPlan);
    }
    setConfirmModalVisible(false);
    message.success(`Plano ${selectedPlan.nome} selecionado com sucesso!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const isCurrentPlan = (planId) => {
    return currentPlan && currentPlan.id === planId;
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2}>Escolha seu Plano</Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          Selecione o plano que melhor atende às suas necessidades profissionais
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {planos.map((plano) => (
          <Col xs={24} sm={12} lg={6} key={plano.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                border: isCurrentPlan(plano.id) ? `2px solid ${plano.cor}` : '1px solid #d9d9d9',
                position: 'relative'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              {isCurrentPlan(plano.id) && (
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  background: plano.cor,
                  color: 'white',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  PLANO ATUAL
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '32px', color: plano.cor, marginBottom: '8px' }}>
                  {plano.icone}
                </div>
                <Title level={4} style={{ margin: 0, color: plano.cor }}>
                  {plano.nome}
                </Title>
                <Text type="secondary">{plano.descricao}</Text>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: plano.cor }}>
                  {formatPrice(plano.preco)}
                </div>
                <Text type="secondary">{plano.unidade}</Text>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <Text strong style={{ color: '#52c41a' }}>✓ Características:</Text>
                <List
                  size="small"
                  dataSource={plano.caracteristicas}
                  renderItem={item => (
                    <List.Item style={{ padding: '4px 0', border: 'none' }}>
                      <CheckOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      <Text style={{ fontSize: '13px' }}>{item}</Text>
                    </List.Item>
                  )}
                />
              </div>

              {plano.limitacoes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <Text strong style={{ color: '#faad14' }}>⚠ Limitações:</Text>
                  <List
                    size="small"
                    dataSource={plano.limitacoes}
                    renderItem={item => (
                      <List.Item style={{ padding: '4px 0', border: 'none' }}>
                        <Text style={{ fontSize: '13px', color: '#666' }}>• {item}</Text>
                      </List.Item>
                    )}
                  />
                </div>
              )}

              <Button
                type={isCurrentPlan(plano.id) ? "default" : "primary"}
                size="large"
                block
                style={{
                  backgroundColor: isCurrentPlan(plano.id) ? '#f5f5f5' : plano.cor,
                  borderColor: plano.cor,
                  height: '45px',
                  fontWeight: 'bold'
                }}
                disabled={isCurrentPlan(plano.id)}
                onClick={() => handleSelectPlan(plano)}
              >
                {isCurrentPlan(plano.id) ? 'Plano Atual' : 'Selecionar Plano'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Confirmar Seleção de Plano"
        open={confirmModalVisible}
        onOk={confirmPlanSelection}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        {selectedPlan && (
          <div>
            <Paragraph>
              Você está prestes a selecionar o plano <strong>{selectedPlan.nome}</strong>.
            </Paragraph>
            <Paragraph>
              <strong>Valor:</strong> {formatPrice(selectedPlan.preco)} {selectedPlan.unidade}
            </Paragraph>
            <Paragraph>
              {selectedPlan.tipo === 'pay-per-use' 
                ? 'Este plano cobra por consulta realizada. Você será cobrado apenas quando usar o sistema.'
                : 'Este é um plano de assinatura mensal. O valor será cobrado automaticamente todo mês.'
              }
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlanosAssinatura;