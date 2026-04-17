-- Security Hardening for MotoristAI
-- This script ensures all tables have RLS enabled and proper user-level isolation.
-- Run this in the Supabase SQL Editor.

DO $$
DECLARE
    t text;
    -- Adicionada verificação de segurança para as tabelas identificadas no código
    tables text[] := ARRAY['vehicles', 'vehicle_expenses', 'trips', 'platforms', 'goals', 'family_expenses', 'expenses', 'entries'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- 1. Habilitar RLS (Row Level Security)
        -- Isso bloqueia todo acesso que não corresponda a uma política explícita
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

        -- 2. Garantir que a coluna user_id existe
        -- Se não existir, ela é criada como UUID apontando para a tabela de usuários do Supabase
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = t AND column_name = 'user_id'
        ) THEN
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN user_id uuid REFERENCES auth.users DEFAULT auth.uid()', t);
        END IF;

        -- 3. Limpar políticas antigas (para permitir re-execução segura do script)
        EXECUTE format('DROP POLICY IF EXISTS "Users can only access their own %I" ON public.%I', t, t);

        -- 4. Criar Política Consolidada (CRUD Total)
        -- Permite ler, inserir, atualizar e deletar apenas os próprios dados
        EXECUTE format('CREATE POLICY "Users can only access their own %I" ON public.%I 
                        FOR ALL 
                        USING (auth.uid() = user_id) 
                        WITH CHECK (auth.uid() = user_id)', t, t);
        
        RAISE NOTICE 'Segurança aplicada com sucesso na tabela: %', t;
    END LOOP;
END $$;
