import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface Entry {
  id: string;
  date: string;
  source: string; // 'Uber', '99', etc.
  value: number;
  tripCount: number;
  kmDriven: number;
  hoursWorked: string; // HH:MM format
  notes?: string;
}

interface EntryStore {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  addEntry: (entry: Omit<Entry, 'id'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<Omit<Entry, 'id'>>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

const mapFromDB = (data: any): Entry => ({
  id: data.id,
  date: data.date,
  source: data.source,
  value: data.value,
  tripCount: data.trip_count,
  kmDriven: data.km_driven,
  hoursWorked: data.hours_worked,
  notes: data.notes,
});

const mapToDB = (data: Partial<Entry>) => {
  const mapped: any = { ...data };
  if (data.tripCount !== undefined) { mapped.trip_count = data.tripCount; delete mapped.tripCount; }
  if (data.kmDriven !== undefined) { mapped.km_driven = data.kmDriven; delete mapped.kmDriven; }
  if (data.hoursWorked !== undefined) { mapped.hours_worked = data.hoursWorked; delete mapped.hoursWorked; }
  return mapped;
};

export const useEntryStore = create<EntryStore>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: false });

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
      const dbEntry = mapToDB(entry);
      const { data, error } = await supabase
        .from('entries')
        .insert([dbEntry])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        entries: [mapFromDB(data), ...state.entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
      const dbEntry = mapToDB(updatedEntry);
      const { data, error } = await supabase
        .from('entries')
        .update(dbEntry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry.id === id ? mapFromDB(data) : entry
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
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
        .from('entries')
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
