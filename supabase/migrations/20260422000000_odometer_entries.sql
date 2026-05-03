-- Tabela de lançamentos de quilometragem do odômetro
-- Cada entrada registra o km do veículo em uma determinada data
CREATE TABLE IF NOT EXISTS odometer_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  km INTEGER NOT NULL CHECK (km >= 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_odometer_entries_user ON odometer_entries(user_id);
CREATE INDEX idx_odometer_entries_vehicle ON odometer_entries(vehicle_id);
CREATE INDEX idx_odometer_entries_date ON odometer_entries(date);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_odometer_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_odometer_entries_updated_at
  BEFORE UPDATE ON odometer_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_odometer_entries_updated_at();

-- RLS
ALTER TABLE odometer_entries ENABLE ROW LEVEL SECURITY;

-- Políticas: usuário só vê/gerencia seus próprios registros
CREATE POLICY "Users can view own odometer entries"
  ON odometer_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own odometer entries"
  ON odometer_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own odometer entries"
  ON odometer_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own odometer entries"
  ON odometer_entries FOR DELETE
  USING (auth.uid() = user_id);