import { useState, useEffect, useRef } from 'react';
import { usePhotoNoteStore, PHOTO_NOTE_CATEGORIES } from '../../../store/photoNoteStore';
import { useVehicleStore } from '../../../store/vehicleStore';
import { formatCurrency } from '../../../utils/formatters';

const PhotoNotePage = () => {
  const { notes, isLoading, uploading, error, fetchNotes, addNote, deleteNote } = usePhotoNoteStore();
  const { vehicles, fetchVehicles } = useVehicleStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'outros',
    vehicle_id: '',
    notes: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewPhoto, setViewPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
    fetchVehicles();
  }, [fetchNotes, fetchVehicles]);

  const resetForm = () => {
    setForm({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'outros',
      vehicle_id: '',
      notes: '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Selecione uma foto da nota');
      return;
    }
    if (!form.amount || !form.description) {
      alert('Preencha valor e descrição');
      return;
    }

    await addNote({
      amount: parseFloat(form.amount),
      description: form.description,
      date: form.date,
      category: form.category,
      vehicle_id: form.vehicle_id || null,
      notes: form.notes || null,
      photoFile: selectedFile,
    });

    resetForm();
  };

  const handleDelete = async (id: string, photoUrl: string) => {
    await deleteNote(id, photoUrl);
    setDeleteConfirm(null);
  };

  const getCategoryLabel = (value: string) => {
    return PHOTO_NOTE_CATEGORIES.find((c) => c.value === value)?.label || value;
  };

  if (isLoading && notes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ios-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ios-text)]">Notas com Foto</h1>
          <p className="text-sm text-[var(--ios-text-secondary)] mt-1">
            Registre despesas com foto da nota fiscal
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[var(--ios-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Nova Nota
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Formulário de nova nota */}
      {showForm && (
        <div className="bg-[var(--ios-card-bg)] rounded-xl p-4 space-y-4 border border-[var(--ios-card-border)]">
          <h2 className="font-semibold text-[var(--ios-text)]">Nova Nota</h2>

          {/* Upload de foto */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--ios-text-secondary)]">Foto da Nota *</label>
            {previewUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setViewPhoto(previewUrl)}
                />
                <button
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-black/80"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--ios-card-border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--ios-blue)] transition-colors"
              >
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm text-[var(--ios-text-secondary)]">
                  Clique para selecionar a foto da nota
                </p>
                <p className="text-xs text-[var(--ios-text-tertiary)] mt-1">
                  JPG, PNG ou WEBP
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Valor */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Valor *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0,00"
              className="w-full bg-[var(--ios-bg)] border border-[var(--ios-card-border)] rounded-lg px-3 py-2 text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Descrição *</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Abastecimento posto Shell"
              className="w-full bg-[var(--ios-bg)] border border-[var(--ios-card-border)] rounded-lg px-3 py-2 text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
            />
          </div>

          {/* Data e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Data</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-[var(--ios-bg)] border border-[var(--ios-card-border)] rounded-lg px-3 py-2 text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[var(--ios-bg)] border border-[var(--ios-card-border)] rounded-lg px-3 py-2 text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
              >
                {PHOTO_NOTE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Veículo (opcional) */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Veículo (opcional)</label>
            <select
              value={form.vehicle_id}
              onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
              className="w-full bg-[var(--ios-bg)] border border-[var(--ios-card-border)] rounded-lg px-3 py-2 text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
            >
              <option value="">Nenhum</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year})
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="Observações adicionais..."
              className="w-full bg-[var(--ios-bg)] border border-[var(--ios-card-border)] rounded-lg px-3 py-2 text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)] resize-none"
            />
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 bg-[var(--ios-blue)] text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </span>
              ) : (
                'Salvar Nota'
              )}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--ios-text-secondary)] border border-[var(--ios-card-border)] hover:bg-[var(--ios-bg)] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de notas */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-[var(--ios-text-secondary)]">Nenhuma nota registrada</p>
          <p className="text-sm text-[var(--ios-text-tertiary)] mt-1">
            Clique em "+ Nova Nota" para começar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-[var(--ios-card-bg)] rounded-xl overflow-hidden border border-[var(--ios-card-border)]"
            >
              {/* Foto miniatura */}
              <div
                className="relative h-40 bg-gray-100 cursor-pointer"
                onClick={() => setViewPhoto(note.photo_url)}
              >
                <img
                  src={note.photo_url}
                  alt={note.description}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" x="50" text-anchor="middle" dominant-baseline="central" font-size="40">📷</text></svg>';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-[var(--ios-blue)] text-white text-xs px-2 py-1 rounded-full">
                    {getCategoryLabel(note.category)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--ios-text)] truncate">
                      {note.description}
                    </h3>
                    <p className="text-2xl font-bold text-[var(--ios-blue)]">
                      {formatCurrency(note.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-[var(--ios-text-secondary)]">
                  <span>
                    {new Date(note.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </span>
                  {note.vehicle_id && vehicles.find((v) => v.id === note.vehicle_id) && (
                    <span className="bg-[var(--ios-bg)] px-2 py-1 rounded text-xs">
                      {vehicles.find((v) => v.id === note.vehicle_id)?.brand}{' '}
                      {vehicles.find((v) => v.id === note.vehicle_id)?.model}
                    </span>
                  )}
                </div>

                {note.notes && (
                  <p className="text-sm text-[var(--ios-text-tertiary)] italic">
                    "{note.notes}"
                  </p>
                )}

                {/* Ações */}
                <div className="flex justify-end pt-2">
                  {deleteConfirm === note.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(note.id, note.photo_url)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-[var(--ios-text-secondary)] px-3 py-1.5 rounded-lg text-xs border border-[var(--ios-card-border)] hover:bg-[var(--ios-bg)]"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(note.id)}
                      className="text-red-500 text-xs hover:text-red-600"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de visualização ampliada da foto */}
      {viewPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setViewPhoto(null)}
              className="absolute -top-10 right-0 text-white text-lg hover:text-gray-300"
            >
              Fechar ✕
            </button>
            <img
              src={viewPhoto}
              alt="Nota fiscal"
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoNotePage;