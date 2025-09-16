// Middleware de controle de acesso baseado no plano de assinatura

// Definição dos planos e suas funcionalidades
export const PLANOS = {
  CONSULTA_AVULSA: 'consulta_avulsa',
  BASICO: 'basico',
  INTERMEDIARIO: 'intermediario',
  FULL: 'full'
};

// Definição das funcionalidades disponíveis
export const FUNCIONALIDADES = {
  ANALISE_IMAGEM: 'analise_imagem',
  RELATORIO_PDF: 'relatorio_pdf',
  COMPARACAO_PROPRIEDADES: 'comparacao_propriedades',
  HISTORICO_CONSULTAS: 'historico_consultas',
  DASHBOARD_AVANCADO: 'dashboard_avancado',
  API_INTEGRACAO: 'api_integracao',
  SUPORTE_PRIORITARIO: 'suporte_prioritario',
  EXPORTACAO_DADOS: 'exportacao_dados',
  RELATORIOS_PERSONALIZADOS: 'relatorios_personalizados',
  ANALISE_BATCH: 'analise_batch'
};

// Mapeamento de funcionalidades por plano
const PERMISSOES_PLANO = {
  [PLANOS.CONSULTA_AVULSA]: [
    FUNCIONALIDADES.ANALISE_IMAGEM
  ],
  [PLANOS.BASICO]: [
    FUNCIONALIDADES.ANALISE_IMAGEM,
    FUNCIONALIDADES.RELATORIO_PDF,
    FUNCIONALIDADES.HISTORICO_CONSULTAS
  ],
  [PLANOS.INTERMEDIARIO]: [
    FUNCIONALIDADES.ANALISE_IMAGEM,
    FUNCIONALIDADES.RELATORIO_PDF,
    FUNCIONALIDADES.COMPARACAO_PROPRIEDADES,
    FUNCIONALIDADES.HISTORICO_CONSULTAS,
    FUNCIONALIDADES.DASHBOARD_AVANCADO,
    FUNCIONALIDADES.EXPORTACAO_DADOS
  ],
  [PLANOS.FULL]: [
    FUNCIONALIDADES.ANALISE_IMAGEM,
    FUNCIONALIDADES.RELATORIO_PDF,
    FUNCIONALIDADES.COMPARACAO_PROPRIEDADES,
    FUNCIONALIDADES.HISTORICO_CONSULTAS,
    FUNCIONALIDADES.DASHBOARD_AVANCADO,
    FUNCIONALIDADES.API_INTEGRACAO,
    FUNCIONALIDADES.SUPORTE_PRIORITARIO,
    FUNCIONALIDADES.EXPORTACAO_DADOS,
    FUNCIONALIDADES.RELATORIOS_PERSONALIZADOS,
    FUNCIONALIDADES.ANALISE_BATCH
  ]
};

// Limites por plano
export const LIMITES_PLANO = {
  [PLANOS.CONSULTA_AVULSA]: {
    consultasMensais: null, // Ilimitado, mas pago por consulta
    armazenamentoMB: 100,
    relatóriosPorMes: null,
    suporte: 'email'
  },
  [PLANOS.BASICO]: {
    consultasMensais: 50,
    armazenamentoMB: 500,
    relatóriosPorMes: 20,
    suporte: 'email'
  },
  [PLANOS.INTERMEDIARIO]: {
    consultasMensais: 200,
    armazenamentoMB: 2000,
    relatóriosPorMes: 100,
    suporte: 'chat'
  },
  [PLANOS.FULL]: {
    consultasMensais: null, // Ilimitado
    armazenamentoMB: 10000,
    relatóriosPorMes: null, // Ilimitado
    suporte: 'prioritario'
  }
};

// Preços dos planos (em centavos para evitar problemas de ponto flutuante)
export const PRECOS_PLANO = {
  [PLANOS.CONSULTA_AVULSA]: 500, // R$ 5,00 por consulta
  [PLANOS.BASICO]: 2900, // R$ 29,00/mês
  [PLANOS.INTERMEDIARIO]: 5900, // R$ 59,00/mês
  [PLANOS.FULL]: 9900 // R$ 99,00/mês
};

/**
 * Obtém informações do usuário atual do localStorage
 * @returns {Object|null} Dados do usuário ou null se não logado
 */
export const obterUsuarioAtual = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

/**
 * Obtém o plano atual do usuário
 * @returns {string} Plano do usuário ou CONSULTA_AVULSA como padrão
 */
export const obterPlanoUsuario = () => {
  const usuario = obterUsuarioAtual();
  return usuario?.plano || PLANOS.CONSULTA_AVULSA;
};

/**
 * Verifica se o usuário tem acesso a uma funcionalidade específica
 * @param {string} funcionalidade - Funcionalidade a ser verificada
 * @returns {boolean} True se tem acesso, false caso contrário
 */
export const temAcesso = (funcionalidade) => {
  const plano = obterPlanoUsuario();
  const permissoes = PERMISSOES_PLANO[plano] || [];
  return permissoes.includes(funcionalidade);
};

/**
 * Verifica se o usuário atingiu o limite de uso de uma funcionalidade
 * @param {string} tipoLimite - Tipo de limite (consultasMensais, relatóriosPorMes, etc.)
 * @returns {Object} { atingiuLimite: boolean, limite: number, usado: number }
 */
export const verificarLimite = (tipoLimite) => {
  const plano = obterPlanoUsuario();
  const limites = LIMITES_PLANO[plano];
  const limite = limites[tipoLimite];
  
  // Se o limite é null, significa ilimitado
  if (limite === null) {
    return { atingiuLimite: false, limite: null, usado: 0 };
  }
  
  // Obter uso atual do localStorage
  const usoAtual = obterUsoAtual(tipoLimite);
  
  return {
    atingiuLimite: usoAtual >= limite,
    limite,
    usado: usoAtual
  };
};

/**
 * Obtém o uso atual de uma funcionalidade do localStorage
 * @param {string} tipoLimite - Tipo de limite
 * @returns {number} Quantidade usada no mês atual
 */
const obterUsoAtual = (tipoLimite) => {
  try {
    const mesAtual = new Date().toISOString().slice(0, 7); // YYYY-MM
    const chaveUso = `uso_${tipoLimite}_${mesAtual}`;
    const uso = localStorage.getItem(chaveUso);
    return uso ? parseInt(uso, 10) : 0;
  } catch {
    return 0;
  }
};

/**
 * Incrementa o uso de uma funcionalidade
 * @param {string} tipoLimite - Tipo de limite
 * @param {number} quantidade - Quantidade a incrementar (padrão: 1)
 */
export const incrementarUso = (tipoLimite, quantidade = 1) => {
  try {
    const mesAtual = new Date().toISOString().slice(0, 7);
    const chaveUso = `uso_${tipoLimite}_${mesAtual}`;
    const usoAtual = obterUsoAtual(tipoLimite);
    localStorage.setItem(chaveUso, (usoAtual + quantidade).toString());
  } catch {
    // Falha silenciosa
  }
};

/**
 * Middleware para verificar acesso antes de executar uma ação
 * @param {string} funcionalidade - Funcionalidade requerida
 * @param {Function} callback - Função a ser executada se tiver acesso
 * @param {Function} onDenied - Função a ser executada se não tiver acesso
 * @returns {boolean} True se executou a ação, false se foi negado
 */
export const verificarAcessoEExecutar = (funcionalidade, callback, onDenied) => {
  if (!temAcesso(funcionalidade)) {
    if (onDenied) {
      onDenied({
        funcionalidade,
        planoAtual: obterPlanoUsuario(),
        planosComAcesso: Object.keys(PERMISSOES_PLANO).filter(plano => 
          PERMISSOES_PLANO[plano].includes(funcionalidade)
        )
      });
    }
    return false;
  }
  
  if (callback) {
    callback();
  }
  return true;
};

/**
 * Verifica se pode executar uma ação considerando limites de uso
 * @param {string} tipoLimite - Tipo de limite a verificar
 * @param {Function} callback - Função a executar se dentro do limite
 * @param {Function} onLimitExceeded - Função a executar se limite excedido
 * @returns {boolean} True se executou, false se limite excedido
 */
export const verificarLimiteEExecutar = (tipoLimite, callback, onLimitExceeded) => {
  const { atingiuLimite, limite, usado } = verificarLimite(tipoLimite);
  
  if (atingiuLimite) {
    if (onLimitExceeded) {
      onLimitExceeded({
        tipoLimite,
        limite,
        usado,
        plano: obterPlanoUsuario()
      });
    }
    return false;
  }
  
  if (callback) {
    callback();
    // Incrementar uso após execução bem-sucedida
    incrementarUso(tipoLimite);
  }
  return true;
};

/**
 * Obtém informações completas sobre o plano do usuário
 * @returns {Object} Informações do plano, permissões e limites
 */
export const obterInfoPlano = () => {
  const plano = obterPlanoUsuario();
  const usuario = obterUsuarioAtual();
  
  return {
    plano,
    nome: obterNomePlano(plano),
    preco: PRECOS_PLANO[plano],
    permissoes: PERMISSOES_PLANO[plano] || [],
    limites: LIMITES_PLANO[plano] || {},
    usuario: usuario?.nome || 'Usuário',
    dataVencimento: usuario?.dataVencimento || null,
    ativo: usuario?.ativo !== false
  };
};

/**
 * Obtém o nome amigável do plano
 * @param {string} plano - Código do plano
 * @returns {string} Nome amigável do plano
 */
export const obterNomePlano = (plano) => {
  const nomes = {
    [PLANOS.CONSULTA_AVULSA]: 'Consultas Avulsas',
    [PLANOS.BASICO]: 'Plano Básico',
    [PLANOS.INTERMEDIARIO]: 'Plano Intermediário',
    [PLANOS.FULL]: 'Pacote Full'
  };
  return nomes[plano] || 'Plano Desconhecido';
};

/**
 * Atualiza o plano do usuário
 * @param {string} novoPlano - Novo plano do usuário
 * @param {string} dataVencimento - Data de vencimento (opcional)
 */
export const atualizarPlanoUsuario = (novoPlano, dataVencimento = null) => {
  try {
    const usuario = obterUsuarioAtual();
    if (usuario) {
      const usuarioAtualizado = {
        ...usuario,
        plano: novoPlano,
        dataVencimento,
        dataAtualizacao: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(usuarioAtualizado));
    }
  } catch {
    // Falha silenciosa
  }
};

/**
 * Hook personalizado para verificação de acesso em componentes React
 * @param {string} funcionalidade - Funcionalidade a verificar
 * @returns {Object} { temAcesso: boolean, plano: string, upgrade: Function }
 */
export const useAccessControl = (funcionalidade) => {
  const plano = obterPlanoUsuario();
  const acesso = temAcesso(funcionalidade);
  
  const upgrade = () => {
    // Lógica para redirecionar para upgrade de plano
    const planosComAcesso = Object.keys(PERMISSOES_PLANO).filter(p => 
      PERMISSOES_PLANO[p].includes(funcionalidade)
    );
    
    return {
      funcionalidade,
      planoAtual: plano,
      planosRecomendados: planosComAcesso
    };
  };
  
  return {
    temAcesso: acesso,
    plano,
    upgrade
  };
};

export default {
  PLANOS,
  FUNCIONALIDADES,
  LIMITES_PLANO,
  PRECOS_PLANO,
  obterUsuarioAtual,
  obterPlanoUsuario,
  temAcesso,
  verificarLimite,
  incrementarUso,
  verificarAcessoEExecutar,
  verificarLimiteEExecutar,
  obterInfoPlano,
  obterNomePlano,
  atualizarPlanoUsuario,
  useAccessControl
};