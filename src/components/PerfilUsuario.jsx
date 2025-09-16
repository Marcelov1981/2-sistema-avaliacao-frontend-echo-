import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, List, Tag, Avatar, Descriptions, Modal, Form, Input, message, Divider } from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  CreditCardOutlined, 
  HistoryOutlined, 
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { obterUsuarioAtual } from '../utils/AccessControl';
import paymentSystem, { TIPOS_TRANSACAO, STATUS_TRANSACAO } from '../utils/PaymentSystem';

const { Title, Text, Paragraph } = Typography;

const PerfilUsuario = ({ onNavigate }) => {
  const [usuario, setUsuario] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalHistoricoVisible, setModalHistoricoVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      // Carregar dados do usuário
      const dadosUsuario = obterUsuarioAtual();
      setUsuario(dadosUsuario);

      // Carregar histórico de transações
      const historicoTransacoes = paymentSystem.obterHistoricoTransacoes();
      setHistorico(historicoTransacoes);

      // Carregar cartões salvos
      const cartoesSalvos = JSON.parse(localStorage.getItem('cartoes') || '[]');
      setCartoes(cartoesSalvos);

      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
      setLoading(false);
    }
  };

  const handleEditarPerfil = (values) => {
    try {
      // Atualizar dados do usuário no localStorage
      const usuarioAtualizado = { ...usuario, ...values };
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
      setUsuario(usuarioAtualizado);
      setModalEditarVisible(false);
      message.success('Perfil atualizado com sucesso!');
    } catch {
      message.error('Erro ao atualizar perfil');
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor / 100);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoText = (tipo) => {
    const tipos = {
      [TIPOS_TRANSACAO.CONSULTA_AVULSA]: 'Consulta Avulsa',
      [TIPOS_TRANSACAO.ASSINATURA_MENSAL]: 'Assinatura Mensal',
      [TIPOS_TRANSACAO.UPGRADE_PLANO]: 'Upgrade de Plano',
      [TIPOS_TRANSACAO.CREDITO_ADICIONAL]: 'Crédito Adicional'
    };
    return tipos[tipo] || tipo;
  };

  const getStatusColor = (status) => {
    const cores = {
      [STATUS_TRANSACAO.APROVADA]: 'green',
      [STATUS_TRANSACAO.PENDENTE]: 'orange',
      [STATUS_TRANSACAO.PROCESSANDO]: 'blue',
      [STATUS_TRANSACAO.REJEITADA]: 'red',
      [STATUS_TRANSACAO.CANCELADA]: 'default',
      [STATUS_TRANSACAO.ESTORNADA]: 'purple'
    };
    return cores[status] || 'default';
  };

  const getStatusText = (status) => {
    const textos = {
      [STATUS_TRANSACAO.APROVADA]: 'Aprovada',
      [STATUS_TRANSACAO.PENDENTE]: 'Pendente',
      [STATUS_TRANSACAO.PROCESSANDO]: 'Processando',
      [STATUS_TRANSACAO.REJEITADA]: 'Rejeitada',
      [STATUS_TRANSACAO.CANCELADA]: 'Cancelada',
      [STATUS_TRANSACAO.ESTORNADA]: 'Estornada'
    };
    return textos[status] || status;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Carregando dados do usuário...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Meu Perfil</Title>
        <Text type="secondary">Gerencie suas informações pessoais e dados da conta</Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Informações do Perfil */}
        <Col xs={24} lg={12}>
          <Card 
            title="Informações Pessoais" 
            extra={
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue(usuario);
                  setModalEditarVisible(true);
                }}
              >
                Editar
              </Button>
            }
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div style={{ marginTop: '12px' }}>
                <Title level={4} style={{ margin: 0 }}>{usuario?.nome || 'Usuário'}</Title>
                <Text type="secondary">{usuario?.email || 'email@exemplo.com'}</Text>
              </div>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Nome">{usuario?.nome || 'Não informado'}</Descriptions.Item>
              <Descriptions.Item label="Email">{usuario?.email || 'Não informado'}</Descriptions.Item>
              <Descriptions.Item label="Telefone">{usuario?.telefone || 'Não informado'}</Descriptions.Item>
              <Descriptions.Item label="Empresa">{usuario?.empresa || 'Não informado'}</Descriptions.Item>
              <Descriptions.Item label="Data de Cadastro">
                {usuario?.dataCadastro ? formatarData(usuario.dataCadastro) : 'Não informado'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Resumo da Conta */}
        <Col xs={24} lg={12}>
          <Card title="Resumo da Conta">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Plano Atual:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag color="blue">{usuario?.plano || 'Básico'}</Tag>
                </div>
              </div>
              
              <div>
                <Text strong>Status da Conta:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag color={usuario?.ativo !== false ? 'green' : 'red'}>
                    {usuario?.ativo !== false ? 'Ativa' : 'Inativa'}
                  </Tag>
                </div>
              </div>

              <div>
                <Text strong>Cartões Cadastrados:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text>{cartoes.length} cartão(ões)</Text>
                </div>
              </div>

              <div>
                <Text strong>Transações:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text>{historico.length} transação(ões)</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Ações Rápidas */}
        <Col xs={24}>
          <Card title="Ações Rápidas">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button 
                  block 
                  size="large" 
                  icon={<CreditCardOutlined />}
                  onClick={() => onNavigate && onNavigate('cartoes')}
                >
                  Meus Cartões
                </Button>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Button 
                  block 
                  size="large" 
                  icon={<HistoryOutlined />}
                  onClick={() => setModalHistoricoVisible(true)}
                >
                  Histórico Completo
                </Button>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Button 
                  block 
                  size="large" 
                  icon={<DollarOutlined />}
                  onClick={() => onNavigate && onNavigate('creditos')}
                >
                  Gerenciar Créditos
                </Button>
              </Col>
              
              <Col xs={24} sm={12} md={6}>
                <Button 
                  block 
                  size="large" 
                  icon={<UserOutlined />}
                  onClick={() => onNavigate && onNavigate('planos')}
                >
                  Alterar Plano
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Últimas Transações */}
        <Col xs={24}>
          <Card 
            title="Últimas Transações" 
            extra={
              <Button 
                type="link" 
                icon={<HistoryOutlined />}
                onClick={() => setModalHistoricoVisible(true)}
              >
                Ver Todas
              </Button>
            }
          >
            {historico.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <HistoryOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Text type="secondary">Nenhuma transação encontrada</Text>
              </div>
            ) : (
              <List
                dataSource={historico.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text>{getTipoText(item.tipo)}</Text>
                          <Tag color={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text>{formatarMoeda(item.valor)}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatarData(item.dataCreacao)}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal Editar Perfil */}
      <Modal
        title="Editar Perfil"
        open={modalEditarVisible}
        onCancel={() => setModalEditarVisible(false)}
        onOk={() => form.submit()}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditarPerfil}
        >
          <Form.Item
            name="nome"
            label="Nome Completo"
            rules={[{ required: true, message: 'Por favor, insira seu nome' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Seu nome completo" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira seu email' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="seu@email.com" />
          </Form.Item>

          <Form.Item
            name="telefone"
            label="Telefone"
          >
            <Input prefix={<PhoneOutlined />} placeholder="(11) 99999-9999" />
          </Form.Item>

          <Form.Item
            name="empresa"
            label="Empresa"
          >
            <Input prefix={<BankOutlined />} placeholder="Nome da empresa" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Histórico Completo */}
      <Modal
        title="Histórico Completo de Transações"
        open={modalHistoricoVisible}
        onCancel={() => setModalHistoricoVisible(false)}
        footer={null}
        width={800}
      >
        <List
          dataSource={historico}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Text>{getTipoText(item.tipo)}</Text>
                    <Tag color={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text>{formatarMoeda(item.valor)}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatarData(item.dataCreacao)}
                    </Text>
                    {item.descricao && (
                      <Text type="secondary">{item.descricao}</Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default PerfilUsuario;