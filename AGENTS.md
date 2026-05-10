# MotoristAI — Instruções Obrigatórias do Projeto

Este arquivo é lido automaticamente por qualquer agente AI (Claude, Gemini ou outro) que trabalhe neste projeto.
As regras abaixo são **OBRIGATÓRIAS** e devem ser seguidas **SEM EXCEÇÃO**.

---

## Comportamento do Agente (Karpathy Guidelines)

Diretrizes comportamentais para reduzir erros comuns de codificação. Aplicáveis a **toda** implementação de código.

> **Tradeoff:** Estas diretrizes priorizam cautela sobre velocidade. Para tarefas triviais, use o bom senso.

### 1. Pense Antes de Codificar

**Não assuma. Não esconda confusão. Mostre os tradeoffs.**

Antes de implementar:
- Declare suas suposições explicitamente. Se incerto, pergunte.
- Se existirem múltiplas interpretações, apresente-as — não escolha silenciosamente.
- Se existir uma abordagem mais simples, diga. Questione quando necessário.
- Se algo estiver confuso, pare. Nomeie o que está confuso. Pergunte.

### 2. Simplicidade Primeiro

**Código mínimo que resolve o problema. Nada especulativo.**

- Sem features além do que foi pedido.
- Sem abstrações para código de uso único.
- Sem "flexibilidade" ou "configurabilidade" que não foi solicitada.
- Sem tratamento de erros para cenários impossíveis.
- Se você escrever 200 linhas e puder ser 50, reescreva.

Pergunte-se: "Um engenheiro sênior diria que isso está complicado demais?" Se sim, simplifique.

### 3. Mudanças Cirúrgicas

**Toque apenas o necessário. Limpe apenas a sua própria bagunça.**

Ao editar código existente:
- Não "melhore" código adjacente, comentários ou formatação.
- Não refatore coisas que não estão quebradas.
- Mantenha o estilo existente, mesmo que você faria diferente.
- Se notar código morto não relacionado, mencione — não delete.

Quando suas mudanças criarem órfãos:
- Remova imports/variáveis/funções que **suas** mudanças tornaram desnecessários.
- Não remova código morto pré-existente a menos que solicitado.

O teste: cada linha alterada deve ser rastreável diretamente ao pedido do usuário.

### 4. Execução Orientada a Objetivos

**Defina critérios de sucesso. Itere até verificar.**

Transforme tarefas em objetivos verificáveis:
- "Adicionar validação" → "Escrever testes para inputs inválidos, depois fazê-los passar"
- "Corrigir o bug" → "Escrever um teste que reproduz o bug, depois fazê-lo passar"
- "Refatorar X" → "Garantir que os testes passem antes e depois"

Para tarefas multi-etapas, declare um plano breve:
```
1. [Etapa] → verificar: [checagem]
2. [Etapa] → verificar: [checagem]
3. [Etapa] → verificar: [checagem]
```

Critérios fortes de sucesso permitem iterar de forma independente. Critérios fracos ("fazer funcionar") exigem clarificações constantes.

---

## Git: Commit e Push

**ANTES de executar qualquer operação de git (commit, push, branch), você DEVE:**

1. Ler o arquivo `docs/GIT_WORKFLOW.md`
2. Seguir **exatamente** os passos documentados nele
3. Usar as informações de remote, branch e diretório descritas naquele arquivo

**Referência rápida (sempre confirme no `GIT_WORKFLOW.md`):**
- Diretório: `z:\Documentos\Projetos\MotoristAI`
- Remote: `origin`
- Branch: `main`
- Mensagens de commit em inglês, no formato: `tipo: descricao`

---

## Segurança

- **NUNCA** exponha a `service_role` key do Supabase no código cliente
- **NUNCA** commite o arquivo `.env`
- **NUNCA** commite a pasta `.agent/`
- Toda nova tabela no Supabase **DEVE** ter RLS habilitado com política vinculada ao `auth.uid()`

---

## Documentação do Projeto

| Documento | Caminho | Descrição |
|:----------|:--------|:----------|
| Git Workflow | `docs/GIT_WORKFLOW.md` | Passo a passo padrão para commit/push |
| Manutenção | `docs/MAINTENANCE.md` | Guia de infraestrutura e deploy |
| Vulnerabilidades | `docs/vulnerabilities.md` | Registro de riscos e resoluções |
| Backlog de Planos | `docs/plans/README.md` | Índice de planos de implementação |

---

## Stack Técnica

| Camada | Tecnologia |
|:-------|:-----------|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Estado | Zustand |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Mobile | Capacitor |
| Deploy | EasyPanel + Nixpacks (Hostinger VPS) |

---

## Idioma

Sempre converse com o usuário em **Português do Brasil**.
