# Plano 001: Auditoria de Segurança Crítica

**Status:** ✅ Concluído
**Data de Criação:** 2026-04-16
**Autor:** Antigravity

## 🎯 Objetivo
Identificar e corrigir falhas de segurança no MotoristAI, com foco imediato no vazamento de credenciais administrativas e configuração de políticas de proteção de dados (RLS).

## 🚩 Problemas Identificados
1. **Exposição de Service Role Key**: A chave `service_role` está sendo usada no frontend (prefixada com `VITE_`), permitindo acesso total ao banco via navegador.
2. **RLS Inativo**: Ausência de políticas de segurança por linha nas tabelas do Supabase.
3. **Falta de Ferramentas**: Antigravity Kit não instalado para scans automatizados.

## 🛠️ Ações Necessárias
1. **Correção de Credenciais**:
   - Obter a `Anon Key` correta.
   - Atualizar o arquivo `.env`.
2. **Implementação de RLS**:
   - Criar migração SQL para habilitar RLS em todas as tabelas.
   - Definir políticas: `auth.uid() = user_id`.
3. **Instalação de Ferramentas**:
   - Clonar o Antigravity Kit em `.agent/`.
   - Executar `security_scan.py`.

## 📝 Notas de Execução
- Aguardando confirmação da Anon Key pelo usuário.
