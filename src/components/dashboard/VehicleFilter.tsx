import { useEffect } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { useSettingsFilterStore } from '../../store/settingsFilterStore';
import { Car, ChevronDown } from 'lucide-react';

/**
 * Seletor de veículo para filtrar dados no dashboard.
 * Persiste a seleção via settingsFilterStore.
 * Exibe "Todos os veículos" por padrão.
 */
export default function VehicleFilter() {
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();
  const { selectedVehicle, setVehicle } = useSettingsFilterStore();

  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles();
    }
  }, [fetchVehicles, vehicles.length]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Car className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
      </div>
      <select
        value={selectedVehicle || ''}
        onChange={(e) => setVehicle(e.target.value || null)}
        className="w-full pl-10 pr-8 py-2.5 border border-[var(--ios-separator)] rounded-xl bg-[var(--ios-card)] text-[var(--ios-text)] text-sm appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
      >
        <option value="">Todos os veículos</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.brand} {v.model} {v.year} — {v.color}
          </option>
        ))}
        {isLoading && (
          <option value="" disabled>
            Carregando...
          </option>
        )}
        {vehicles.length === 0 && !isLoading && (
          <option value="" disabled>
            Nenhum veículo cadastrado
          </option>
        )}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
        <ChevronDown className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
      </div>
    </div>
  );
}