import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Tabs, message, Checkbox, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

const Autenticacao = ({ onLogin, onRegister }) => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/usuarios/login`, {
        email: values.email,
        senha: values.password
      });
      
      if (response.data && response.data.success) {
        const userData = {
          id: response.data.usuario.id,
          email: response.data.usuario.email,
          nome: response.data.usuario.nome,
          plano: response.data.usuario.plano || null,
          dataLogin: new Date().toISOString(),
          token: response.data.token
        };
        
        // Salvar no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        
        message.success('Login realizado com sucesso!');
        
        console.log('Login bem-sucedido, dados do usuário:', userData);
        console.log('Callback onLogin disponível:', !!onLogin);
        
        if (onLogin) {
          console.log('Executando callback onLogin...');
          onLogin(userData);
        } else {
          console.error('Callback onLogin não foi fornecido!');
        }
      } else {
        message.error('Credenciais inválidas.');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error('Email ou senha incorretos.');
      } else {
        message.error('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    console.log('handleRegister chamado com valores:', values);
    setLoading(true);
    try {
      const dadosEnvio = {
        nome: values.nome,
        email: values.email,
        senha: values.password,
        telefone: values.telefone,
        cpfCnpj: values.cpfCnpj,
        empresa: values.empresa || ''
      };
      console.log('Dados que serão enviados:', dadosEnvio);
      
      const response = await axios.post(`${API_BASE_URL}/api/v1/usuarios/registro`, dadosEnvio);
      
      if (response.data && response.data.success) {
        const userData = {
          id: response.data.usuario.id,
          email: response.data.usuario.email,
          nome: response.data.usuario.nome,
          telefone: response.data.usuario.telefone,
          cpfCnpj: response.data.usuario.cpfCnpj,
          empresa: response.data.usuario.empresa,
          plano: null,
          dataCadastro: new Date().toISOString(),
          token: response.data.token
        };
        
        // Salvar no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
        
        message.success('Cadastro realizado com sucesso!');
        
        console.log('Registro bem-sucedido, dados do usuário:', userData);
        console.log('Callback onRegister disponível:', !!onRegister);
        
        if (onRegister) {
          console.log('Executando callback onRegister...');
          onRegister(userData);
        } else {
          console.error('Callback onRegister não foi fornecido!');
        }
      } else {
        message.error(response.data?.message || 'Erro ao realizar cadastro.');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data?.message || 'Dados inválidos.');
      } else if (error.response?.status === 409) {
        message.error('Este email já está cadastrado.');
      } else {
        message.error('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateCPFCNPJ = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('CPF/CNPJ é obrigatório'));
    }
    
    // Remover caracteres especiais
    const cleanValue = value.replace(/[^\d]/g, '');
    
    if (cleanValue.length !== 11 && cleanValue.length !== 14) {
      return Promise.reject(new Error('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos'));
    }
    
    return Promise.resolve();
  };

  const formatCPFCNPJ = (value) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    
    if (cleanValue.length <= 11) {
      // Formato CPF: 000.000.000-00
      return cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    } else {
      // Formato CNPJ: 00.000.000/0000-00
      return cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          borderRadius: '12px'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            GeoMind
          </Title>
          <Text type="secondary">Sistema de Avaliação Imobiliária</Text>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
          style={{ marginBottom: '20px' }}
        >
          <TabPane tab="Entrar" key="login">
            <Form
              form={loginForm}
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Por favor, insira seu email!' },
                  { type: 'email', message: 'Email inválido!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Por favor, insira sua senha!' },
                  { min: 6, message: 'Senha deve ter pelo menos 6 caracteres!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Senha"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Checkbox>Lembrar-me</Checkbox>
                  <Link>Esqueceu a senha?</Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{ height: '45px', fontSize: '16px' }}
                >
                  Entrar
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Cadastrar" key="register">
            <Form
              form={registerForm}
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="nome"
                rules={[
                  { required: true, message: 'Por favor, insira seu nome!' },
                  { min: 2, message: 'Nome deve ter pelo menos 2 caracteres!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nome completo"
                  autoComplete="name"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Por favor, insira seu email!' },
                  { type: 'email', message: 'Email inválido!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="telefone"
                rules={[
                  { required: true, message: 'Por favor, insira seu telefone!' },
                  { pattern: /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/, message: 'Telefone inválido!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Telefone (11) 99999-9999"
                  autoComplete="tel"
                />
              </Form.Item>

              <Form.Item
                name="cpfCnpj"
                rules={[{ validator: validateCPFCNPJ }]}
              >
                <Input
                  prefix={<IdcardOutlined />}
                  placeholder="CPF ou CNPJ"
                  onChange={(e) => {
                    const formatted = formatCPFCNPJ(e.target.value);
                    registerForm.setFieldsValue({ cpfCnpj: formatted });
                  }}
                />
              </Form.Item>

              <Form.Item
                name="empresa"
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Empresa (opcional)"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Por favor, insira sua senha!' },
                  { min: 6, message: 'Senha deve ter pelo menos 6 caracteres!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Senha"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Por favor, confirme sua senha!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('As senhas não coincidem!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirmar senha"
                  autoComplete="new-password"
                />
              </Form.Item>

              <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[
                  { required: true, message: 'Você deve aceitar os termos de uso!' }
                ]}
              >
                <Checkbox>
                  Aceito os <Link>Termos de Uso</Link> e <Link>Política de Privacidade</Link>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{ height: '45px', fontSize: '16px' }}
                >
                  Criar Conta
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 GeoMind. Todos os direitos reservados.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Autenticacao;