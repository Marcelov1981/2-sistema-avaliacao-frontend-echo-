import React, { useState, useRef } from 'react';
import ImageAnalysis from '../utils/ImageAnalysis';

const ImageComparison = ({ visible, onClose, onAnalysisComplete }) => {
  const [webscrapingImages, setWebscrapingImages] = useState([]);
  const [databaseImages, setDatabaseImages] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentComparison, setCurrentComparison] = useState(null);
  const [selectedWebImages, setSelectedWebImages] = useState([]);
  const [selectedDbImages, setSelectedDbImages] = useState([]);
  
  const imageAnalysis = useRef(new ImageAnalysis());

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1001,
      display: visible ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '95vw',
      height: '90vh',
      overflow: 'auto',
      padding: '24px'
    },
    button: {
      backgroundColor: '#1890ff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      marginRight: '8px'
    },
    buttonSecondary: {
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      marginRight: '8px'
    },
    uploadArea: {
      border: '2px dashed #d9d9d9',
      borderRadius: '8px',
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: '#fafafa',
      cursor: 'pointer',
      transition: 'border-color 0.3s'
    },
    uploadAreaHover: {
      borderColor: '#1890ff'
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '16px',
      marginTop: '16px'
    },
    imageCard: {
      border: '1px solid #d9d9d9',
      borderRadius: '8px',
      padding: '8px',
      backgroundColor: 'white'
    },
    imagePreview: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    selectedImage: {
      border: '2px solid #1890ff'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#1890ff',
      transition: 'width 0.3s'
    }
  };

  // Função para lidar com upload de arquivos
  const handleFileUpload = (files, type) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Apenas arquivos de imagem são permitidos!');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: e.target.result,
          file: file,
          source: type
        };
        
        if (type === 'webscraping') {
          setWebscrapingImages(prev => [...prev, newImage]);
        } else {
          setDatabaseImages(prev => [...prev, newImage]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Componente de upload
  const UploadArea = ({ title, onUpload, images, type }) => {
    const [dragOver, setDragOver] = useState(false);
    
    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      onUpload(e.dataTransfer.files, type);
    };
    
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOver(true);
    };
    
    const handleDragLeave = () => {
      setDragOver(false);
    };
    
    const handleFileSelect = (e) => {
      onUpload(e.target.files, type);
    };
    
    return (
      <div style={{ marginBottom: '24px' }}>
        <h3>{title}</h3>
        <div
          style={{
            ...styles.uploadArea,
            ...(dragOver ? styles.uploadAreaHover : {})
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById(`file-input-${type}`).click()}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📤</div>
          <p>Clique ou arraste imagens aqui</p>
          <p style={{ fontSize: '12px', color: '#666' }}>Suporta: JPG, PNG, WebP</p>
          <input
            id={`file-input-${type}`}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>
        
        {images.length > 0 && (
          <div style={styles.imageGrid}>
            {images.map(image => (
              <div
                key={image.id}
                style={{
                  ...styles.imageCard,
                  ...((type === 'webscraping' && selectedWebImages.some(img => img.id === image.id)) || 
                      (type === 'database' && selectedDbImages.some(img => img.id === image.id)) ? styles.selectedImage : {})
                }}
                onClick={() => {
                  if (type === 'webscraping') {
                    setSelectedWebImages(prev => {
                      const isSelected = prev.some(img => img.id === image.id);
                      if (isSelected) {
                        return prev.filter(img => img.id !== image.id);
                      } else {
                        return [...prev, image];
                      }
                    });
                  } else {
                    setSelectedDbImages(prev => {
                      const isSelected = prev.some(img => img.id === image.id);
                      if (isSelected) {
                        return prev.filter(img => img.id !== image.id);
                      } else {
                        return [...prev, image];
                      }
                    });
                  }
                }}
              >
                <img src={image.url} alt={image.name} style={styles.imagePreview} />
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', textAlign: 'center' }}>
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Executar análise completa
  const executeAnalysis = async () => {
    if (webscrapingImages.length === 0 || databaseImages.length === 0) {
      alert('Adicione imagens em ambas as categorias antes de executar a análise.');
      return;
    }

    setLoading(true);
    try {
      console.log('Executando análise completa com:', {
        webImages: webscrapingImages.length,
        dbImages: databaseImages.length
      });
      
      const results = await imageAnalysis.current.compareImageSets(
        webscrapingImages,
        databaseImages
      );
      
      console.log('Resultados da análise completa:', results);
      setAnalysisResults(results);
      
      // Chamar callback com os resultados
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      alert('Erro ao executar análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Comparar imagens selecionadas
  const compareSpecificImages = async () => {
    if (selectedWebImages.length === 0 || selectedDbImages.length === 0) {
      alert('Selecione pelo menos uma imagem de cada tipo para comparar.');
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando comparação com:', {
        webImages: selectedWebImages.length,
        dbImages: selectedDbImages.length
      });
      
      const results = await imageAnalysis.current.compareImageSets(
        selectedWebImages,
        selectedDbImages
      );
      
      console.log('Resultados da comparação:', results);
      setCurrentComparison(results);
      alert('Comparação concluída!');
    } catch (error) {
      console.error('Erro na comparação:', error);
      alert('Erro ao comparar imagens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Limpar dados
  const clearAll = () => {
    setWebscrapingImages([]);
    setDatabaseImages([]);
    setAnalysisResults(null);
    setCurrentComparison(null);
    setSelectedWebImages([]);
    setSelectedDbImages([]);
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0 }}>Comparação de Imagens</h2>
            <p style={{ margin: 0, color: '#666' }}>Análise comparativa entre imagens de webscraping e banco de dados</p>
          </div>
          <div>
            <button style={styles.buttonSecondary} onClick={clearAll}>Limpar Tudo</button>
            <button style={styles.buttonSecondary} onClick={onClose}>Fechar</button>
          </div>
        </div>

        {/* Área de Upload */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <UploadArea
            title="Imagens de Webscraping"
            onUpload={handleFileUpload}
            images={webscrapingImages}
            type="webscraping"
          />
          <UploadArea
            title="Imagens do Banco de Dados"
            onUpload={handleFileUpload}
            images={databaseImages}
            type="database"
          />
        </div>

        {/* Controles de Análise */}
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3>Controles de Análise</h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button 
              style={styles.button} 
              onClick={executeAnalysis}
              disabled={loading || webscrapingImages.length === 0 || databaseImages.length === 0}
            >
              {loading ? '⏳ Analisando...' : '🔍 Executar Análise Completa'}
            </button>
            
            <button 
              style={styles.button} 
              onClick={compareSpecificImages}
              disabled={loading || selectedWebImages.length === 0 || selectedDbImages.length === 0}
            >
              📊 Comparar Selecionadas ({selectedWebImages.length} vs {selectedDbImages.length})
            </button>
            
            <span style={{ color: '#666', fontSize: '14px' }}>
              {webscrapingImages.length} webscraping | {databaseImages.length} banco de dados
            </span>
          </div>
        </div>

        {/* Resultados da Análise */}
        {analysisResults && (
          <div style={{ backgroundColor: 'white', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <h3>Resultados da Análise Completa</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {analysisResults.summary?.averageQuality?.webscraping?.toFixed(1) || 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Qualidade Webscraping</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {analysisResults.summary?.averageQuality?.database?.toFixed(1) || 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Qualidade Database</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                  {analysisResults.comparisons?.length || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Comparações</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                  {analysisResults.summary?.bestMatches?.length || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Melhores Matches</div>
              </div>
            </div>
            
            {analysisResults.summary?.recommendations && analysisResults.summary.recommendations.length > 0 && (
              <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', padding: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#389e0d' }}>Recomendações:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {analysisResults.summary.recommendations.map((rec, index) => (
                    <li key={index} style={{ color: '#389e0d', fontSize: '14px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Resultados da Comparação */}
        {currentComparison && (
          <div style={{ backgroundColor: 'white', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '16px' }}>
            <h3>Resultados da Comparação</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                  {currentComparison.summary?.averageQuality?.webscraping?.toFixed(1) || 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Qualidade Webscraping</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                  {currentComparison.summary?.averageQuality?.database?.toFixed(1) || 0}%
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Qualidade Database</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>
                  {currentComparison.comparisons?.length || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Comparações</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1' }}>
                  {currentComparison.summary?.bestMatches?.length || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Melhores Matches</div>
              </div>
            </div>
            
            {currentComparison.summary?.recommendations && currentComparison.summary.recommendations.length > 0 && (
              <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', padding: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#389e0d' }}>Recomendações:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {currentComparison.summary.recommendations.map((rec, index) => (
                    <li key={index} style={{ color: '#389e0d', fontSize: '14px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageComparison;