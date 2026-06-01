import { useEffect } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { Car } from 'lucide-react';
import { AppSelect } from './AppSelect';

interface VehicleSelectorProps {
  value: string;
  onChange: (vehicleId: string) => void;
  label?: string;
}

/**
 * Seletor de veículos — busca da store e exibe como DropdownMenu shadcn estilizado
 * Usa o design system iOS via variáveis CSS
 */
export default function VehicleSelector({ value, onChange, label = 'Veículo' }: VehicleSelectorProps) {
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();

  useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles();
    }
  }, [fetchVehicles, vehicles.length]);

  const placeholder = isLoading
    ? 'Carregando veículos...'
    : vehicles.length === 0
    ? 'Nenhum veículo cadastrado'
    : 'Selecione um veículo';

  const options = vehicles.map((v) => ({
    value: v.id,
    label: `${v.brand} ${v.model} ${v.year}${v.color ? ` — ${v.color}` : ''}`,
  }));

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--ios-text)] mb-1">
        {label}
      </label>
      <AppSelect
        value={value}
        onValueChange={onChange}
        options={options}
        placeholder={placeholder}
        icon={<Car className="h-4 w-4" />}
        disabled={isLoading || vehicles.length === 0}
      />
      {vehicles.length === 0 && !isLoading && (
        <p className="text-xs text-[var(--ios-text-tertiary)] mt-1">
          Cadastre um veículo em{' '}
          <button
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
