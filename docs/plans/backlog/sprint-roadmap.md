# 🗺️ Roadmap de Sprints — MotoristAI

> **Última atualização:** 05/03/2026
> **Status atual:** Sprint 1 concluída ✅ | Sprint 2 concluída ✅ | Sprint 3 concluída ✅

---

## 📋 Estrutura das Sprints

Cada sprint tem duração de **1 semana** e entrega valor incremental ao usuário.
As tarefas dentro de cada sprint são priorizadas por **impacto x esforço**.

---

## ✅ Sprint 1 — Pré-lançamento (Concluída)

**Objetivo:** Finalizar funcionalidades básicas e eliminar placeholders para lançamento.

### Tarefas

| # | Tarefa | Status | Arquivos envolvidos |
|---|--------|--------|-------------------|
| 1.1 | Dar rota funcional para Trips (corridas) | ✅ | `src/pages/Trips.tsx` |
| 1.2 | Criar página de listagem de despesas veiculares | ✅ | `src/pages/VehicleExpensesList.tsx` |
| 1.3 | Criar página de listagem de despesas familiares | ✅ | `src/pages/FamilyExpensesList.tsx` |
| 1.4 | Substituir placeholder da página AI por conteúdo real | ✅ | `src/pages/AI.tsx` |
| 1.5 | Adicionar "Esqueci minha senha" no Login | ✅ | `src/pages/Login.tsx` |
| 1.6 | Ocultar placeholders disabled do menu Ajustes | ✅ | `src/pages/Settings.tsx` |
| 1.7 | Adicionar "Todas as Despesas" nas seções veiculares e familiares | ✅ | `src/pages/Settings.tsx` |
| 1.8 | Adicionar rota /ai no App.tsx | ✅ | `src/App.tsx` |
| 1.9 | Redirecionar para login se não autenticado | ✅ | `src/components/Layout.tsx` |
| 1.10 | Renomear label "AI" para "Insights" na BottomNavBar | ✅ | `src/components/BottomNavBar.tsx` |

### Critérios de aceite
- [x] Navegação completa sem páginas "em construção"
- [x] Login seguro com "Esqueci minha senha"
- [x] Assistente IA com dados reais do usuário
- [x] Placeholders desabilitados não aparecem no menu

---

## ✅ Sprint 2 — Valor Imediato (Concluída)

**Objetivo:** Adicionar funcionalidades de exportação e melhorar formulários existentes para capturar dados mais ricos.

### Tarefas

| # | Tarefa | Status | Arquivos envolvidos | Estimativa |
|---|--------|--------|-------------------|-----------|
| 2.1 | Exportação CSV de receitas, despesas e corridas | ✅ | `src/utils/exportCsv.ts`, `src/pages/Entries.tsx`, `src/pages/Expenses.tsx`, `src/pages/Trips.tsx`, `src/pages/VehicleExpensesList.tsx`, `src/pages/FamilyExpensesList.tsx` | 4h |
| 2.2 | Esclarecer fluxo de despesas no form "Nova Despesa" | ✅ | `src/pages/NewExpenseChoice.tsx`, `src/App.tsx` | 3h |
| 2.3 | Campos opcionais no formulário de entrada (km, horas, viagens) | ✅ | `src/pages/forms/EntryFormPage.tsx` | 4h |
| 2.4 | `vehicleId` real nos formulários de despesas veiculares | ✅ | `src/components/forms/VehicleSelector.tsx`, `src/pages/forms/vehicle/*.tsx` (5 formulários) | 6h |

### Critérios de aceite
- [x] Exportação CSV funcional em todas as listagens (Entradas, Despesas, Corridas, Desp. Veiculares, Desp. Familiares)
- [x] Ao clicar "Nova Despesa", o usuário escolhe entre Veículo ou Família
- [x] Campos de métricas (viagens, km, horas) são opcionais no formulário de entrada
- [x] Todos os 5 formulários veiculares têm seletor de veículo vinculado ao banco

---

## ✅ Sprint 3 — Diferenciação (Concluída)

**Objetivo:** Funcionalidades que diferenciam o MotoristAI de concorrentes.

| # | Tarefa | Status | Estimativa |
|---|--------|--------|-----------|
| 3.1 | Filtro por veículo no dashboard | ✅ | 6h |
| 3.2 | Onboarding para novos usuários (tour guiado) | ✅ | 8h |
| 3.3 | Notificações push (lembrete para registrar corridas) | ✅ | 12h |

### Detalhamento

#### 3.1 — Filtro por veículo ✅
- Adicionar seletor de veículo no topo do dashboard
- Filtrar receitas, despesas e métricas com base no veículo selecionado
- Exibir "Todos os veículos" por padrão

#### 3.2 — Onboarding ✅
- Detectar primeiro login
- Mostrar sequência de cards explicativos (4 etapas: boas-vindas, corridas, despesas, metas)
- Pular se o usuário clicar "Entendi"
- Persistência via `user.user_metadata` do Supabase Auth
- Componentes: `src/hooks/useOnboarding.ts`, `src/components/OnboardingTour.tsx`
- Integrado em `src/components/Layout.tsx` — aparece após carregamento dos dados

#### 3.3 — Notificações push ✅
- Hook `useNotificationReminder` com timer e persistência via localStorage
- Service worker customizado (`public/sw.js`) com suporte a `push` e `notificationclick`
- Vite PWA configurado com `injectManifest` para SW customizado
- Configuração visual em **Ajustes > Lembretes** com:
  - Toggle ativar/desativar
  - Seletor de horário (hora + minuto)
  - Dias da semana (toggle por botão, com proteção para não desmarcar todos)
  - Status da permissão de notificação
  - Pré-visualização da notificação
- Fallback para Notification API quando não há service worker
- Build verificado — `dist/sw.js` gerado sem erros

---

## 🔮 Sprint 4+ — Estratégico (Futuro)

**Objetivo:** Funcionalidades de longo prazo que geram retenção e diferenciação competitiva.

| # | Tarefa | Status | Estimativa | Prioridade |
|---|--------|--------|-----------|-----------|
| 4.1 | Importação de extratos bancários (PDF/CSV) | ⬜ | 16h | 🔥 Alta |
| 4.2 | Relatório PDF para comprovação de renda | ⬜ | 12h | 🔥 Alta |
| 4.3 | Alertas de manutenção por km | ⬜ | 8h | Média |
| 4.4 | Integração com APIs de plataformas (Uber, 99) | ⬜ | 20h | Baixa |
| 4.5 | Modo escuro completo (já iniciado) | ⬜ | 4h | Média |
| 4.6 | Suporte a múltiplos veículos simultâneos | ⬜ | 10h | Média |
| 4.7 | App Android/iOS nativo (Capacitor) | ⬜ | 24h | Baixa |

### Detalhamento

#### 4.1 — Importação de extratos
- Upload de arquivo PDF/CSV
- Parse automático de valores, datas e descrições
- Classificação inteligente por categoria
- Diferencial competitivo: motorista não precisa lançar manualmente

#### 4.2 — Relatório PDF
- Gerar PDF mensal com:
  - Resumo financeiro (receitas, despesas, lucro)
  - Gráfico de evolução
  - Tabela de corridas
- Ideal para comprovação de renda em financiamentos

#### 4.3 — Alertas de manutenção
- Configurar km para cada tipo de manutenção (óleo, pneus, correia)
- Notificar quando o veículo atingir o km configurado
- Vincular ao odômetro registrado nas entradas

---

## 📊 Métricas de Acompanhamento

| Sprint | Previsão | Início | Término | Entregues | Pendentes |
|--------|----------|--------|---------|-----------|-----------|
| Sprint 1 | 1 semana | 16/04 | 16/04 | 10/10 | 0 |
| Sprint 2 | 1 semana | 16/04 | 16/04 | 4/4 | 0 |
| Sprint 3 | 1-2 semanas | 16/04 | 05/03 | 3/3 | 0 |
| Sprint 4+ | Contínuo | — | — | 0/7 | 7 |

---

## 🧠 Regras de Priorização

1. **Valor para o usuário primeiro** — funcionalidades que o usuário usa todo dia
2. **Esforço baixo, impacto alto** — entregas rápidas geram confiança
3. **Diferenciação** — só após o básico estar sólido
4. **Infraestrutura** — melhorias técnicas que destravam entregas futuras

---

## 📝 Como usar este documento

- **Antes de iniciar uma sprint:** mova as tarefas para "Em andamento" e crie branches
- **Durante a sprint:** atualize o status conforme avança
- **Após concluir:** mova o conteúdo para `docs/plans/history/` com a data

> ⚠️ **Mantenha este documento atualizado!** Ele é a fonte da verdade sobre o roadmap do projeto.