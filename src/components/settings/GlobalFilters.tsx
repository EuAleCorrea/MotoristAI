import { Car, Calendar, Layers3 } from 'lucide-react';
import { useSettingsFilterStore } from '../../store/settingsFilterStore';
import { AppSelect } from '../forms/AppSelect';

const GlobalFilters = () => {
  const { selectedMonth, selectedVehicle, selectedPlatform, setMonth, setVehicle, setPlatform } = useSettingsFilterStore();

  // Mock data for selectors
  const months = ['Janeiro', 'Fevereiro', 'Março'];
  const vehicles = ['Carro 1', 'Carro 2'];
  const platforms = ['Uber', '99'];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <AppSelect
        value={selectedMonth || ''}
        onValueChange={setMonth}
        placeholder="Mês"
        icon={<Calendar className="h-4 w-4" />}
        className="w-32 flex-shrink-0"
        triggerClassName="rounded-full !py-1.5 h-8 text-xs pl-8 pr-2"
        options={[
          { value: '', label: 'Mês' },
          ...months.map(m => ({ value: m, label: m }))
        ]}
      />
      <AppSelect
        value={selectedVehicle || ''}
        onValueChange={setVehicle}
        placeholder="Veículo"
        icon={<Car className="h-4 w-4" />}
        className="w-32 flex-shrink-0"
        triggerClassName="rounded-full !py-1.5 h-8 text-xs pl-8 pr-2"
        options={[
          { value: '', label: 'Veículo' },
          ...vehicles.map(v => ({ value: v, label: v }))
        ]}
      />
      <AppSelect
        value={selectedPlatform || ''}
        onValueChange={setPlatform}
        placeholder="Plataforma"
        icon={<Layers3 className="h-4 w-4" />}
        className="w-36 flex-shrink-0"
        triggerClassName="rounded-full !py-1.5 h-8 text-xs pl-8 pr-2"
        options={[
          { value: '', label: 'Plataforma' },
          ...platforms.map(p => ({ value: p, label: p }))
        ]}
      />
    </div>
  );
};

export default GlobalFilters;
