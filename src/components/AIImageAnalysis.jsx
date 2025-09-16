import React, { useState } from 'react';
import GeminiService from '../utils/GeminiService';
import PDFGenerator from '../utils/PDFGenerator';
import SafariNotification from './SafariNotification.jsx';
import SafariCompatibility from '../utils/SafariCompatibility.js';

const AIImageAnalysis = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [images, setImages] = useState([]);
  const [databaseImages, setDatabaseImages] = useState([]);
  const [webscrapingImages, setWebscrapingImages] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisType, setAnalysisType] = useState('single'); // single, multiple, comparison
  const [propertyInfo, setPropertyInfo] = useState({
    endereco: '',
    cidade: '',
    tipo: '',
    areaTerreno: '',
    areaConstruida: '',
    finalidade: ''
  });

  // Manipula upload de imagens
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      setError('Apenas arquivos de imagem são permitidos.');
      return;
    }
    
    setImages(prev => [...prev, ...imageFiles]);
    setError('');
  };

  // Remove imagem
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDatabaseImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setDatabaseImages(prev => [...prev, ...files]);
  };

  const handleWebscrapingImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setWebscrapingImages(prev => [...prev, ...files]);
  };

  const removeDatabaseImage = (index) => {
    setDatabaseImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeWebscrapingImage = (index) => {
    setWebscrapingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Limpa todas as imagens
  const clearImages = () => {
    setImages([]);
    setAnalysisResult(null);
    setError('');
  };

  // Manipula mudanças nas informações do imóvel
  const handlePropertyInfoChange = (field, value) => {
    setPropertyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Executa análise
  const runAnalysis = async () => {
    if (images.length === 0) {
      setError('Selecione pelo menos uma imagem para análise.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      let result;
      
      if (analysisType === 'single' && images.length > 0) {
        result = await GeminiService.analyzeImage(images[0], customPrompt);
      } else if (analysisType === 'multiple') {
        result = await GeminiService.analyzeMultipleImages(images, customPrompt);
      } else if (analysisType === 'comparison' && images.length >= 2) {
        const midPoint = Math.ceil(images.length / 2);
        const images1 = images.slice(0, midPoint);
        const images2 = images.slice(midPoint);
        result = await GeminiService.comparePropertyImages(images1, images2, customPrompt);
      } else {
        setError('Configuração inválida para o tipo de análise selecionado.');
        setLoading(false);
        return;
      }

      if (result.success) {
        setAnalysisResult({
          ...result,
          propertyInfo,
          images: images.map(img => ({
            name: img.name,
            size: img.size,
            type: img.type
          }))
        });
      } else {
        if (result.error && result.error.includes('sobrecarregado')) {
          setError('⚠️ O modelo de IA está temporariamente sobrecarregado. Tente novamente em alguns minutos.');
        } else {
          setError(result.error || 'Erro na análise das imagens.');
        }
      }
    } catch (err) {
      setError('Erro inesperado durante a análise.');
      console.error('Erro na análise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComparison = async () => {
    if (databaseImages.length === 0 || webscrapingImages.length === 0) {
      setError('Por favor, adicione pelo menos uma imagem em cada seção.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const prompt = customPrompt || `
        Compare as imagens do banco de dados com as imagens de webscraping e forneça uma análise detalhada sobre:
        
        1. SIMILARIDADE VISUAL:
        - Percentual de similaridade entre as propriedades
        - Características arquitetônicas em comum
        - Diferenças estruturais identificadas
        
        2. QUALIDADE DAS IMAGENS:
        - Resolução e nitidez das imagens do banco vs webscraping
        - Ângulos e perspectivas utilizadas
        - Iluminação e condições de captura
        
        3. AUTENTICIDADE:
        - Indicadores de que as imagens são da mesma propriedade
        - Elementos únicos que confirmam ou negam a correspondência
        - Possíveis sinais de edição ou manipulação
        
        4. AVALIAÇÃO DE VALOR:
        - Consistência na apresentação da propriedade
        - Impacto das diferenças no valor percebido
        - Recomendações para verificação adicional
        
        5. CONCLUSÃO:
        - Probabilidade de serem da mesma propriedade (0-100%)
        - Nível de confiança na análise
        - Próximos passos recomendados
      `;

      const result = await GeminiService.comparePropertyImages(
        databaseImages,
        webscrapingImages,
        prompt
      );

      if (result.success) {
        setComparisonResult({
          analysis: result.comparison,
          timestamp: result.timestamp,
          databaseImageCount: result.property1ImageCount,
          webscrapingImageCount: result.property2ImageCount
        });
      } else {
        if (result.error && result.error.includes('sobrecarregado')) {
          setError('⚠️ O modelo de IA está temporariamente sobrecarregado. Tente novamente em alguns minutos.');
        } else {
          setError(result.error || 'Erro na comparação das imagens.');
        }
      }
    } catch (err) {
      setError(`Erro inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Gera e baixa PDF
  const generatePDF = async () => {
    if (activeTab === 'analysis' && !analysisResult) {
      setError('Nenhuma análise disponível para gerar PDF.');
      return;
    }
    
    if (activeTab === 'comparison' && !comparisonResult) {
      setError('Nenhuma comparação disponível para gerar PDF.');
      return;
    }

    // Mostra instruções específicas para Safari se necessário
    if (SafariCompatibility.isSafari() && !SafariCompatibility.supportsAutomaticDownloads()) {
      SafariCompatibility.showSafariInstructions('baixar o relatório PDF');
    }

    try {
      const pdfGenerator = new PDFGenerator();
      
      if (activeTab === 'analysis') {
        await pdfGenerator.generateAnalysisReport({
          propertyInfo,
          analysis: analysisResult.analysis,
          images,
          timestamp: analysisResult.timestamp
        });
      } else {
        await pdfGenerator.generateComparisonReport({
          propertyInfo,
          analysis: comparisonResult.analysis,
          databaseImages,
          webscrapingImages,
          timestamp: comparisonResult.timestamp
        });
      }
    } catch (err) {
      setError(`Erro ao gerar PDF: ${err.message}`);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '20px',
      textAlign: 'center'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical'
    },
    fileInput: {
      width: '100%',
      padding: '12px',
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.2s'
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '12px',
      marginTop: '12px'
    },
    imageItem: {
      position: 'relative',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '8px',
      textAlign: 'center'
    },
    removeButton: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none'
    },
    primaryButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#6b7280',
      color: 'white'
    },
    dangerButton: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    resultCard: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px'
    },
    resultText: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#374151',
      whiteSpace: 'pre-wrap'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <SafariNotification 
        action="gerar relatórios PDF e fazer upload de imagens"
        showOnMount={true}
        autoHide={true}
      />
      <div style={styles.card}>
        <h1 style={styles.title}>Análise de Imóveis com IA</h1>
        
        <div className="tab-navigation" style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
          <button 
            style={{
              ...styles.button,
              ...(activeTab === 'analysis' ? styles.primaryButton : styles.secondaryButton),
              padding: '8px 16px'
            }}
            onClick={() => setActiveTab('analysis')}
          >
            📊 Análise Simples
          </button>
          <button 
            style={{
              ...styles.button,
              ...(activeTab === 'comparison' ? styles.primaryButton : styles.secondaryButton),
              padding: '8px 16px'
            }}
            onClick={() => setActiveTab('comparison')}
          >
            🔍 Comparação de Imagens
          </button>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        
        {activeTab === 'analysis' && (
          <>
            {/* Configuração do tipo de análise */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Tipo de Análise</h3>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                style={styles.select}
              >
                <option value="single">Análise de Imagem Única</option>
                <option value="multiple">Análise de Múltiplas Imagens</option>
              </select>
            </div>

            {/* Informações do imóvel */}
            <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Informações do Imóvel (Opcional)</h3>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Endereço</label>
              <input
                type="text"
                value={propertyInfo.endereco}
                onChange={(e) => handlePropertyInfoChange('endereco', e.target.value)}
                style={styles.input}
                placeholder="Endereço completo do imóvel"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Cidade</label>
              <input
                type="text"
                value={propertyInfo.cidade}
                onChange={(e) => handlePropertyInfoChange('cidade', e.target.value)}
                style={styles.input}
                placeholder="Cidade"
              />
            </div>
          </div>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tipo de Imóvel</label>
              <select
                value={propertyInfo.tipo}
                onChange={(e) => handlePropertyInfoChange('tipo', e.target.value)}
                style={styles.select}
              >
                <option value="">Selecione o tipo</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Finalidade</label>
              <select
                value={propertyInfo.finalidade}
                onChange={(e) => handlePropertyInfoChange('finalidade', e.target.value)}
                style={styles.select}
              >
                <option value="">Selecione a finalidade</option>
                <option value="Compra e Venda">Compra e Venda</option>
                <option value="Financiamento">Financiamento</option>
                <option value="Seguro">Seguro</option>
                <option value="Locação">Locação</option>
                <option value="Judicial">Judicial</option>
              </select>
            </div>
          </div>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Área do Terreno (m²)</label>
              <input
                type="number"
                value={propertyInfo.areaTerreno}
                onChange={(e) => handlePropertyInfoChange('areaTerreno', e.target.value)}
                style={styles.input}
                placeholder="Área do terreno"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Área Construída (m²)</label>
              <input
                type="number"
                value={propertyInfo.areaConstruida}
                onChange={(e) => handlePropertyInfoChange('areaConstruida', e.target.value)}
                style={styles.input}
                placeholder="Área construída"
              />
            </div>
          </div>
        </div>

            {/* Upload de imagens */}
            <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Imagens para Análise</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Selecionar Imagens</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.fileInput}
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
              {analysisType === 'single' && 'Selecione uma imagem para análise.'}
              {analysisType === 'multiple' && 'Selecione múltiplas imagens do mesmo imóvel.'}
              {analysisType === 'comparison' && 'Selecione imagens de dois imóveis diferentes (serão divididas automaticamente).'}
            </p>
          </div>
          
          {images.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {images.length} imagem(ns) selecionada(s)
                </span>
                <button
                  onClick={clearImages}
                  style={{ ...styles.button, ...styles.dangerButton, padding: '6px 12px', fontSize: '12px' }}
                >
                  Limpar Todas
                </button>
              </div>
              
              <div style={styles.imageGrid}>
                {images.map((image, index) => (
                  <div key={index} style={styles.imageItem}>
                    <button
                      onClick={() => removeImage(index)}
                      style={styles.removeButton}
                    >
                      ×
                    </button>
                    <div style={{ fontSize: '12px', color: '#6b7280', wordBreak: 'break-word' }}>
                      {image.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

            {/* Prompt personalizado */}
            <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Prompt Personalizado (Opcional)</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Instruções Específicas para a IA</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              style={styles.textarea}
              placeholder="Digite instruções específicas para a análise. Deixe em branco para usar o prompt padrão otimizado para análise de imóveis."
            />
          </div>
        </div>

            {/* Botões de ação */}
            <div style={styles.buttonGroup}>
              <button
                onClick={runAnalysis}
                disabled={loading || images.length === 0}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  opacity: loading || images.length === 0 ? 0.6 : 1
                }}
              >
                {loading ? 'Analisando...' : 'Iniciar Análise'}
              </button>
              
              {analysisResult && (
                <button
                  onClick={generatePDF}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Gerar PDF
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === 'comparison' && (
          <>
            {/* Seção de imagens do banco de dados */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Imagens do Banco de Dados</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Selecionar Imagens do Banco</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleDatabaseImageUpload}
                  style={styles.fileInput}
                />
              </div>
              
              {databaseImages.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {databaseImages.length} imagem(ns) do banco
                    </span>
                    <button
                      onClick={() => setDatabaseImages([])}
                      style={{ ...styles.button, ...styles.dangerButton, padding: '6px 12px', fontSize: '12px' }}
                    >
                      Limpar
                    </button>
                  </div>
                  
                  <div style={styles.imageGrid}>
                    {databaseImages.map((image, index) => (
                      <div key={index} style={styles.imageItem}>
                        <button
                          onClick={() => removeDatabaseImage(index)}
                          style={styles.removeButton}
                        >
                          ×
                        </button>
                        <div style={{ fontSize: '12px', color: '#6b7280', wordBreak: 'break-word' }}>
                          {image.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seção de imagens de webscraping */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Imagens de Webscraping</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Selecionar Imagens de Webscraping</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleWebscrapingImageUpload}
                  style={styles.fileInput}
                />
              </div>
              
              {webscrapingImages.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {webscrapingImages.length} imagem(ns) de webscraping
                    </span>
                    <button
                      onClick={() => setWebscrapingImages([])}
                      style={{ ...styles.button, ...styles.dangerButton, padding: '6px 12px', fontSize: '12px' }}
                    >
                      Limpar
                    </button>
                  </div>
                  
                  <div style={styles.imageGrid}>
                    {webscrapingImages.map((image, index) => (
                      <div key={index} style={styles.imageItem}>
                        <button
                          onClick={() => removeWebscrapingImage(index)}
                          style={styles.removeButton}
                        >
                          ×
                        </button>
                        <div style={{ fontSize: '12px', color: '#6b7280', wordBreak: 'break-word' }}>
                          {image.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt personalizado para comparação */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Prompt Personalizado (Opcional)</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Instruções Específicas para Comparação</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  style={styles.textarea}
                  placeholder="Digite instruções específicas para a comparação. Deixe em branco para usar o prompt padrão otimizado para comparação de imóveis."
                />
              </div>
            </div>

            {/* Botões de ação para comparação */}
            <div style={styles.buttonGroup}>
              <button
                onClick={handleComparison}
                disabled={loading || databaseImages.length === 0 || webscrapingImages.length === 0}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  opacity: loading || databaseImages.length === 0 || webscrapingImages.length === 0 ? 0.6 : 1
                }}
              >
                {loading ? 'Comparando...' : 'Iniciar Comparação'}
              </button>
              
              {comparisonResult && (
                <button
                  onClick={generatePDF}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Gerar PDF
                </button>
              )}
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div style={styles.loading}>
            <div>🤖 Analisando imagens com IA...</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>Isso pode levar alguns segundos</div>
          </div>
        )}

        {/* Resultado da análise */}
        {analysisResult && activeTab === 'analysis' && (
          <div style={styles.resultCard}>
            <h3 style={styles.sectionTitle}>Resultado da Análise</h3>
            <div style={styles.resultText}>
              {analysisResult.analysis || analysisResult.comparison}
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
              Análise realizada em: {new Date(analysisResult.timestamp).toLocaleString('pt-BR')}
            </div>
          </div>
        )}

        {/* Resultado da comparação */}
        {comparisonResult && activeTab === 'comparison' && (
          <div style={styles.resultCard}>
            <h3 style={styles.sectionTitle}>Resultado da Comparação</h3>
            <div style={styles.resultText}>
              {comparisonResult.analysis}
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
              <div>Comparação realizada em: {new Date(comparisonResult.timestamp).toLocaleString('pt-BR')}</div>
              <div>Imagens do banco: {comparisonResult.databaseImageCount}</div>
              <div>Imagens de webscraping: {comparisonResult.webscrapingImageCount}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIImageAnalysis;