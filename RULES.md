# Regras e Padrões do Projeto MotoristAI

## Navegação e Botão de Voltar

### ✅ CORRETO: Usar o Header Global
O botão de voltar deve ser gerenciado pelo componente `Header.tsx` global, **nunca** dentro das páginas individuais.

**Para adicionar botão de voltar em uma nova página:**
1. Adicione o pattern da rota no arquivo `src/components/Header.tsx`
2. Localize o array `formPagePatterns` 
3. Adicione um regex que corresponda à rota da nova página

**Exemplo:**
```typescript
const formPagePatterns = [
  /^\/entradas\/(nova|[\w-]+\/editar)$/,
  /^\/metas$/,
  /^\/cadastros\/veiculos$/,
  /^\/cadastros\/plataformas$/,  // ← Adicione aqui
  // ... outras rotas
];
```

### ❌ INCORRETO: Botão de voltar dentro da página
**Nunca** adicione um botão de voltar customizado dentro do componente da página:
```tsx
// ❌ NÃO FAÇA ISSO
<button onClick={() => navigate('/ajustes')}>
  <ArrowLeft />
</button>
```

---

## Estrutura de Páginas

### Header de Página
Use apenas título com ícone, sem botão de voltar:
```tsx
<div className="flex items-center gap-3">
  <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
    <IconeDoLucide className="h-6 w-6 text-primary-600 dark:text-primary-400" />
  </div>
  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
    Título da Página
  </h1>
</div>
```

---

## Banco de Dados

### Stores Zustand
- Sempre usar `../services/supabase` para import do cliente Supabase (não `../lib/supabase`)
- Incluir funções de seed automático para dados padrão

### RLS (Row Level Security)
- Sempre habilitar RLS em todas as tabelas
- Criar policies separadas para SELECT, INSERT, UPDATE e DELETE

---

## Valores Padrão

### Plataformas
- Uber, 99 (mínimo obrigatório)

### Categorias de Despesas
- Combustível, Eletricidade (mínimo obrigatório)
