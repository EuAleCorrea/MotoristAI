import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsFilterState {
  selectedMonth: string | null;
  selectedVehicle: string | null;
  selectedPlatform: string | null;
  setMonth: (month: string | null) => void;
  setVehicle: (vehicle: string | null) => void;
  setPlatform: (platform: string | null) => void;
}

export const useSettingsFilterStore = create<SettingsFilterState>()(
  persist(
    (set) => ({
      selectedMonth: null,
      selectedVehicle: null,
      selectedPlatform: null,
      setMonth: (month) => set({ selectedMonth: month }),
      setVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      setPlatform: (platform) => set({ selectedPlatform: platform }),
    }),
    {
      name: 'settings-filter-storage',
    }
  )
);
