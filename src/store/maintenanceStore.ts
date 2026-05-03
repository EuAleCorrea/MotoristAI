import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface MaintenanceRule {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  service_name: string;
  interval_km: number;
  last_km: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Para exibição (join opcional via frontend)
  vehicle_name?: string;
  progress_pct?: number; // 0-100, calculado
  km_remaining?: number;
  is_overdue?: boolean;
}

interface MaintenanceStore {
  rules: MaintenanceRule[];
  isLoading: boolean;
  error: string | null;

  // CRUD
  fetchRules: () => Promise<void>;
  addRule: (rule: Omit<MaintenanceRule, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRule: (id: string, updates: Partial<MaintenanceRule>) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;

  // Cálculo de progresso
  calculateProgress: (rule: MaintenanceRule, currentKm: number) => { progress_pct: number; km_remaining: number; is_overdue: boolean };
}

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  rules: [],
  isLoading: false,
  error: null,

  fetchRules: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('maintenance_rules')
        .select('*')
        .order('service_name', { ascending: true });

      if (error) throw error;

      // Se tiver vehicle_id, busca o nome
      const rulesWithVehicle = await Promise.all(
        (data || []).map(async (rule) => {
          let vehicle_name: string | undefined;
          if (rule.vehicle_id) {
            const { data: vehicle } = await supabase
              .from('vehicles')
              .select('name')
              .eq('id', rule.vehicle_id)
              .single();
            vehicle_name = vehicle?.name;
          }
          return { ...rule, vehicle_name } as MaintenanceRule;
        })
      );

      set({ rules: rulesWithVehicle });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addRule: async (rule) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('maintenance_rules')
        .insert([{
          service_name: rule.service_name,
          vehicle_id: rule.vehicle_id,
          interval_km: rule.interval_km,
          last_km: rule.last_km,
          notes: rule.notes,
        }])
        .select()
        .single();

      if (error) throw error;

      // Buscar nome do veículo se houver
      let vehicle_name: string | undefined;
      if (data.vehicle_id) {
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select('name')
          .eq('id', data.vehicle_id)
          .single();
        vehicle_name = vehicle?.name;
      }

      set((state) => ({
        rules: [...state.rules, { ...data, vehicle_name } as MaintenanceRule],
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateRule: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('maintenance_rules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        rules: state.rules.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRule: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('maintenance_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        rules: state.rules.filter((r) => r.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  calculateProgress: (rule, currentKm) => {
    const kmSinceLast = currentKm - rule.last_km;
    const progress_pct = Math.min(100, Math.round((kmSinceLast / rule.interval_km) * 100));
    const km_remaining = Math.max(0, rule.interval_km - kmSinceLast);
    const is_overdue = kmSinceLast >= rule.interval_km;
    return { progress_pct, km_remaining, is_overdue };
  },
}));