import { useEffect } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { Car } from 'lucide-react';

interface VehicleSelectorProps {
  value: string;
  onChange: (vehicleId: string) => void;
  label?: string;
}

/**
 * Seletor de veículos — busca da store e exibe como select estilizado
 * Usa o design system iOS via variáveis CSS
 */
export default function VehicleSelector({ value, onChange, label = 'Veículo' }: VehicleSelectorProps) {
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();

  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles();
    }
  }, [fetchVehicles, vehicles.length]);

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--ios-text)] mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Car className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-[var(--ios-card)] text-[var(--ios-text)]"
          required
        >
          <option value="" disabled>
            {isLoading ? 'Carregando veículos...' : 'Selecione um veículo'}
          </option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.brand} {v.model} {v.year} — {v.color ? `${v.color}` : ''}
            </option>
          ))}
          {vehicles.length === 0 && !isLoading && (
            <option value="" disabled>
              Nenhum veículo cadastrado. Vá em Ajustes &gt; Veículos
            </option>
          )}
        </select>
      </div>
      {vehicles.length === 0 && !isLoading && (
        <p className="text-xs text-[var(--ios-text-tertiary)] mt-1">
          Cadastre um veículo em <button
            type="button"
            onClick={() => window.location.href = '/cadastros/veiculos'}
            className="text-[var(--ios-accent)] underline"
          >
            Ajustes &gt; Veículos
          </button>
        </p>
      )}
    </div>
  );
}
