# 🛡️ Registro de Vulnerabilidades e Riscos

Este documento serve para rastrear todas as falhas de segurança identificadas e as ações tomadas para mitigá-las.

## ✅ Vulnerabilidades Resolvidas

| ID | Vulnerabilidade | Data Correção | Método |
|:---|:---|:---|:---|
| SEC-001 | Vazamento de Service Role Key no Frontend | 2026-04-16 | Substituição por Anon Key no .env |
| SEC-002 | Tabelas Supabase sem Row Level Security (RLS) | 2026-04-16 | Aplicação de script SQL de Hardening (auth.uid()) |

---

## 🚩 Riscos Ativos
1. **Falta de Auditoria Automatizada Pós-Deploy**: Necessário criar rotinas periódicas de scan.

---

## 📈 Melhores Práticas de Segurança (MotoristAI)
- Nunca usar o prefixo `VITE_` para chaves `service_role` ou `secret_key`.
- Todo deploy deve ser precedido por um `npm audit` e scan de segurança com o Antigravity Kit.
- RLS deve ser a primeira coisa a ser configurada em qualquer nova tabela.
- Usar sempre o `user_id` vinculado ao `auth.uid()` para isolamento de dados.
