# 009 — Sessão, Políticas Públicas e Parsing Monetário

**Status:** ✅ Concluído
**Criado em:** 2026-06-18
**Concluído em:** 2026-06-18

---

## O que foi feito

### 1. Expiração de Sessão (nível banco)

**Problema:** Sessão persistia para sempre (só expirava no logout manual).

**Solução:** Duas camadas de expiração:
- **Inatividade 5 min** → `useInactivityLogout` escuta eventos (`mousedown`, `keydown`, `touchstart`, `scroll`, `mousemove`) e faz logout após 5 min sem interação
- **Sessão máxima 24h** → `supabase.ts` armazena timestamp de início no `localStorage` e expira ao atingir 24h

**Tela dedicada:** Ao expirar, redireciona para `/login` exibindo um card "Sessão expirada" com motivo (inatividade ou 24h) + botão "Fazer login".

**Arquivos:**
| Arquivo | Mudança |
|---|---|
| `src/hooks/useInactivityLogout.ts` | 🆕 Hook de inatividade |
| `src/services/supabase.ts` | ✏️ Intercepta `onAuthStateChange` + `getSession` para gravar `session_expired_reason` |
| `src/pages/Login.tsx` | ✏️ Lê flag e exibe tela dedicada |
| `src/App.tsx` | ✏️ `InactivityWatcher` inline que chama o hook |

### 2. Páginas de Política Públicas

**Problema:** Links "Termos de Uso" e "Privacidade" no login apontavam para `/terms` e `/privacy` (rotas **inexistentes** → tela branca).

**Causa raiz:**
- Links em `AuthCard.tsx` apontavam para `/terms` e `/privacy`
- Rotas reais eram `/politicas/termos`, `/politicas/privacidade`, `/politicas/lgpd`
- Todas protegidas por `ProtectedRoute` (exigiam login)

**Solução:**
- Links corrigidos para `/politicas/termos`, `/politicas/privacidade`, `/politicas/lgpd`
- `ProtectedRoute` removido das 3 rotas (App.tsx)
- `Layout.tsx` refatorado: detecta `/politicas/*` e renderiza `PublicHeader` + conteúdo + `PublicFooter` quando `!user`
- `PublicHeader.tsx` (novo) — Header mínimo: botão "Voltar" + logo
- `PublicFooter.tsx` (novo) — Footer com links Termos · Privacidade · LGPD

**Arquivos:**
| Arquivo | Mudança |
|---|---|
| `src/pages/Login.tsx` | ✏️ Tela dedicada "Sessão expirada" |
| `src/App.tsx` | ✏️ Desproteger rotas de política |
| `src/components/ui/AuthCard.tsx` | ✏️ Links corrigidos (+ LGPD) |
| `src/components/Layout.tsx` | ✏️ Detecção de páginas públicas |
| `src/components/PublicHeader.tsx` | 🆕 Criado |
| `src/components/PublicFooter.tsx` | 🆕 Criado |

### 3. Parsing Monetário (pt-BR)

**Problema:** Inputs `type="number"` não aceitam vírgula como separador decimal no Android (padrão pt-BR). Usuário digitava `365,50` e o valor era ignorado ou convertido incorretamente.

**Solução:**
- `parseAmount()` em `formatters.ts` — aceita `"365,50"` e `"1.234,56"`, retorna número ou `null`
- `MoneyInput.tsx` — component customizado com `inputMode="decimal"` + `lang="pt-BR"`, dispara `onChange` a cada keystroke
- Substituídos `type="number"` por `<MoneyInput />` em QuickEntryModal, ExpenseModal, TripModal e 21+ formulários
- Todos os `parseFloat`/`Number(...)` de valores monetários substituídos por `parseAmount()`

**Arquivos:** 21+ arquivos alterados (todos os formulários de entrada/despesa familiar/veicular/recorrente)

---

## Critérios de Done

- [x] Build (`npm run build`) sem erros
- [x] Teste manual de inatividade: 30s sem ação → logout + tela "Sessão expirada"
- [x] Teste manual das páginas de política sem login (Termos, Privacidade, LGPD)
- [x] Páginas de política com layout mínimo (cabeçalho + rodapé)
- [x] Voltar da política → login
- [x] Parsing `365,50` e `1.234,56` salvos como 365.5 e 1234.56
- [x] Docs atualizadas

## Pendências (Phase 2)

- Migration SQL para identificar/corrigir dados históricos salvos 100× maior
- `CHECK` constraint no Supabase para evitar valores > 1.000.000 sem justificativa
- Testes unitários para `parseAmount()` / `parseCurrency()`
- Documento `docs/MONETARY_STANDARDS.md`
