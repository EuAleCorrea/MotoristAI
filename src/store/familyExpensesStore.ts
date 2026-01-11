import { create } from 'zustand';
import { supabase } from '../services/supabase';


// --- Base Interface ---
export interface FamilyExpense {
  id: string;
  category: 'Moradia' | 'Alimentação' | 'Saúde' | 'Educação' | 'Lazer' | 'Outras';
  description: string;
  totalValue: number;
  paymentMethod: string;
  notes?: string;
  // Specific fields (stored in details JSONB in DB)
  details?: Record<string, any>;
  // Dates (mapped from DB date column or details)
  date?: string;
  dueDate?: string;
  purchaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Specific Expense Types Support (for UI consumption) ---
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
  recurrence: 'Única' | 'Semanal' | 'Mensal';
  productList?: string;
}

export interface HealthExpense extends FamilyExpense {
  category: 'Saúde';
  expenseType: 'Plano de Saúde' | 'Consulta' | 'Exame' | 'Medicamento' | 'Odontologia' | 'Academia' | 'Outros';
  provider: string;
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
  periodicity?: 'Mensal' | 'Anual';
  destination?: string;
  durationInDays?: number;
}

export interface OtherExpense extends FamilyExpense {
  category: 'Outras';
  customCategory: string;
  date: string;
  recurrence: 'Única' | 'Mensal' | 'Anual';
}

// ... (Other interfaces are effectively handled by the generic structure + details, 
// but keeping full type safety would require complex discriminators. 
// For this migration, we simplify the store to handle the generic with details bag, 
// casting when necessary in components, or we map explicitly.)

// For simplicity and robustness during migration, we will use a pragmatic approach:
// store 'details' for all specific fields, and map 'date' to the main date column.

export type AnyFamilyExpense = FamilyExpense;

// --- Store Interface ---
interface FamilyExpensesStore {
  expenses: AnyFamilyExpense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: Omit<AnyFamilyExpense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, updatedData: Partial<AnyFamilyExpense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const mapFromDB = (data: any): AnyFamilyExpense => {
  const details = data.details || {};
  return {
    id: data.id,
    category: data.category,
    description: data.description,
    totalValue: data.amount,
    paymentMethod: data.payment_method,
    notes: details.notes, // notes might be in details or we didn't add it to schema explicitly? schema has no notes column, so it goes to details.
    date: data.date,
    details: details,
    // Flatten specific date fields for UI compatibility if they were in details
    dueDate: details.dueDate,
    purchaseDate: details.purchaseDate,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const mapToDB = (data: Partial<AnyFamilyExpense>) => {
  // Extract core fields
  const {
    category,
    description,
    totalValue,
    paymentMethod,
    date,
    notes,
    details,
    ...rest // The rest are specific fields that should go into details
  } = data;

  // Prefer explicit date field, otherwise check specific fields
  let dbDate = date;
  if (!dbDate && rest.dueDate) dbDate = rest.dueDate as string;
  if (!dbDate && rest.purchaseDate) dbDate = rest.purchaseDate as string;
  if (!dbDate) dbDate = new Date().toISOString();

  // Merge rest into details
  const dbDetails = {
    ...details,
    ...rest,
    notes: notes, // Store notes in details as per schema plan
  };

  return {
    category,
    description,
    amount: totalValue,
    payment_method: paymentMethod,
    date: dbDate,
    details: dbDetails,
  };
};

export const useFamilyExpensesStore = create<FamilyExpensesStore>((set) => ({
  expenses: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('family_expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ expenses: data?.map(mapFromDB) || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (expenseData) => {
    set({ isLoading: true, error: null });
    try {
      const dbExpense = mapToDB(expenseData);
      const { data, error } = await supabase
        .from('family_expenses')
        .insert([dbExpense])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        expenses: [mapFromDB(data), ...state.expenses]
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateExpense: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const dbExpense = mapToDB(updatedData);
      const { data, error } = await supabase
        .from('family_expenses')
        .update(dbExpense)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense.id === id ? mapFromDB(data) : expense
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('family_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
