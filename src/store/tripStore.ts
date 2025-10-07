import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

interface Trip {
  id: string;
  platform: string;
  amount: number;
  distance: number;
  duration: number;
  date: string;
}

interface TripStore {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
}

const generateSampleTrips = (): Trip[] => {
  const trips: Trip[] = [];
  const platforms = ['Uber', '99', 'iFood', 'Rappi'];
  
  for (let i = 0; i < 30; i++) {
    trips.push({
      id: faker.string.uuid(),
      platform: faker.helpers.arrayElement(platforms),
      amount: parseFloat(faker.finance.amount({ min: 10, max: 80, dec: 2 })),
      distance: parseFloat(faker.number.float({ min: 2, max: 30, fractionDigits: 1 }).toFixed(1)),
      duration: faker.number.int({ min: 10, max: 60 }),
      date: faker.date.recent({ days: 30 }).toISOString(),
    });
  }
  
  return trips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      trips: generateSampleTrips(),
      addTrip: (trip) =>
        set((state) => ({
          trips: [{ ...trip, id: faker.string.uuid() }, ...state.trips],
        })),
      updateTrip: (id, updatedTrip) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === id ? { ...trip, ...updatedTrip } : trip
          ),
        })),
      deleteTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== id),
        })),
    }),
    {
      name: 'trip-storage',
    }
  )
);
