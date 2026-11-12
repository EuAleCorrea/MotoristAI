# MotoristAI — Tokens canônicos

**Entrega 02 · documento canônico de design tokens**
Fonte de verdade única para cor, tipografia, forma, espaçamento, elevação e movimento.
Revoga os tokens de cor da Entrega 01 (seção 6 daquele documento).

---

## 0. Registro de decisões

| # | Decisão | Adotado |
|:--|:--|:--|
| D1 | Escala tipográfica | Uma única escala de 8 estilos (seção 3) |
| D2 | Fonte | **Roboto** — padrão do sistema, sem custo de APK |
| D3 | Contraste do botão primário | Fundo `#0057D9` nas ações preenchidas (light) · `#0A84FF` com texto escuro (dark) |
| D4 | Texto suave no dark | `#64748B` substituído por `#7E8FA3` (passa AA) |
| D5 | Gráficos | **Canvas próprio** para donut, barras e linha. Sem dependência externa |
| D6 | Paleta categórica | 6 cores fixas, ordem estável (seção 2.5) |
| D7 | Chip de status de pagamento | **Fora desta entrega.** Não há campo no modelo; vira item de backlog |
| D8 | Ocultar saldo | Preferência persistida, vale em Início e Relatórios |
| D9 | Ícones | `material-icons-core` + vetores próprios para categorias |
| D10 | Cores dinâmicas | Desativadas (`dynamicColor = false`) |
| D11 | Entrega 01 | Tokens de cor passam a referenciar este documento |

---

## 1. Princípios

1. **Token semântico, nunca literal.** Nenhum composable usa hex direto.
2. **Mesmo nome nos dois temas, hex pode variar.** `textMuted` existe nos dois; o valor muda
   para preservar contraste. Isso não cria dois design systems.
3. **Acessibilidade é parte do token, não revisão posterior.** Todo par texto/fundo está
   medido na seção 2.4.
4. **Hierarquia antes de decoração.** Verde e vermelho existem para valor financeiro e estado,
   não para enfeitar.
5. **Nada de cor só.** Todo estado crítico (erro, alerta, sucesso) também tem ícone ou rótulo.

---

## 2. Cor

### 2.1 Papéis do Material 3

| Slot `ColorScheme` | Light | Dark |
|:--|:--|:--|
| `primary` | `#0057D9` | `#0A84FF` |
| `onPrimary` | `#FFFFFF` | `#0B1929` |
| `primaryContainer` | `#E6F2FF` | `#4DA3FF` |
| `onPrimaryContainer` | `#0057D9` | `#0B1929` |
| `secondary` | `#00A3FF` | `#00A3FF` |
| `onSecondary` | `#0B1929` | `#0B1929` |
| `secondaryContainer` | `#E0F4FF` | `#0E2A47` |
| `onSecondaryContainer` | `#00557A` | `#8FD3FF` |
| `tertiary` | `#7C4DFF` | `#7C4DFF` |
| `onTertiary` | `#FFFFFF` | `#FFFFFF` |
| `background` | `#F1F5F9` | `#0B1929` |
| `onBackground` | `#0F172A` | `#FFFFFF` |
| `surface` | `#FFFFFF` | `#112630` |
| `onSurface` | `#0F172A` | `#FFFFFF` |
| `surfaceVariant` | `#F8FAFC` | `#162534` |
| `onSurfaceVariant` | `#475569` | `#94A3B8` |
| `outline` | `#E2E8F0` | `#1E3A5F` |
| `outlineVariant` | `#CBD5E1` | `#334155` |
| `error` | `#DC2626` | `#DC2626` |
| `onError` | `#FFFFFF` | `#FFFFFF` |
| `errorContainer` | `#FEE2E2` | `#3D1518` |
| `onErrorContainer` | `#B91C1C` | `#FCA5A5` |
| `scrim` | `rgba(11,25,41,0.42)` | `rgba(0,0,0,0.55)` |
| `inverseSurface` | `#0F172A` | `#FFFFFF` |
| `inverseOnSurface` | `#FFFFFF` | `#0F172A` |

> **Por que `primary` não é `#0A84FF` no tema claro:** branco sobre `#0A84FF` dá 3,6:1 e
> reprova AA para rótulo de 16 sp. `#0A84FF` continua sendo a cor da marca — vive em `accent`.

### 2.2 Tokens estendidos (fora do `ColorScheme`)

| Token | Light | Dark | Uso |
|:--|:--|:--|:--|
| `accent` | `#0A84FF` | `#4DA3FF` | Ícones ativos, indicadores, seleção, gráficos |
| `accentSubtle` | `#E6F2FF` | `#0E2A47` | Fundo de item selecionado, chip ativo |
| `success` | `#16A34A` | `#22C55E` | Ícone e superfície de sucesso |
| `successText` | `#15803D` | `#22C55E` | Texto de valor positivo |
| `warning` | `#F59E0B` | `#F59E0B` | Ícone e borda de alerta |
| `warningText` | `#B45309` | `#FBBF24` | Texto de alerta |
| `info` | `#0EA5E9` | `#0EA5E9` | Snackbar informativo, ícones |
| `errorBorder` | `#EF4444` | `#EF4444` | Borda de campo com erro |
| `errorText` | `#DC2626` | `#F87171` | Mensagem de erro |
| `textMuted` | `#64748B` | `#7E8FA3` | Legenda, rodapé, texto de apoio |
| `disabledSurface` | `#E2E8F0` | `#1E2A36` | Fundo desabilitado |
| `onDisabled` | `#94A3B8` | `#4A5A6B` | Texto desabilitado *(isento de AA)* |
| `gradientStart` | `#0057D9` | `#0057D9` | Card de saldo |
| `gradientEnd` | `#0A84FF` | `#0A84FF` | Card de saldo |
| `chartGrid` | `#E2E8F0` | `#1E3A5F` | Linha de grade dos gráficos |

### 2.3 Gramática de uso

| Situação | Token |
|:--|:--|
| Botão preenchido, ação principal | `primary` + `onPrimary` |
| Botão secundário | borda `outline` + texto `primary` |
| Botão tonal | `accentSubtle` + texto `primary` |
| Link e ação de texto | `primary` |
| Aba ativa, item selecionado | `accent` |
| Valor de receita | `successText` |
| Valor de despesa | `errorText` |
| Badge de aviso | `warning` |
| Divisor, borda de card | `outline` |
| Fundo de campo | `surface` (light) · `surfaceVariant` (dark) |

### 2.4 Contraste verificado

Pares medidos com a fórmula WCAG 2.1. Mínimo: 4,5:1 para texto, 3:1 para componente de UI.

| Par | Ratio | AA |
|:--|:--|:--|
| `onPrimary` sobre `primary` (light) | 6,24:1 | ✅ |
| `onPrimary` sobre `primary` (dark) | 4,86:1 | ✅ |
| `onSurface` sobre `surface` (light) | 17,9:1 | ✅ |
| `onSurface` sobre `surface` (dark) | 15,1:1 | ✅ |
| `onSurfaceVariant` sobre `surface` (light) | 7,5:1 | ✅ |
| `onSurfaceVariant` sobre `surface` (dark) | 6,2:1 | ✅ |
| `textMuted` sobre `surface` (light) | 4,8:1 | ✅ |
| `textMuted` sobre `surface` (dark) | 4,7:1 | ✅ |
| `accent` sobre `surface` (dark) — ícone | 5,9:1 | ✅ |
| `accent` sobre `surface` (light) — ícone | 3,6:1 | ✅ (UI ≥ 3:1) |
| `successText` sobre `surface` (light) | 5,0:1 | ✅ |
| `successText` sobre `surface` (dark) | 6,9:1 | ✅ |
| `errorText` sobre `surface` (light) | 4,8:1 | ✅ |
| `errorText` sobre `surface` (dark) | 5,7:1 | ✅ |
| `warningText` sobre `surface` (light) | 4,8:1 | ✅ |
| `onError` sobre `error` | 4,8:1 | ✅ |
| `onDisabled` sobre `disabledSurface` | 2,4:1 | ⚪ isento |
| `accent` sobre `surface` (light) — texto | 3,6:1 | ❌ proibido |

> **Regra derivada:** `accent` nunca é usado como cor de texto no tema claro. Texto de ação
> usa `primary`. No escuro, `accent` é permitido para texto por passar AA.

### 2.5 Paleta categórica de gráficos

Ordem fixa. A mesma categoria recebe a mesma cor em todos os gráficos e em todos os temas.

| Ordem | Light | Dark | Categoria típica |
|:--|:--|:--|:--|
| 1 | `#0A84FF` | `#4DA3FF` | Combustível / receita principal |
| 2 | `#F59E0B` | `#FBBF24` | Manutenção |
| 3 | `#7C4DFF` | `#A78BFA` | Pedágio |
| 4 | `#22C55E` | `#4ADE80` | Alimentação |
| 5 | `#EF4444` | `#F87171` | Saúde |
| 6 | `#94A3B8` | `#7E8FA3` | Outros |

Sem 7ª cor: ao passar de 6 categorias, agrupar o restante em "Outros".

### 2.6 Gradiente do card de saldo

`linearGradient(135°, gradientStart → gradientEnd)`, texto `#FFFFFF`, ícone com 70% de alfa.
Não usar gradiente em nenhum outro card.

---

## 3. Tipografia

Família: **Roboto**. Sem fonte empacotada.

| Token | Tamanho | Entrelinha | Peso | Letter spacing | Uso |
|:--|:--|:--|:--|:--|:--|
| `display` | 28 sp | 32 sp | Bold (700) | −0,2 sp | Valor do card de saldo, título de destaque |
| `title1` | 24 sp | 28 sp | Bold (700) | −0,1 sp | Título de tela |
| `title2` | 20 sp | 24 sp | SemiBold (600) | 0 | Título de card e de seção |
| `title3` | 18 sp | 24 sp | SemiBold (600) | 0 | Subtítulo de seção |
| `body` | 16 sp | 24 sp | Regular (400) | 0 | Texto padrão, valor de campo |
| `bodySmall` | 14 sp | 20 sp | Regular (400) | 0 | Descrição de item de lista |
| `label` | 12 sp | 16 sp | Medium (500) | 0,4 sp | Rótulo de campo, chip, botão, aba |
| `caption` | 12 sp | 16 sp | Regular (400) | 0,2 sp | Texto auxiliar, legenda, rodapé |

**Regras**

- Máximo de dois pesos na mesma tela: `Bold` para título, `Regular` para corpo.
- Nunca reduzir entrelinha; texto financeiro nunca em itálico.
- Escala de fonte do sistema respeitada: usar `sp`, nunca `dp`, em texto.
- Valores monetários usam `display`, `title1` ou `body` — nunca `label`.

**Mapeamento para `Typography` do M3**

| Slot M3 | Token MotoristAI |
|:--|:--|
| `headlineLarge` | `display` |
| `headlineMedium` | `title1` |
| `headlineSmall` | `title2` |
| `titleLarge` | `title3` |
| `bodyLarge` | `body` |
| `bodyMedium` | `bodySmall` |
| `labelLarge` | `label` |
| `labelSmall` | `caption` |

Slots restantes (`displayLarge`, `titleMedium`, `bodySmall`, `labelMedium`) herdam do M3
e não são usados diretamente.

---

## 4. Forma

| Token M3 | Valor | Uso |
|:--|:--|:--|
| `extraSmall` | 4 dp | Badge, indicador de progresso |
| `small` | 8 dp | Chip, ícone em container |
| `medium` | 12 dp | **Campo de texto, botão, card pequeno** |
| `large` | 16 dp | **Card** |
| `extraLarge` | 20 dp | **Bottom sheet, diálogo** |
| — | 28 dp | FAB (círculo) |

- Nunca usar `0 dp` em container; nunca passar de 20 dp em superfície retangular.
- Campo de texto e botão compartilham o mesmo raio (12 dp) para alinhamento vertical.

---

## 5. Espaçamento

Grade base 4 dp.

| Token | Valor | Uso |
|:--|:--|:--|
| `space1` | 4 dp | Separação entre rótulo e valor |
| `space2` | 8 dp | Entre ícone e texto |
| `space3` | 12 dp | Entre cards, entre campo e rótulo |
| `space4` | 16 dp | Padding lateral da tela, padding de card |
| `space5` | 24 dp | Entre blocos de seção |
| `space6` | 32 dp | Espaço antes de ação de rodapé |

| Regra | Valor |
|:--|:--|
| Padding lateral de tela | 16 dp |
| Padding interno de card | 16 dp |
| Gap entre cards | 12 dp |
| Altura de item de lista | 64 dp (2 linhas) · 56 dp (1 linha) |
| Altura de campo de texto | 56 dp |
| Altura de botão | 48 dp |
| Altura de chip | 32 dp |
| Área de toque mínima | 48 × 48 dp |

---

## 6. Elevação

| Superfície | Light | Dark |
|:--|:--|:--|
| Card | 0 dp + borda `outline` | 0 dp, `surface` sobre `background` |
| Card elevado (destaque) | 2 dp | 0 dp |
| FAB | 6 dp | 6 dp |
| Bottom sheet | 16 dp | 16 dp |
| Diálogo | 24 dp | 24 dp |
| Barra inferior | 0 dp + borda superior | 0 dp + borda superior |

Dark mode não usa sombra: a separação vem de variação de superfície e borda.

---

## 7. Movimento

| Token | Duração | Uso |
|:--|:--|:--|
| `motionFast` | 150 ms | Ripple, mudança de estado de componente |
| `motionMedium` | 250 ms | Entrada de sheet, transição de tela |
| `motionSlow` | 400 ms | Expansão de seção, troca de tema |

Curva padrão: `Easing.Standard` do M3 (`FastOutSlowIn`).
Respeitar `Settings.Global.ANIMATOR_DURATION_SCALE` — usuário com animações desligadas
não recebe transição.

---

## 8. Ícones

| Tamanho | Uso |
|:--|:--|
| 16 dp | Ícone dentro de chip e de snackbar |
| 18 dp | Ícone dentro de botão |
| 20 dp | Ícone em campo de texto |
| 24 dp | Ícone de lista, de barra inferior, de topo de tela |

- Estilo: contorno 2 dp, cantos arredondados. Preenchido apenas no ícone ativo da barra.
- Cor herda do container (`onSurface`, `accent` ou `onPrimary`). Nunca cor fixa.
- Todo ícone que carrega ação tem `contentDescription`. Ícone decorativo usa `null`.

**Conjunto necessário (15 vetores próprios)** — categorias e domínio do motorista:
combustível, manutenção, pedágio, financiamento, depreciação, moradia, alimentação, saúde,
educação, lazer, corrida, veículo, meta, odômetro, nota fiscal.

Os ícones de interface (casa, barras, engrenagem, seta, busca, filtro, calendário, fechar)
vêm de `material-icons-core`.

---

## 9. Estrutura de código proposta

Sem implementar — apenas a forma que os tokens vão tomar quando a migração começar.

```
ui/theme/
  Color.kt          → lightColorScheme / darkColorScheme
  ExtendedColors.kt → LocalMotoristAIColors (success, warning, info, chart1..6, accent…)
  Type.kt           → Typography + MotoristAITypography (display, title1…)
  Shape.kt          → Shapes
  Spacing.kt        → LocalSpacing (space1..space6)
  Motion.kt         → LocalMotion
  Theme.kt          → MotoristAITheme(darkTheme = isSystemInDarkTheme())
```

`dynamicColor` permanece desativado em `Theme.kt`, com comentário explicando a decisão
(identidade de marca sobre Material You).

---

## 10. Checklist de aceite dos tokens

- [ ] Nenhum hex fora de `ui/theme/`
- [ ] Todo par texto/fundo da seção 2.4 dentro do mínimo
- [ ] Dois temas com o mesmo conjunto de nomes
- [ ] Escala de fonte do sistema não quebra nenhum componente
- [ ] Cores de gráfico estáveis entre telas e temas
- [ ] `contentDescription` em todo ícone acionável
