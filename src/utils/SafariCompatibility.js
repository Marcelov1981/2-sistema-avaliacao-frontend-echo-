/**
 * Utilitário para resolver problemas de compatibilidade do Safari
 * Especialmente relacionados a downloads de arquivos e blob URLs
 */

class SafariCompatibility {
  /**
   * Detecta se o navegador é Safari
   */
  static isSafari() {
    const userAgent = navigator.userAgent;
    return /^((?!chrome|android).)*safari/i.test(userAgent) || 
           /iPad|iPhone|iPod/.test(userAgent);
  }

  /**
   * Detecta se é Safari no iOS
   */
  static isSafariMobile() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  /**
   * Download seguro de arquivos que funciona no Safari
   * @param {Blob|string} data - Dados para download (Blob ou string)
   * @param {string} filename - Nome do arquivo
   * @param {string} mimeType - Tipo MIME do arquivo
   */
  static downloadFile(data, filename, mimeType = 'application/octet-stream') {
    try {
      let blob;
      
      // Se data já é um Blob, usa diretamente
      if (data instanceof Blob) {
        blob = data;
      } else {
        // Cria Blob a partir de string
        blob = new Blob([data], { type: mimeType });
      }

      // Para Safari no iOS, abre em nova aba
      if (this.isSafariMobile()) {
        const reader = new FileReader();
        reader.onload = function() {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head>
                  <title>${filename}</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="margin: 20px; font-family: Arial, sans-serif;">
                  <h3>Download: ${filename}</h3>
                  <p>Pressione e segure o link abaixo, depois selecione "Salvar no Arquivos" ou "Copiar":</p>
                  <a href="${reader.result}" download="${filename}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007AFF;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    margin: 10px 0;
                  ">📥 ${filename}</a>
                  <br><br>
                  <small>Se o download não funcionar automaticamente, pressione e segure o link acima.</small>
                </body>
              </html>
            `);
          } else {
            alert('Por favor, permita pop-ups para fazer o download do arquivo.');
          }
        };
        reader.readAsDataURL(blob);
        return;
      }

      // Para Safari desktop e outros navegadores
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Para Safari, adiciona o link ao DOM temporariamente
      if (this.isSafari()) {
        document.body.appendChild(link);
      }
      
      link.click();
      
      // Remove o link do DOM se foi adicionado
      if (this.isSafari() && link.parentNode) {
        document.body.removeChild(link);
      }
      
      // Limpa a URL do objeto após um delay para garantir que o download iniciou
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
    } catch (error) {
      console.error('Erro no download:', error);
      
      // Fallback: tenta abrir em nova aba
      try {
        let dataUrl;
        if (data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = function() {
            const newWindow = window.open();
            if (newWindow) {
              newWindow.location.href = reader.result;
            }
          };
          reader.readAsDataURL(data);
        } else {
          dataUrl = 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(data);
          const newWindow = window.open();
          if (newWindow) {
            newWindow.location.href = dataUrl;
          }
        }
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        alert('Não foi possível fazer o download do arquivo. Tente usar outro navegador.');
      }
    }
  }

  /**
   * Download de PDF com compatibilidade para Safari
   * @param {jsPDF} doc - Documento jsPDF
   * @param {string} filename - Nome do arquivo
   */
  static downloadPDF(doc, filename = 'documento.pdf') {
    try {
      // Para Safari no iOS, usa data URL
      if (this.isSafariMobile()) {
        const pdfDataUrl = doc.output('dataurlstring');
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${filename}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                  .download-container { text-align: center; }
                  .download-btn {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #007AFF;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    margin: 10px;
                  }
                  iframe { width: 100%; height: 70vh; border: 1px solid #ccc; }
                </style>
              </head>
              <body>
                <div class="download-container">
                  <h3>📄 ${filename}</h3>
                  <a href="${pdfDataUrl}" download="${filename}" class="download-btn">
                    📥 Baixar PDF
                  </a>
                  <br><br>
                  <iframe src="${pdfDataUrl}" title="Preview do PDF"></iframe>
                  <br><br>
                  <small>Se o download não funcionar, pressione e segure o botão "Baixar PDF" acima.</small>
                </div>
              </body>
            </html>
          `);
        }
        return;
      }

      // Para outros navegadores, usa o método padrão do jsPDF
      doc.save(filename);
      
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      
      // Fallback: tenta usar blob
      try {
        const blob = doc.output('blob');
        this.downloadFile(blob, filename, 'application/pdf');
      } catch (fallbackError) {
        console.error('Erro no fallback do PDF:', fallbackError);
        alert('Não foi possível fazer o download do PDF. Tente usar outro navegador.');
      }
    }
  }

  /**
   * Cria URL de objeto com limpeza automática para Safari
   * @param {Blob|File} file - Arquivo ou blob
   * @returns {string} URL do objeto
   */
  static createObjectURL(file) {
    const url = URL.createObjectURL(file);
    
    // Para Safari, limpa URLs antigas mais frequentemente
    if (this.isSafari()) {
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignora erros de limpeza
        }
      }, 30000); // 30 segundos
    }
    
    return url;
  }

  /**
   * Mostra instruções específicas para Safari
   * @param {string} action - Ação que o usuário está tentando fazer
   */
  static showSafariInstructions(action = 'baixar arquivo') {
    if (this.isSafari()) {
      const instructions = this.isSafariMobile() 
        ? `Para ${action} no Safari (iOS):\n\n1. Toque e segure o link de download\n2. Selecione "Salvar no Arquivos" ou "Copiar"\n3. Escolha onde salvar o arquivo\n\nOu use o Chrome/Firefox para melhor compatibilidade.`
        : `Para ${action} no Safari:\n\n1. Certifique-se de que downloads estão habilitados\n2. Verifique se não há bloqueadores de pop-up ativos\n3. Tente usar Chrome/Firefox se houver problemas\n\nSe o problema persistir, contate o suporte.`;
      
      alert(instructions);
    }
  }

  /**
   * Verifica se o navegador suporta downloads automáticos
   */
  static supportsAutomaticDownloads() {
    // Safari no iOS tem limitações com downloads automáticos
    return !this.isSafariMobile();
  }
}

export default SafariCompatibility;