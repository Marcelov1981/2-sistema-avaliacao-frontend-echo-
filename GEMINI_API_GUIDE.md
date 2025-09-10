# Guia da API Gemini - Tratamento de Erros

## Configuração da API Key

1. Obtenha sua chave da API em: https://makersuite.google.com/app/apikey
2. Crie um arquivo `.env` na raiz do projeto:
```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

## Erros Comuns e Soluções

### Erro 503 - Modelo Sobrecarregado
**Mensagem**: "The model is overloaded. Please try again later."

**Causa**: O modelo Gemini está recebendo muitas requisições simultâneas.

**Solução Implementada**:
- ✅ Sistema de retry automático (3 tentativas)
- ✅ Delay de 2 segundos entre tentativas
- ✅ Mensagem amigável para o usuário
- ✅ Fallback gracioso após esgotar tentativas

### Erro 403 - Permissão Negada
**Mensagem**: "Method doesn't allow unregistered callers"

**Causa**: API Key inválida ou não configurada.

**Solução**:
1. Verifique se a API Key está correta no arquivo `.env`
2. Confirme que a API Key tem permissões para o modelo `gemini-1.5-flash`
3. Reinicie o servidor de desenvolvimento após alterar o `.env`

### Erro 429 - Rate Limit
**Mensagem**: "Quota exceeded" ou "Rate limit exceeded"

**Causa**: Muitas requisições em pouco tempo.

**Solução**:
- Aguarde alguns minutos antes de tentar novamente
- Considere implementar um sistema de queue para requisições

## Boas Práticas

1. **Não exponha a API Key**: Sempre use variáveis de ambiente
2. **Implemente retry logic**: Para lidar com falhas temporárias
3. **Monitore quotas**: Acompanhe o uso da API no console do Google
4. **Otimize prompts**: Prompts mais específicos geram melhores resultados
5. **Compressão de imagens**: Reduza o tamanho das imagens para economizar quota

## Monitoramento

Para monitorar o uso da API:
1. Acesse: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com
2. Vá em "Quotas" para ver limites e uso atual
3. Configure alertas para quando se aproximar dos limites

## Troubleshooting

Se continuar enfrentando problemas:
1. Verifique os logs do console do navegador
2. Confirme que o servidor está rodando (`npm run dev`)
3. Teste a API Key diretamente no Google AI Studio
4. Verifique se há atualizações da biblioteca `@google/generative-ai`