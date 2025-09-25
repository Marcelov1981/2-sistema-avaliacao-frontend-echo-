import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Table, Tag, Button, Modal, message, Divider, Statistic } from 'antd';
import { 
  TeamOutlined, 
  ProjectOutlined, 
  DollarOutlined,
  CameraOutlined,
  LinkOutlined,
  EyeOutlined
} from '@ant-design/icons';
import relationshipService from '../services/relationshipService';

const { Title, Text } = Typography;

const DataRelationshipManager = () => {
  const [completeData, setCompleteData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [relationshipModal, setRelationshipModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [userData, statsData] = await Promise.all([
        relationshipService.getUserCompleteData(),
        relationshipService.getRelationshipStats()
      ]);
      
      setCompleteData(userData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      message.error('Erro ao carregar dados de relacionamentos');
    } finally {
      setLoading(false);
    }
  };

  const renderStatsCards = () => {
    if (!stats) return null;
    
    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total de Projetos"
              value={stats.totalProjetos}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total de Clientes"
              value={stats.totalClientes}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total de Orçamentos"
              value={stats.totalOrcamentos}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total de Avaliações"
              value={stats.totalAvaliacoes}
              prefix={<CameraOutlined />}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const getClienteProjects = (clienteId) => {
    return completeData?.projetos?.filter(p => p.cliente_id === clienteId) || [];
  };

  const getProjectBudgets = (projectId) => {
    return completeData?.orcamentos?.filter(o => o.projeto_id === projectId) || [];
  };

  const getProjectEvaluations = (projectId) => {
    return completeData?.avaliacoes?.filter(a => a.projeto_id === projectId) || [];
  };

  const showEntityDetails = async (entity, type) => {
    try {
      setLoading(true);
      let entityWithRelations;
      
      switch (type) {
        case 'projeto':
          entityWithRelations = await relationshipService.getProjectWithRelations(entity.id);
          break;
        case 'orcamento':
          entityWithRelations = await relationshipService.getOrcamentoWithRelations(entity.id);
          break;
        case 'avaliacao':
          entityWithRelations = await relationshipService.getAvaliacaoWithRelations(entity.id);
          break;
        default:
          entityWithRelations = entity;
      }
      
      setSelectedEntity({ ...entityWithRelations, type });
      setRelationshipModal(true);
    } catch {
       message.error('Erro ao carregar detalhes da entidade');
     } finally {
      setLoading(false);
    }
  };



  const clientesColumns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Projetos',
      key: 'projetos',
      render: (_, record) => {
        const clienteProjetos = getClienteProjects(record.id);
        return (
          <Tag color={clienteProjetos.length > 0 ? 'green' : 'default'}>
            {clienteProjetos.length} projeto(s)
          </Tag>
        );
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => showEntityDetails(record, 'cliente')}
        >
          Ver Relacionamentos
        </Button>
      ),
    },
  ];

  const projetosColumns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Cliente',
      key: 'cliente',
      render: (_, record) => (
        record.cliente ? record.cliente.nome : 'N/A'
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'concluido' ? 'green' : status === 'em_andamento' ? 'blue' : 'orange'}>
          {status || 'em_andamento'}
        </Tag>
      ),
    },
    {
      title: 'Orçamentos',
      key: 'orcamentos',
      render: (_, record) => (
        <Tag color={(record.orcamentos && record.orcamentos.length > 0) ? 'green' : 'default'}>
          {record.orcamentos ? record.orcamentos.length : 0} orçamento(s)
        </Tag>
      )
    },
    {
      title: 'Avaliações',
      key: 'avaliacoes',
      render: (_, record) => (
        <Tag color={(record.avaliacoes && record.avaliacoes.length > 0) ? 'green' : 'default'}>
          {record.avaliacoes ? record.avaliacoes.length : 0} avaliação(ões)
        </Tag>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => showEntityDetails(record, 'projeto')}
        >
          Ver Relacionamentos
        </Button>
      ),
    },
  ];

  const renderEntityDetails = () => {
    if (!selectedEntity) return null;

    const { type } = selectedEntity;

    if (type === 'cliente') {
      const clienteProjetos = getClienteProjects(selectedEntity.id);
      return (
        <div>
          <Title level={4}>Cliente: {selectedEntity.nome}</Title>
          <Divider />
          <Title level={5}>Projetos Relacionados ({clienteProjetos.length})</Title>
          {clienteProjetos.map(projeto => {
            const projectBudgets = getProjectBudgets(projeto.id);
            const projectEvaluations = getProjectEvaluations(projeto.id);
            return (
              <Card key={projeto.id} size="small" style={{ marginBottom: '8px' }}>
                <div>
                  <strong>{projeto.nome}</strong>
                  <div>
                    <Tag color="blue">{projectBudgets.length} orçamento(s)</Tag>
                    <Tag color="purple">{projectEvaluations.length} avaliação(ões)</Tag>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      );
    }

    if (type === 'projeto') {
      const cliente = completeData?.clientes?.find(c => c.id === selectedEntity.cliente_id);
      const projectBudgets = getProjectBudgets(selectedEntity.id);
      const projectEvaluations = getProjectEvaluations(selectedEntity.id);
      
      return (
        <div>
          <Title level={4}>Projeto: {selectedEntity.nome}</Title>
          <Divider />
          
          <Title level={5}>Cliente</Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <strong>{cliente ? cliente.nome : 'N/A'}</strong>
            <br />
            {cliente ? cliente.email : ''}
          </Card>

          <Title level={5}>Orçamentos ({projectBudgets.length})</Title>
          {projectBudgets.map(orcamento => (
            <Card key={orcamento.id} size="small" style={{ marginBottom: '8px' }}>
              <div>
                <strong>{orcamento.titulo || 'Orçamento'}</strong>
                <div>
                  <Tag color={orcamento.status === 'aprovado' ? 'green' : 'orange'}>
                    {orcamento.status}
                  </Tag>
                  <span>R$ {orcamento.valor?.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </Card>
          ))}

          <Title level={5}>Avaliações ({projectEvaluations.length})</Title>
          {projectEvaluations.map(avaliacao => (
            <Card key={avaliacao.id} size="small" style={{ marginBottom: '8px' }}>
              <div>
                <strong>{avaliacao.titulo || 'Avaliação'}</strong>
                <div>
                  <Tag color={avaliacao.status === 'concluida' ? 'green' : 'orange'}>
                    {avaliacao.status}
                  </Tag>
                  <span>{avaliacao.tipo_analise}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <LinkOutlined /> Gerenciamento de Relacionamentos de Dados
      </Title>
      
      <Text type="secondary">
        Visualize como todas as entidades do sistema se relacionam entre si
      </Text>

      <Divider />

      {renderStatsCards()}

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Clientes" loading={loading}>
            <Table
              dataSource={completeData?.clientes || []}
              columns={clientesColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Projetos" loading={loading}>
            <Table
              dataSource={completeData?.projetos || []}
              columns={projetosColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Relacionamentos da Entidade"
        open={relationshipModal}
        onCancel={() => setRelationshipModal(false)}
        footer={[
          <Button key="close" onClick={() => setRelationshipModal(false)}>
            Fechar
          </Button>
        ]}
        width={800}
      >
        {renderEntityDetails()}
      </Modal>
    </div>
  );
};

export default DataRelationshipManager;