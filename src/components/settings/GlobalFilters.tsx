import { Car, Calendar, Layers3 } from 'lucide-react';
import { useSettingsFilterStore } from '../../store/settingsFilterStore';

const GlobalFilters = () => {
  const { selectedMonth, selectedVehicle, selectedPlatform, setMonth, setVehicle, setPlatform } = useSettingsFilterStore();

  // Mock data for selectors
  const months = ['Janeiro', 'Fevereiro', 'Março'];
  const vehicles = ['Carro 1', 'Carro 2'];
  const platforms = ['Uber', '99'];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <select 
            onChange={(e) => setMonth(e.target.value)} 
            value={selectedMonth || ''}
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
        >
          <option value="">Mês</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
       <div className="relative">
        <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <select 
            onChange={(e) => setVehicle(e.target.value)} 
            value={selectedVehicle || ''}
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
        >
          <option value="">Veículo</option>
          {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
       <div className="relative">
        <Layers3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <select 
            onChange={(e) => setPlatform(e.target.value)} 
            value={selectedPlatform || ''}
            className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
        >
          <option value="">Plataforma</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
    </div>
  );
};

export default GlobalFilters;
