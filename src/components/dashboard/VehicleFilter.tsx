import * as React from 'react';
import { useEffect } from 'react';
import { useVehicleStore } from '../../store/vehicleStore';
import { useSettingsFilterStore } from '../../store/settingsFilterStore';
import { Car, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

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

  // Seleciona automaticamente se houver apenas um veículo
  useEffect(() => {
    if (!isLoading && vehicles.length === 1 && !selectedVehicle) {
      setVehicle(vehicles[0].id);
    }
  }, [isLoading, vehicles, selectedVehicle, setVehicle]);

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicle);
  const triggerLabel = currentVehicle
    ? `${currentVehicle.brand} ${currentVehicle.model} ${currentVehicle.year} — ${currentVehicle.color}`
    : 'Todos os veículos';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between pl-10 pr-4 py-2.5 border border-[var(--ios-separator)] rounded-xl bg-[var(--ios-card)] text-[var(--ios-text)] text-sm font-normal shadow-sm h-auto hover:bg-[var(--ios-card)] hover:text-[var(--ios-text)] relative active:scale-98 transition-transform"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Car className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
          </div>
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="h-4 w-4 text-[var(--ios-text-tertiary)] flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-[calc(100vw-32px)] sm:w-80 bg-[var(--ios-sheet-bg)] border border-[var(--ios-separator)] text-[var(--ios-text)] rounded-xl p-1 shadow-lg z-[200]">
        <DropdownMenuRadioGroup
          value={selectedVehicle || ''}
          onValueChange={(val) => setVehicle(val || null)}
        >
          <DropdownMenuRadioItem
            value=""
            className="flex items-center gap-2 pl-8 pr-3 py-2 rounded-lg text-sm text-[var(--ios-text)] focus:bg-[var(--ios-fill)] focus:text-[var(--ios-text)] cursor-pointer"
          >
            Todos os veículos
          </DropdownMenuRadioItem>
          
          {vehicles.map((v) => (
            <DropdownMenuRadioItem
              key={v.id}
              value={v.id}
              className="flex items-center gap-2 pl-8 pr-3 py-2 rounded-lg text-sm text-[var(--ios-text)] focus:bg-[var(--ios-fill)] focus:text-[var(--ios-text)] cursor-pointer"
            >
              {v.brand} {v.model} {v.year} — {v.color}
            </DropdownMenuRadioItem>
          ))}
          
          {isLoading && (
            <div className="px-3 py-2 text-xs text-[var(--ios-text-secondary)] italic">
              Carregando...
            </div>
          )}
          
          {vehicles.length === 0 && !isLoading && (
            <div className="px-3 py-2 text-xs text-[var(--ios-text-secondary)] italic">
              Nenhum veículo cadastrado
            </div>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}