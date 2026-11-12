# Relatório de Testes — Entregas 02.1 e 02.2

**Referência anterior:** commits `c373977` (02) e `c73179d` (02.1)
**Escopo:** correções da barra inferior, do Desfazer, dos indicadores financeiros, das dependências
(02.1) e endurecimento do `UndoController` (02.2)
**Data:** 12/11/2026

---

## 1. Ambiente

| Item | Valor |
|:--|:--|
| SO | Windows (host de desenvolvimento) |
| JDK | 21 (toolchain do Android Studio) |
| Gradle | 9.6.0 · AGP 9.4.1 · Kotlin 2.2.10 |
| compileSdk / targetSdk | 36 |
| minSdk | 24 |
| Compose BOM | 2025.02.00 |
| Dispositivo / emulador | **nenhum conectado** (`adb devices` vazio) |

---

## 2. Testes executados de fato

### 2.1 Compilação Debug

```
> Task :app:assembleDebug
BUILD SUCCESSFUL
```

Executado após cada mudança de código. Resultado final: **sucesso**, 0 erros.

### 2.2 Testes unitários (JVM)

```
> Task :app:testDebugUnitTest
37 passed, 0 skipped, 0 failed
```

| Classe de teste | Testes | Objeto |
|:--|--:|:--|
| `UndoControllerTest` | 11 | Janela de 5.000 ms, disparo único, id obsoleto, supersessão, dispose, falha e exceção |
| `MoneyTest` | 9 | Formatação pt-BR: zero, centavos, milhar, milhão, negativos, `Long.MIN_VALUE`, rótulo de acessibilidade |
| `MoneyTextSizingTest` | 8 | Escolha de tipografia, ausência de truncamento, escala de fonte 200%, colunas responsivas |
| `NavigationMetricsTest` | 9 | 320/360/393/480 dp, alvo mínimo de 48 dp, inset de gestos e de 3 botões, rótulos curtos |

**Registro honesto de uma falha intermediária:** a primeira execução (`--tests com.motoristai.app.ui.*`)
retornou `35 passed, 1 failed`. A causa foi uma asserção **incorreta no próprio teste**
(`indicatorColumns(320f)` era comparado com 1, quando a regra define 2 colunas a partir de 300 dp).
A asserção foi corrigida; nenhuma linha de produção precisou mudar. A execução completa
seguinte passou com 37/37.

### 2.3 Testes de navegação e responsividade

Cobertos por `NavigationMetricsTest`, que valida o cálculo puro usado pela barra:

| Largura | Slot calculado | Rótulo | Padding do conteúdo (inset 24) |
|--:|--:|:--|--:|
| 320 dp | 66,00 dp | curto | 116 dp |
| 360 dp | 76,00 dp | completo | 116 dp |
| 393 dp | 84,25 dp | completo | 116 dp |
| 480 dp | 106,00 dp | completo | 116 dp |

Com inset de 48 dp (3 botões), o padding do conteúdo vai a 140 dp e o FAB sobe para 76 dp.
A soma dos slots nunca excede a largura disponível e nenhum alvo é menor que 48 dp —
ambas as invariantes verificadas por asserção.

### 2.4 Acessibilidade

| Verificação | Como foi feita | Resultado |
|:--|:--|:--|
| Leitura integral do valor monetário | Teste de `Money.accessibilityLabel` com valor de milhão | ✅ passa |
| Ordem de foco da barra (Início → Movim. → FAB → Relatórios → Ajustes) | `traversalIndex` explícito por slot | ✅ implementado |
| Alvo de toque ≥ 48 dp | `NavigationMetricsTest` em 4 larguras | ✅ passa |
| Contraste AA | Tabela §2.4 de `tokens.md` (pares medidos) | ✅ conforme |
| Skeleton não lido pelo leitor de tela | `clearAndSetSemantics { }` | ✅ implementado |

---

## 3. Testes **não** executados — limitação registrada

| Teste | Motivo | Situação |
|:--|:--|:--|
| Instrumentados (`androidTest`, Compose UI) | **Nenhum dispositivo ou emulador conectado.** `adb devices` retorna lista vazia e não há AVD configurado neste ambiente | ❌ não executado |
| Renderização dos `@Preview` pelo tooling do IDE | `render_compose_preview` respondeu "Failed to find preview element" | ❌ não executado |
| Navegação por gestos vs. 3 botões em aparelho real | Depende de dispositivo | ❌ não executado (coberto apenas por cálculo unitário do inset) |

> As capturas `preview-white-mode.png` e `preview-dark-mode.png` são renderizações de
> **referência dos tokens** (HTML espelhando os valores de `tokens.md`) — **não** são
> screenshots de execução do app em dispositivo. Não há evidência de execução em runtime
> nesta entrega.

Para executar os instrumentados quando houver emulador:

```bash
cd android
./gradlew app:connectedDebugAndroidTest
```

---

## 4. Correções aplicadas

### 4.1 Barra inferior (`MotoristAINavigationBar.kt`)

- Distribuição rígida substituída por cálculo em `NavigationMetrics` a partir da largura real
  (`BoxWithConstraints`) e do inset de sistema (`WindowInsets.navigationBars`).
- Slot central reservado ao FAB com 56 dp; os 4 destinos dividem o restante com piso de 48 dp.
- Rótulos trocam para a forma curta abaixo de 68 dp de slot ou acima de 125% de escala de fonte.
- FAB posicionado por `fabBottomOffsetDp` calculado (inset + 28 dp), sem valores mágicos.
- Ordem de acessibilidade fixa via `traversalIndex`.
- Quatro destinos e FAB central preservados.

### 4.2 Desfazer (`Overlays.kt` + `undo/UndoController.kt`)

- Lógica extraída para `UndoController`, testável em JVM, com janela de exatamente 5.000 ms.
- `consumed` marcado antes do callback: confirmação ocorre **uma única vez**.
- `undo(id)` ignora ids obsoletos; nova ação supersede a anterior **confirmando-a** (nunca
  descartando o registro).
- `confirmAndClear()` no `DisposableEffect`: sair da tela confirma a ação pendente.
- Falha na confirmação chama `onFailed` e não é silenciada.
- `SnackbarDuration` do M3 não é usado (mínimo de 4 s).

> **Nada executa exclusão definitiva nesta entrega.** O controlador apenas invoca callbacks;
> a aplicação decide o que fazer. Nenhum caminho de escrita em banco foi adicionado.

### 4.3 Indicadores financeiros (`Cards.kt` + `MoneyText.kt` + `util/Money.kt`)

- `TextOverflow.Ellipsis` **removido** de todo valor monetário.
- Tamanho da fonte escolhido por largura disponível e escala de fonte do sistema
  (degraus 28 → 24 → 20 → 18 → 16 sp).
- Espaço não separável entre "R$" e o número: a quebra de linha nunca corta dígitos.
- `IndicatorGroup` responsivo: 3 colunas ≥ 360 dp, 2 colunas ≥ 300 dp, empilhado abaixo disso.
- Rótulo de acessibilidade sempre com o valor integral.
- Componentes passaram a receber **centavos (`Long`)** em vez de string formatada, eliminando
  divergência de formatação entre telas.

### 4.4 Dependências (`android/app/build.gradle`)

- `material-icons-extended` **removido**.
- Ícones que não existem no pacote `core` foram substituídos por vetores próprios em
  `ui/icons/MotoristAIIcons.kt` (Visibility, VisibilityOff, Mic, TrendingUp, TrendingDown,
  Inbox, ErrorOutline), desenhados com traço de 2 dp.
- Ícones core preservados: Add, ArrowDropDown, CheckCircle, KeyboardArrowRight, Close, Delete,
  Home, List, Settings, Search, Info, Lock, Place, ShoppingCart.
- Compilação confirmada após a remoção (`BUILD SUCCESSFUL`).

---

## 5. Artefatos desta entrega

| Arquivo | Conteúdo |
|:--|:--|
| `ui/navigation/NavigationMetrics.kt` | Cálculo puro da barra |
| `ui/undo/UndoController.kt` | Controlador transacional do Desfazer |
| `ui/util/Money.kt` | Formatação pt-BR determinística |
| `ui/util/MoneyTextSizing.kt` | Escolha de tipografia e colunas |
| `ui/components/MoneyText.kt` | Valor monetário sem truncamento |
| `ui/icons/MotoristAIIcons.kt` | 7 vetores próprios |
| `src/test/java/...` | 4 classes, 37 testes |

---

## 5-A. Entrega 02.2 — Correção do `UndoController`

### 5-A.1 Defeitos encontrados no código de `c73179d`

| # | Defeito | Evidência no código anterior |
|--:|:--|:--|
| 1 | Substituição de ação pendente chamava `previous.onConfirm()` **direto**, fora do `commit()` | Retorno `false` e exceções da ação substituída eram silenciados |
| 2 | Todo commit rodava no escopo de UI | `scope.launch { delay(); commit() }` — cancelar o escopo matava a confirmação |
| 3 | `confirmAndClear()` disparava no mesmo escopo | Se já cancelado, `launch` não executa e a confirmação era perdida |
| 4 | Disparo único dependia só de `consumed` | Sem reivindicação atômica entre timeout, dispose e supersessão |

### 5-A.2 Correções aplicadas (`ui/undo/UndoController.kt`)

1. **Fluxo único de confirmação** — timeout, substituição, dispose e cancelamento do escopo
   passam por `launchCommit()` → `commit()`, que trata `false` (via `onFailed`) e exceções.
2. **Confirmação sobrevive à destruição da tela** — novo parâmetro `commitScope` (padrão:
   `SupervisorJob + Dispatchers.Default`), independente do escopo de UI. O callback é
   executado dentro de `withContext(NonCancellable)`.
3. **Rede de segurança** — `scope.coroutineContext[Job]?.invokeOnCompletion { confirmAndClear() }`:
   se o escopo for cancelado sem que o dono chame o dispose, a ação pendente ainda é confirmada.
4. **Disparo único atômico** — dois estados distintos por ação: `settled` (janela encerrada,
   não desfazível) e `confirmed` (confirmação reivindicada). `beginConfirm()` é a única porta
   de confirmação e é atômica sob o mesmo lock.
5. **Identidade preservada** — `undo(id)` só age no id pendente; `arm()` com id repetido
   retorna `false` sem duplicar; supersessão fecha a janela anterior antes de abrir a nova.

Nenhuma operação real de exclusão foi adicionada. O controlador apenas invoca callbacks.

### 5-A.3 Testes do `UndoController` — 19 testes, todos aprovados

| Grupo | Testes |
|:--|--:|
| Janela de 5.000 ms | 3 |
| Desfazer e ids obsoletos | 4 |
| Substituição de ação pendente | 3 |
| Dispose, cancelamento de escopo e concorrência | 5 |
| Falhas de confirmação | 2 |
| Idempotência do dispose | 2 |

Casos novos desta entrega:

- substituição com `onConfirm` retornando `false` → `onFailed` é chamado, com o id correto;
- substituição com `onConfirm` lançando exceção → `onFailed` recebe a exceção original;
- **cancelamento do escopo de UI** sem chamada de dispose → confirmação executada uma vez;
- cancelamento do escopo **após** a janela → nenhuma confirmação duplicada;
- cancelamento do escopo **após** o desfazer → não confirma;
- 50 ações em sequência rápida → 49 confirmações das substituídas + 1 da última, sem repetição;
- corrida entre `undo()` e `confirmAndClear()` → apenas um dos dois prevalece.

### 5-A.4 Resultado final

```
> Task :app:assembleDebug
BUILD SUCCESSFUL

> Task :app:testDebugUnitTest
45 passed, 0 skipped, 0 failed
```

Distribuição: `UndoControllerTest` 19 · `MoneyTest` 9 · `MoneyTextSizingTest` 8 · `NavigationMetricsTest` 9.

### 5-A.5 Iterações registradas (falhas reais durante o trabalho)

| Execução | Resultado | Causa | Correção |
|:--|:--|:--|:--|
| 1ª | 9 passed / **10 failed** | Confirmações não executavam: o `backgroundScope` do `runTest` não é avançado por `advanceUntilIdle()` neste setup | Testes passaram a usar o próprio `TestScope` como `commitScope` |
| 2ª | 17 passed / **2 failed** | `advanceUntilIdle()` avança também os 5 s da janela, confirmando a ação seguinte | Trocado por `runCurrent()` onde o objetivo era apenas escoar a substituição |
| 3ª | **19 passed / 0 failed** | — | — |

Nenhuma dessas falhas foi corrigida alterando produção: as duas eram erros de asserção/setup
no próprio teste. O código de produção passou a mudar apenas por causa dos defeitos 1 a 4 listados.

---

## 6. Pendências conhecidas

1. **Instrumentados não executados** — depende de emulador. Os testes de UI descritos na
   especificação (semântica, ordem de foco, larguras reais) precisam de `connectedDebugAndroidTest`.
2. **Ícones de categoria do produto** (combustível, manutenção, pedágio, moradia…) continuam
   pendentes: a especificação prevê 15 vetores próprios e esta entrega cobre apenas os 7 de
   interface. Na galeria, os itens de demonstração usam ícones core neutros.
3. **Exclusão definitiva transacional** não foi implementada — fora do escopo autorizado.
