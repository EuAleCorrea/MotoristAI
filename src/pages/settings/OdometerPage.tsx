import { useState, useEffect } from 'react';
import { Gauge, Plus, Edit2, Trash2, Check, X, Car, Calendar, FileText } from 'lucide-react';
import { useOdometerStore, OdometerEntry } from '../../../store/odometerStore';
import { useVehicleStore } from '../../../store/vehicleStore';

function OdometerPage() {
  const { entries, fetchEntries, addEntry, updateEntry, deleteEntry } = useOdometerStore();
  const { vehicles, fetchVehicles } = useVehicleStore();

  // Form state
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [kmInput, setKmInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [notesInput, setNotesInput] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKm, setEditingKm] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const [editingNotes, setEditingNotes] = useState('');

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (selectedVehicleId) {
      fetchEntries(selectedVehicleId);
    } else {
      fetchEntries();
    }
  }, [selectedVehicleId, fetchEntries]);

  const getVehicleName = (vehicleId: string) => {
    const v = vehicles.find((v) => v.id === vehicleId);
    return v ? `${v.brand} ${v.model} ${v.version || ''} (${v.year})` : 'Veículo não encontrado';
  };

  const handleAddEntry = async () => {
    if (!selectedVehicleId || !kmInput.trim()) return;
    const km = parseInt(kmInput, 10);
    if (isNaN(km) || km < 0) return;

    await addEntry({
      vehicle_id: selectedVehicleId,
      km,
      date: dateInput,
      notes: notesInput,
    });

    setKmInput('');
    setNotesInput('');
    setDateInput(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const handleStartEdit = (entry: OdometerEntry) => {
    setEditingId(entry.id);
    setEditingKm(entry.km.toString());
    setEditingDate(entry.date);
    setEditingNotes(entry.notes);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const km = parseInt(editingKm, 10);
    if (isNaN(km) || km < 0) return;

    await updateEntry(editingId, {
      km,
      date: editingDate,
      notes: editingNotes,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    setDeletingId(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[var(--ios-tint)]">
          <Gauge className="h-6 w-6 text-[var(--ios-accent)]" />
        </div>
        <h1 className="text-xl font-bold text-[var(--ios-text)]">
          Lançar Km do Odômetro
        </h1>
      </div>

      {/* Vehicle Selector */}
      <div>
        <label className="block text-sm font-medium text-[var(--ios-text-secondary)] mb-2">
          Selecione o veículo
        </label>
        <select
          value={selectedVehicleId}
          onChange={(e) => setSelectedVehicleId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[var(--ios-separator)] bg-[var(--ios-card)] text-[var(--ios-text)] text-sm appearance-none"
        >
          <option value="">Todos os veículos</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.brand} {v.model} {v.version || ''} ({v.year})
            </option>
          ))}
        </select>
      </div>

      {/* Action Button / Form */}
      {showForm ? (
        <div className="bg-[var(--ios-card)] rounded-xl shadow-sm p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">
              Quilometragem (km)
            </label>
            <input
              type="number"
              min="0"
              value={kmInput}
              onChange={(e) => setKmInput(e.target.value)}
              placeholder="Ex: 50000"
              className="w-full px-4 py-3 rounded-xl border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">
              Data
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">
              Observação (opcional)
            </label>
            <input
              type="text"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Ex: Início do mês"
              className="w-full px-4 py-3 rounded-xl border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddEntry}
              disabled={!selectedVehicleId || !kmInput.trim()}
              className="flex-1 px-4 py-3 bg-[var(--sys-green)] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 transition"
            >
              Salvar
            </button>
            <button
              onClick={() => { setShowForm(false); setKmInput(''); setNotesInput(''); }}
              className="px-4 py-3 bg-[var(--ios-fill)] text-[var(--ios-text)] font-semibold rounded-xl hover:opacity-80 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          disabled={!vehicles.length}
          className="w-full p-4 flex items-center justify-center gap-2 text-[var(--ios-accent)] hover:bg-[var(--ios-bg)] rounded-xl border-2 border-dashed border-[var(--ios-separator)] transition disabled:opacity-40"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Novo Lançamento</span>
        </button>
      )}

      {/* List */}
      <div className="bg-[var(--ios-card)] rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-[var(--ios-separator)]">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-[var(--ios-text-tertiary)]">
              <Gauge className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhum lançamento encontrado.</p>
              <p className="text-xs mt-1">Adicione o primeiro lançamento de km acima.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-[var(--ios-bg)]/50 transition relative group">
                {/* Delete overlay */}
                {deletingId === entry.id && (
                  <div className="absolute inset-0 bg-[rgba(255,59,48,0.08)] flex items-center justify-center gap-4 z-10 rounded-xl">
                    <span className="text-sm text-red-700 dark:text-red-300 font-medium">Excluir este lançamento?</span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-3 py-1.5 bg-gray-200 text-[var(--ios-text)] text-sm font-semibold rounded-lg"
                    >
                      Não
                    </button>
                  </div>
                )}

                {editingId === entry.id ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--ios-text-tertiary)] w-8">Km:</span>
                      <input
                        type="number"
                        min="0"
                        value={editingKm}
                        onChange={(e) => setEditingKm(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--ios-text-tertiary)] w-8">Data:</span>
                      <input
                        type="date"
                        value={editingDate}
                        onChange={(e) => setEditingDate(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--ios-text-tertiary)] w-8">Obs:</span>
                      <input
                        type="text"
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Observação"
                        className="flex-1 px-3 py-2 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-bg)] text-[var(--ios-text)] text-sm"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleSaveEdit} className="p-2 text-[var(--sys-green)] hover:bg-[rgba(52,199,89,0.08)] rounded-lg">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancelEdit} className="p-2 text-[var(--ios-text-secondary)] hover:bg-[var(--ios-fill)] rounded-lg">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[var(--ios-text)]">
                          {entry.km.toLocaleString('pt-BR')} km
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--ios-text-tertiary)]">
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {getVehicleName(entry.vehicle_id)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      {entry.notes && (
                        <div className="flex items-center gap-1 text-xs text-[var(--ios-text-secondary)] mt-1">
                          <FileText className="h-3 w-3" />
                          {entry.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className="p-2 text-[var(--ios-text-tertiary)] hover:text-[var(--ios-accent)] hover:bg-[var(--ios-fill)] rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(entry.id)}
                        className="p-2 text-[var(--ios-text-tertiary)] hover:text-[var(--sys-red)] hover:bg-[var(--ios-fill)] rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OdometerPage;