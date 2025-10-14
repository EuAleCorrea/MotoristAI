import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

export type FinancialStatus = 'Financiado' | 'Alugado' | 'Quitado';
export type Transmission = 'Manual' | 'Automático';
export type Fuel = 'Gasolina' | 'Etanol' | 'Diesel' | 'GNV' | 'Elétrico' | 'Híbrido';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  color: string;
  fuel: Fuel;
  transmission: Transmission;
  doors: number;
  hasAirConditioning: boolean;
  mileage: number;
  financialStatus: FinancialStatus;
}

interface VehicleStore {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Omit<Vehicle, 'id'>>) => void;
  deleteVehicle: (id: string) => void;
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set) => ({
      vehicles: [],
      addVehicle: (vehicle) =>
        set((state) => ({
          vehicles: [{ ...vehicle, id: faker.string.uuid() }, ...state.vehicles],
        })),
      updateVehicle: (id, updatedVehicle) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
          ),
        })),
      deleteVehicle: (id) =>
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
        })),
    }),
    {
      name: 'vehicle-storage',
    }
  )
);
