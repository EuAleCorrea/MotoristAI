-- Migração para remover duplicatas e adicionar constraint UNIQUE
-- Execute este script no SQL Editor do Supabase

-- 1. Identificar e remover plataformas duplicadas (mantendo a mais antiga)
DELETE FROM platforms
WHERE id NOT IN (
    SELECT MIN(id)
    FROM platforms
    GROUP BY LOWER(name)
);

-- 2. Adicionar constraint UNIQUE no campo name para prevenir futuras duplicatas
-- Primeiro, verificar se a constraint já existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'platforms_name_unique'
    ) THEN
        ALTER TABLE platforms ADD CONSTRAINT platforms_name_unique UNIQUE (name);
    END IF;
END $$;

-- 3. Verificar o resultado
SELECT * FROM platforms ORDER BY sort_order;
