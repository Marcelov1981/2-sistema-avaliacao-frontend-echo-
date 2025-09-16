import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, List, Modal, message, Space, Tag, Popconfirm } from 'antd';
import { CreditCardOutlined, PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GerenciamentoCartoes = ({ onCardSaved, onCardDeleted }) => {
  const [cartoes, setCartoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarCartoes();
  }, []);

  const carregarCartoes = () => {
    const cartoesStorage = localStorage.getItem('cartoes');
    if (cartoesStorage) {
      setCartoes(JSON.parse(cartoesStorage));
    }
  };

  const salvarCartoes = (novosCartoes) => {
    localStorage.setItem('cartoes', JSON.stringify(novosCartoes));
    setCartoes(novosCartoes);
  };

  const handleSaveCard = async (values) => {
    setLoading(true);
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novoCartao = {
        id: editingCard ? editingCard.id : 'card_' + Date.now(),
        numero: values.numero,
        nome: values.nome,
        validade: values.validade,
        cvv: values.cvv,
        // Mascarar número do cartão para exibição
        numeroMascarado: '**** **** **** ' + values.numero.slice(-4),
        bandeira: detectarBandeira(values.numero),
        principal: cartoes.length === 0 || values.principal,
        dataCadastro: editingCard ? editingCard.dataCadastro : new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };
      
      let novosCartoes;
      if (editingCard) {
        novosCartoes = cartoes.map(cartao => 
          cartao.id === editingCard.id ? novoCartao : cartao
        );
        message.success('Cartão atualizado com sucesso!');
      } else {
        // Se for o primeiro cartão ou marcado como principal, desmarcar outros
        if (novoCartao.principal) {
          novosCartoes = cartoes.map(cartao => ({ ...cartao, principal: false }));
          novosCartoes.push(novoCartao);
        } else {
          novosCartoes = [...cartoes, novoCartao];
        }
        message.success('Cartão cadastrado com sucesso!');
      }
      
      salvarCartoes(novosCartoes);
      
      if (onCardSaved) {
        onCardSaved(novoCartao);
      }
      
      setModalVisible(false);
      setEditingCard(null);
      form.resetFields();
    } catch {
      message.error('Erro ao salvar cartão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cartaoId) => {
    try {
      const novosCartoes = cartoes.filter(cartao => cartao.id !== cartaoId);
      
      // Se o cartão deletado era o principal e há outros cartões, tornar o primeiro como principal
      if (novosCartoes.length > 0) {
        const cartaoDeletado = cartoes.find(c => c.id === cartaoId);
        if (cartaoDeletado && cartaoDeletado.principal) {
          novosCartoes[0].principal = true;
        }
      }
      
      salvarCartoes(novosCartoes);
      
      if (onCardDeleted) {
        onCardDeleted(cartaoId);
      }
      
      message.success('Cartão removido com sucesso!');
    } catch {
      message.error('Erro ao remover cartão.');
    }
  };

  const handleEditCard = (cartao) => {
    setEditingCard(cartao);
    form.setFieldsValue({
      numero: cartao.numero,
      nome: cartao.nome,
      validade: cartao.validade,
      cvv: cartao.cvv,
      principal: cartao.principal
    });
    setModalVisible(true);
  };

  const detectarBandeira = (numero) => {
    const numeroLimpo = numero.replace(/\s/g, '');
    
    if (numeroLimpo.startsWith('4')) return 'Visa';
    if (numeroLimpo.startsWith('5') || numeroLimpo.startsWith('2')) return 'Mastercard';
    if (numeroLimpo.startsWith('3')) return 'American Express';
    if (numeroLimpo.startsWith('6')) return 'Discover';
    
    return 'Desconhecida';
  };

  const formatarNumeroCartao = (value) => {
    const numeroLimpo = value.replace(/\s/g, '');
    const grupos = numeroLimpo.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numeroLimpo;
  };

  const formatarValidade = (value) => {
    const valorLimpo = value.replace(/\D/g, '');
    if (valorLimpo.length >= 2) {
      return valorLimpo.substring(0, 2) + '/' + valorLimpo.substring(2, 4);
    }
    return valorLimpo;
  };

  const validarNumeroCartao = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Número do cartão é obrigatório'));
    }
    
    const numeroLimpo = value.replace(/\s/g, '');
    if (numeroLimpo.length < 13 || numeroLimpo.length > 19) {
      return Promise.reject(new Error('Número do cartão inválido'));
    }
    
    return Promise.resolve();
  };

  const validarValidade = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Validade é obrigatória'));
    }
    
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) {
      return Promise.reject(new Error('Formato inválido (MM/AA)'));
    }
    
    const [mes, ano] = value.split('/');
    const dataValidade = new Date(2000 + parseInt(ano), parseInt(mes) - 1);
    const hoje = new Date();
    
    if (dataValidade < hoje) {
      return Promise.reject(new Error('Cartão vencido'));
    }
    
    return Promise.resolve();
  };

  const getBandeiraColor = (bandeira) => {
    switch (bandeira) {
      case 'Visa': return '#1A1F71';
      case 'Mastercard': return '#EB001B';
      case 'American Express': return '#006FCF';
      default: return '#666';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3}>Meus Cartões</Title>
          <Text type="secondary">Gerencie seus métodos de pagamento</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCard(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Adicionar Cartão
        </Button>
      </div>

      {cartoes.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <CreditCardOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">Nenhum cartão cadastrado</Title>
          <Text type="secondary">Adicione um cartão para começar a usar nossos serviços</Text>
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          dataSource={cartoes}
          renderItem={(cartao) => (
            <List.Item>
              <Card
                style={{
                  background: cartao.principal 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none'
                }}
                bodyStyle={{ padding: '20px' }}
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditCard(cartao)}
                    style={{ color: 'white' }}
                  />,
                  <Popconfirm
                    title="Remover cartão"
                    description="Tem certeza que deseja remover este cartão?"
                    onConfirm={() => handleDeleteCard(cartao.id)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      style={{ color: 'white' }}
                    />
                  </Popconfirm>
                ]}
              >
                <div style={{ marginBottom: '16px' }}>
                  {cartao.principal && (
                    <Tag color="gold" style={{ marginBottom: '8px' }}>PRINCIPAL</Tag>
                  )}
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {cartao.numeroMascarado}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    {cartao.nome}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Validade</div>
                    <div style={{ fontSize: '14px' }}>{cartao.validade}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      color: getBandeiraColor(cartao.bandeira)
                    }}>
                      {cartao.bandeira}
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={editingCard ? 'Editar Cartão' : 'Adicionar Cartão'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCard(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCard}
          size="large"
        >
          <Form.Item
            name="numero"
            label="Número do Cartão"
            rules={[{ validator: validarNumeroCartao }]}
          >
            <Input
              prefix={<CreditCardOutlined />}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              onChange={(e) => {
                const formatted = formatarNumeroCartao(e.target.value);
                form.setFieldsValue({ numero: formatted });
              }}
            />
          </Form.Item>

          <Form.Item
            name="nome"
            label="Nome no Cartão"
            rules={[
              { required: true, message: 'Nome é obrigatório' },
              { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
            ]}
          >
            <Input
              placeholder="Nome como impresso no cartão"
              style={{ textTransform: 'uppercase' }}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="validade"
              label="Validade"
              rules={[{ validator: validarValidade }]}
              style={{ flex: 1 }}
            >
              <Input
                placeholder="MM/AA"
                maxLength={5}
                onChange={(e) => {
                  const formatted = formatarValidade(e.target.value);
                  form.setFieldsValue({ validade: formatted });
                }}
              />
            </Form.Item>

            <Form.Item
              name="cvv"
              label="CVV"
              rules={[
                { required: true, message: 'CVV é obrigatório' },
                { pattern: /^\d{3,4}$/, message: 'CVV deve ter 3 ou 4 dígitos' }
              ]}
              style={{ flex: 1 }}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="123"
                maxLength={4}
                type="password"
              />
            </Form.Item>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button
              onClick={() => {
                setModalVisible(false);
                setEditingCard(null);
                form.resetFields();
              }}
              style={{ flex: 1 }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ flex: 1 }}
            >
              {editingCard ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default GerenciamentoCartoes;