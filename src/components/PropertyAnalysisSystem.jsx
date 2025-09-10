import React, { useState } from 'react';
import ImageComparison from './ImageComparison';
import PropertyComparisonReport from './PropertyComparisonReport';

const PropertyAnalysisSystem = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading] = useState(false);
  const [comparisonVisible, setComparisonVisible] = useState(false);

  const steps = [
    {
      title: 'Upload de Imagens',
      description: 'Carregue imagens de webscraping e banco de dados',
      icon: '📤'
    },
    {
      title: 'Análise Comparativa',
      description: 'Execute a comparação e análise das imagens',
      icon: '🔍'
    },
    {
      title: 'Relatório de Avaliação',
      description: 'Visualize o relatório completo de avaliação',
      icon: '📊'
    }
  ];

  // Função chamada quando a análise é concluída no ImageComparison
  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setCurrentStep(2);
    setComparisonVisible(false);
    alert('Análise concluída! Relatório gerado com sucesso.');
  };

  // Navegar para etapa anterior
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Navegar para próxima etapa
  const goToNextStep = () => {
    if (currentStep === 0) {
      setComparisonVisible(true);
      setCurrentStep(1);
    } else if (currentStep === 1 && analysisData) {
      setCurrentStep(2);
    }
  };

  // Reiniciar processo
  const resetAnalysis = () => {
    setCurrentStep(0);
    setAnalysisData(null);
    setComparisonVisible(false);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: visible ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      backgroundColor: '#f5f5f5',
      width: '90vw',
      height: '90vh',
      borderRadius: '8px',
      overflow: 'auto',
      padding: '24px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
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
    stepContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    step: {
      flex: 1,
      textAlign: 'center',
      padding: '16px',
      position: 'relative'
    },
    stepActive: {
      color: '#1890ff'
    },
    stepCompleted: {
      color: '#52c41a'
    },
    stepIcon: {
      fontSize: '24px',
      marginBottom: '8px'
    },
    stepTitle: {
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    stepDescription: {
      fontSize: '12px',
      color: '#666'
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={styles.card}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={styles.stepIcon}>📤</div>
              <h3>Preparação para Análise</h3>
              <p style={{ marginBottom: 24, color: '#666' }}>
                Nesta etapa você irá carregar as imagens de webscraping e do banco de dados 
                para realizar a comparação e análise de valor do imóvel.
              </p>
              <ul style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto 24px' }}>
                <li>Carregue imagens obtidas por webscraping</li>
                <li>Adicione imagens de referência do banco de dados</li>
                <li>O sistema suporta múltiplas imagens em cada categoria</li>
                <li>Formatos aceitos: JPG, PNG, WebP</li>
              </ul>
              <button style={styles.button} onClick={goToNextStep}>
                Iniciar Upload de Imagens
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div style={styles.card}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={styles.stepIcon}>🔍</div>
              <h3>Análise em Andamento</h3>
              <p style={{ marginBottom: 24, color: '#666' }}>
                Execute a comparação entre as imagens carregadas. O sistema irá analisar:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <h4>Qualidade das Imagens</h4>
                  <p>Resolução, nitidez, brilho e contraste</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <h4>Similaridade Visual</h4>
                  <p>Correspondência entre imagens</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <h4>Apelo Visual</h4>
                  <p>Cores, iluminação e composição</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <h4>Consistência</h4>
                  <p>Uniformidade entre imagens</p>
                </div>
              </div>
              {!analysisData && (
                <button style={styles.button} onClick={() => setComparisonVisible(true)}>
                  Abrir Ferramenta de Comparação
                </button>
              )}
              {analysisData && (
                <div>
                  <span style={{ color: '#52c41a', fontWeight: 'bold' }}>✅ Análise Concluída!</span>
                  <br />
                  <button style={styles.button} onClick={goToNextStep}>
                    Ver Relatório de Avaliação
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div style={styles.card}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={styles.stepIcon}>📊</div>
              <h3>Relatório de Avaliação</h3>
              <p style={{ marginBottom: 24, color: '#666' }}>
                Visualize o relatório completo da análise comparativa realizada.
              </p>
              {analysisData && (
                <PropertyComparisonReport comparisonData={analysisData} />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Cabeçalho */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Sistema de Análise Comparativa de Imóveis</h2>
              <p style={{ margin: 0, color: '#666' }}>
                Análise inteligente de imagens para avaliação de valor imobiliário
              </p>
            </div>
            <div>
              <button style={styles.buttonSecondary} onClick={onClose}>Fechar</button>
              {currentStep > 0 && (
                <button style={styles.buttonSecondary} onClick={resetAnalysis}>Reiniciar</button>
              )}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={styles.card}>
          <div style={styles.stepContainer}>
            {steps.map((step, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.step,
                  ...(currentStep === index ? styles.stepActive : {}),
                  ...(currentStep > index ? styles.stepCompleted : {})
                }}
              >
                <div style={styles.stepIcon}>{step.icon}</div>
                <div style={styles.stepTitle}>{step.title}</div>
                <div style={styles.stepDescription}>{step.description}</div>
              </div>
            ))}
          </div>

          {/* Navegação */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {currentStep > 0 && (
                <button style={styles.buttonSecondary} onClick={goToPreviousStep}>Anterior</button>
              )}
            </div>
            <div>
              <span style={{ color: '#666' }}>Etapa {currentStep + 1} de {steps.length}</span>
            </div>
          </div>
        </div>

        {/* Conteúdo da Etapa */}
        {loading ? (
          <div style={styles.card}>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div>⏳ Processando análise...</div>
            </div>
          </div>
        ) : (
          renderStepContent()
        )}

        {/* Modal de Comparação de Imagens */}
        <ImageComparison
          visible={comparisonVisible}
          onClose={() => setComparisonVisible(false)}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    </div>
  );
};

export default PropertyAnalysisSystem;