# MotoristAI — Especificação dos componentes

**Entrega 02 · especificação final para implementação em Kotlin + Jetpack Compose (M3)**
Tokens em [`tokens.md`](tokens.md). Fluxos e telas na Entrega 01.
Nenhuma linha de código faz parte desta entrega.

Legenda de origem: **E** prancha White · **D** prancha Dark · **N** necessário, ausente nas pranchas.

---

## A. Ações

| # | Componente | Dimensões | Estados | Cores | Acessibilidade | Compose |
|:--|:--|:--|:--|:--|:--|:--|
| C01 | Botão primário | h 48 · raio 12 · padding 20 · ícone 18 | normal, pressionado, foco, desabilitado, carregando | `primary` / `onPrimary`; pressionado `#0057D9`+10% de escurecimento | role Button · alvo 48 · rótulo falado | `Button` |
| C02 | Botão secundário | igual C01 · borda 1 dp | idem | borda `outline`, texto `primary` | idem | `OutlinedButton` |
| C03 | Botão tonal | igual C01 | idem | `accentSubtle` + texto `primary` | idem | `FilledTonalButton` |
| C04 | Botão de texto | h 40 · padding 12 | normal, pressionado, desabilitado | texto `primary` | idem | `TextButton` |
| C05 | FAB | 56 · raio 28 · elevação 6 | normal, pressionado, oculto sob sheet | `primary` / `onPrimary` | contentDescription "Novo lançamento" · alvo 56 | `FloatingActionButton` + `Box` |

**Comportamento**

- Botão primário é largo em formulário (`fillMaxWidth`) e do tamanho do conteúdo em sheet.
- Estado carregando: spinner 16 dp substitui o ícone, rótulo permanece, botão não recebe toque.
- Desabilitado nunca aparece sem motivo: se o botão Salvar está inativo, o campo que falta
  precisa estar visível e marcado.
- Um único botão primário por tela. Ação destrutiva usa `error` e nunca fica à direita de
  uma ação primária sem separação visual.

---

## B. Formulário

| # | Componente | Dimensões | Estados | Cores | Acessibilidade | Compose |
|:--|:--|:--|:--|:--|:--|:--|
| C06 | Campo de texto | h 56 · raio 12 · borda 1 dp · padding 16 | padrão, foco, erro, desabilitado, somente leitura | borda `outline`; foco `primary` 2 dp; erro `errorBorder` 2 dp | rótulo sempre visível · erro anunciado via `supportingText` | `OutlinedTextField` |
| C07 | Dropdown | igual C06 + ícone 20 | fechado, aberto, erro, desabilitado | idem | anuncia "selecionado" · menu com role de lista | `ExposedDropdownMenuBox` |
| C08 | Chip de filtro | h 32 · raio 8 · padding 12 | não selecionado, selecionado, pressionado | `surface` + borda / `accentSubtle` + borda `primary` | `stateDescription` "selecionado" | `FilterChip` |
| C09 | Chip multi-seleção | igual C08 + X 16 | idem + removível | idem | X anuncia "remover filtro" | `InputChip` |
| C10 | Segmented control | h 40 · raio 12 · 2–3 opções | selecionada, não selecionada | seleção `accentSubtle` + texto `primary` | role de grupo · anuncia qual está ativa | `SingleChoiceSegmentedButtonRow` |
| C11 | Checkbox | 20 · alvo 48 | marcado, desmarcado, desabilitado | `primary` | `toggleable` | `Checkbox` |
| C12 | Radio | 20 · alvo 48 | selecionado, não | `primary` | role RadioButton | `RadioButton` |
| C13 | Switch | 52 × 32 | ligado, desligado, desabilitado | trilho `primary` quando ligado | role Switch | `Switch` |

**Comportamento**

- Rótulo fora do campo, sempre visível, `label` 12 sp; placeholder nunca substitui rótulo.
- Campo obrigatório: sufixo visual discreto no rótulo. Erro: borda `errorBorder` 2 dp +
  mensagem `errorText` 12 sp abaixo.
- Validação no `blur` e no Salvar — nunca a cada tecla (ver `especificacao-formularios.md`).
- Campo de valor: teclado decimal, máscara pt-BR, alinhamento à esquerda, fonte `body` 16 sp
  em formulário e `display` dentro do campo principal de novo lançamento.
- Campo somente leitura usa `surfaceVariant` + ícone de cadeado 16 dp; não abre teclado.
- Contador de caracteres aparece só a partir de 80% do limite.

---

## C. Navegação

### C14 · Barra inferior com FAB central — `N` (customizada)

Este é o componente de maior risco: `NavigationBar` do M3 não comporta FAB.

| Item | Especificação |
|:--|:--|
| Estrutura | `Box` com `Row` de 4 destinos + `Spacer` central, sobreposta por `FloatingActionButton` |
| Altura da barra | 56 dp |
| Inset de gesto | 24 dp (gesture nav) / 48 dp (3 botões) |
| Largura de slot | 72 dp (4 slots + 72 dp de spacer em 360 dp) |
| FAB | 56 dp, 52 dp do rodapé, sobrepondo 28 dp da barra |
| Padding inferior do conteúdo | 116 dp / 140 dp |
| Item ativo | ícone preenchido + rótulo `accent` + `label` 12 sp |
| Item inativo | ícone contornado + rótulo `onSurfaceVariant` |
| Ripple | contido no slot, não invade o spacer |
| Acessibilidade | 4 itens com `selected` correto; FAB com rótulo "Novo lançamento"; alvo ≥ 48 dp; ordem de foco: Início → Movimentações → FAB → Relatórios → Ajustes |

**Comportamento**

- Barra visível só nos quatro destinos raiz. Ausente em telas secundárias e sob sheet modal.
- Trocar de destino preserva o estado de cada uma das quatro telas.
- Back nos destinos raiz não é interceptado: sai do app.
- Rótulos nunca quebram linha nem são truncados (usar `Movim.` se necessário em 360 dp).

---

## D. Dados

| # | Componente | Dimensões | Estados | Cores | Acessibilidade | Compose |
|:--|:--|:--|:--|:--|:--|:--|
| C15 | Card de saldo | h 112 · raio 16 · padding 16 | valor visível, valor oculto, carregando | gradiente `gradientStart→End`, texto branco | botão de olho com rótulo "ocultar valor" / "mostrar valor" | `Box` + `Brush.linearGradient` |
| C16 | Card de indicador | h 88 · raio 16 · padding 16 | valor, sem valor | `surface` + borda · valor `successText`/`errorText` | valor lido como moeda | `Card` |
| C17 | Card de meta | h 96 · raio 16 | progresso 0–100%, concluída | barra `primary` sobre `outline` | progresso anunciado em % | `Card` + `LinearProgressIndicator` |
| C18 | Item de lista | h 64 · padding 16 | normal, pressionado, arrastando | ícone `onSurfaceVariant` · valor `successText`/`errorText` | linha inteira clicável · lê título, subtítulo e valor | `ListItem` |

**Comportamento**

- C15: o olho alterna entre valor e `R$ ••••`. Estado persistido (D8) e compartilhado com
  Relatórios. Não oculta os cards de indicador.
- C16: sempre três colunas em Início (receitas, despesas, saldo). Número quebra linha apenas
  acima de R$ 999.999,99, reduzindo para `title3`.
- C17: meta concluída troca a barra por ícone de check e mantém o percentual "100%".
- C18: sem chevron quando a linha não navega. Valor sempre alinhado à direita e nunca truncado.

---

## E. Visualização de dados

| # | Componente | Dimensões | Estados | Cores | Acessibilidade | Compose |
|:--|:--|:--|:--|:--|:--|:--|
| C19 | Donut de categorias | 160 × 160 · espessura 24 | com dados, vazio, destaque de fatia | `chart1..6` | tabela de dados equivalente via `contentDescription` + legenda textual | `Canvas` |
| C20 | Barras | h 160 · 6 colunas | com dados, vazio | série `accent`, comparativo `outlineVariant` | valores lidos na legenda, não só na barra | `Canvas` |
| C21 | Linha / área | h 160 · 2 séries | com dados, vazio | receita `success`, despesa `error` | idem | `Canvas` |

**Comportamento**

- Sempre acompanhados de legenda textual com valor e percentual — gráfico nunca é a única
  fonte da informação.
- Estado vazio: ilustração neutra + texto "Sem dados no período" + ação para trocar o período.
- Sem animação de entrada além de 400 ms; respeitar escala de animação do sistema.
- Sem interação de toque nesta versão (sem tooltip): reduz complexidade e custo.

---

## F. Sobreposições

| # | Componente | Dimensões | Estados | Cores | Acessibilidade | Compose |
|:--|:--|:--|:--|:--|:--|:--|
| C22 | Bottom sheet de ação | raio 20 topo · padding 16 · 3 opções | aberto, arrastando, fechando | `surface` · scrim 42% | foco preso no sheet · fecha com back e com scrim · X com rótulo "fechar" | `ModalBottomSheet` |
| C23 | Diálogo destrutivo | largura 320 · raio 20 | aberto, ação em andamento | ícone `errorText` em círculo `errorContainer` | título é o cabeçalho · ações na ordem Cancelar → Confirmar | `AlertDialog` |
| C24 | Snackbar | h mín. 48 · raio 12 · margem 16 | sucesso, info, erro · com ação, com X | `success` / `info` / `error` como faixa lateral | anunciado por `liveRegion` · ação nomeada · fecha sozinho em 5 s | **host próprio** (ver nota) |

**Nota obrigatória sobre C24:** `SnackbarDuration` do M3 só oferece 4 s, 10 s e indefinido.
A especificação de formulários exige 5 s com Desfazer. Portanto o snackbar é um composable
próprio com `LaunchedEffect` + `delay(5_000)`, e **não** usa `SnackbarHostState.showSnackbar`.

**Comportamento das sobreposições**

- Sheet cobre a barra inferior e o FAB; ambos ficam inoperantes até fechar.
- Fechar o sheet: X, arrastar para baixo ou tocar no scrim. Os três são válidos (I14).
- Diálogo destrutivo só para ação irreversível (veículo, conta, categoria em uso).
  Excluir lançamento usa Desfazer, sem diálogo (I15).
- Um sheet ou diálogo por vez. Abrir o segundo fecha o primeiro.

---

## G. Estados e feedback

| # | Componente | Dimensões | Estados | Cores | Acessibilidade | Compose |
|:--|:--|:--|:--|:--|:--|:--|
| C25 | Estado vazio | ícone 48 · texto centralizado | — | ícone `onSurfaceVariant` | lido como uma unidade | próprio |
| C26 | Carregando | spinner 32 + texto | — | `primary` | anuncia "carregando" | `CircularProgressIndicator` |
| C27 | Estado de erro | ícone 48 + título + texto + botão | — | ícone `errorText` | botão "Tentar novamente" com alvo 48 | próprio |
| C28 | Skeleton | linha h 12 · card h 88 | — | `disabledSurface` com shimmer 1,2 s | `clearAndSetSemantics {}` — não é lido | próprio |
| C29 | Chip de status | h 24 · raio 8 · padding 8 | — | ver nota | texto sempre presente, não só cor | `Surface` |
| C30 | Barra de progresso | linear h 8 · circular 32 | determinada, indeterminada | trilho `outline`, valor `primary` | progresso em % | `LinearProgressIndicator` |

**Nota sobre C29:** o chip Pago / Pendente / Atrasado **não faz parte desta entrega** (D7).
Não há campo de status de pagamento no modelo de dados. Fica registrado como backlog, com
spec pronta: `success` / `warning` / `error` como cor de texto, fundo com 12% de alfa.

**Comportamento de estado**

- Toda tela com dados tem quatro estados obrigatórios: carregando, vazio, erro, conteúdo.
- Skeleton substitui o spinner em listas e cards com estrutura previsível; spinner fica para
  ações pontuais.
- Estado de erro sempre oferece uma saída: tentar novamente, trocar o período ou voltar.

---

## H. Componentes ausentes nas pranchas

| # | Componente | Especificação resumida | Compose |
|:--|:--|:--|:--|
| C31 | Campo de busca | h 48 · raio 12 · ícone 20 · limpar quando há texto | `OutlinedTextField` + `leadingIcon` |
| C32 | Campo de senha | igual C06 + olho de visibilidade | `PasswordVisualTransformation` |
| C33 | Botão biométrico | h 48 · ícone 24 + texto · estados normal e erro | `Button` + BiometricPrompt |
| C34 | Cabeçalho de dia | h 32 · fundo `background` · data à esquerda, subtotal à direita | próprio |
| C35 | Divisor de seção | h 1 · `outline` · margem vertical 24 | `HorizontalDivider` |
| C36 | Dica contextual | 1 linha · ícone 16 + texto `caption` | próprio |

C31 a C33 vêm do fluxo de entrada e de Movimentações (Entrega 01). Precisam de decisão de
design antes da implementação — não estão cobertos por nenhuma prancha.

---

## I. Matriz de estados por tema

Todos os componentes acima existem nos dois temas. O que muda:

| Aspecto | Light | Dark |
|:--|:--|:--|
| Separação de card | borda `outline` + sombra 0 | variação de superfície + borda |
| Sombra | até 2 dp em card, 6 dp em FAB | apenas FAB |
| Fundo de campo | `surface` branco | `surfaceVariant` |
| Cor de ação preenchida | `#0057D9` | `#0A84FF` com texto `#0B1929` |
| Texto de apoio | `#64748B` | `#7E8FA3` |
| Scrim | 42% de azul-marinho | 55% de preto |

---

## J. Critérios de aceite da implementação

- [ ] Cada componente tem preview nos dois temas (`uiMode = UI_MODE_NIGHT_YES`)
- [ ] Nenhum hex fora de `ui/theme/`
- [ ] Todo alvo de toque ≥ 48 dp
- [ ] Todo par texto/fundo conforme a tabela 2.4 de `tokens.md`
- [ ] Todo ícone acionável com `contentDescription`
- [ ] Escala de fonte do sistema em 200% não quebra layout de card de saldo nem de lista
- [ ] Barra inferior não cobre conteúdo em nenhuma tela
- [ ] Snackbar de Desfazer expira em 5 s e cancela ao trocar de tela
- [ ] Nenhuma cor só como portadora de significado
