# MotoristAI - Instrucoes Obrigatorias do Projeto

Este arquivo e lido automaticamente por qualquer agente AI que trabalhe neste projeto.
As regras abaixo sao OBRIGATORIAS e devem ser seguidas SEM EXCECAO.

---

## Karpathy Guidelines (OBRIGATÓRIO)

**ANTES de iniciar qualquer implementação de código, você DEVE:**
1. Ler e seguir as diretrizes comportamentais em `CLAUDE.md`.
2. Consultar a skill `karpathy-guidelines` (`.agent/.agent/skills/karpathy-guidelines/SKILL.md`) para garantir que o código siga os padrões de simplicidade, precisão e mudanças cirúrgicas.
3. Se houver dúvida sobre a implementação, pare e pergunte ao usuário seguindo a regra "Think Before Coding".

---

## Git: Commit e Push

**ANTES de executar qualquer operacao de git (commit, push, branch), voce DEVE:**

1. Ler o arquivo `docs/GIT_WORKFLOW.md` usando a ferramenta `view_file`
2. Seguir EXATAMENTE os passos documentados nele
3. Usar as informacoes de remote, branch e diretorio descritas naquele arquivo

**Dados rapidos (para referencia, mas SEMPRE confirme no GIT_WORKFLOW.md):**
- Diretorio: `z:\Documentos\Projetos\MotoristAI`
- Remote: `origin`
- Branch: `main`
- Mensagens de commit em ingles, no formato: `tipo: descricao`

---

## Seguranca

- **NUNCA** exponha a `service_role` key do Supabase no codigo cliente
- **NUNCA** commite o arquivo `.env`
- **NUNCA** commite a pasta `.agent/`
- Toda nova tabela no Supabase DEVE ter RLS habilitado com politica vinculada ao `auth.uid()`

---

## Documentacao do Projeto

| Documento | Caminho | Descricao |
|:----------|:--------|:----------|
| Git Workflow | `docs/GIT_WORKFLOW.md` | Passo a passo padrao para commit/push |
| Manutencao | `docs/MAINTENANCE.md` | Guia de infraestrutura e deploy |
| Vulnerabilidades | `docs/vulnerabilities.md` | Registro de riscos e resolucoes |
| Backlog de Planos | `docs/plans/README.md` | Indice de planos de implementacao |

---

## Stack Tecnica

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Estado**: Zustand
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Mobile**: Capacitor
- **Deploy**: EasyPanel + Nixpacks (Hostinger VPS)

---

## Idioma

Sempre converse com o usuario em **Portugues do Brasil**.
