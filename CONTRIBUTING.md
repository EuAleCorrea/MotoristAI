# 🤝 Guia de Contribuição — MotoristAI

Obrigado por contribuir com o MotoristAI! Este guia garante que nosso código seja consistente, organizado e fácil de manter.

---

## 📋 Índice

- [Fluxo de Trabalho](#-fluxo-de-trabalho)
- [Convenção de Commits](#-convenção-de-commits)
- [Padrões de Código](#-padrões-de-código)
- [Zustand (State Management)](#-zustand-state-management)
- [Supabase](#-supabase)
- [Checklist de Pull Request](#-checklist-de-pull-request)

---

## 🔄 Fluxo de Trabalho

```
1. Crie uma branch a partir de `main`
   git checkout main
   git pull origin main
   git checkout -b feature/nome-descritivo

2. Desenvolva e commite seguindo a convenção
   git add .
   git commit -m "feat: adicionar cálculo de km por corrida"

3. Antes de abrir o PR, valide:
   npm run lint
   npm run build

4. Abra um Pull Request para `main`
   - Preencha o template de PR
   - Aguarde review

5. Após aprovação, faça merge via GitHub
```

### Branches — Nomenclatura

| Prefixo | Quando usar | Exemplo |
|---------|-------------|---------|
| `feature/` | Nova funcionalidade | `feature/relatorio-pdf` |
| `fix/` | Correção de bug | `fix/data-fuso-horario` |
| `refactor/` | Refatoração sem alterar comportamento | `refactor/entry-store` |
| `docs/` | Apenas documentação | `docs/guia-supabase` |
| `chore/` | Manutenção (deps, configs) | `chore/atualizar-vite` |

> ⚠️ **Nunca** faça push direto na `main`. Sempre abra um Pull Request.

---

## 📝 Convenção de Commits

Usamos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
<tipo>: <descrição curta em português>
```

### Tipos Permitidos

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade para o usuário |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança funcional |
| `style` | Mudanças apenas visuais (CSS, UI) |
| `docs` | Alterações em documentação |
| `chore` | Manutenção (dependências, configs, CI) |
| `perf` | Melhorias de performance |

### Exemplos

```
✅ feat: adicionar gráfico de receita semanal
✅ fix: corrigir cálculo de meta mensal com dias zerados
✅ refactor: simplificar lógica do platformStore
✅ style: ajustar espaçamento dos cards no dashboard
✅ docs: documentar API de despesas

❌ update
❌ fix bug
❌ mudanças
```

---

## 🎨 Padrões de Código

### TypeScript
- **Sempre** tipar props de componentes e retornos de funções
- Preferir `interface` para props e `type` para unions/helpers
- Evitar `any` — use `unknown` quando o tipo é incerto

### React
- Componentes como **função** (nunca classes)
- Um componente por arquivo
- Nomes de arquivos em **PascalCase** (ex.: `StatsCard.tsx`)
- Hooks customizados prefixados com `use` (ex.: `useTheme.ts`)

### Tailwind CSS
- **Sempre** usar classes Tailwind, nunca CSS custom desnecessário
- Consultar o `tailwind.config.cjs` para temas e extensões já definidas
- Agrupar classes seguindo a ordem: layout → sizing → spacing → typography → visual → state

```tsx
// ✅ Bom
<div className="flex items-center gap-4 p-4 text-sm text-gray-700 bg-white rounded-2xl hover:shadow-md">

// ❌ Ruim — CSS inline misturado
<div className="flex" style={{ padding: '16px', color: '#333' }}>
```

### Ícones
- Usar exclusivamente **Lucide React** (`lucide-react`)
- Importar ícones individualmente:

```tsx
import { Car, DollarSign } from 'lucide-react';
```

---

## 🗄️ Zustand (State Management)

### Regras

1. **Um store por domínio** — cada arquivo em `src/store/` cuida de uma entidade
2. **Tipagem forte** — toda store tem interface de tipagem
3. **Async com Supabase** — operações de CRUD dentro do store
4. **Sem lógica de UI** — stores contém apenas estado e ações de dados

### Estrutura de um Store

```typescript
import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface Entry {
  id: string;
  amount: number;
  // ...
}

interface EntryStore {
  entries: Entry[];
  loading: boolean;
  fetchEntries: (userId: string) => Promise<void>;
  addEntry: (entry: Omit<Entry, 'id'>) => Promise<void>;
}

export const useEntryStore = create<EntryStore>((set) => ({
  entries: [],
  loading: false,
  fetchEntries: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId);
    set({ entries: data ?? [], loading: false });
  },
  addEntry: async (entry) => {
    // ...
  },
}));
```

---

## 🛡️ Supabase

### Regras de Ouro

1. **RLS (Row Level Security) sempre ativado** em todas as tabelas
2. **Nunca** usar `service_role` key no frontend — apenas `anon` key
3. **Migrations** ficam em `supabase/migrations/` com nomes descritivos
4. **Autenticação** é gerenciada pelo Supabase Auth — não criar sistemas custom

### Criando uma Migration

```sql
-- supabase/migrations/nome_descritivo.sql

-- Exemplo: adicionar coluna de categoria
ALTER TABLE entries ADD COLUMN category_id UUID REFERENCES categories(id);

-- Lembrar de atualizar a policy RLS se necessário
CREATE POLICY "Users can read own entries"
  ON entries FOR SELECT
  USING (auth.uid() = user_id);
```

---

## ✅ Checklist de Pull Request

Antes de abrir seu PR, confirme:

- [ ] Código segue os padrões deste guia
- [ ] `npm run lint` passa sem erros
- [ ] `npm run build` compila sem erros
- [ ] Testado localmente no navegador
- [ ] Commits seguem a convenção (`feat:`, `fix:`, etc.)
- [ ] Screenshots incluídas (se houve mudanças de UI)
- [ ] Nenhuma credencial/secret hardcoded no código

---

## 🆘 Dúvidas?

Abra uma Issue com a label `docs` ou entre em contato com o mantenedor do projeto.
