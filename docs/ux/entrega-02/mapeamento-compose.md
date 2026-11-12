# MotoristAI — Entrega 02: Design System → Jetpack Compose / Material 3

**Etapa:** análise das pranchas, inventário de componentes, mapeamento técnico e bloqueios
**Status:** aguardando decisões antes de qualquer implementação
**Fora de escopo:** código, telas, migração de tecnologia

---

## 1. O que cada prancha entrega

| Bloco | Prancha White | Prancha Dark |
|:--|:--|:--|
| Paleta | 15 tokens (5 azuis/semânticas, 5 sistema, 5 neutros) | 10 tokens (semânticas + 3 textos) |
| Tipografia | Inter ou Roboto, 7 estilos (H1–H4, Body, Small, Label) | Roboto, 6 estilos (H1–H3, T1–T3) |
| Botões | Primário, Secundário, Tonal, Texto + 3 estados | Primário, Secundário, Terciário + FAB + 3 estados |
| Campos | Padrão, Foco, Erro, Desabilitado, Somente leitura | Idêntico aos 5 estados |
| Seletores | Dropdown, radio, checkbox, switch | Dropdown, chip único, chip múltiplo |
| Navegação | Barra 4 abas + FAB central | Barra 4 abas + FAB central |
| Filtros | Chips Todas/Receitas/Despesas + 2 dropdowns + filtro | Mesmo conjunto |
| Cards | 1 card em gradiente + 3 cards de indicador | 1 card gradiente + 3 indicadores + 1 meta com progresso |
| Listas | 3 linhas com ícone e chevron | 3 linhas com ícone e chevron |
| Gráficos | Donut + barras agrupadas | Donut + barras + linha/área |
| Sheets e diálogos | Bottom sheet (com X) + diálogo destrutivo | Bottom sheet + diálogo destrutivo |
| Feedbacks | 3 snackbars (sucesso, info, erro) | 2 snackbars + progresso de meta + skeleton |
| Estados | Vazio, carregando, erro, sucesso | Vazio, carregando, erro, sucesso |
| Exclusivo | — | Chip de status (Pago/Pendente/Atrasado), skeleton |

---

## 2. Divergências entre as duas pranchas

O desenho é o mesmo, mas os valores não. Preciso de uma decisão canônica para cada linha.

| Item | White | Dark | Proposta |
|:--|:--|:--|:--|
| H2 | 24/28 Bold | 22/28 Bold | **24/28** — mantém a progressão 28→24→20 |
| H3 | 20/24 SemiBold | 18/24 SemiBold | **20/24** |
| H4 | 18/24 SemiBold | não existe | **manter**, é o nível usado em subtítulos de seção |
| Body / T1 | 16/24 Regular | 16/Regular | igual |
| Small / T2 | 14/20 Regular | 14/Regular | igual |
| Label | 12/16 **Medium** | não existe | **manter** — usado em rótulos de chip e botão |
| — / T3 | não existe | 12/Regular | vira **Caption 12/16 Regular** |
| Fonte | Inter *ou* Roboto | Roboto | **Roboto** (padrão do sistema, zero dependência) |
| Sucesso | #16A34A | #22C55E | **dois hex, um papel** — ver item 3 |
| Primária Clara | #E6F2FF | #4DA3FF | **papéis diferentes** — ver item 3 |
| Botão terciário | TextButton (texto) | FAB circular | nomes iguais, componentes distintos → renomear |
| Chip de status | não existe | Pago/Pendente/Atrasado | decidir se é componente do produto |
| Skeleton | não existe | presente | incluir nas duas |

> **Regra que proponho:** o *nome* do token é igual nos dois temas; o *hex* muda por tema
> quando necessário para contraste. Isso resolve Sucesso (#16A34A claro / #22C55E escuro)
> sem transformar em dois design systems.

---

## 3. Divergências com a Entrega 01 (documento já aprovado)

Estas precisam de correção na especificação anterior, não são só detalhe visual.

| Token / métrica | Entrega 01 | Prancha | Ação |
|:--|:--|:--|:--|
| Superfície dark | `#1C2B3A` | `#112630` | Prancha vence — atualizar Entrega 01 |
| Fundo dark | `#0B1929` | `#0B1929` | igual |
| Borda dark | `rgba(255,255,255,0.08)` | `#1E3A5F` | Prancha vence (cor sólida) |
| Fundo light | `#F2F2F7` (iOS) | `#F1F5F9` | Prancha vence — sai o cinza iOS |
| Superfície light | `#FFFFFF` | `#FFFFFF` | igual |
| Texto secundário light | `rgba(60,60,67,.6)` | **não definido** | lacuna — propor `#475569` |
| Texto suave light | `rgba(60,60,67,.3)` | **não definido** | lacuna — propor `#94A3B8` |
| Sucesso / Erro light | `#34C759` / `#FF3B30` | `#16A34A` / `#EF4444` | Prancha vence |
| Positivo / negativo dark | `#30D158` / `#FF453A` | `#22C55E` / `#EF4444` | Prancha vence |
| Altura da barra | 56 dp + 24 dp inset | barra visual ~64 dp | manter Entrega 01 (ver I1) |

---

## 4. Tokens canônicos propostos

### 4.1 Cor

| Papel | Light | Dark |
|:--|:--|:--|
| `primary` | `#0A84FF` | `#0A84FF` |
| `primaryPressed` | `#0057D9` | `#0057D9` |
| `primaryContainer` | `#E6F2FF` | `#4DA3FF` |
| `secondary` | `#00A3FF` | `#00A3FF` |
| `tertiary` | `#7C4DFF` | `#7C4DFF` |
| `success` | `#16A34A` | `#22C55E` |
| `error` | `#EF4444` | `#EF4444` |
| `warning` | `#F59E0B` | `#F59E0B` |
| `info` | `#0EA5E9` | `#0EA5E9` |
| `background` | `#F1F5F9` | `#0B1929` |
| `surface` | `#FFFFFF` | `#112630` |
| `surfaceVariant` | `#F8FAFC` | `#162534` *(derivado)* |
| `border` | `#E2E8F0` | `#1E3A5F` |
| `textPrimary` | `#0F172A` | `#FFFFFF` |
| `textSecondary` | `#475569` *(prop.)* | `#94A3B8` |
| `textMuted` | `#94A3B8` *(prop.)* | `#64748B` |
| `disabled` | `#CBD5E1` | `#334155` *(derivado)* |

**Paleta categórica de gráficos** (não existe nas pranchas, é necessária):
`#0A84FF · #F59E0B · #7C4DFF · #22C55E · #EF4444 · #94A3B8`

### 4.2 Tipografia (escala unificada)

| Token | Tamanho / entrelinha | Peso | Uso |
|:--|:--|:--|:--|
| `display` | 28 / 32 | Bold | Título de tela cheia e card de saldo |
| `title1` | 24 / 28 | Bold | Seção principal |
| `title2` | 20 / 24 | SemiBold | Título de card |
| `title3` | 18 / 24 | SemiBold | Subtítulo de seção |
| `body` | 16 / 24 | Regular | Texto padrão, valor de campo |
| `bodySmall` | 14 / 20 | Regular | Descrição de item de lista |
| `label` | 12 / 16 | Medium | Rótulo de campo, chip, botão |
| `caption` | 12 / 16 | Regular | Texto auxiliar e rodapé |

### 4.3 Forma, espaçamento e elevação

| Token | Valor |
|:--|:--|
| Raio de campo / chip | 12 dp |
| Raio de card | 16 dp |
| Raio de sheet | 20 dp (topo) |
| Raio de botão | 12 dp |
| Raio de FAB | 28 dp |
| Grade de espaçamento | 4 dp (múltiplos: 4, 8, 12, 16, 24, 32) |
| Padding lateral de tela | 16 dp |
| Gap entre cards | 12 dp |
| Elevação de card | 0 dp light (borda) · 0 dp dark (superfície) |
| Elevação de FAB | 6 dp |
| Elevação de sheet | 16 dp |

---

## 5. Inventário de componentes

Legenda: **E** = existe na prancha branca · **D** = prancha escura · **N** = necessário mas ausente.

| # | Componente | Variantes / estados | E | D |
|:--|:--|:--|:--|:--|
| C01 | Botão primário | normal, pressionado, desabilitado, com ícone | ✓ | ✓ |
| C02 | Botão secundário (outline) | idem | ✓ | ✓ |
| C03 | Botão tonal | idem | ✓ | — |
| C04 | Botão de texto | normal, desabilitado | ✓ | ✓ |
| C05 | FAB | normal, pressionado, sobre barra | ✓ | ✓ |
| C06 | Campo de texto | padrão, foco, erro, desabilitado, somente leitura | ✓ | ✓ |
| C07 | Dropdown (select) | padrão, aberto, com ícone | ✓ | ✓ |
| C08 | Chip de filtro | não selecionado, selecionado | ✓ | ✓ |
| C09 | Chip de seleção múltipla | com remoção (X) | — | ✓ |
| C10 | Segmented control | 3 opções, selecionada | ✓ | ✓ |
| C11 | Checkbox | marcado, desmarcado | ✓ | — |
| C12 | Radio | selecionado, não | ✓ | — |
| C13 | Switch | ligado, desligado | ✓ | — |
| C14 | Barra de navegação | 4 abas, ativa/inativa, com FAB | ✓ | ✓ |
| C15 | Card de saldo | gradiente, com toggle de visibilidade | ✓ | ✓ |
| C16 | Card de indicador | receita, despesa, saldo, meta | ✓ | ✓ |
| C17 | Card de meta | valor, barra, percentual | — | ✓ |
| C18 | Item de lista | ícone, título, subtítulo, valor, chevron | ✓ | ✓ |
| C19 | Donut de categorias | com legenda e total central | ✓ | ✓ |
| C20 | Gráfico de barras | agrupado, eixo | ✓ | ✓ |
| C21 | Gráfico de linha/área | 2 séries | — | ✓ |
| C22 | Bottom sheet de ação | handle, título, X, 3 opções | ✓ | ✓ |
| C23 | Diálogo destrutivo | ícone, título, texto, 2 ações | ✓ | ✓ |
| C24 | Snackbar | sucesso, info, erro, com X e com ação | ✓ | ✓ |
| C25 | Estado vazio | ícone, título, descrição | ✓ | ✓ |
| C26 | Estado de carregamento | spinner + texto | ✓ | ✓ |
| C27 | Estado de erro | ícone, título, ação "tentar novamente" | ✓ | ✓ |
| C28 | Skeleton | linha, card | — | ✓ |
| C29 | Chip de status | pago, pendente, atrasado | — | ✓ |
| C30 | Barra de progresso | linear, circular | — | ✓ |
| C31 | Campo de busca | ícone, placeholder, limpar | — | — |
| C32 | Campo de senha | máscara, mostrar/ocultar | — | — |
| C33 | Botão biométrico | ícone + texto, estados | — | — |
| C34 | Cabeçalho de dia | data + subtotal | — | — |
| C35 | Divisor de seção | — | — | — |
| C36 | Tooltip / dica contextual | — | — | — |

**C31 a C36 são lacunas das pranchas** — todas aparecem na Entrega 01
(busca em Movimentações, login com senha e biometria, cabeçalho de data na lista).

---

## 6. Mapeamento para Jetpack Compose + Material 3

| Componente | API Compose / M3 | Observação técnica |
|:--|:--|:--|
| Tema | `MaterialTheme(colorScheme, typography, shapes)` | `dynamicColor = false` — identidade fixa |
| Cores extras | `CompositionLocal` + `LocalMotoristAIColors` | success/warning/info/chart não existem no `ColorScheme` |
| Tipografia | `Typography` + object próprio | nomes `display/title1…` mapeados para `headlineLarge…` |
| C01 | `Button` | `ButtonDefaults.buttonColors` |
| C02 | `OutlinedButton` | `border = BorderStroke(1.dp, border)` |
| C03 | `FilledTonalButton` | — |
| C04 | `TextButton` | — |
| C05 | `FloatingActionButton` | reposicionamento manual — ver I1 |
| C06 | `OutlinedTextField` | `isError`, `supportingText`, `enabled`, `readOnly`, `trailingIcon` |
| C07 | `ExposedDropdownMenuBox` + `DropdownMenuItem` | — |
| C08 | `FilterChip` | `selected`, `leadingIcon` |
| C09 | `InputChip` | `trailingIcon = Close` |
| C10 | `SingleChoiceSegmentedButtonRow` | requer M3 ≥ 1.2 |
| C11–C13 | `Checkbox`, `RadioButton`, `Switch` | — |
| C14 | `NavigationBar` + `NavigationBarItem` | não cabe o FAB central — ver I1 |
| C15 | `Box` + `Brush.linearGradient` | gradiente não é token M3 |
| C16–C17 | `Card` / `OutlinedCard` | `CardDefaults.cardColors` |
| C18 | `ListItem` | `headlineContent`, `supportingContent`, `trailingContent` |
| C19–C21 | **sem equivalente** | Canvas próprio ou Vico — ver I6 |
| C22 | `ModalBottomSheet` | `sheetState = rememberModalBottomSheetState()` |
| C23 | `AlertDialog` | `icon` + 2 `TextButton` |
| C24 | `SnackbarHost` + `Snackbar` | duração limitada — ver I2 |
| C25–C27 | composables próprios | sem componente M3 |
| C28 | `Modifier` + `rememberInfiniteTransition` | shimmer manual |
| C29 | `AssistChip` ou `Surface` + texto | — |
| C30 | `LinearProgressIndicator(progress = { })` | — |
| C31 | `OutlinedTextField` + `leadingIcon = Search` | — |
| C32 | `OutlinedTextField` + `PasswordVisualTransformation` | — |
| C33 | `Button` + ícone vetorial | BiometricPrompt fora do Compose |
| C34 | composable próprio | — |
| C35 | `HorizontalDivider` | — |
| Barra inferior e insets | `Scaffold(bottomBar = …)`, `navigationBarsPadding()` | `enableEdgeToEdge()` na Activity |
| Previews | `@Preview(uiMode = UI_MODE_NIGHT_YES)` | um preview por tema para cada componente |
| Ícones | `material-icons-core` ou `extended` | — ver I10 |
| Fontes | `FontFamily` / `Font(R.font.x)` | — ver I11 |
| Moeda | `VisualTransformation` + `KeyboardType.Decimal` | máscara pt-BR |
| Validação | `rememberSaveable` + estado derivado | regras vêm de `especificacao-formularios.md` |

---

## 7. Incompatibilidades e bloqueios técnicos

### I1 · FAB central na barra de navegação — **bloqueio de layout**

`NavigationBar` do M3 tem altura fixa e divide os itens em partes iguais; não existe slot
para FAB. A Entrega 01 exige 56 dp de barra + 24 dp de inset, com FAB sobreposto em 28 dp.
A prancha branca ainda desenha o FAB *dentro* da barra, e a escura o desenha flutuando.

**Recomendação:** barra própria (composable) usando o `Row` de 4 itens + `Spacer` central,
dentro de `Scaffold(bottomBar = …)`, com o FAB em `Box` sobreposto. Não usar `NavigationBar`.

### I2 · Snackbar de 5 segundos — **bloqueio funcional**

`SnackbarDuration` só oferece `Short` (4 s), `Long` (10 s) e `Indefinite`. A especificação
de formulários exige 5 s com Desfazer.

**Recomendação:** host próprio com `LaunchedEffect` + `delay(5_000)`, controlado por estado.
Não usar `SnackbarHostState.showSnackbar` para o caso de Desfazer.

### I3 · Tokens dark divergem da Entrega 01 — **documento desatualizado**

Superfície `#1C2B3A` → `#112630`; borda em alfa → `#1E3A5F`. A Entrega 01 precisa ser
corrigida, senão viram duas verdades no repositório.

### I4 · Escala tipográfica divergente — **bloqueio de implementação**

Sem uma escala única, cada tela vai escolher um tamanho. Ver seção 4.2.

### I5 · Contraste abaixo de AA — **bloqueio de acessibilidade**

| Par | Contraste | Situação |
|:--|:--|:--|
| `#0A84FF` + texto branco (botão primário) | ≈ 3,6:1 | Falha AA para 16 sp normal |
| `#64748B` sobre `#0B1929` (texto suave dark) | ≈ 3,7:1 | Falha AA |
| `#EF4444` sobre `#112630` (erro em card dark) | ≈ 4,2:1 | Falha AA por margem |
| `#94A3B8` sobre `#112630` (texto secundário) | ≈ 6,2:1 | Passa |

**Opções para o botão primário:**
(a) usar `primaryPressed` `#0057D9` como fundo do botão preenchido (≈ 6,2:1);
(b) no dark, usar texto `#0B1929` sobre `#0A84FF` (≈ 4,9:1);
(c) manter o hex e subir o rótulo para 18 sp SemiBold (passa como texto grande).

### I6 · Gráficos não existem no Material 3 — **decisão de dependência**

Donut, barras e linha/área precisam de implementação própria em `Canvas` ou de biblioteca
externa (Vico é a opção Compose-first). Isso afeta tamanho do APK e esforço.

### I7 · Paleta categórica de gráficos ausente

O donut usa azul, laranja, roxo e cinza; nada disso está tokenizado. Precisa de conjunto
fechado, com regra de ordem estável (mesma categoria, mesma cor, sempre).

### I8 · Chip de status (Pago / Pendente / Atrasado) — **possível nova funcionalidade**

Esse componente sugere um campo de status de pagamento. O modelo atual de lançamentos não
tem esse estado. Se não existir, criar o chip implica criar dado, regra e migração —
o que exige autorização explícita, não é decisão de design.

### I9 · Ocultar saldo (ícone de olho) — **novo comportamento**

Presente nas duas pranchas, ausente na Entrega 01. Precisa de definição: preferência
persistida? oculta por sessão? oculta também Relatórios?

### I10 · Pacote de ícones — **impacto no APK**

`material-icons-extended` adiciona milhares de ícones (contornados por R8, mas com custo
de build e de tamanho). Existe um plano aberto de redução de APK (`docs/plans/backlog/008`).
**Recomendação:** usar `material-icons-core` + poucos vetores próprios para os ícones
de categoria (combustível, manutenção, pedágio, moradia…).

### I11 · Fonte Inter versus Roboto

Inter exige empacotar arquivos de fonte (licença OFL, ok) e adiciona peso. Roboto é padrão
do sistema e já é a escolha da prancha escura. **Recomendação: Roboto.**

### I12 · Cores dinâmicas (Material You)

Devem ser desativadas: com `dynamicColor` ligado, o Android 12+ sobrescreve a paleta
e o azul MotoristAI desaparece. Decisão de produto, não só técnica.

### I13 · Skeleton e shimmer não existem no M3

Precisa de composable próprio com `rememberInfiniteTransition`. Sem custo de dependência,
mas é código a escrever e testar.

### I14 · Bottom sheet: X versus arrastar

A prancha branca adiciona um X no sheet; a Entrega 01 especifica arrastar e tocar fora.
**Recomendação:** aceitar os três (X, arrastar, scrim), sem conflito.

### I15 · Diálogo destrutivo convivendo com Desfazer de 5 s

Excluir lançamento aparece com diálogo de confirmação nas pranchas, e a Entrega 01 define
Desfazer de 5 s para a mesma ação. Não é incompatível, mas duplica atrito.
**Recomendação:** excluir com Desfazer (sem diálogo) e reservar o diálogo para ações
irreversíveis — veículo, conta, categoria em uso.

### I16 · "Botão terciário" com dois significados

Na prancha branca é um `TextButton`; na escura é um FAB circular. Renomear: **botão de
texto** e **FAB** são componentes distintos.

---

## 8. Decisões pendentes para liberar a implementação

| # | Decisão | Bloqueia | Recomendação |
|:--|:--|:--|:--|
| D1 | Escala tipográfica única | todos os componentes | adotar seção 4.2 |
| D2 | Fonte: Roboto ou Inter | tema | Roboto |
| D3 | Contraste do botão primário | botões | opção (a): `#0057D9` no preenchido |
| D4 | Token de texto suave no dark | listas e legendas | trocar `#64748B` por `#94A3B8` |
| D5 | Gráficos: Canvas ou Vico | Relatórios | Vico se houver mais de 3 tipos de gráfico |
| D6 | Paleta categórica de gráficos | Relatórios | conjunto da seção 4.1 |
| D7 | Chip de status é funcionalidade nova? | modelo de dados | confirmar antes de desenhar |
| D8 | Ocultar saldo: escopo e persistência | Início e Relatórios | preferência persistida, vale nas duas telas |
| D9 | Ícones: core + próprios ou extended | APK | core + próprios |
| D10 | Cores dinâmicas desativadas | tema | desativar |
| D11 | Atualizar a Entrega 01 com os tokens das pranchas | documentação | atualizar na próxima revisão |

---

## 9. Próximo passo

Nenhuma linha de código foi escrita. Depois das decisões de D1 a D11, a ordem sugerida é:

1. Tokens (`Color`, `Typography`, `Shape`, `LocalMotoristAIColors`) + preview de tema.
2. Componentes de formulário (C06, C07, C08, C10) — são os de maior reuso.
3. Barra inferior + FAB (I1) — é o componente com maior risco de layout.
4. Listas e cards.
5. Bottom sheet, diálogo, snackbar próprio (I2).
6. Gráficos.
7. Só então as telas da Entrega 01.
