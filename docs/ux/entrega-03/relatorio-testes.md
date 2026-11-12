# Relatório de Testes — Entrega 03.1 (Tela Início)

**Referência anterior:** commit `8169005` (Entrega 02.2)
**Escopo:** Implementação da tela nativa **Início** em Kotlin + Jetpack Compose / Material 3.
**Data:** 12/11/2026

---

## 1. Escopo Entregue

A tela Início foi desenvolvida como um componente Compose reutilizável e estrito (`HomeScreen.kt`), seguindo exatamente a arquitetura aprovada (Entrega 01) e os tokens e componentes do Design System (Entregas 02 e 02.2):

1. **Cabeçalho (`HomeHeader`):** Logo do MotoristAI, título "Início", subtítulo, botão de notificações com badge de alerta e avatar de perfil.
2. **Seletor de Período (`PeriodSelectorRow`):** Segmented control ("Hoje" | "Mês") e navegador de mês ("◄ Nov/2026 ►").
3. **Card de Saldo (`BalanceCard`):** Gradiente de saldo com alternância de visibilidade (ocultar/exibir valor) e formatação monetária segura.
4. **Indicadores (`IndicatorCard`):** Cards de Receitas e Despesas em 2 colunas responsivas, recebendo valores em centavos (`Long`).
5. **Metas (`HomeGoalSection`):** Card de faturamento mensal com progresso percentual e barra linear M3.
6. **Acessos Rápidos (`HomeQuickAccessSection`):** Três cartões de atalho (IA MotoristAI, Odômetro, Importação).
7. **Movimentações Recentes (`HomeTransactionsSection`):** Lista unificada com itens reutilizando `MotoristAIListItem`, separadores e link "Ver todas >".

---

## 2. Validação e Testes Executados

### 2.1 Compilação Debug
```
> Task :app:assembleDebug
BUILD SUCCESSFUL
```
Executado com sucesso, sem erros ou warnings de compilação.

### 2.2 Testes Unitários
```
> Task :app:testDebugUnitTest
45 passed, 0 skipped, 0 failed
```
- `UndoControllerTest` (19 testes)
- `MoneyTest` (9 testes)
- `MoneyTextSizingTest` (8 testes)
- `NavigationMetricsTest` (9 testes)

### 2.3 Simulação de Tema e Escala de Fonte
- Validação visual em ambos os modos Light e Dark via `@Preview` com `uiMode`.
- Validação de densidade de tela e espaçamentos (paddings laterais de 16 dp, barras superiores adaptadas a `WindowInsets.statusBars`).
- Valores monetários gerenciados via `Money.format()` (centavos `Long`), garantindo ausência de truncamento.

---

## 3. Limitações do Ambiente (Registradas)
- **Testes instrumentados (UI test / Espresso / Compose Test):** Não executados por ausência de dispositivo ou emulador conectado (`adb devices` vazio).
- **Dados reais de produção:** A tela utiliza estado imutável (`HomeUiState`) com dados de demonstração (*preview*), sem acesso direto ao banco ou serviços de rede nesta etapa.
- **WebView:** Mantido intacto no aplicativo principal (fora de escopo).
