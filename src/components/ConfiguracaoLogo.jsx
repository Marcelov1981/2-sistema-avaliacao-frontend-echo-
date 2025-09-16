import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Row, Col, Slider, Select, message, Space, Typography, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ConfiguracaoLogo = ({ isOpen, onClose }) => {
  const [logoConfig, setLogoConfig] = useState({
    logoUrl: localStorage.getItem('logoUrl') || '',
    logoSize: parseInt(localStorage.getItem('logoSize')) || 100,
    logoPosition: localStorage.getItem('logoPosition') || 'top-right',
    logoOpacity: parseInt(localStorage.getItem('logoOpacity')) || 100
  });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = {
      logoUrl: localStorage.getItem('logoUrl') || '',
      logoSize: parseInt(localStorage.getItem('logoSize')) || 100,
      logoPosition: localStorage.getItem('logoPosition') || 'top-right',
      logoOpacity: parseInt(localStorage.getItem('logoOpacity')) || 100
    };
    setLogoConfig(savedConfig);
  }, []);

  const handleUpload = (file) => {
    setUploading(true);
    
    // Validar tipo de arquivo
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Você só pode fazer upload de arquivos de imagem!');
      setUploading(false);
      return false;
    }

    // Validar tamanho (máximo 2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('A imagem deve ter menos de 2MB!');
      setUploading(false);
      return false;
    }

    // Converter para base64 e salvar
    const reader = new FileReader();
    reader.onload = (e) => {
      const logoUrl = e.target.result;
      const newConfig = { ...logoConfig, logoUrl };
      setLogoConfig(newConfig);
      localStorage.setItem('logoUrl', logoUrl);
      message.success('Logo carregada com sucesso!');
      setUploading(false);
    };
    reader.readAsDataURL(file);
    
    return false; // Previne upload automático
  };

  const handleConfigChange = (key, value) => {
    const newConfig = { ...logoConfig, [key]: value };
    setLogoConfig(newConfig);
    localStorage.setItem(key, value.toString());
  };

  const handleRemoveLogo = () => {
    setLogoConfig({ ...logoConfig, logoUrl: '' });
    localStorage.removeItem('logoUrl');
    message.success('Logo removida com sucesso!');
  };

  const positionOptions = [
    { value: 'top-left', label: 'Superior Esquerda' },
    { value: 'top-center', label: 'Superior Centro' },
    { value: 'top-right', label: 'Superior Direita' },
    { value: 'center-left', label: 'Centro Esquerda' },
    { value: 'center', label: 'Centro' },
    { value: 'center-right', label: 'Centro Direita' },
    { value: 'bottom-left', label: 'Inferior Esquerda' },
    { value: 'bottom-center', label: 'Inferior Centro' },
    { value: 'bottom-right', label: 'Inferior Direita' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={3}>Configuração de Logomarca</Title>
          <Button onClick={onClose}>Fechar</Button>
        </div>

        <Row gutter={[24, 24]}>
          {/* Upload da Logo */}
          <Col span={12}>
            <Card title="Upload da Logomarca" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Selecionar Logo
                  </Button>
                </Upload>
                
                {logoConfig.logoUrl && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Text strong>Logo Atual:</Text>
                      <Button 
                        size="small" 
                        icon={<EyeOutlined />}
                        onClick={() => setPreviewVisible(true)}
                      >
                        Visualizar
                      </Button>
                      <Button 
                        size="small" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveLogo}
                      >
                        Remover
                      </Button>
                    </div>
                    <Image
                      width={100}
                      height={60}
                      src={logoConfig.logoUrl}
                      style={{ objectFit: 'contain', border: '1px solid #d9d9d9' }}
                      preview={{
                        visible: previewVisible,
                        onVisibleChange: setPreviewVisible
                      }}
                    />
                  </div>
                )}
              </Space>
            </Card>
          </Col>

          {/* Configurações */}
          <Col span={12}>
            <Card title="Configurações de Exibição" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* Posição */}
                <div>
                  <Text strong>Posição no Relatório:</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={logoConfig.logoPosition}
                    onChange={(value) => handleConfigChange('logoPosition', value)}
                  >
                    {positionOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Tamanho */}
                <div>
                  <Text strong>Tamanho ({logoConfig.logoSize}px):</Text>
                  <Slider
                    min={50}
                    max={200}
                    value={logoConfig.logoSize}
                    onChange={(value) => handleConfigChange('logoSize', value)}
                    marks={{
                      50: '50px',
                      100: '100px',
                      150: '150px',
                      200: '200px'
                    }}
                  />
                </div>

                {/* Opacidade */}
                <div>
                  <Text strong>Opacidade ({logoConfig.logoOpacity}%):</Text>
                  <Slider
                    min={10}
                    max={100}
                    value={logoConfig.logoOpacity}
                    onChange={(value) => handleConfigChange('logoOpacity', value)}
                    marks={{
                      10: '10%',
                      50: '50%',
                      100: '100%'
                    }}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Preview */}
          <Col span={24}>
            <Card title="Visualização" size="small">
              <div 
                className="border-2 border-dashed border-gray-300 p-8 relative"
                style={{ height: '300px', backgroundColor: '#f9f9f9' }}
              >
                <div className="text-center text-gray-500 mb-4">
                  <Text>Preview do Relatório</Text>
                </div>
                
                {logoConfig.logoUrl && (
                  <img
                    src={logoConfig.logoUrl}
                    alt="Logo Preview"
                    style={{
                      position: 'absolute',
                      width: `${logoConfig.logoSize}px`,
                      height: 'auto',
                      opacity: logoConfig.logoOpacity / 100,
                      ...getPositionStyles(logoConfig.logoPosition)
                    }}
                  />
                )}
                
                <div className="text-center mt-8">
                  <Title level={4}>RELATÓRIO DE AVALIAÇÃO</Title>
                  <Text>Conteúdo do relatório apareceria aqui...</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// Função auxiliar para calcular posição da logo
const getPositionStyles = (position) => {
  const styles = {};
  
  switch (position) {
    case 'top-left':
      styles.top = '10px';
      styles.left = '10px';
      break;
    case 'top-center':
      styles.top = '10px';
      styles.left = '50%';
      styles.transform = 'translateX(-50%)';
      break;
    case 'top-right':
      styles.top = '10px';
      styles.right = '10px';
      break;
    case 'center-left':
      styles.top = '50%';
      styles.left = '10px';
      styles.transform = 'translateY(-50%)';
      break;
    case 'center':
      styles.top = '50%';
      styles.left = '50%';
      styles.transform = 'translate(-50%, -50%)';
      break;
    case 'center-right':
      styles.top = '50%';
      styles.right = '10px';
      styles.transform = 'translateY(-50%)';
      break;
    case 'bottom-left':
      styles.bottom = '10px';
      styles.left = '10px';
      break;
    case 'bottom-center':
      styles.bottom = '10px';
      styles.left = '50%';
      styles.transform = 'translateX(-50%)';
      break;
    case 'bottom-right':
      styles.bottom = '10px';
      styles.right = '10px';
      break;
    default:
      styles.top = '10px';
      styles.right = '10px';
  }
  
  return styles;
};

export default ConfiguracaoLogo;