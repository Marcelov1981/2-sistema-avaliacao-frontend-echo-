# Sistema de Upload de Imagens

## Funcionalidades Implementadas

O sistema agora possui um componente reutilizável para upload e gerenciamento de imagens que foi integrado nos formulários de:

- **Projetos** (Novo Projeto)
- **Orçamentos** (Novo Orçamento)

## Características do Componente ImageUpload

### Funcionalidades
- ✅ Upload por drag & drop ou clique
- ✅ Visualização de miniaturas das imagens
- ✅ Preview em modal das imagens
- ✅ Remoção individual de imagens
- ✅ Validação de tipo de arquivo
- ✅ Validação de tamanho de arquivo
- ✅ Limite configurável de imagens

### Configurações Padrão
- **Tipos aceitos**: JPEG, PNG, GIF, WebP
- **Tamanho máximo**: 5MB por arquivo
- **Projetos**: Até 10 imagens
- **Orçamentos**: Até 8 imagens

### Estrutura de Arquivos
```
src/
├── components/
│   ├── ImageUpload.jsx     # Componente reutilizável
│   ├── NovoProjeto.jsx     # Integrado com upload
│   └── NovoOrcamento.jsx   # Integrado com upload
public/
└── uploads/                # Diretório para imagens
```

## Como Usar

### 1. Upload de Imagens
- Clique na área de upload ou arraste imagens
- Arquivos são validados automaticamente
- Miniaturas aparecem imediatamente

### 2. Visualização
- Clique no ícone de olho para preview em tela cheia
- Clique no X para fechar o preview

### 3. Remoção
- Clique no ícone X vermelho para remover uma imagem

### 4. Validações
- Tipos de arquivo não suportados são rejeitados
- Arquivos muito grandes são rejeitados
- Limite de imagens é respeitado

## Integração em Novos Componentes

Para usar o componente em outros formulários:

```jsx
import ImageUpload from './ImageUpload';

// No estado do componente
const [images, setImages] = useState([]);

// No JSX
<ImageUpload
  images={images}
  onImagesChange={setImages}
  maxImages={5}
  label="Anexar Imagens"
/>

// No reset do formulário
setImages([]);
```

## Próximos Passos Sugeridos

1. **Persistência**: Implementar upload real para servidor
2. **Compressão**: Adicionar compressão automática de imagens
3. **Formatos**: Suporte a PDF e outros documentos
4. **Galeria**: Visualização em galeria nos detalhes
5. **Metadados**: Adicionar descrições às imagens

## Tecnologias Utilizadas

- React Hooks (useState, useRef)
- Lucide React (ícones)
- File API (drag & drop, preview)
- CSS-in-JS (estilos inline)

---

**Status**: ✅ Implementado e funcional
**Última atualização**: Janeiro 2025