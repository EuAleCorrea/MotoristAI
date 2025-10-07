import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

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
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  getGoalByMonth: (year: number, month: number) => Goal | undefined;
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const generateSampleGoals = (): Goal[] => {
  return [
    {
      id: faker.string.uuid(),
      year: currentYear,
      month: currentMonth,
      revenue: 5000,
      profit: 3500,
      expense: 1500,
      daysWorkedPerWeek: 5,
    },
     {
      id: faker.string.uuid(),
      year: currentYear,
      month: currentMonth - 1,
      revenue: 4800,
      profit: 3200,
      expense: 1600,
      daysWorkedPerWeek: 6,
    },
  ];
};

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: generateSampleGoals(),
      addGoal: (goal) =>
        set((state) => {
          const existingGoalIndex = state.goals.findIndex(g => g.year === goal.year && g.month === goal.month);
          
          if (existingGoalIndex > -1) {
            const updatedGoals = [...state.goals];
            const existingGoal = updatedGoals[existingGoalIndex];
            updatedGoals[existingGoalIndex] = { ...existingGoal, ...goal };
            return { goals: updatedGoals.sort((a, b) => b.year - a.year || b.month - a.month) };
          }
          
          const newGoals = [{ ...goal, id: faker.string.uuid() }, ...state.goals];
          return { goals: newGoals.sort((a, b) => b.year - a.year || b.month - a.month) };
        }),
      updateGoal: (id, updatedGoal) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updatedGoal } : goal
          ),
        })),
      getGoalByMonth: (year, month) => {
        return get().goals.find(g => g.year === year && g.month === month);
      }
    }),
    {
      name: 'goal-storage',
    }
  )
);
