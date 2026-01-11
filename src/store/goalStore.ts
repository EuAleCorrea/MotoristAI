import { create } from 'zustand';
import { supabase } from '../services/supabase';

export interface Goal {
  id: string;
  year: number;
  month: number; // 1-12
  daysWorkedPerWeek?: number;
  revenue?: number;
  profit?: number;
  expense?: number;
  // Optional fields from form
  numberOfWeeks?: number;
  week?: number;
  day?: number;
}

interface GoalStore {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getGoalByMonth: (year: number, month: number) => Goal | undefined;
}

const mapFromDB = (data: any): Goal => ({
  id: data.id,
  year: data.year,
  month: data.month,
  revenue: data.revenue,
  profit: data.profit,
  expense: data.expense,
  daysWorkedPerWeek: data.days_worked_per_week,
});

const mapToDB = (data: Partial<Goal>) => {
  const mapped: any = { ...data };
  if (data.daysWorkedPerWeek !== undefined) { mapped.days_worked_per_week = data.daysWorkedPerWeek; delete mapped.daysWorkedPerWeek; }
  // Remove optional form fields before sending to DB if they exist in the object but not in DB
  delete mapped.numberOfWeeks;
  delete mapped.week;
  delete mapped.day;
  return mapped;
};

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (error) throw error;
      set({ goals: data?.map(mapFromDB) || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true, error: null });
    try {
      const dbGoal = mapToDB(goal);

      // Use upsert to prevent duplicates - if a goal for this year/month exists, update it
      const { data, error } = await supabase
        .from('goals')
        .upsert([dbGoal], {
          onConflict: 'user_id,year,month',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => {
        const newGoal = mapFromDB(data);
        // Remove any existing goal for this month/year before adding
        const filteredGoals = state.goals.filter(
          g => !(g.year === newGoal.year && g.month === newGoal.month)
        );
        return {
          goals: [newGoal, ...filteredGoals].sort((a, b) => b.year - a.year || b.month - a.month)
        };
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: async (id, updatedGoal) => {
    set({ isLoading: true, error: null });
    try {
      const dbGoal = mapToDB(updatedGoal);
      const { data, error } = await supabase
        .from('goals')
        .update(dbGoal)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === id ? mapFromDB(data) : goal
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  getGoalByMonth: (year, month) => {
    return get().goals.find(g => g.year === year && g.month === month);
  }
}));
