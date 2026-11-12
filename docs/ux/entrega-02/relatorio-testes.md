# Relatório de Testes — Entrega 02.1 (Correções do Design System)

**Referência anterior:** commit `c373977`
**Escopo:** correção da barra inferior, do Desfazer, dos indicadores financeiros e das dependências
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

## 6. Pendências conhecidas

1. **Instrumentados não executados** — depende de emulador. Os testes de UI descritos na
   especificação (semântica, ordem de foco, larguras reais) precisam de `connectedDebugAndroidTest`.
2. **Ícones de categoria do produto** (combustível, manutenção, pedágio, moradia…) continuam
   pendentes: a especificação prevê 15 vetores próprios e esta entrega cobre apenas os 7 de
   interface. Na galeria, os itens de demonstração usam ícones core neutros.
3. **Exclusão definitiva transacional** não foi implementada — fora do escopo autorizado.
