-- Migration: photo_notes
-- Descrição: Lançamento de despesas com foto da nota fiscal
-- Associado a: PhotoNotePage

-- Criar bucket de storage para fotos de notas
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('note_photos', 'note_photos', false, false)
ON CONFLICT (id) DO NOTHING;

-- Política: usuário pode ver apenas suas próprias fotos
CREATE POLICY "Users can view their own note photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'note_photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: usuário pode fazer upload de fotos
CREATE POLICY "Users can upload note photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'note_photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: usuário pode deletar suas próprias fotos
CREATE POLICY "Users can delete their own note photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'note_photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Tabela de notas com foto
CREATE TABLE IF NOT EXISTS photo_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  photo_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'outros',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_photo_notes_user_id ON photo_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_notes_vehicle_id ON photo_notes(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_photo_notes_date ON photo_notes(date DESC);
CREATE INDEX IF NOT EXISTS idx_photo_notes_category ON photo_notes(category);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_photo_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_photo_notes_updated_at ON photo_notes;
CREATE TRIGGER trigger_photo_notes_updated_at
  BEFORE UPDATE ON photo_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_photo_notes_updated_at();

-- RLS
ALTER TABLE photo_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own photo notes"
ON photo_notes FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own photo notes"
ON photo_notes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own photo notes"
ON photo_notes FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own photo notes"
ON photo_notes FOR DELETE
TO authenticated
USING (user_id = auth.uid());