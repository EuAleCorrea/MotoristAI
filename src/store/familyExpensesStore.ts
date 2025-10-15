import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

// --- Base Interface ---
interface FamilyExpense {
  id: string;
  category: 'Moradia' | 'Alimentação' | 'Saúde' | 'Educação' | 'Lazer' | 'Outras';
  description: string;
  totalValue: number;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Specific Expense Types ---
export interface HousingExpense extends FamilyExpense {
  category: 'Moradia';
  expenseType: 'Aluguel' | 'Financiamento' | 'Condomínio' | 'Energia' | 'Água' | 'Internet' | 'Manutenção' | 'Outros';
  dueDate: string;
  paymentDate?: string;
  status: 'Pago' | 'Pendente';
  recurrence: 'Única' | 'Mensal' | 'Anual';
}

export interface FoodExpense extends FamilyExpense {
  category: 'Alimentação';
  expenseType: 'Supermercado' | 'Delivery' | 'Restaurante' | 'Alimentação escolar' | 'Assinaturas' | 'Outros';
  purchaseDate: string;
  location: string;
  productList?: string;
  recurrence: 'Única' | 'Semanal' | 'Mensal';
}

export interface HealthExpense extends FamilyExpense {
    category: 'Saúde';
    expenseType: 'Plano de Saúde' | 'Consulta' | 'Exame' | 'Medicamento' | 'Odontologia' | 'Academia' | 'Outros';
    provider: string; // Profissional / Clínica / Farmácia
    date: string;
    hasReimbursement: boolean;
    reimbursementValue?: number;
    reimbursementDate?: string;
}

export interface EducationExpense extends FamilyExpense {
    category: 'Educação';
    expenseType: 'Mensalidade' | 'Material escolar' | 'Curso' | 'Transporte escolar' | 'Uniforme' | 'Outros';
    institution: string;
    dueDate: string;
    paymentDate?: string;
    status: 'Pago' | 'Pendente';
    recurrence: 'Única' | 'Mensal' | 'Anual';
}

export interface LeisureExpense extends FamilyExpense {
    category: 'Lazer';
    expenseType: 'Viagem' | 'Cinema' | 'Restaurante' | 'Passeio' | 'Streaming' | 'Academia' | 'Outros';
    location: string;
    date: string;
    participants?: string;
    periodicity?: 'Mensal' | 'Anual'; // For Streaming
    destination?: string; // For Viagem
    durationInDays?: number; // For Viagem
}

export interface OtherExpense extends FamilyExpense {
    category: 'Outras';
    customCategory: string; // Categoria personalizada
    date: string;
    recurrence: 'Única' | 'Mensal' | 'Anual';
}


// --- Union Type ---
export type AnyFamilyExpense = HousingExpense | FoodExpense | HealthExpense | EducationExpense | LeisureExpense | OtherExpense;

// --- Store Interface ---
interface FamilyExpensesStore {
  expenses: AnyFamilyExpense[];
  addExpense: (expenseData: Omit<AnyFamilyExpense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updatedData: Partial<AnyFamilyExpense>) => void;
  deleteExpense: (id:string) => void;
}

// --- Helper Function for Sorting ---
const getExpenseDate = (expense: AnyFamilyExpense): string => {
    if ('date' in expense) return expense.date;
    if ('dueDate' in expense) return expense.dueDate;
    if ('purchaseDate' in expense) return expense.purchaseDate;
    return expense.createdAt;
};

// --- Zustand Store ---
export const useFamilyExpensesStore = create<FamilyExpensesStore>()(
  persist(
    (set) => ({
      expenses: [],
      addExpense: (expenseData) =>
        set((state) => ({
          expenses: [
            { 
              ...expenseData, 
              id: faker.string.uuid(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as AnyFamilyExpense, 
            ...state.expenses
          ].sort((a, b) => new Date(getExpenseDate(b)).getTime() - new Date(getExpenseDate(a)).getTime()),
        })),
      updateExpense: (id, updatedData) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? { ...expense, ...updatedData, updatedAt: new Date().toISOString() }
              : expense
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
    }),
    {
      name: 'family-expenses-storage',
    }
  )
);
