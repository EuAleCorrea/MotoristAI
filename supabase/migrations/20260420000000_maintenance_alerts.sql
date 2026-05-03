-- Tabela de regras de manutenção por quilometragem
-- Cada regra define um tipo de manutenção com intervalo em km
CREATE TABLE IF NOT EXISTS maintenance_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL, -- Ex: "Troca de óleo", "Correia dentada"
  interval_km INTEGER NOT NULL CHECK (interval_km > 0),
  last_km INTEGER NOT NULL DEFAULT 0, -- Km da última realização
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Histórico de manutenções realizadas (opcional, vincula a despesas)
CREATE TABLE IF NOT EXISTS maintenance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES maintenance_rules(id) ON DELETE CASCADE,
  expense_id UUID REFERENCES vehicle_expenses(id) ON DELETE SET NULL,
  km_at_service INTEGER NOT NULL, -- Km do veículo no momento
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_maintenance_rules_user ON maintenance_rules(user_id);
CREATE INDEX idx_maintenance_rules_vehicle ON maintenance_rules(vehicle_id);
CREATE INDEX idx_maintenance_history_rule ON maintenance_history(rule_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_maintenance_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_maintenance_rules_updated_at
  BEFORE UPDATE ON maintenance_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_maintenance_rules_updated_at();

-- RLS
ALTER TABLE maintenance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_history ENABLE ROW LEVEL SECURITY;

-- Políticas: usuário só vê seus próprios registros
CREATE POLICY "Users can view own maintenance rules"
  ON maintenance_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own maintenance rules"
  ON maintenance_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own maintenance rules"
  ON maintenance_rules FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own maintenance rules"
  ON maintenance_rules FOR DELETE
  USING (auth.uid() = user_id);

-- Histórico
CREATE POLICY "Users can view own maintenance history"
  ON maintenance_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_rules
      WHERE maintenance_rules.id = maintenance_history.rule_id
      AND maintenance_rules.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own maintenance history"
  ON maintenance_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_rules
      WHERE maintenance_rules.id = maintenance_history.rule_id
      AND maintenance_rules.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own maintenance history"
  ON maintenance_history FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_rules
      WHERE maintenance_rules.id = maintenance_history.rule_id
      AND maintenance_rules.user_id = auth.uid()
    )
  );