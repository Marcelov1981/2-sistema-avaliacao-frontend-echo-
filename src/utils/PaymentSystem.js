// Sistema de cobrança por consulta (pay-per-use)

import { PLANOS, PRECOS_PLANO, obterUsuarioAtual, incrementarUso } from './AccessControl';

/**
 * Tipos de transação
 */
export const TIPOS_TRANSACAO = {
  CONSULTA_AVULSA: 'consulta_avulsa',
  ASSINATURA_MENSAL: 'assinatura_mensal',
  UPGRADE_PLANO: 'upgrade_plano',
  CREDITO_ADICIONAL: 'credito_adicional'
};

/**
 * Status de transação
 */
export const STATUS_TRANSACAO = {
  PENDENTE: 'pendente',
  PROCESSANDO: 'processando',
  APROVADA: 'aprovada',
  REJEITADA: 'rejeitada',
  CANCELADA: 'cancelada',
  ESTORNADA: 'estornada'
};

/**
 * Métodos de pagamento
 */
export const METODOS_PAGAMENTO = {
  CARTAO_CREDITO: 'cartao_credito',
  PIX: 'pix',
  BOLETO: 'boleto',
  CREDITOS: 'creditos'
};

/**
 * Classe para gerenciar o sistema de pagamentos
 */
class PaymentSystem {
  constructor() {
    this.transacoes = this.carregarTransacoes();
    this.creditos = this.carregarCreditos();
  }

  /**
   * Carrega transações do localStorage
   */
  carregarTransacoes() {
    try {
      const transacoes = localStorage.getItem('transacoes');
      return transacoes ? JSON.parse(transacoes) : [];
    } catch {
      return [];
    }
  }

  /**
   * Salva transações no localStorage
   */
  salvarTransacoes() {
    try {
      localStorage.setItem('transacoes', JSON.stringify(this.transacoes));
    } catch {
      console.error('Erro ao salvar transações');
    }
  }

  /**
   * Carrega créditos do usuário
   */
  carregarCreditos() {
    try {
      const usuario = obterUsuarioAtual();
      return usuario?.creditos || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Atualiza créditos do usuário
   */
  atualizarCreditos(novoSaldo) {
    try {
      const usuario = obterUsuarioAtual();
      if (usuario) {
        const usuarioAtualizado = {
          ...usuario,
          creditos: Math.max(0, novoSaldo),
          dataAtualizacao: new Date().toISOString()
        };
        localStorage.setItem('userData', JSON.stringify(usuarioAtualizado));
        this.creditos = usuarioAtualizado.creditos;
      }
    } catch {
      console.error('Erro ao atualizar créditos');
    }
  }

  /**
   * Gera ID único para transação
   */
  gerarIdTransacao() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Processa pagamento de consulta avulsa
   */
  async processarConsultaAvulsa(dadosConsulta, metodoPagamento = METODOS_PAGAMENTO.CARTAO_CREDITO) {
    const valor = PRECOS_PLANO[PLANOS.CONSULTA_AVULSA];
    const usuario = obterUsuarioAtual();

    if (!usuario) {
      throw new Error('Usuário não autenticado');
    }

    const transacao = {
      id: this.gerarIdTransacao(),
      tipo: TIPOS_TRANSACAO.CONSULTA_AVULSA,
      valor,
      moeda: 'BRL',
      status: STATUS_TRANSACAO.PENDENTE,
      metodoPagamento,
      usuarioId: usuario.id,
      dadosConsulta,
      dataCreacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    try {
      // Se for pagamento com créditos
      if (metodoPagamento === METODOS_PAGAMENTO.CREDITOS) {
        return await this.processarPagamentoCreditos(transacao);
      }

      // Simular processamento de pagamento
      transacao.status = STATUS_TRANSACAO.PROCESSANDO;
      this.transacoes.push(transacao);
      this.salvarTransacoes();

      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular aprovação (90% de chance de aprovação)
      const aprovado = Math.random() > 0.1;

      if (aprovado) {
        transacao.status = STATUS_TRANSACAO.APROVADA;
        transacao.dataAprovacao = new Date().toISOString();
        
        // Incrementar uso de consultas
        incrementarUso('consultasMensais');
        
        // Registrar consulta realizada
        this.registrarConsultaRealizada(dadosConsulta, transacao.id);
      } else {
        transacao.status = STATUS_TRANSACAO.REJEITADA;
        transacao.motivoRejeicao = 'Cartão recusado pela operadora';
      }

      transacao.dataAtualizacao = new Date().toISOString();
      this.salvarTransacoes();

      return {
        sucesso: aprovado,
        transacao,
        mensagem: aprovado ? 'Pagamento aprovado com sucesso!' : 'Pagamento rejeitado. Tente outro cartão.'
      };

    } catch (error) {
      transacao.status = STATUS_TRANSACAO.REJEITADA;
      transacao.erro = error.message;
      transacao.dataAtualizacao = new Date().toISOString();
      this.salvarTransacoes();

      throw new Error('Erro ao processar pagamento: ' + error.message);
    }
  }

  /**
   * Processa pagamento com créditos
   */
  async processarPagamentoCreditos(transacao) {
    const creditosNecessarios = transacao.valor;
    
    if (this.creditos < creditosNecessarios) {
      transacao.status = STATUS_TRANSACAO.REJEITADA;
      transacao.motivoRejeicao = 'Créditos insuficientes';
      this.transacoes.push(transacao);
      this.salvarTransacoes();
      
      return {
        sucesso: false,
        transacao,
        mensagem: `Créditos insuficientes. Necessário: R$ ${(creditosNecessarios / 100).toFixed(2)}, Disponível: R$ ${(this.creditos / 100).toFixed(2)}`
      };
    }

    // Debitar créditos
    this.atualizarCreditos(this.creditos - creditosNecessarios);
    
    transacao.status = STATUS_TRANSACAO.APROVADA;
    transacao.dataAprovacao = new Date().toISOString();
    transacao.creditosUtilizados = creditosNecessarios;
    
    this.transacoes.push(transacao);
    this.salvarTransacoes();
    
    // Incrementar uso de consultas
    incrementarUso('consultasMensais');
    
    // Registrar consulta realizada
    this.registrarConsultaRealizada(transacao.dadosConsulta, transacao.id);
    
    return {
      sucesso: true,
      transacao,
      mensagem: 'Pagamento realizado com créditos!',
      saldoRestante: this.creditos
    };
  }

  /**
   * Adiciona créditos à conta do usuário
   */
  async adicionarCreditos(valor, metodoPagamento = METODOS_PAGAMENTO.CARTAO_CREDITO) {
    const usuario = obterUsuarioAtual();
    
    if (!usuario) {
      throw new Error('Usuário não autenticado');
    }

    const transacao = {
      id: this.gerarIdTransacao(),
      tipo: TIPOS_TRANSACAO.CREDITO_ADICIONAL,
      valor,
      moeda: 'BRL',
      status: STATUS_TRANSACAO.PENDENTE,
      metodoPagamento,
      usuarioId: usuario.id,
      dataCreacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    try {
      transacao.status = STATUS_TRANSACAO.PROCESSANDO;
      this.transacoes.push(transacao);
      this.salvarTransacoes();

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular aprovação
      const aprovado = Math.random() > 0.05; // 95% de aprovação

      if (aprovado) {
        transacao.status = STATUS_TRANSACAO.APROVADA;
        transacao.dataAprovacao = new Date().toISOString();
        
        // Adicionar créditos
        this.atualizarCreditos(this.creditos + valor);
      } else {
        transacao.status = STATUS_TRANSACAO.REJEITADA;
        transacao.motivoRejeicao = 'Falha no processamento';
      }

      transacao.dataAtualizacao = new Date().toISOString();
      this.salvarTransacoes();

      return {
        sucesso: aprovado,
        transacao,
        novoSaldo: aprovado ? this.creditos : this.creditos,
        mensagem: aprovado ? 'Créditos adicionados com sucesso!' : 'Falha ao adicionar créditos'
      };

    } catch (error) {
      transacao.status = STATUS_TRANSACAO.REJEITADA;
      transacao.erro = error.message;
      this.salvarTransacoes();
      throw error;
    }
  }

  /**
   * Registra uma consulta realizada
   */
  registrarConsultaRealizada(dadosConsulta, transacaoId) {
    try {
      const consultas = this.carregarConsultasRealizadas();
      const novaConsulta = {
        id: 'consulta_' + Date.now(),
        transacaoId,
        dados: dadosConsulta,
        dataRealizacao: new Date().toISOString(),
        usuario: obterUsuarioAtual()?.id
      };
      
      consultas.push(novaConsulta);
      localStorage.setItem('consultasRealizadas', JSON.stringify(consultas));
    } catch {
      console.error('Erro ao registrar consulta');
    }
  }

  /**
   * Carrega consultas realizadas
   */
  carregarConsultasRealizadas() {
    try {
      const consultas = localStorage.getItem('consultasRealizadas');
      return consultas ? JSON.parse(consultas) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obtém histórico de transações do usuário
   */
  obterHistoricoTransacoes(filtros = {}) {
    const usuario = obterUsuarioAtual();
    if (!usuario) return [];

    let transacoesFiltradas = this.transacoes.filter(t => t.usuarioId === usuario.id);

    // Aplicar filtros
    if (filtros.tipo) {
      transacoesFiltradas = transacoesFiltradas.filter(t => t.tipo === filtros.tipo);
    }

    if (filtros.status) {
      transacoesFiltradas = transacoesFiltradas.filter(t => t.status === filtros.status);
    }

    if (filtros.dataInicio) {
      transacoesFiltradas = transacoesFiltradas.filter(t => 
        new Date(t.dataCreacao) >= new Date(filtros.dataInicio)
      );
    }

    if (filtros.dataFim) {
      transacoesFiltradas = transacoesFiltradas.filter(t => 
        new Date(t.dataCreacao) <= new Date(filtros.dataFim)
      );
    }

    // Ordenar por data (mais recente primeiro)
    return transacoesFiltradas.sort((a, b) => 
      new Date(b.dataCreacao) - new Date(a.dataCreacao)
    );
  }

  /**
   * Obtém estatísticas de uso e gastos
   */
  obterEstatisticas() {
    const usuario = obterUsuarioAtual();
    if (!usuario) return null;

    const transacoesUsuario = this.transacoes.filter(t => 
      t.usuarioId === usuario.id && t.status === STATUS_TRANSACAO.APROVADA
    );

    const totalGasto = transacoesUsuario.reduce((total, t) => total + t.valor, 0);
    const consultasRealizadas = transacoesUsuario.filter(t => 
      t.tipo === TIPOS_TRANSACAO.CONSULTA_AVULSA
    ).length;

    const mesAtual = new Date().toISOString().slice(0, 7);
    const transacoesMesAtual = transacoesUsuario.filter(t => 
      t.dataCreacao.startsWith(mesAtual)
    );
    const gastoMesAtual = transacoesMesAtual.reduce((total, t) => total + t.valor, 0);

    return {
      totalGasto,
      consultasRealizadas,
      gastoMesAtual,
      consultasMesAtual: transacoesMesAtual.filter(t => 
        t.tipo === TIPOS_TRANSACAO.CONSULTA_AVULSA
      ).length,
      creditosDisponiveis: this.creditos,
      ultimaTransacao: transacoesUsuario[0] || null
    };
  }

  /**
   * Verifica se o usuário pode realizar uma consulta
   */
  podeRealizarConsulta() {
    const usuario = obterUsuarioAtual();
    if (!usuario) return { pode: false, motivo: 'Usuário não autenticado' };

    // Se tem créditos suficientes
    if (this.creditos >= PRECOS_PLANO[PLANOS.CONSULTA_AVULSA]) {
      return { pode: true, metodo: 'creditos' };
    }

    // Verificar se tem cartão cadastrado
    const cartoes = JSON.parse(localStorage.getItem('cartoes') || '[]');
    if (cartoes.length > 0) {
      return { pode: true, metodo: 'cartao' };
    }

    return { 
      pode: false, 
      motivo: 'Nenhum método de pagamento disponível. Adicione créditos ou cadastre um cartão.' 
    };
  }
}

// Instância singleton
const paymentSystem = new PaymentSystem();

export default paymentSystem;
export { PaymentSystem };