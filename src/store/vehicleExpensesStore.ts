import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

// Base interface
interface VehicleExpense {
  id: string;
  vehicleId: string; // To link to a specific vehicle in the future
  date: string;
  totalValue: number;
  odometer?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Specific Expense Types
export interface FuelExpense extends VehicleExpense {
  type: 'fuel';
  fuelType: 'Gasolina' | 'Etanol' | 'Diesel' | 'Elétrico' | 'Híbrido';
  pricePerUnit: number;
  quantity: number;
  electricPricePerUnit?: number;
  electricQuantity?: number;
}

export interface MaintenanceExpense extends VehicleExpense {
  type: 'maintenance';
  maintenanceType: 'Preventiva' | 'Corretiva';
  description: string;
  provider: string;
  partsReplaced?: string;
  laborCost: number;
  partsCost: number;
}

export interface TollParkingExpense extends VehicleExpense {
  type: 'toll_parking';
  expenseType: 'Pedágio' | 'Estacionamento';
  description: string;
  chargeType: 'Avulso' | 'Tag mensal';
  location?: string;
}

export interface FinanceExpense extends VehicleExpense {
  type: 'finance';
  costType: 'Financiamento' | 'Seguro' | 'IPVA' | 'Licenciamento' | 'Multa' | 'Outros';
  description: string;
  dueDate: string;
  paymentDate?: string;
  status: 'Pago' | 'Pendente';
  paymentMethod?: string;
}

export interface DepreciationExpense extends VehicleExpense {
  type: 'depreciation';
  purchaseValue: number;
  currentValue: number;
  purchaseDate: string;
  evaluationDate: string;
  depreciationPercentage: number;
}

export type AnyVehicleExpense = FuelExpense | MaintenanceExpense | TollParkingExpense | FinanceExpense | DepreciationExpense;

interface VehicleExpensesStore {
  expenses: AnyVehicleExpense[];
  addExpense: (expenseData: Omit<AnyVehicleExpense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updatedData: Partial<AnyVehicleExpense>) => void;
  deleteExpense: (id: string) => void;
}

export const useVehicleExpensesStore = create<VehicleExpensesStore>()(
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
            } as AnyVehicleExpense, 
            ...state.expenses
          ],
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
      name: 'vehicle-expenses-storage',
    }
  )
);
