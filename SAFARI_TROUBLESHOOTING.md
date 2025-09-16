# Guia de Solução de Problemas - Safari

## Problemas Comuns no Safari

Este guia ajuda a resolver problemas específicos que podem ocorrer ao usar o Safari com nossa aplicação.

### 🔧 Problemas Resolvidos Automaticamente

Nossa aplicação agora inclui correções automáticas para:

- ✅ **Downloads de PDF**: Implementação específica para Safari
- ✅ **Downloads de arquivos JSON**: Compatibilidade melhorada
- ✅ **Upload de imagens**: URLs de objeto otimizadas
- ✅ **Notificações automáticas**: Alertas quando usar Safari

### 📱 Safari no iOS (iPhone/iPad)

#### Problema: "Não consigo baixar arquivos"

**Solução:**
1. Quando aparecer o link de download, **pressione e segure** o link
2. Selecione "**Salvar no Arquivos**" ou "**Copiar**"
3. Escolha onde salvar o arquivo
4. Para PDFs, você também pode visualizar antes de salvar

**Alternativa:**
- Use **Chrome** ou **Firefox** no iOS para melhor experiência
- Estes navegadores têm melhor suporte a downloads automáticos

#### Problema: "O arquivo abre em nova aba mas não baixa"

**Solução:**
1. Na nova aba, toque no ícone de **compartilhamento** (📤)
2. Selecione "**Salvar no Arquivos**"
3. Escolha a pasta de destino

### 🖥️ Safari no macOS (Desktop)

#### Problema: "Downloads não funcionam"

**Verificações:**
1. **Configurações do Safari** → **Geral** → Verifique se "Localização de download de arquivo" está configurada
2. **Configurações do Safari** → **Sites** → **Downloads** → Permita downloads automáticos
3. Desative bloqueadores de pop-up temporariamente

#### Problema: "Pop-ups são bloqueados"

**Solução:**
1. **Safari** → **Configurações** → **Sites** → **Pop-ups**
2. Adicione nosso site à lista de exceções
3. Ou temporariamente desative o bloqueador

### 🔍 Problemas Específicos por Funcionalidade

#### Upload de Imagens

**Sintomas:**
- Imagens não aparecem após upload
- Erro "URL inválida"

**Solução:**
- ✅ **Já corrigido automaticamente** - nossa aplicação agora usa URLs otimizadas para Safari
- Se persistir, tente recarregar a página

#### Geração de PDF

**Sintomas:**
- PDF não baixa automaticamente
- Abre em nova aba mas não salva

**Solução:**
- ✅ **Já corrigido automaticamente** - implementamos download específico para Safari
- No iOS: pressione e segure o link de download
- No macOS: verifique configurações de download

#### Exportação de Relatórios

**Sintomas:**
- Arquivos JSON não baixam
- Erro ao exportar dados

**Solução:**
- ✅ **Já corrigido automaticamente** - usamos método compatível com Safari
- Se necessário, o arquivo abrirá em nova aba para download manual

### 🚀 Recomendações Gerais

#### Para Melhor Experiência:

1. **Use navegadores alternativos** quando possível:
   - **Chrome** (recomendado)
   - **Firefox**
   - **Edge**

2. **Mantenha o Safari atualizado**:
   - Versões mais recentes têm melhor compatibilidade
   - **macOS**: Sistema → Atualização de Software
   - **iOS**: Configurações → Geral → Atualização de Software

3. **Configure o Safari adequadamente**:
   - Permita downloads automáticos
   - Desative bloqueadores quando necessário
   - Limpe cache regularmente

### 🆘 Quando Buscar Ajuda

Contate nosso suporte se:

- ❌ Problemas persistem após seguir este guia
- ❌ Funcionalidades críticas não funcionam
- ❌ Erros não documentados aparecem

**Informações úteis para o suporte:**
- Versão do Safari (Safari → Sobre o Safari)
- Sistema operacional e versão
- Descrição detalhada do problema
- Screenshots se possível

### 🔄 Atualizações

**Versão 1.0** - Implementações incluídas:
- ✅ SafariCompatibility.js - Utilitário de compatibilidade
- ✅ SafariNotification.jsx - Notificações automáticas
- ✅ Downloads otimizados para PDF e JSON
- ✅ URLs de objeto com limpeza automática
- ✅ Detecção automática de Safari/iOS

---

**💡 Dica:** Nossa aplicação detecta automaticamente quando você está usando Safari e mostra notificações com instruções específicas quando necessário.