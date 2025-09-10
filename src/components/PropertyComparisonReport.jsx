import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Alert, Statistic, Tag, Divider, Typography, Button, Space } from 'antd';
import { TrophyOutlined, WarningOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PropertyComparisonReport = ({ comparisonData, onExport }) => {
  const [reportData, setReportData] = useState(null);
  const [valueAnalysis, setValueAnalysis] = useState(null);

  useEffect(() => {
    if (comparisonData) {
      generateReport(comparisonData);
    }
  }, [comparisonData]);

  // Gera relatório completo de análise
  const generateReport = (data) => {
    const analysis = analyzePropertyValue(data);
    setReportData(analysis.report);
    setValueAnalysis(analysis.valueComparison);
  };

  // Analisa o valor do imóvel baseado nas características das imagens
  const analyzePropertyValue = (data) => {
    const { comparisons, bestMatch, averageSimilarity } = data;
    
    // Calcular scores de diferentes aspectos
    const qualityScore = calculateQualityScore(comparisons);
    const consistencyScore = calculateConsistencyScore(comparisons);
    const visualAppealScore = calculateVisualAppealScore(comparisons);
    const authenticityScore = calculateAuthenticityScore(comparisons);
    
    // Score geral do imóvel
    const overallScore = (qualityScore + consistencyScore + visualAppealScore + authenticityScore) / 4;
    
    // Análise de valor
    const valueAnalysis = generateValueAnalysis({
      qualityScore,
      consistencyScore,
      visualAppealScore,
      authenticityScore,
      overallScore,
      averageSimilarity,
      bestMatch
    });
    
    return {
      report: {
        timestamp: new Date().toISOString(),
        propertyId: `PROP_${Date.now()}`,
        scores: {
          quality: qualityScore,
          consistency: consistencyScore,
          visualAppeal: visualAppealScore,
          authenticity: authenticityScore,
          overall: overallScore
        },
        metrics: {
          totalComparisons: comparisons.length,
          averageSimilarity,
          bestMatchSimilarity: bestMatch.similarity
        }
      },
      valueComparison: valueAnalysis
    };
  };

  // Calcula score de qualidade das imagens
  const calculateQualityScore = (comparisons) => {
    if (!comparisons.length) return 0;
    
    const avgQuality = comparisons.reduce((sum, comp) => {
      const webQuality = comp.analysis.features.image1.qualityScore.overall;
      const dbQuality = comp.analysis.features.image2.qualityScore.overall;
      return sum + Math.max(webQuality, dbQuality); // Usar a melhor qualidade
    }, 0) / comparisons.length;
    
    return Math.round(avgQuality);
  };

  // Calcula score de consistência
  const calculateConsistencyScore = (comparisons) => {
    if (!comparisons.length) return 0;
    
    const avgSimilarity = comparisons.reduce((sum, comp) => sum + comp.similarity, 0) / comparisons.length;
    return Math.round(avgSimilarity);
  };

  // Calcula score de apelo visual
  const calculateVisualAppealScore = (comparisons) => {
    if (!comparisons.length) return 0;
    
    const avgColorfulness = comparisons.reduce((sum, comp) => {
      const webColor = comp.analysis.features.image1.colorAnalysis.colorfulness;
      const dbColor = comp.analysis.features.image2.colorAnalysis.colorfulness;
      return sum + Math.max(webColor, dbColor);
    }, 0) / comparisons.length;
    
    const avgBrightness = comparisons.reduce((sum, comp) => {
      const webBright = comp.analysis.features.image1.brightness;
      const dbBright = comp.analysis.features.image2.brightness;
      return sum + Math.max(webBright, dbBright);
    }, 0) / comparisons.length;
    
    // Score baseado em colorfulness e brightness ideal (não muito escuro, não muito claro)
    const colorScore = Math.min(avgColorfulness / 50 * 100, 100);
    const brightScore = 100 - Math.abs(avgBrightness - 128) / 128 * 100;
    
    return Math.round((colorScore + brightScore) / 2);
  };

  // Calcula score de autenticidade
  const calculateAuthenticityScore = (comparisons) => {
    if (!comparisons.length) return 0;
    
    // Baseado na consistência entre múltiplas imagens
    const varianceInSimilarity = calculateVariance(comparisons.map(c => c.similarity));
    const authenticityScore = Math.max(0, 100 - varianceInSimilarity);
    
    return Math.round(authenticityScore);
  };

  // Calcula variância
  const calculateVariance = (values) => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  // Gera análise de valor detalhada
  const generateValueAnalysis = (scores) => {
    const { qualityScore, consistencyScore, visualAppealScore, authenticityScore, overallScore } = scores;
    
    // Determinar categoria de valor
    let valueCategory, valueMultiplier, reasoning;
    
    if (overallScore >= 85) {
      valueCategory = 'Premium';
      valueMultiplier = 1.15;
      reasoning = 'Imóvel de alta qualidade com excelente apresentação visual e consistência nas imagens.';
    } else if (overallScore >= 70) {
      valueCategory = 'Alto Padrão';
      valueMultiplier = 1.08;
      reasoning = 'Imóvel bem apresentado com boa qualidade de imagens e características atrativas.';
    } else if (overallScore >= 55) {
      valueCategory = 'Padrão';
      valueMultiplier = 1.0;
      reasoning = 'Imóvel com apresentação adequada, sem características que justifiquem premium ou desconto.';
    } else if (overallScore >= 40) {
      valueCategory = 'Básico';
      valueMultiplier = 0.95;
      reasoning = 'Imóvel com apresentação simples, pode necessitar melhorias na qualidade das imagens.';
    } else {
      valueCategory = 'Atenção';
      valueMultiplier = 0.88;
      reasoning = 'Imóvel com problemas na apresentação visual que podem impactar negativamente o valor.';
    }
    
    // Fatores específicos que influenciam o valor
    const valueFactors = [];
    
    if (qualityScore >= 80) {
      valueFactors.push({
        factor: 'Alta Qualidade de Imagem',
        impact: '+3%',
        description: 'Imagens de alta resolução e nitidez aumentam a percepção de valor.'
      });
    }
    
    if (visualAppealScore >= 75) {
      valueFactors.push({
        factor: 'Excelente Apelo Visual',
        impact: '+5%',
        description: 'Cores vibrantes e boa iluminação tornam o imóvel mais atrativo.'
      });
    }
    
    if (consistencyScore >= 80) {
      valueFactors.push({
        factor: 'Alta Consistência',
        impact: '+2%',
        description: 'Imagens consistentes transmitem confiabilidade e profissionalismo.'
      });
    }
    
    if (authenticityScore < 60) {
      valueFactors.push({
        factor: 'Possível Inconsistência',
        impact: '-5%',
        description: 'Variações significativas entre imagens podem indicar problemas de autenticidade.'
      });
    }
    
    if (qualityScore < 50) {
      valueFactors.push({
        factor: 'Baixa Qualidade de Imagem',
        impact: '-8%',
        description: 'Imagens de baixa qualidade podem reduzir significativamente o interesse.'
      });
    }
    
    return {
      category: valueCategory,
      multiplier: valueMultiplier,
      reasoning,
      factors: valueFactors,
      recommendations: generateRecommendations(scores)
    };
  };

  // Gera recomendações específicas
  const generateRecommendations = (scores) => {
    const recommendations = [];
    
    if (scores.qualityScore < 70) {
      recommendations.push({
        type: 'warning',
        title: 'Melhore a Qualidade das Imagens',
        description: 'Utilize câmeras de maior resolução e garanta boa iluminação para aumentar o valor percebido.',
        priority: 'alta'
      });
    }
    
    if (scores.visualAppealScore < 60) {
      recommendations.push({
        type: 'info',
        title: 'Otimize o Apelo Visual',
        description: 'Considere melhor enquadramento, cores mais vibrantes e ambientes bem iluminados.',
        priority: 'média'
      });
    }
    
    if (scores.consistencyScore < 70) {
      recommendations.push({
        type: 'warning',
        title: 'Padronize as Imagens',
        description: 'Mantenha consistência no estilo, iluminação e qualidade entre todas as imagens.',
        priority: 'alta'
      });
    }
    
    if (scores.authenticityScore < 65) {
      recommendations.push({
        type: 'error',
        title: 'Verifique Autenticidade',
        description: 'Grandes variações podem indicar uso de imagens não originais ou editadas.',
        priority: 'crítica'
      });
    }
    
    if (scores.overallScore >= 80) {
      recommendations.push({
        type: 'success',
        title: 'Excelente Apresentação',
        description: 'Continue mantendo este padrão de qualidade para maximizar o valor do imóvel.',
        priority: 'baixa'
      });
    }
    
    return recommendations;
  };

  // Função para exportar relatório
  const handleExport = () => {
    const exportData = {
      report: reportData,
      valueAnalysis: valueAnalysis,
      exportDate: new Date().toISOString()
    };
    
    if (onExport) {
      onExport(exportData);
    } else {
      // Download como JSON
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-avaliacao-${reportData?.propertyId || 'property'}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!reportData || !valueAnalysis) {
    return (
      <Card>
        <Alert
          message="Nenhuma análise disponível"
          description="Execute uma comparação de imagens para gerar o relatório de avaliação."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Cabeçalho do Relatório */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>Relatório de Avaliação Imobiliária</Title>
            <Text type="secondary">ID: {reportData.propertyId}</Text>
            <br />
            <Text type="secondary">Gerado em: {new Date(reportData.timestamp).toLocaleString('pt-BR')}</Text>
          </Col>
          <Col>
            <Button type="primary" onClick={handleExport}>
              Exportar Relatório
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Scores Principais */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Score Geral"
              value={reportData.scores.overall}
              suffix="/100"
              valueStyle={{ color: reportData.scores.overall >= 70 ? '#3f8600' : reportData.scores.overall >= 50 ? '#faad14' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Qualidade"
              value={reportData.scores.quality}
              suffix="/100"
              valueStyle={{ color: reportData.scores.quality >= 70 ? '#3f8600' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Consistência"
              value={reportData.scores.consistency}
              suffix="/100"
              valueStyle={{ color: reportData.scores.consistency >= 70 ? '#3f8600' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Apelo Visual"
              value={reportData.scores.visualAppeal}
              suffix="/100"
              valueStyle={{ color: reportData.scores.visualAppeal >= 70 ? '#3f8600' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Análise de Valor */}
      <Card title="Análise de Valor" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Tag 
                color={valueAnalysis.category === 'Premium' ? 'gold' : 
                       valueAnalysis.category === 'Alto Padrão' ? 'green' :
                       valueAnalysis.category === 'Padrão' ? 'blue' :
                       valueAnalysis.category === 'Básico' ? 'orange' : 'red'}
                style={{ fontSize: 16, padding: '8px 16px' }}
              >
                <TrophyOutlined /> {valueAnalysis.category}
              </Tag>
            </div>
            <Paragraph>
              <Text strong>Multiplicador de Valor: </Text>
              <Text style={{ 
                color: valueAnalysis.multiplier > 1 ? '#3f8600' : 
                       valueAnalysis.multiplier < 1 ? '#cf1322' : '#1890ff',
                fontSize: 16,
                fontWeight: 'bold'
              }}>
                {(valueAnalysis.multiplier * 100).toFixed(0)}%
              </Text>
            </Paragraph>
            <Paragraph>{valueAnalysis.reasoning}</Paragraph>
          </Col>
          <Col span={12}>
            <Title level={5}>Fatores de Impacto no Valor</Title>
            {valueAnalysis.factors.map((factor, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                <Row justify="space-between">
                  <Col span={16}>
                    <Text strong>{factor.factor}</Text>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Tag color={factor.impact.startsWith('+') ? 'green' : 'red'}>
                      {factor.impact}
                    </Tag>
                  </Col>
                </Row>
                <Paragraph style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                  {factor.description}
                </Paragraph>
              </div>
            ))}
          </Col>
        </Row>
      </Card>

      {/* Métricas de Análise */}
      <Card title="Métricas de Análise" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title="Total de Comparações"
              value={reportData.metrics.totalComparisons}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Similaridade Média"
              value={reportData.metrics.averageSimilarity.toFixed(1)}
              suffix="%"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Melhor Correspondência"
              value={reportData.metrics.bestMatchSimilarity.toFixed(1)}
              suffix="%"
            />
          </Col>
        </Row>
      </Card>

      {/* Recomendações */}
      <Card title="Recomendações">
        <Space direction="vertical" style={{ width: '100%' }}>
          {valueAnalysis.recommendations.map((rec, index) => {
            const iconMap = {
              success: <CheckCircleOutlined />,
              warning: <WarningOutlined />,
              error: <WarningOutlined />,
              info: <InfoCircleOutlined />
            };
            
            return (
              <Alert
                key={index}
                message={rec.title}
                description={rec.description}
                type={rec.type}
                icon={iconMap[rec.type]}
                showIcon
                action={
                  <Tag color={rec.priority === 'crítica' ? 'red' : 
                            rec.priority === 'alta' ? 'orange' :
                            rec.priority === 'média' ? 'blue' : 'green'}>
                    {rec.priority.toUpperCase()}
                  </Tag>
                }
              />
            );
          })}
        </Space>
      </Card>
    </div>
  );
};

export default PropertyComparisonReport;