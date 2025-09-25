import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Alert, Spin, Tag, Statistic, Row, Col, Divider, List } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import validationService from '../services/validationService';

const DataIntegrityReport = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const generateReport = async () => {
    try {
      setLoading(true);
      const integrityReport = await validationService.generateIntegrityReport();
      setReport(integrityReport);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  const getStatusColor = (isConsistent) => {
    return isConsistent ? 'success' : 'error';
  };

  const getStatusIcon = (isConsistent) => {
    return isConsistent ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />;
  };

  const statisticsColumns = [
    {
      title: 'Entidade',
      dataIndex: 'entity',
      key: 'entity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value) => <Tag color="blue">{value}</Tag>
    },
    {
      title: 'Órfãos',
      dataIndex: 'orphans',
      key: 'orphans',
      render: (value) => (
        <Tag color={value > 0 ? 'red' : 'green'}>
          {value}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Tag 
          color={record.orphans > 0 ? 'red' : 'green'}
          icon={record.orphans > 0 ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
        >
          {record.orphans > 0 ? 'Problemas' : 'OK'}
        </Tag>
      )
    }
  ];

  const getTableData = () => {
    if (!report) return [];
    
    const { data } = report.consistency;
    return [
      {
        key: 'clientes',
        entity: 'Clientes',
        total: data.totalClientes,
        orphans: 0
      },
      {
        key: 'projetos',
        entity: 'Projetos',
        total: data.totalProjetos,
        orphans: data.orphanProjects
      },
      {
        key: 'orcamentos',
        entity: 'Orçamentos',
        total: data.totalOrcamentos,
        orphans: data.orphanBudgets
      },
      {
        key: 'avaliacoes',
        entity: 'Avaliações',
        total: data.totalAvaliacoes,
        orphans: data.orphanEvaluations
      }
    ];
  };

  if (loading && !report) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px' }}>Gerando relatório de integridade...</p>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              <FileTextOutlined style={{ marginRight: '8px' }} />
              Relatório de Integridade dos Dados
            </span>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={generateReport}
              loading={loading}
            >
              Atualizar
            </Button>
          </div>
        }
      >
        {report && (
          <>
            {/* Status Geral */}
            <Alert
              message="Status Geral da Integridade"
              description={
                report.consistency.isConsistent
                  ? "Todos os dados estão consistentes e bem relacionados."
                  : `Foram encontrados ${report.consistency.issues.length} problema(s) de integridade.`
              }
              type={getStatusColor(report.consistency.isConsistent)}
              icon={getStatusIcon(report.consistency.isConsistent)}
              showIcon
              style={{ marginBottom: '24px' }}
            />

            {/* Estatísticas Gerais */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Statistic
                  title="Total de Clientes"
                  value={report.consistency.data.totalClientes}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total de Projetos"
                  value={report.consistency.data.totalProjetos}
                  prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total de Orçamentos"
                  value={report.consistency.data.totalOrcamentos}
                  prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total de Avaliações"
                  value={report.consistency.data.totalAvaliacoes}
                  prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
                />
              </Col>
            </Row>

            <Divider />

            {/* Tabela Detalhada */}
            <Table
              columns={statisticsColumns}
              dataSource={getTableData()}
              pagination={false}
              size="middle"
              style={{ marginBottom: '24px' }}
            />

            {/* Problemas Encontrados */}
            {!report.consistency.isConsistent && (
              <>
                <Divider />
                <Card 
                  title="Problemas Encontrados" 
                  size="small" 
                  style={{ marginBottom: '24px' }}
                >
                  <List
                    dataSource={report.consistency.issues}
                    renderItem={(issue) => (
                      <List.Item>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                        {issue}
                      </List.Item>
                    )}
                  />
                </Card>
              </>
            )}

            {/* Recomendações */}
            <Card title="Recomendações" size="small">
              <List
                dataSource={report.recommendations}
                renderItem={(recommendation) => (
                  <List.Item>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    {recommendation}
                  </List.Item>
                )}
              />
            </Card>

            {/* Informações do Relatório */}
            <div style={{ marginTop: '24px', textAlign: 'center', color: '#666' }}>
              <small>
                Relatório gerado em: {new Date(report.timestamp).toLocaleString('pt-BR')}
                {lastUpdate && (
                  <> | Última atualização: {lastUpdate.toLocaleString('pt-BR')}</>
                )}
              </small>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default DataIntegrityReport;