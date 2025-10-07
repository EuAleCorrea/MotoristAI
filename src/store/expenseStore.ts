import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

const generateSampleExpenses = (): Expense[] => {
  const expenses: Expense[] = [];
  const categories = ['Combustível', 'Manutenção', 'Alimentação', 'Estacionamento', 'Pedágio'];
  
  for (let i = 0; i < 20; i++) {
    const category = faker.helpers.arrayElement(categories);
    expenses.push({
      id: faker.string.uuid(),
      category,
      description: `${category} - ${faker.commerce.productName()}`,
      amount: parseFloat(faker.finance.amount({ min: 20, max: 200, dec: 2 })),
      date: faker.date.recent({ days: 30 }).toISOString(),
    });
  }
  
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: generateSampleExpenses(),
      addExpense: (expense) =>
        set((state) => ({
          expenses: [{ ...expense, id: faker.string.uuid() }, ...state.expenses],
        })),
      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
    }),
    {
      name: 'expense-storage',
    }
  )
);
