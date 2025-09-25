import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Select, Switch, Button, Card, Row, Col, Upload, message, ColorPicker, Slider } from 'antd';
import { UploadOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import configuracoesService from '../services/configuracoesService.js';

const { Option } = Select;
const { TextArea } = Input;

const EdicaoConfiguracoes = ({ isOpen, onClose, tipoConfiguracao }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({});

  const carregarConfiguracoes = useCallback(async () => {
    setLoading(true);
    try {
      // Tentar carregar do backend primeiro
      const response = await configuracoesService.buscarConfiguracoesPorTipo(tipoConfiguracao);
      
      if (response.success && response.data) {
        setConfiguracoes(response.data);
        form.setFieldsValue(response.data);
      } else {
        // Fallback para configuração padrão
        const configPadrao = obterConfiguracaoPadrao(tipoConfiguracao);
        setConfiguracoes(configPadrao);
        form.setFieldsValue(configPadrao);
      }
    } catch (error) {
      console.warn('Erro ao carregar do backend, usando localStorage:', error);
      
      // Fallback para localStorage
      const configSalva = localStorage.getItem(`config_${tipoConfiguracao}`);
      const configPadrao = obterConfiguracaoPadrao(tipoConfiguracao);
      
      const configAtual = configSalva ? 
        { ...configPadrao, ...JSON.parse(configSalva) } : 
        configPadrao;
      
      setConfiguracoes(configAtual);
      form.setFieldsValue(configAtual);
    } finally {
      setLoading(false);
    }
  }, [tipoConfiguracao, form]);

  useEffect(() => {
    if (isOpen && tipoConfiguracao) {
      carregarConfiguracoes();
    }
  }, [isOpen, tipoConfiguracao, carregarConfiguracoes]);

  const obterConfiguracaoPadrao = (tipo) => {
    const padroes = {
      idioma: {
        idioma: 'pt-BR',
        fusoHorario: 'America/Sao_Paulo',
        formatoData: 'DD/MM/YYYY',
        formatoHora: '24h',
        moeda: 'BRL'
      },
      tema: {
        tema: 'claro',
        corPrimaria: '#1890ff',
        corSecundaria: '#52c41a',
        tamanhoFonte: 14,
        animacoes: true,
        modoCompacto: false
      },
      perfil: {
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        cargo: '',
        endereco: '',
        bio: ''
      },
      notificacoes: {
        emailNotificacoes: true,
        pushNotificacoes: true,
        notificarRelatorios: true,
        notificarBackup: true,
        notificarErros: true,
        frequenciaResumo: 'diario'
      },
      seguranca: {
        autenticacaoDupla: false,
        sessaoExpira: '24h',
        logAcessos: true,
        senhaComplexidade: 'media'
      },
      backup: {
        backupAutomatico: true,
        frequenciaBackup: 'diario',
        horarioBackup: '02:00',
        manterBackups: 30,
        incluirImagens: true
      },
      integracao: {
        apiKey: '',
        webhookUrl: '',
        timeoutApi: 30,
        retentativas: 3
      },
      templates: {
        templatePadrao: 'moderno',
        incluirLogo: true,
        incluirAssinatura: true,
        formatoPadrao: 'PDF',
        qualidadeImagem: 'alta'
      },
      assinatura: {
        nomeAssinante: '',
        cargoAssinante: '',
        certificadoDigital: false,
        imagemAssinatura: ''
      }
    };
    
    return padroes[tipo] || {};
  };

  const obterTituloModal = (tipo) => {
    const titulos = {
      idioma: 'Configurações de Idioma e Localização',
      tema: 'Configurações de Tema',
      perfil: 'Configurações de Perfil',
      notificacoes: 'Configurações de Notificações',
      seguranca: 'Configurações de Segurança',
      backup: 'Configurações de Backup',
      integracao: 'Configurações de Integração',
      templates: 'Configurações de Templates',
      assinatura: 'Configurações de Assinatura'
    };
    
    return titulos[tipo] || 'Configurações';
  };

  const handleSalvar = async (values) => {
    setLoading(true);
    try {
      // Tentar salvar no backend primeiro
      const response = await configuracoesService.salvarConfiguracao(tipoConfiguracao, values);
      
      if (response.success) {
        // Salvar também no localStorage como backup
        localStorage.setItem(`config_${tipoConfiguracao}`, JSON.stringify(values));
        
        message.success('Configurações salvas com sucesso!');
        onClose();
      } else {
        throw new Error(response.message || 'Erro ao salvar no backend');
      }
    } catch (error) {
      console.warn('Erro ao salvar no backend, salvando apenas no localStorage:', error);
      
      // Fallback para localStorage
      try {
        localStorage.setItem(`config_${tipoConfiguracao}`, JSON.stringify(values));
        message.warning('Configurações salvas localmente. Verifique a conexão com o servidor.');
        onClose();
      } catch {
         message.error('Erro ao salvar configurações');
       }
    } finally {
      setLoading(false);
    }
  };

  const renderCamposConfiguracao = () => {
    switch (tipoConfiguracao) {
      case 'idioma':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="idioma" label="Idioma">
                  <Select>
                    <Option value="pt-BR">Português (Brasil)</Option>
                    <Option value="en-US">English (US)</Option>
                    <Option value="es-ES">Español</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="fusoHorario" label="Fuso Horário">
                  <Select>
                    <Option value="America/Sao_Paulo">Brasília (GMT-3)</Option>
                    <Option value="America/New_York">New York (GMT-5)</Option>
                    <Option value="Europe/London">Londres (GMT+0)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="formatoData" label="Formato de Data">
                  <Select>
                    <Option value="DD/MM/YYYY">DD/MM/AAAA</Option>
                    <Option value="MM/DD/YYYY">MM/DD/AAAA</Option>
                    <Option value="YYYY-MM-DD">AAAA-MM-DD</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="formatoHora" label="Formato de Hora">
                  <Select>
                    <Option value="24h">24 horas</Option>
                    <Option value="12h">12 horas (AM/PM)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'tema':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="tema" label="Tema">
                  <Select>
                    <Option value="claro">Claro</Option>
                    <Option value="escuro">Escuro</Option>
                    <Option value="automatico">Automático</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="tamanhoFonte" label="Tamanho da Fonte">
                  <Slider min={12} max={18} marks={{ 12: '12px', 14: '14px', 16: '16px', 18: '18px' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="animacoes" label="Animações" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="modoCompacto" label="Modo Compacto" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'perfil':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="nome" label="Nome Completo">
                  <Input placeholder="Seu nome completo" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="Email">
                  <Input type="email" placeholder="seu@email.com" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="telefone" label="Telefone">
                  <Input placeholder="(11) 99999-9999" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="empresa" label="Empresa">
                  <Input placeholder="Nome da empresa" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="bio" label="Biografia">
              <TextArea rows={3} placeholder="Breve descrição sobre você" />
            </Form.Item>
          </>
        );

      case 'notificacoes':
        return (
          <>
            <Card title="Tipos de Notificação" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="emailNotificacoes" label="Email" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="pushNotificacoes" label="Push" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            <Card title="Eventos" size="small">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="notificarRelatorios" label="Relatórios" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="notificarBackup" label="Backup" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="notificarErros" label="Erros" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </>
        );

      case 'seguranca':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="autenticacaoDupla" label="Autenticação em Duas Etapas" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sessaoExpira" label="Expiração da Sessão">
                  <Select>
                    <Option value="1h">1 hora</Option>
                    <Option value="8h">8 horas</Option>
                    <Option value="24h">24 horas</Option>
                    <Option value="7d">7 dias</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="logAcessos" label="Log de Acessos" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="senhaComplexidade" label="Complexidade da Senha">
                  <Select>
                    <Option value="baixa">Baixa</Option>
                    <Option value="media">Média</Option>
                    <Option value="alta">Alta</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'backup':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="backupAutomatico" label="Backup Automático" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="frequenciaBackup" label="Frequência">
                  <Select>
                    <Option value="diario">Diário</Option>
                    <Option value="semanal">Semanal</Option>
                    <Option value="mensal">Mensal</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="horarioBackup" label="Horário">
                  <Input type="time" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="manterBackups" label="Manter Backups (dias)">
                  <Slider min={7} max={90} marks={{ 7: '7', 30: '30', 60: '60', 90: '90' }} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'templates':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="templatePadrao" label="Template Padrão">
                  <Select>
                    <Option value="classico">Clássico</Option>
                    <Option value="moderno">Moderno</Option>
                    <Option value="minimalista">Minimalista</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="formatoPadrao" label="Formato Padrão">
                  <Select>
                    <Option value="PDF">PDF</Option>
                    <Option value="DOCX">Word</Option>
                    <Option value="HTML">HTML</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="incluirLogo" label="Incluir Logo" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="incluirAssinatura" label="Incluir Assinatura" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="qualidadeImagem" label="Qualidade da Imagem">
                  <Select>
                    <Option value="baixa">Baixa</Option>
                    <Option value="media">Média</Option>
                    <Option value="alta">Alta</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      case 'assinatura':
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="nomeAssinante" label="Nome do Assinante">
                  <Input placeholder="Nome completo" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cargoAssinante" label="Cargo">
                  <Input placeholder="Cargo ou função" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="certificadoDigital" label="Certificado Digital" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="imagemAssinatura" label="Imagem da Assinatura">
                  <Upload
                    beforeUpload={() => false}
                    accept="image/*"
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </>
        );

      default:
        return <div>Tipo de configuração não encontrado</div>;
    }
  };

  return (
    <Modal
      title={obterTituloModal(tipoConfiguracao)}
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>
          Cancelar
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          icon={<SaveOutlined />}
          loading={loading}
          onClick={() => form.submit()}
        >
          Salvar Configurações
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSalvar}
        initialValues={configuracoes}
      >
        {renderCamposConfiguracao()}
      </Form>
    </Modal>
  );
};

export default EdicaoConfiguracoes;