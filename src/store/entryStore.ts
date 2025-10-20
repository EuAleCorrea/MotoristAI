import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { faker } from '@faker-js/faker';

export interface Entry {
  id: string;
  date: string;
  source: string; // 'Uber', '99', etc.
  value: number;
  tripCount: number;
  kmDriven: number;
  hoursWorked: string; // HH:MM format
  notes?: string;
}

interface EntryStore {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<Omit<Entry, 'id'>>) => void;
  deleteEntry: (id: string) => void;
}

const generateSampleEntries = (): Entry[] => {
  const entries: Entry[] = [];
  const sources = ['Uber', '99', 'inDrive'];
  
  for (let i = 0; i < 30; i++) {
    const hours = faker.number.int({ min: 4, max: 10 });
    const minutes = faker.helpers.arrayElement([0, 15, 30, 45]);
    entries.push({
      id: faker.string.uuid(),
      date: faker.date.recent({ days: 30 }).toISOString(),
      source: faker.helpers.arrayElement(sources),
      value: parseFloat(faker.finance.amount({ min: 150, max: 400, dec: 2 })),
      tripCount: faker.number.int({ min: 10, max: 25 }),
      kmDriven: parseFloat(faker.number.float({ min: 80, max: 250, fractionDigits: 1 }).toFixed(1)),
      hoursWorked: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      notes: i % 5 === 0 ? faker.lorem.sentence() : undefined,
    });
  }
  
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useEntryStore = create<EntryStore>()(
  persist(
    (set) => ({
      entries: generateSampleEntries(),
      addEntry: (entry) =>
        set((state) => ({
          entries: [{ ...entry, id: faker.string.uuid() }, ...state.entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        })),
      updateEntry: (id, updatedEntry) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: 'entry-storage',
    }
  )
);
