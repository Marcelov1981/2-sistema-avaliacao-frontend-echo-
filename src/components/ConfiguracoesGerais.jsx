import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Space, Divider } from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  PictureOutlined,
  GlobalOutlined,
  ToolOutlined,
  EditOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ConfiguracoesGerais = ({ onOpenConfiguracao, onOpenEdicao }) => {
  const [selectedCategory, setSelectedCategory] = useState('geral');

  const categorias = [
    {
      id: 'geral',
      nome: 'Geral',
      icon: <SettingOutlined />,
      cor: '#1890ff'
    },
    {
      id: 'usuario',
      nome: 'Usuário',
      icon: <UserOutlined />,
      cor: '#52c41a'
    },
    {
      id: 'sistema',
      nome: 'Sistema',
      icon: <DatabaseOutlined />,
      cor: '#722ed1'
    },
    {
      id: 'relatorios',
      nome: 'Relatórios',
      icon: <FileTextOutlined />,
      cor: '#fa8c16'
    }
  ];

  const configuracoes = {
    geral: [
      {
        id: 'logo',
        titulo: 'Configuração de Logo',
        descricao: 'Personalize a logomarca que aparece nos relatórios',
        icon: <PictureOutlined />,
        acao: () => onOpenConfiguracao('logo')
      },
      {
        id: 'idioma',
        titulo: 'Idioma e Localização',
        descricao: 'Configure idioma, fuso horário e formato de data',
        icon: <GlobalOutlined />,
        acao: () => onOpenEdicao('idioma')
      },
      {
        id: 'tema',
        titulo: 'Tema da Interface',
        descricao: 'Escolha entre tema claro, escuro ou automático',
        icon: <ToolOutlined />,
        acao: () => onOpenEdicao('tema')
      }
    ],
    usuario: [
      {
        id: 'perfil',
        titulo: 'Perfil do Usuário',
        descricao: 'Edite informações pessoais e dados de contato',
        icon: <UserOutlined />,
        acao: () => onOpenEdicao('perfil')
      },
      {
        id: 'notificacoes',
        titulo: 'Notificações',
        descricao: 'Configure alertas e notificações do sistema',
        icon: <BellOutlined />,
        acao: () => onOpenEdicao('notificacoes')
      },
      {
        id: 'seguranca',
        titulo: 'Segurança',
        descricao: 'Altere senha e configure autenticação',
        icon: <SecurityScanOutlined />,
        acao: () => onOpenEdicao('seguranca')
      }
    ],
    sistema: [
      {
        id: 'backup',
        titulo: 'Backup e Restauração',
        descricao: 'Configure backups automáticos dos seus dados',
        icon: <DatabaseOutlined />,
        acao: () => onOpenEdicao('backup')
      },
      {
        id: 'integracao',
        titulo: 'Integrações',
        descricao: 'Configure APIs e integrações externas',
        icon: <GlobalOutlined />,
        acao: () => onOpenEdicao('integracao')
      }
    ],
    relatorios: [
      {
        id: 'templates',
        titulo: 'Templates de Relatório',
        descricao: 'Personalize modelos de relatórios e laudos',
        icon: <FileTextOutlined />,
        acao: () => onOpenEdicao('templates')
      },
      {
        id: 'assinatura',
        titulo: 'Assinatura Digital',
        descricao: 'Configure assinatura digital para documentos',
        icon: <EditOutlined />,
        acao: () => onOpenEdicao('assinatura')
      }
    ]
  };

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    categoryButton: {
      width: '100%',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    configCard: {
      marginBottom: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #f0f0f0'
    },
    configHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    configIcon: {
      fontSize: '24px',
      color: '#1890ff'
    },
    configTitle: {
      fontSize: '18px',
      fontWeight: '600',
      margin: 0,
      color: '#262626'
    },
    configDescription: {
      color: '#8c8c8c',
      fontSize: '14px',
      margin: 0
    },
    actionButton: {
      marginTop: '12px'
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2}>Configurações do Sistema</Title>
      <Text type="secondary">
        Gerencie todas as configurações do seu sistema de forma organizada
      </Text>
      
      <Divider />
      
      <Row gutter={[24, 24]}>
        {/* Menu de Categorias */}
        <Col xs={24} md={6}>
          <Card title="Categorias" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {categorias.map((categoria) => (
                <Button
                  key={categoria.id}
                  type={selectedCategory === categoria.id ? 'primary' : 'default'}
                  icon={categoria.icon}
                  style={{
                    ...styles.categoryButton,
                    backgroundColor: selectedCategory === categoria.id ? categoria.cor : undefined
                  }}
                  onClick={() => setSelectedCategory(categoria.id)}
                >
                  {categoria.nome}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>
        
        {/* Lista de Configurações */}
        <Col xs={24} md={18}>
          <Card 
            title={`Configurações - ${categorias.find(c => c.id === selectedCategory)?.nome}`}
            size="small"
          >
            <Row gutter={[16, 16]}>
              {configuracoes[selectedCategory]?.map((config) => (
                <Col xs={24} lg={12} key={config.id}>
                  <Card
                    style={styles.configCard}
                    hoverable
                    onClick={config.acao}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={styles.configHeader}>
                      <div style={styles.configIcon}>
                        {config.icon}
                      </div>
                      <div>
                        <h4 style={styles.configTitle}>{config.titulo}</h4>
                        <p style={styles.configDescription}>{config.descricao}</p>
                      </div>
                    </div>
                    
                    <Button 
                      type="primary" 
                      size="small"
                      style={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        config.acao();
                      }}
                    >
                      Configurar
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConfiguracoesGerais;