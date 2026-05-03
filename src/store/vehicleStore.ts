import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface Vehicle {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  color: string;
  fuel: string;
  transmission: string;
  doors: number;
  has_air_conditioning: boolean;
  mileage: number;
  financial_status: string;
}

interface VehicleStore {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'user_id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Omit<Vehicle, 'id' | 'user_id'>>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

const mapFromDB = (data: any): Vehicle => ({
  id: data.id,
  user_id: data.user_id,
  brand: data.brand,
  model: data.model,
  version: data.version || '',
  year: data.year,
  color: data.color || '',
  fuel: data.fuel,
  transmission: data.transmission || '',
  doors: data.doors || 4,
  has_air_conditioning: data.has_air_conditioning ?? false,
  mileage: data.mileage || 0,
  financial_status: data.financial_status || '',
});

export const FUEL_OPTIONS = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'etanol', label: 'Etanol' },
  { value: 'flex', label: 'Flex' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'gnv', label: 'GNV' },
  { value: 'eletrico', label: 'Elétrico' },
  { value: 'hibrido', label: 'Híbrido' },
];

export const TRANSMISSION_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatica', label: 'Automática' },
  { value: 'cvt', label: 'CVT' },
  { value: 'semi-automatica', label: 'Semi-automática' },
];

export const FINANCIAL_STATUS_OPTIONS = [
  { value: 'quitado', label: 'Quitado' },
  { value: 'financiado', label: 'Financiado' },
  { value: 'consorcio', label: 'Consórcio' },
  { value: 'leasing', label: 'Leasing' },
];

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  isLoading: false,
  error: null,

  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('brand', { ascending: true })
        .order('model', { ascending: true });

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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('Usuário não autenticado');

      const dbVehicle = {
        user_id: userData.user.id,
        brand: vehicle.brand,
        model: vehicle.model,
        version: vehicle.version || null,
        year: vehicle.year,
        color: vehicle.color || null,
        fuel: vehicle.fuel,
        transmission: vehicle.transmission || null,
        doors: vehicle.doors || null,
        has_air_conditioning: vehicle.has_air_conditioning ?? false,
        mileage: vehicle.mileage || null,
        financial_status: vehicle.financial_status || null,
      };

      const { data, error } = await supabase
        .from('vehicles')
        .insert([dbVehicle])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        vehicles: [...state.vehicles, mapFromDB(data)].sort((a, b) =>
          `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
        ),
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
      const dbVehicle: any = {};
      if (updatedVehicle.brand !== undefined) dbVehicle.brand = updatedVehicle.brand;
      if (updatedVehicle.model !== undefined) dbVehicle.model = updatedVehicle.model;
      if (updatedVehicle.version !== undefined) dbVehicle.version = updatedVehicle.version || null;
      if (updatedVehicle.year !== undefined) dbVehicle.year = updatedVehicle.year;
      if (updatedVehicle.color !== undefined) dbVehicle.color = updatedVehicle.color || null;
      if (updatedVehicle.fuel !== undefined) dbVehicle.fuel = updatedVehicle.fuel;
      if (updatedVehicle.transmission !== undefined) dbVehicle.transmission = updatedVehicle.transmission || null;
      if (updatedVehicle.doors !== undefined) dbVehicle.doors = updatedVehicle.doors || null;
      if (updatedVehicle.has_air_conditioning !== undefined) dbVehicle.has_air_conditioning = updatedVehicle.has_air_conditioning;
      if (updatedVehicle.mileage !== undefined) dbVehicle.mileage = updatedVehicle.mileage || null;
      if (updatedVehicle.financial_status !== undefined) dbVehicle.financial_status = updatedVehicle.financial_status || null;

      const { data, error } = await supabase
        .from('vehicles')
        .update(dbVehicle)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === id ? mapFromDB(data) : v
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
        vehicles: state.vehicles.filter((v) => v.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));