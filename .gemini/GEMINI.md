# Regras do Projeto MotoristAI

## Navegação - Botão de Voltar
- NUNCA adicione botão de voltar customizado dentro das páginas
- SEMPRE use o Header global: adicione o pattern da rota em `src/components/Header.tsx` no array `formPagePatterns`
- Exemplo: `/^\/cadastros\/plataformas$/`

## Imports Supabase
- SEMPRE use `../services/supabase` (não `../lib/supabase`)

## Estrutura de Páginas
- Header de página: apenas título com ícone, sem botão de voltar
- O botão de voltar é gerenciado pelo componente Header.tsx global

## Banco de Dados
- SEMPRE habilitar RLS em todas as tabelas
- SEMPRE criar stores Zustand com funções de seed para dados padrão
- **SEMPRE use o MCP do Supabase** para executar queries, migrações e operações no banco de dados diretamente. Não peça ao usuário para executar manualmente no terminal ou SQL Editor.

## Formatação de Números e Moeda (CRÍTICO)
- SEMPRE use o padrão brasileiro (pt-BR) para formatação de números e moeda
- NUNCA use `.toFixed()` diretamente para exibir valores ao usuário
- SEMPRE use as funções utilitárias de `src/utils/formatters.ts`:
  - `formatCurrency(value)` para valores monetários (ex: R$ 1.234,56)
  - `formatNumber(value, decimals)` para números gerais (ex: 1.234,56)
  - `formatPercent(value)` para percentuais (ex: 85,5%)
- Para tooltips de gráficos ECharts, use formatadores personalizados com `toLocaleString('pt-BR')`
- Exemplo correto: `value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`
- Exemplo incorreto: `R$ ${value.toFixed(2)}`
