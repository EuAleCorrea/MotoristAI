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
