// Cache para configurações de logo
class LogoCache {
  constructor() {
    this.cache = null;
    this.lastFetch = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos
  }

  // Verificar se o cache é válido
  isValid() {
    if (!this.cache || !this.lastFetch) {
      return false;
    }
    return (Date.now() - this.lastFetch) < this.cacheDuration;
  }

  // Obter dados do cache
  get() {
    if (this.isValid()) {
      return this.cache;
    }
    return null;
  }

  // Salvar dados no cache
  set(data) {
    this.cache = data;
    this.lastFetch = Date.now();
  }

  // Limpar cache
  clear() {
    this.cache = null;
    this.lastFetch = null;
  }

  // Invalidar cache (forçar nova requisição)
  invalidate() {
    this.clear();
  }
}

// Instância singleton do cache
const logoCache = new LogoCache();

export default logoCache;