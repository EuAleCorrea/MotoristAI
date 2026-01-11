# Sistema de Metas - MotoristAI

## 📋 Visão Geral

O sistema de Metas do MotoristAI permite que o motorista defina objetivos financeiros mensais e acompanhe seu progresso diário através do dashboard principal.

---

## 🎯 Cadastro de Metas

### Campos do Formulário

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Dias trabalhados na semana** | Quantos dias por semana o motorista trabalha | 5 |
| **Ano** | Ano da meta | 2026 |
| **Mês** | Mês da meta | Janeiro |
| **Semanas no mês** | Campo calculado automaticamente | 4,43 |
| **Faturamento (R$)** | Meta de receita bruta mensal | R$ 6.000,00 |
| **Lucro (R$)** | Meta de lucro líquido mensal | R$ 4.500,00 |
| **Despesa (R$)** | Meta máxima de despesas mensais | R$ 1.500,00 |

### Cálculo de Semanas no Mês

O campo "Semanas no mês" é **calculado automaticamente** com base no ano e mês selecionados:

```
Semanas = Dias no mês / 7
```

**Exemplo:** Janeiro/2026 tem 31 dias → 31 ÷ 7 = **4,43 semanas**

---

## 📊 Cálculo da Meta Diária no Dashboard

### Fórmula Principal

O dashboard exibe a meta diária calculada da seguinte forma:

```
Meta Diária = Meta Mensal de Faturamento / Dias Úteis no Mês
```

### Cálculo Detalhado

1. **Busca a meta do mês atual:**
   ```javascript
   const currentMonthGoal = getGoalByMonth(ano_atual, mes_atual);
   const metaMensalFaturamento = currentMonthGoal?.revenue || 0;
   ```

2. **Calcula dias úteis no mês:**
   ```javascript
   const diasNoMes = 31; // (exemplo para Janeiro)
   const diasPorSemana = meta.daysWorkedPerWeek || diasNoMes;
   
   // Fórmula: (dias no mês / 7) * dias trabalhados por semana
   const diasUteisNoMes = (diasNoMes / 7) * diasPorSemana;
   ```

3. **Calcula meta diária:**
   ```javascript
   const metaDiaria = metaMensalFaturamento / diasUteisNoMes;
   ```

### Exemplo Prático

| Parâmetro | Valor |
|-----------|-------|
| Meta Mensal de Faturamento | R$ 6.000,00 |
| Dias no mês (Janeiro) | 31 |
| Dias trabalhados por semana | 5 |
| Semanas no mês | 31 ÷ 7 = 4,43 |
| Dias úteis no mês | 4,43 × 5 = **22,14 dias** |
| **Meta Diária** | R$ 6.000 ÷ 22,14 = **R$ 271,04** |

---

## 🔄 Representação Visual no Dashboard

### Componente LucroCentral (Círculo Principal)

O círculo central do dashboard exibe:

1. **Lucro Líquido do Dia:** Faturamento do dia - Despesas do dia
2. **Meta Diária:** Calculada conforme descrito acima
3. **Percentual de Progresso:** `(Lucro do Dia / Meta Diária) × 100`

### Elementos Visuais

```
┌─────────────────────────────────┐
│           HOJE                  │
│        R$ 280,00                │  ← Lucro Líquido do dia
│       Lucro Líquido             │
│     Meta: R$ 67,74 📈           │  ← Meta diária calculada
│           100%                  │  ← % de progresso (max 100%)
└─────────────────────────────────┘
```

### Barra de Progresso Circular

- **Círculo cinza:** Representa 100% da meta
- **Círculo azul gradiente:** Representa o progresso atual
- **Fórmula do progresso:**
  ```javascript
  percentual = Math.min((lucroLiquido / meta) * 100, 100);
  ```
  *O percentual é limitado a 100% para não quebrar a visualização*

### Indicadores de Status

| Ícone | Significado |
|-------|-------------|
| 📈 (TrendingUp verde) | Meta atingida ou ultrapassada |
| 📉 (TrendingDown cinza) | Meta ainda não atingida |

---

## 🗄️ Estrutura de Dados

### Tabela `goals` no Supabase

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL, -- 1-12
  days_worked_per_week INTEGER,
  revenue DECIMAL(10,2),   -- Meta de faturamento
  profit DECIMAL(10,2),    -- Meta de lucro
  expense DECIMAL(10,2),   -- Meta de despesa
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Interface TypeScript

```typescript
interface Goal {
  id: string;
  year: number;
  month: number;        // 1-12
  daysWorkedPerWeek?: number;
  revenue?: number;     // Meta de faturamento
  profit?: number;      // Meta de lucro
  expense?: number;     // Meta de despesa máxima
}
```

---

## 📅 Visualização por Período

### Dashboard "Hoje"
- Mostra meta **diária** (meta mensal ÷ dias úteis)
- Compara lucro do dia com meta diária

### Visualização Diária
- Mesma lógica do "Hoje", mas para data selecionada

### Visualização Semanal
- Meta semanal = Meta mensal ÷ 4
- Simplificado para divisão por 4 semanas

### Visualização Mensal
- Mostra meta mensal diretamente do cadastro
- Compara faturamento real vs meta cadastrada

### Visualização Anual
- Soma todas as metas mensais do ano
- Compara faturamento real do ano vs soma das metas

---

## ⚠️ Comportamento Especial

### Quando não há meta cadastrada

Se não existir meta para o mês atual:
```javascript
const dailyGoal = monthlyRevenueGoal > 0 ? calculatedDailyGoal : 300;
```
- **Valor padrão:** R$ 300,00 por dia

### Meta zerada ou não preenchida

- Se `revenue = 0` ou `null`, o sistema usa R$ 300 como fallback
- O indicador de meta não é exibido se não houver meta válida

---

## 🔧 Arquivos Relacionados

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/store/goalStore.ts` | Gerenciamento de estado das metas |
| `src/pages/forms/GoalFormPage.tsx` | Formulário de cadastro/edição |
| `src/components/dashboard/DashboardHome.tsx` | Cálculo da meta diária |
| `src/components/dashboard/LucroCentral.tsx` | Exibição visual do progresso |
| `src/utils/dateHelpers.ts` | Funções auxiliares (semanas no mês) |

---

## 📝 Resumo do Fluxo

```
1. Usuário cadastra meta mensal
   ↓
2. Sistema armazena no Supabase
   ↓
3. Dashboard busca meta do mês atual
   ↓
4. Calcula dias úteis: (dias no mês / 7) × dias por semana
   ↓
5. Calcula meta diária: meta mensal / dias úteis
   ↓
6. Compara lucro do dia com meta diária
   ↓
7. Exibe progresso visual no círculo central
```
