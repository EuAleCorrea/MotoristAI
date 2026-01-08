import { create } from 'zustand';
import { supabase } from '../services/supabase';

export type FinancialStatus = 'Financiado' | 'Alugado' | 'Quitado';
export type Transmission = 'Manual' | 'Automático';
export type Fuel = 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Elétrico' | 'Híbrido';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  color: string;
  fuel: Fuel;
  transmission: Transmission;
  doors: number;
  hasAirConditioning: boolean;
  mileage: number;
  financialStatus: FinancialStatus;
}

interface VehicleStore {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Omit<Vehicle, 'id'>>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

const mapFromDB = (data: any): Vehicle => ({
  id: data.id,
  brand: data.brand,
  model: data.model,
  version: data.version,
  year: data.year,
  color: data.color,
  fuel: data.fuel,
  transmission: data.transmission,
  doors: data.doors,
  hasAirConditioning: data.has_air_conditioning,
  mileage: data.mileage,
  financialStatus: data.financial_status,
});

const mapToDB = (data: Partial<Vehicle>) => {
  const mapped: any = { ...data };
  if (data.financialStatus !== undefined) { mapped.financial_status = data.financialStatus; delete mapped.financialStatus; }
  if (data.hasAirConditioning !== undefined) { mapped.has_air_conditioning = data.hasAirConditioning; delete mapped.hasAirConditioning; }
  return mapped;
};

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  isLoading: false,
  error: null,

  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) throw error;
      set({ vehicles: data?.map(mapFromDB) || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const dbVehicle = mapToDB(vehicle);
      const { data, error } = await supabase
        .from('vehicles')
        .insert([dbVehicle])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        vehicles: [mapFromDB(data), ...state.vehicles]
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateVehicle: async (id, updatedVehicle) => {
    set({ isLoading: true, error: null });
    try {
      const dbVehicle = mapToDB(updatedVehicle);
      const { data, error } = await supabase
        .from('vehicles')
        .update(dbVehicle)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.id === id ? mapFromDB(data) : vehicle
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVehicle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
