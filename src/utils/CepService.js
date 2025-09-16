/**
 * Serviço para busca de endereços por CEP usando a API ViaCEP
 */

class CepService {
  /**
   * Busca CEP por endereço (busca reversa)
   * @param {string} uf - Estado (UF)
   * @param {string} cidade - Nome da cidade
   * @param {string} logradouro - Nome da rua/logradouro
   * @returns {Object} Resultado da busca
   */
  static async buscarCepPorEndereco(uf, cidade, logradouro) {
    try {
      // Valida se os parâmetros obrigatórios foram fornecidos
      if (!uf || !cidade || !logradouro) {
        throw new Error('UF, cidade e logradouro são obrigatórios');
      }
      
      // Valida se cidade e logradouro têm pelo menos 3 caracteres
      if (cidade.length < 3 || logradouro.length < 3) {
        throw new Error('Cidade e logradouro devem ter pelo menos 3 caracteres');
      }
      
      // Codifica os parâmetros para URL
      const ufEncoded = encodeURIComponent(uf.trim());
      const cidadeEncoded = encodeURIComponent(cidade.trim());
      const logradouroEncoded = encodeURIComponent(logradouro.trim());
      
      const response = await fetch(`https://viacep.com.br/ws/${ufEncoded}/${cidadeEncoded}/${logradouroEncoded}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na consulta do endereço');
      }
      
      const data = await response.json();
      
      // Verifica se encontrou resultados
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Nenhum CEP encontrado para este endereço');
      }
      
      // Retorna os resultados formatados
      const resultados = data.map(item => ({
        cep: item.cep,
        endereco: item.logradouro,
        bairro: item.bairro,
        cidade: item.localidade,
        estado: item.uf,
        complemento: item.complemento || '',
        ddd: item.ddd || ''
      }));
      
      return {
        success: true,
        data: resultados,
        total: resultados.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Busca endereço por CEP
   * @param {string} cep - CEP para busca (formato: 12345678 ou 12345-678)
   * @returns {Promise<Object>} Dados do endereço ou erro
   */
  static async buscarEnderecoPorCep(cep) {
    try {
      // Remove caracteres não numéricos do CEP
      const cepLimpo = cep.replace(/\D/g, '');
      
      // Valida se o CEP tem 8 dígitos
      if (cepLimpo.length !== 8) {
        throw new Error('CEP deve conter 8 dígitos');
      }
      
      // Valida se o CEP não é uma sequência inválida
      if (/^(\d)\1{7}$/.test(cepLimpo)) {
        throw new Error('CEP inválido');
      }
      
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na consulta do CEP');
      }
      
      const data = await response.json();
      
      // Verifica se o CEP foi encontrado
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      return {
        success: true,
        data: {
          cep: data.cep,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          complemento: data.complemento || '',
          ddd: data.ddd || ''
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Formata CEP para exibição (12345-678)
   * @param {string} cep - CEP sem formatação
   * @returns {string} CEP formatado
   */
  static formatarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  /**
   * Remove formatação do CEP
   * @param {string} cep - CEP formatado
   * @returns {string} CEP sem formatação
   */
  static limparCep(cep) {
    return cep.replace(/\D/g, '');
  }
  
  /**
   * Valida formato do CEP
   * @param {string} cep - CEP para validação
   * @returns {boolean} True se válido
   */
  static validarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8 && !/^(\d)\1{7}$/.test(cepLimpo);
  }
}

export default CepService;