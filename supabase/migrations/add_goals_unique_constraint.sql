-- Script SQL para adicionar UNIQUE constraint na tabela goals
-- Execute este script no SQL Editor do Supabase

-- Primeiro, remover duplicatas existentes
-- Mantendo apenas um registro por user_id/year/month
DELETE FROM goals a
USING goals b
WHERE a.user_id = b.user_id 
  AND a.year = b.year 
  AND a.month = b.month
  AND a.id < b.id;

-- Agora adicionar a constraint de unicidade
ALTER TABLE goals 
ADD CONSTRAINT goals_user_year_month_unique 
UNIQUE (user_id, year, month);
