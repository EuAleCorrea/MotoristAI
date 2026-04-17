# MotoristAI - Instrucoes Obrigatorias do Projeto

Este arquivo e lido automaticamente por qualquer agente AI que trabalhe neste projeto.
As regras abaixo sao OBRIGATORIAS e devem ser seguidas SEM EXCECAO.

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
