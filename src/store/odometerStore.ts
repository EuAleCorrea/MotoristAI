import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface OdometerEntry {
  id: string;
  vehicle_id: string;
  km: number;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface OdometerStore {
  entries: OdometerEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: (vehicleId?: string) => Promise<void>;
  addEntry: (entry: Omit<OdometerEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<Omit<OdometerEntry, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

const mapFromDB = (data: any): OdometerEntry => ({
  id: data.id,
  vehicle_id: data.vehicle_id,
  km: data.km,
  date: data.date,
  notes: data.notes || '',
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const useOdometerStore = create<OdometerStore>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async (vehicleId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('Usuário não autenticado');

      let query = supabase
        .from('odometer_entries')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;

      if (error) throw error;
      set({ entries: data?.map(mapFromDB) || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('Usuário não autenticado');

      const dbEntry = {
        user_id: userData.user.id,
        vehicle_id: entry.vehicle_id,
        km: entry.km,
        date: entry.date,
        notes: entry.notes || null,
      };

      const { data, error } = await supabase
        .from('odometer_entries')
        .insert([dbEntry])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        entries: [mapFromDB(data), ...state.entries]
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateEntry: async (id, updatedEntry) => {
    set({ isLoading: true, error: null });
    try {
      const dbEntry: any = {};
      if (updatedEntry.vehicle_id !== undefined) dbEntry.vehicle_id = updatedEntry.vehicle_id;
      if (updatedEntry.km !== undefined) dbEntry.km = updatedEntry.km;
      if (updatedEntry.date !== undefined) dbEntry.date = updatedEntry.date;
      if (updatedEntry.notes !== undefined) dbEntry.notes = updatedEntry.notes || null;

      const { data, error } = await supabase
        .from('odometer_entries')
        .update(dbEntry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry.id === id ? mapFromDB(data) : entry
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('odometer_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));