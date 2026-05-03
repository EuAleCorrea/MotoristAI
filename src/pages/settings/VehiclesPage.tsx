import { useState, useEffect } from 'react';
import { Car, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useVehicleStore, Vehicle, FUEL_OPTIONS, TRANSMISSION_OPTIONS, FINANCIAL_STATUS_OPTIONS } from '../../../store/vehicleStore';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

type VehicleForm = Omit<Vehicle, 'id' | 'user_id'>;

const emptyForm = (): VehicleForm => ({
  brand: '',
  model: '',
  version: '',
  year: CURRENT_YEAR,
  color: '',
  fuel: 'flex',
  transmission: 'manual',
  doors: 4,
  has_air_conditioning: false,
  mileage: 0,
  financial_status: 'quitado',
});

const VehiclesPage = () => {
  const { vehicles, isLoading, fetchVehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicleStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleForm>(emptyForm());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.brand.trim()) errs.brand = 'Marca é obrigatória';
    if (!form.model.trim()) errs.model = 'Modelo é obrigatório';
    if (!form.year) errs.year = 'Ano é obrigatório';
    if (!form.fuel) errs.fuel = 'Combustível é obrigatório';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setShowForm(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      version: vehicle.version,
      year: vehicle.year,
      color: vehicle.color,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      doors: vehicle.doors,
      has_air_conditioning: vehicle.has_air_conditioning,
      mileage: vehicle.mileage,
      financial_status: vehicle.financial_status,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateVehicle(editingId, form);
      } else {
        await addVehicle(form);
      }
      setShowForm(false);
      setEditingId(null);
    } catch {
      // error handled by store
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
    setDeletingId(null);
  };

  const handleChange = (field: keyof VehicleForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const fuelLabel = (value: string) => FUEL_OPTIONS.find((f) => f.value === value)?.label || value;
  const transmissionLabel = (value: string) => TRANSMISSION_OPTIONS.find((t) => t.value === value)?.label || value;
  const financialLabel = (value: string) => FINANCIAL_STATUS_OPTIONS.find((f) => f.value === value)?.label || value;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[var(--ios-tint)]">
          <Car className="h-6 w-6 text-[var(--ios-accent)]" />
        </div>
        <h1 className="text-xl font-bold text-[var(--ios-text)]">Veículos</h1>
      </div>

      {/* Content */}
      <div className="bg-[var(--ios-card)] rounded-xl shadow-sm overflow-hidden">
        {isLoading && vehicles.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ios-accent)] mx-auto" />
            <p className="mt-3 text-sm text-[var(--ios-text-secondary)]">Carregando veículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-8 text-center">
            <Car className="h-12 w-12 text-[var(--ios-text-tertiary)] mx-auto mb-3" />
            <p className="text-[var(--ios-text-secondary)] text-sm">Nenhum veículo cadastrado</p>
            <p className="text-[var(--ios-text-tertiary)] text-xs mt-1">Adicione seu primeiro veículo</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 hover:bg-[var(--ios-bg)]/50 transition relative group">
                {/* Delete confirmation overlay */}
                {deletingId === vehicle.id && (
                  <div className="absolute inset-0 bg-[rgba(255,59,48,0.08)] flex items-center justify-center gap-4 z-10 rounded-xl">
                    <span className="text-sm text-red-700 dark:text-red-300 font-medium">Excluir este veículo?</span>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[var(--ios-fill)] flex items-center justify-center">
                      <Car className="h-7 w-7 text-[var(--ios-accent)]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--ios-text)] truncate">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-xs text-[var(--ios-text-secondary)] mt-0.5">
                        {vehicle.version && `${vehicle.version} • `}
                        {vehicle.year}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--ios-fill)] text-[var(--ios-text-secondary)]">
                          {fuelLabel(vehicle.fuel)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--ios-fill)] text-[var(--ios-text-secondary)]">
                          {transmissionLabel(vehicle.transmission)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--ios-fill)] text-[var(--ios-text-secondary)]">
                          {financialLabel(vehicle.financial_status)}
                        </span>
                        {vehicle.mileage > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--ios-fill)] text-[var(--ios-text-secondary)]">
                            {vehicle.mileage.toLocaleString('pt-BR')} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="p-2 text-[var(--ios-text-tertiary)] hover:text-[var(--ios-accent)] hover:bg-[var(--ios-fill)] rounded-lg"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(vehicle.id)}
                      className="p-2 text-[var(--ios-text-tertiary)] hover:text-[var(--sys-red)] hover:bg-[var(--ios-fill)] rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="w-full p-4 flex items-center justify-center gap-2 text-[var(--ios-accent)] hover:bg-[var(--ios-bg)]/50 transition border-t border-[var(--ios-separator)]"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">Adicionar Veículo</span>
        </button>
      </div>

      {/* Modal: Add/Edit Vehicle Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-[var(--ios-card)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[var(--ios-text)] mb-6">
                {editingId ? 'Editar Veículo' : 'Novo Veículo'}
              </h2>

              <div className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Marca *</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="Ex: Toyota, Volkswagen"
                    className={`w-full px-3 py-2.5 rounded-lg border ${errors.brand ? 'border-red-400' : 'border-[var(--ios-separator)]'} bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30`}
                  />
                  {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Modelo *</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    placeholder="Ex: Corolla, Gol"
                    className={`w-full px-3 py-2.5 rounded-lg border ${errors.model ? 'border-red-400' : 'border-[var(--ios-separator)]'} bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30`}
                  />
                  {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
                </div>

                {/* Version */}
                <div>
                  <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Versão</label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) => handleChange('version', e.target.value)}
                    placeholder="Ex: 1.8 Flex, 2.0 TSI"
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30"
                  />
                </div>

                {/* Year + Color */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Ano *</label>
                    <select
                      value={form.year}
                      onChange={(e) => handleChange('year', Number(e.target.value))}
                      className={`w-full px-3 py-2.5 rounded-lg border ${errors.year ? 'border-red-400' : 'border-[var(--ios-separator)]'} bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30`}
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Cor</label>
                    <input
                      type="text"
                      value={form.color}
                      onChange={(e) => handleChange('color', e.target.value)}
                      placeholder="Ex: Preto, Branco"
                      className="w-full px-3 py-2.5 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30"
                    />
                  </div>
                </div>

                {/* Fuel */}
                <div>
                  <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Combustível *</label>
                  <select
                    value={form.fuel}
                    onChange={(e) => handleChange('fuel', e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border ${errors.fuel ? 'border-red-400' : 'border-[var(--ios-separator)]'} bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30`}
                  >
                    {FUEL_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                  {errors.fuel && <p className="text-xs text-red-500 mt-1">{errors.fuel}</p>}
                </div>

                {/* Transmission + Doors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Transmissão</label>
                    <select
                      value={form.transmission}
                      onChange={(e) => handleChange('transmission', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30"
                    >
                      {TRANSMISSION_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Portas</label>
                    <select
                      value={form.doors}
                      onChange={(e) => handleChange('doors', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30"
                    >
                      {[2, 3, 4, 5].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Air Conditioning */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--ios-text)]">Ar condicionado</span>
                  <button
                    type="button"
                    onClick={() => handleChange('has_air_conditioning', !form.has_air_conditioning)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.has_air_conditioning ? 'bg-[var(--ios-accent)]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.has_air_conditioning ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Odômetro atual (km)</label>
                  <input
                    type="number"
                    value={form.mileage}
                    onChange={(e) => handleChange('mileage', Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30"
                  />
                </div>

                {/* Financial Status */}
                <div>
                  <label className="block text-xs font-medium text-[var(--ios-text-secondary)] mb-1">Status Financeiro</label>
                  <select
                    value={form.financial_status}
                    onChange={(e) => handleChange('financial_status', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--ios-separator)] bg-[var(--ios-input-bg)] text-[var(--ios-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ios-accent)]/30"
                  >
                    {FINANCIAL_STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="flex-1 py-2.5 rounded-lg bg-gray-100 text-[var(--ios-text)] font-medium text-sm hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-[var(--ios-accent)] text-white font-medium text-sm hover:opacity-80 transition disabled:opacity-50"
              >
                {saving ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;