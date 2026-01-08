import { create } from 'zustand';
import { supabase } from '../services/supabase';

interface Trip {
  id: string;
  platform: string;
  amount: number;
  distance: number;
  duration: number;
  date: string;
}

interface TripStore {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ trips: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTrip: async (trip) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([trip])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ trips: [data, ...state.trips] }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTrip: async (id, updatedTrip) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('trips')
        .update(updatedTrip)
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === id ? { ...trip, ...updatedTrip } : trip
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTrip: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        trips: state.trips.filter((trip) => trip.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
