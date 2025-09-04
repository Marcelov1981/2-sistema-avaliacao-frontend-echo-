import React, { useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';

const LaudoPDF = ({ avaliacao, onClose }) => {
  const [laudoData, setLaudoData] = useState({
    numeroLaudo: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    responsavelTecnico: '',
    registroProfissional: '',
    tipoRegistro: 'CREA',
    assinatura: '',
    observacoesFinais: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLaudoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const gerarPDF = async () => {
    try {
      setLoading(true);
      setError('');

      // Criar novo documento PDF
      const doc = new jsPDF();
      
      // Configurações do documento
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let yPosition = 30;

      // Cabeçalho
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('LAUDO DE AVALIAÇÃO IMOBILIÁRIA', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Número do laudo e data
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Laudo Nº: ${laudoData.numeroLaudo}`, margin, yPosition);
      doc.text(`Data de Emissão: ${new Date(laudoData.dataEmissao).toLocaleDateString('pt-BR')}`, pageWidth - margin - 60, yPosition);
      yPosition += 20;

      // Linha separadora
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Dados do projeto
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('1. DADOS DO IMÓVEL', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Projeto: ${avaliacao.orcamento?.projeto?.nome || 'N/A'}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Cliente: ${avaliacao.orcamento?.projeto?.cliente?.nome || 'N/A'}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Endereço: ${avaliacao.orcamento?.projeto?.endereco || 'N/A'}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Tipo de Avaliação: ${avaliacao.orcamento?.tipoAvaliacao || 'N/A'}`, margin, yPosition);
      yPosition += 15;

      // Metodologia
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('2. METODOLOGIA UTILIZADA', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Metodologia: ${avaliacao.metodologiaUtilizada}`, margin, yPosition);
      yPosition += 15;

      // Considerações técnicas
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('3. CONSIDERAÇÕES TÉCNICAS', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const consideracoes = doc.splitTextToSize(avaliacao.consideracoes, pageWidth - 2 * margin);
      doc.text(consideracoes, margin, yPosition);
      yPosition += consideracoes.length * 6 + 10;

      // Observações técnicas
      if (avaliacao.observacoesTecnicas) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('4. OBSERVAÇÕES TÉCNICAS', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const observacoes = doc.splitTextToSize(avaliacao.observacoesTecnicas, pageWidth - 2 * margin);
        doc.text(observacoes, margin, yPosition);
        yPosition += observacoes.length * 6 + 10;
      }

      // Valor final
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('5. VALOR DA AVALIAÇÃO', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Valor Final: R$ ${avaliacao.valorFinal?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, margin, yPosition);
      yPosition += 20;

      // Observações finais
      if (laudoData.observacoesFinais) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('6. OBSERVAÇÕES FINAIS', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const obsFinais = doc.splitTextToSize(laudoData.observacoesFinais, pageWidth - 2 * margin);
        doc.text(obsFinais, margin, yPosition);
        yPosition += obsFinais.length * 6 + 20;
      }

      // Verificar se precisa de nova página
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      // Responsável técnico e assinatura
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RESPONSÁVEL TÉCNICO', margin, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nome: ${laudoData.responsavelTecnico}`, margin, yPosition);
      yPosition += 8;
      doc.text(`${laudoData.tipoRegistro}: ${laudoData.registroProfissional}`, margin, yPosition);
      yPosition += 20;

      // Linha para assinatura
      doc.line(margin, yPosition, pageWidth / 2, yPosition);
      yPosition += 8;
      doc.text('Assinatura do Responsável Técnico', margin, yPosition);

      // Data de emissão no rodapé
      yPosition += 20;
      doc.text(`${avaliacao.orcamento?.projeto?.cliente?.cidade || 'Cidade'}, ${new Date(laudoData.dataEmissao).toLocaleDateString('pt-BR')}`, margin, yPosition);

      // Salvar o PDF
      const fileName = `Laudo_${laudoData.numeroLaudo}_${avaliacao.orcamento?.projeto?.nome?.replace(/\s+/g, '_') || 'Projeto'}.pdf`;
      doc.save(fileName);

      // Salvar dados do laudo no backend
      await salvarLaudo();

      alert('Laudo gerado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setError('Erro ao gerar o laudo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const salvarLaudo = async () => {
    try {
      const laudoPayload = {
        avaliacaoId: avaliacao.id,
        numeroLaudo: laudoData.numeroLaudo,
        dataEmissao: laudoData.dataEmissao,
        responsavelTecnico: laudoData.responsavelTecnico,
        registroProfissional: laudoData.registroProfissional,
        tipoRegistro: laudoData.tipoRegistro,
        observacoesFinais: laudoData.observacoesFinais,
        status: 'emitido'
      };

      await axios.post('https://geomind-service-production.up.railway.app/api/v1/laudos', laudoPayload);
    } catch (error) {
      console.error('Erro ao salvar laudo:', error);
      // Não bloquear a geração do PDF por erro no backend
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!laudoData.numeroLaudo || !laudoData.responsavelTecnico || !laudoData.registroProfissional) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    gerarPDF();
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#64748b'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff'
    },
    select: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    textarea: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      minHeight: '80px',
      resize: 'vertical'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s'
    },
    cancelButton: {
      backgroundColor: '#f8fafc',
      color: '#64748b',
      border: '1px solid #e2e8f0'
    },
    submitButton: {
      backgroundColor: '#059669',
      color: 'white'
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '16px'
    },
    avaliacaoInfo: {
      backgroundColor: '#f8fafc',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    infoTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px'
    },
    infoText: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '4px'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>Gerar Laudo Final</h3>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Informações da Avaliação */}
        <div style={styles.avaliacaoInfo}>
          <div style={styles.infoTitle}>Dados da Avaliação</div>
          <div style={styles.infoText}>Projeto: {avaliacao.orcamento?.projeto?.nome || 'N/A'}</div>
          <div style={styles.infoText}>Cliente: {avaliacao.orcamento?.projeto?.cliente?.nome || 'N/A'}</div>
          <div style={styles.infoText}>Valor Final: R$ {avaliacao.valorFinal?.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          <div style={styles.infoText}>Metodologia: {avaliacao.metodologiaUtilizada}</div>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número do Laudo *</label>
            <input
              type="text"
              name="numeroLaudo"
              value={laudoData.numeroLaudo}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Ex: LAV-2024-001"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Data de Emissão *</label>
            <input
              type="date"
              name="dataEmissao"
              value={laudoData.dataEmissao}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Responsável Técnico *</label>
            <input
              type="text"
              name="responsavelTecnico"
              value={laudoData.responsavelTecnico}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Nome completo do responsável técnico"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Registro *</label>
            <select
              name="tipoRegistro"
              value={laudoData.tipoRegistro}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="CREA">CREA</option>
              <option value="CAU">CAU</option>
              <option value="CRECI">CRECI</option>
              <option value="IBAPE">IBAPE</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Número do Registro Profissional *</label>
            <input
              type="text"
              name="registroProfissional"
              value={laudoData.registroProfissional}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Ex: CREA/SP 123456789"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Observações Finais</label>
            <textarea
              name="observacoesFinais"
              value={laudoData.observacoesFinais}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Observações adicionais para o laudo final..."
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              style={{...styles.button, ...styles.cancelButton}}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{...styles.button, ...styles.submitButton}}
            >
              {loading ? 'Gerando...' : 'Gerar Laudo PDF'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaudoPDF;