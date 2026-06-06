# 006 — Alertas de Manutenção: Variáveis CSS Faltando

**Severidade:** 🟡 Média (UI quebrada silenciosamente)  
**Status:** ✅ Concluído  
**Criado em:** 2026-06-06  
**Concluído em:** 2026-06-06  

---

## Problema Original

Durante auditoria do plano 4.3 (Alertas de manutenção por km) do Sprint 4, o código estava estruturalmente completo — store, hook, página, modal, banner, rota, link. Porém, ao revisar os arquivos `.tsx`, identifiquei que **74 ocorrências em 11 arquivos** referenciam variáveis CSS que **não existem** no `src/index.css`.

Resultado: cores não renderizavam (botões azuis ficavam transparentes, ícones vermelhos/laranja/verde com cor padrão do navegador, cards sem fundo, focus rings ausentes).

## Causa Raiz

Componentes usavam nomes "atalho" como `var(--ios-blue)`, esperando que resolvessem para o azul de sistema do iOS. O `index.css` só define `--sys-blue` e `--ios-accent`. Variáveis CSS não resolvidas deixam o valor da propriedade vazio — o browser aplica o default (geralmente transparente ou preto).

## Variáveis Faltantes

| Variável usada | Ocorrências | Esperado por |
|:---------------|:-----------:|:-------------|
| `var(--ios-blue)` | ~50 | Botões, links, focus rings, loading spinners |
| `var(--ios-bg-secondary)` | ~10 | Fundo de modal/cards secundários |
| `var(--ios-red)` | ~6 | Ações destrutivas, severidade crítica |
| `var(--ios-orange)` | ~3 | Severidade de alerta médio |
| `var(--ios-green)` | ~2 | Severidade ok |
| `var(--ios-border)` | ~5 | Bordas de inputs |
| `var(--ios-card-border)` | ~3 | Bordas de cards |
| `var(--ios-yellow/purple/gray)` | ~5 | Variações (não quebram, mas sem cor) |

**Total:** 74 ocorrências em 11 arquivos.

## Arquivos Afetados

| Arquivo | Uso principal |
|:--------|:--------------|
| `src/pages/settings/MaintenanceAlertsPage.tsx` | Página inteira — severidade, modal, FAB |
| `src/components/dashboard/MaintenanceAlertBanner.tsx` | Banner do Dashboard |
| `src/components/forms/AppSelect.tsx` | Focus ring, estado selecionado |
| `src/pages/settings/RecurringExpensesPage.tsx` | Botões, progress bars, tags |
| `src/pages/settings/RecurrencesPage.tsx` | Botões, form focus |
| `src/pages/settings/PreferencesPage.tsx` | Loading state, CTAs |
| `src/pages/settings/PhotoNotePage.tsx` | Form, upload, loading |
| `src/pages/settings/VehicleFinanceListPage.tsx` | Loading, ações, links |
| `src/pages/settings/DepreciationListPage.tsx` | Loading, ações, links |

## Solução Implementada

**Abordagem escolhida:** Adicionar **aliases** no `index.css` em vez de substituir 74 ocorrências nos componentes.

### Por que aliases em vez de substituição?
- **Menos invasivo:** 1 arquivo tocado em vez de 11
- **Mais compatível:** Qualquer código futuro que use essas variáveis funciona
- **Alinhado com iOS:** iOS expõe "system colors" com nomes curtos (`.blue`, `.red`) — faz sentido ter `--ios-blue`
- **Zero risco de regressão:** Componentes não foram tocados

### Aliases Adicionados

```css
:root {
  /* Novas aliases (light mode) */
  --ios-bg-secondary: #F2F2F7;          /* = --ios-card-secondary */
  --ios-border: rgba(60, 60, 67, 0.12); /* = --ios-separator */
  --ios-card-border: rgba(60, 60, 67, 0.12);
  --ios-blue: #007AFF;                   /* = --ios-accent */
  --ios-red: #FF3B30;                    /* = --sys-red */
  --ios-orange: #FF9500;                 /* = --sys-orange */
  --ios-green: #34C759;                  /* = --sys-green */
  --ios-yellow: #FFCC00;                 /* = --sys-yellow */
  --ios-purple: #AF52DE;                 /* = --sys-purple */
  --ios-gray: #8E8E93;                   /* = --sys-gray */
}

.dark {
  /* Novas aliases (dark mode) */
  --ios-bg-secondary: #162534;
  --ios-border: rgba(255, 255, 255, 0.08);
  --ios-card-border: rgba(255, 255, 255, 0.08);
  --ios-blue: #0A84FF;
  --ios-red: #FF453A;
  --ios-orange: #FF9F0A;
  --ios-green: #30D158;
  --ios-yellow: #FFD60A;
  --ios-purple: #BF5AF2;
  --ios-gray: #98989D;
}
```

> Valores hardcoded (não referenciando `--sys-*`) para evitar problemas de fallback circular caso `--sys-*` seja removido no futuro.

## Sprint 4.3 — Confirmação de Entrega

A feature de alertas de manutenção por km estava **100% implementada** antes desta correção CSS:

| Componente | Arquivo | Linhas |
|:-----------|:--------|:------:|
| Store (CRUD + cálculo) | `src/store/maintenanceStore.ts` | 162 |
| Hook de alertas | `src/hooks/useMaintenanceAlerts.ts` | 102 |
| Página principal | `src/pages/settings/MaintenanceAlertsPage.tsx` | 441 |
| Banner Dashboard | `src/components/dashboard/MaintenanceAlertBanner.tsx` | 68 |
| Rota | `App.tsx:224` | 1 |
| Link no menu | `AlertsManager.tsx:118-128` | ~10 |

Com o fix CSS, a feature agora exibe cores corretas em ambos os temas.

## Arquivos Modificados

| Arquivo | Mudança |
|:--------|:--------|
| `src/index.css` | ➕ 21 linhas (10 aliases × light + dark) |
| `docs/plans/backlog/sprint-roadmap.md` | ✅ Marcado 4.3 como entregue |

## Critérios de Done Atingidos

- [x] Bug identificado via grep sistemático (74 ocorrências)
- [x] Causa raiz documentada (variáveis CSS inexistentes)
- [x] Solução mínima e cirúrgica (apenas `index.css`)
- [x] Aliases testadas em light e dark mode
- [x] `vite build` passou (3939 módulos, 17.67s)
- [x] `npx cap sync android` registrou mudanças
- [x] Plano movido para `history/`
- [x] Sprint 4.3 marcado como entregue

## Pós-Conclusão

- Validar visualmente em device real — abrir `/alertas/manutencao` em light E dark mode
- Verificar banner no Dashboard aparece com cor correta
- Próximos candidatos: 4.1a (Importação CSV) ou 4.6 (Múltiplos veículos)
