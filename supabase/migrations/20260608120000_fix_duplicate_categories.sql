-- Migration 009: Limpar duplicatas em expense_categories + adicionar UNIQUE constraint
-- Data: 2026-06-08
-- Contexto: race condition no seedDefaultCategories causou duplicações em (user_id, name)
-- Este script é idempotente — pode rodar mais de uma vez sem erro.

BEGIN;

-- ============================================================================
-- 1. CONFERÊNCIA (não destrutivo) — mostra duplicatas existentes
-- ============================================================================
DO $$
DECLARE
  total_dups INT;
BEGIN
  SELECT COUNT(*) INTO total_dups
  FROM (
    SELECT user_id, name
    FROM expense_categories
    GROUP BY user_id, name
    HAVING COUNT(*) > 1
  ) dups;

  RAISE NOTICE 'Antes da limpeza: % grupos de duplicatas encontrados', total_dups;
END $$;

-- ============================================================================
-- 2. LIMPEZA — apaga duplicatas mantendo a mais antiga (menor ctid) por (user_id, name)
-- ============================================================================
DELETE FROM expense_categories a
USING expense_categories b
WHERE a.user_id = b.user_id
  AND a.name = b.name
  AND a.ctid > b.ctid;

-- ============================================================================
-- 3. CONSTRAINT — impede duplicações futuras em (user_id, name)
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'expense_categories_user_id_name_unique'
  ) THEN
    ALTER TABLE expense_categories
    ADD CONSTRAINT expense_categories_user_id_name_unique
    UNIQUE (user_id, name);
    RAISE NOTICE 'Constraint UNIQUE (user_id, name) criada com sucesso';
  ELSE
    RAISE NOTICE 'Constraint UNIQUE (user_id, name) já existe — nada a fazer';
  END IF;
END $$;

-- ============================================================================
-- 4. VALIDAÇÃO PÓS-LIMPEZA
-- ============================================================================
DO $$
DECLARE
  total_rows INT;
  total_dups INT;
BEGIN
  SELECT COUNT(*) INTO total_rows FROM expense_categories;
  SELECT COUNT(*) INTO total_dups
  FROM (
    SELECT user_id, name
    FROM expense_categories
    GROUP BY user_id, name
    HAVING COUNT(*) > 1
  ) dups;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'RESULTADO:';
  RAISE NOTICE '  Linhas restantes: %', total_rows;
  RAISE NOTICE '  Duplicatas restantes: %', total_dups;
  RAISE NOTICE '========================================';
END $$;

COMMIT;
