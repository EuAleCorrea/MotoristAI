import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { faker } from '@faker-js/faker';

// Base interface
interface VehicleExpense {
  id: string;
  vehicleId?: string; // To link to a specific vehicle in the future (nullable in store but DB field exists)
  date: string;
  totalValue: number;
  odometer?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Mapped fields
  details: Record<string, any>;
  type: string; // fuel, maintenance, etc.
}

// Specific Expense Types
export interface FuelExpense extends VehicleExpense {
  type: 'fuel';
  details: {
    fuelType: 'Gasolina' | 'Etanol' | 'Diesel' | 'Elétrico' | 'Híbrido';
    pricePerUnit: number;
    quantity: number;
    electricPricePerUnit?: number;
    electricQuantity?: number;
  }
}

export interface MaintenanceExpense extends VehicleExpense {
  type: 'maintenance';
  details: {
    maintenanceType: 'Preventiva' | 'Corretiva';
    description: string;
    provider: string;
    partsReplaced?: string;
    laborCost: number;
    partsCost: number;
  }
}

export interface TollParkingExpense extends VehicleExpense {
  type: 'toll_parking';
  details: {
    expenseType: 'Pedágio' | 'Estacionamento';
    description: string;
    chargeType: 'Avulso' | 'Tag mensal';
    location?: string;
  }
}

export interface FinanceExpense extends VehicleExpense {
  type: 'finance';
  details: {
    costType: 'Financiamento' | 'Seguro' | 'IPVA' | 'Licenciamento' | 'Multa' | 'Outros';
    description: string;
    dueDate: string;
    paymentDate?: string;
    status: 'Pago' | 'Pendente';
    paymentMethod?: string;
  }
}

export interface DepreciationExpense extends VehicleExpense {
  type: 'depreciation';
  details: {
    purchaseValue: number;
    currentValue: number;
    purchaseDate: string;
    evaluationDate: string;
    depreciationPercentage: number;
  }
}

export type AnyVehicleExpense = VehicleExpense;

interface VehicleExpensesStore {
  expenses: AnyVehicleExpense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: Omit<AnyVehicleExpense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, updatedData: Partial<AnyVehicleExpense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const mapFromDB = (data: any): AnyVehicleExpense => {
  const details = data.details || {};
  return {
    id: data.id,
    vehicleId: data.vehicle_id,
    date: data.date,
    totalValue: data.amount,
    notes: details.notes,
    type: data.type,
    details: details,
    // Flatten core optional properties that might be in details
    odometer: details.odometer,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const mapToDB = (data: Partial<AnyVehicleExpense>) => {
  const {
    vehicleId,
    date,
    totalValue,
    type,
    notes,
    odometer,
    details,
    ...rest // Specific fields
  } = data;

  const dbDetails = {
    ...details,
    ...rest,
    notes,
    odometer,
  };

  return {
    vehicle_id: vehicleId,
    type,
    description: (data as any).description || (details as any)?.description || type, // Fallback description
    amount: totalValue,
    date: date || new Date().toISOString(),
    details: dbDetails,
  };
};

export const useVehicleExpensesStore = create<VehicleExpensesStore>((set) => ({
  expenses: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vehicle_expenses')
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
        .from('vehicle_expenses')
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
        .from('vehicle_expenses')
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
        .from('vehicle_expenses')
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
