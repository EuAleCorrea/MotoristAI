-- =============================================================
-- Migration: Recurrences and Installments
-- =============================================================
-- Recorrências: despesas que se repetem (aluguel, assinaturas, etc.)
-- Parcelamentos: despesas parceladas no cartão ou boleto
-- =============================================================

-- ---------------------------------------------------------
-- 1. Tabela: recurrences
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS recurrences (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificação
  description TEXT NOT NULL,
  category    TEXT NOT NULL,                    -- ex: 'Moradia', 'Alimentação', 'Assinatura', 'Seguro', 'Outros'
  type        TEXT NOT NULL CHECK (type IN ('vehicle', 'family', 'general')),

  -- Valor e periodicidade
  amount          DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  frequency       TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual')),
  day             INTEGER CHECK (day IS NULL OR (day >= 1 AND day <= 31)),  -- dia de vencimento (opcional para weekly)
  next_due_date   DATE NOT NULL,               -- próxima data de vencimento calculada

  -- Relacionamento (opcional)
  vehicle_id  UUID REFERENCES vehicles(id) ON DELETE SET NULL,

  -- Controle
  active      BOOLEAN NOT NULL DEFAULT true,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_recurrences_user_id ON recurrences(user_id);
CREATE INDEX idx_recurrences_active ON recurrences(active);
CREATE INDEX idx_recurrences_next_due ON recurrences(next_due_date);

-- RLS
ALTER TABLE recurrences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias recorrências"
  ON recurrences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias recorrências"
  ON recurrences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias recorrências"
  ON recurrences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias recorrências"
  ON recurrences FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 2. Tabela: installments
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS installments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificação
  description TEXT NOT NULL,
  category    TEXT NOT NULL,                    -- ex: 'Eletrônicos', 'Móveis', 'Curso', 'Cartão', 'Outros'

  -- Valores
  total_amount    DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
  installment_amount DECIMAL(12,2) NOT NULL CHECK (installment_amount > 0),
  total_installments  INTEGER NOT NULL CHECK (total_installments BETWEEN 2 AND 120),
  paid_installments   INTEGER NOT NULL DEFAULT 0 CHECK (paid_installments >= 0),

  -- Datas
  start_date  DATE NOT NULL,                   -- data da primeira parcela
  due_day     INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),  -- dia de vencimento de cada parcela
  next_due_date DATE NOT NULL,                 -- próxima parcela a vencer

  -- Forma de pagamento
  payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'debit_card', 'bank_slip', 'pix', 'other')),

  -- Relacionamento (opcional)
  vehicle_id  UUID REFERENCES vehicles(id) ON DELETE SET NULL,

  -- Controle
  active      BOOLEAN NOT NULL DEFAULT true,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_installments_user_id ON installments(user_id);
CREATE INDEX idx_installments_active ON installments(active);
CREATE INDEX idx_installments_next_due ON installments(next_due_date);

-- RLS
ALTER TABLE installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios parcelamentos"
  ON installments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios parcelamentos"
  ON installments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios parcelamentos"
  ON installments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios parcelamentos"
  ON installments FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 3. Trigger: updated_at automático
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_recurrences_updated_at
  BEFORE UPDATE ON recurrences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_installments_updated_at
  BEFORE UPDATE ON installments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();