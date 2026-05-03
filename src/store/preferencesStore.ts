import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface UserPreferences {
  id?: string;
  user_id?: string;
  language: string;
  currency: string;
  date_format: string;
  time_format: string;
  theme: string;
  unit_system: string;
  default_platform: string | null;
  default_category: string | null;
  weekly_goal_hours: number | null;
  notifications_enabled: boolean;
}

interface PreferencesState {
  preferences: UserPreferences | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'pt-BR',
  currency: 'BRL',
  date_format: 'DD/MM/YYYY',
  time_format: '24h',
  theme: 'system',
  unit_system: 'metric',
  default_platform: null,
  default_category: null,
  weekly_goal_hours: null,
  notifications_enabled: true,
};

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: null,
  loading: false,
  saving: false,
  error: null,

  fetchPreferences: async () => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (data) {
        set({ preferences: {
          language: data.language,
          currency: data.currency,
          date_format: data.date_format,
          time_format: data.time_format,
          theme: data.theme,
          unit_system: data.unit_system,
          default_platform: data.default_platform,
          default_category: data.default_category,
          weekly_goal_hours: data.weekly_goal_hours,
          notifications_enabled: data.notifications_enabled,
        }, loading: false });
      } else {
        // Se não existir, cria com defaults
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({ user_id: user.id, ...DEFAULT_PREFERENCES });

        if (insertError) throw new Error(insertError.message);

        set({ preferences: { ...DEFAULT_PREFERENCES }, loading: false });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updatePreferences: async (prefs: Partial<UserPreferences>) => {
    set({ saving: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_preferences')
        .update({
          ...prefs,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);

      set(state => ({
        preferences: state.preferences ? { ...state.preferences, ...prefs } : { ...DEFAULT_PREFERENCES, ...prefs },
        saving: false,
      }));
    } catch (err: any) {
      set({ error: err.message, saving: false });
    }
  },

  resetPreferences: async () => {
    set({ saving: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_preferences')
        .update({
          ...DEFAULT_PREFERENCES,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);

      set({ preferences: { ...DEFAULT_PREFERENCES }, saving: false });
    } catch (err: any) {
      set({ error: err.message, saving: false });
    }
  },
}));