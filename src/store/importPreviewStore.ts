import { create } from 'zustand';
import type { RawTransaction } from '../lib/bankStatementParser';

export interface ImportRow extends RawTransaction {
  selected: boolean;
  category: string;
  notes?: string;
}

interface ImportPreviewStore {
  fileName: string | null;
  source: 'csv' | 'ofx' | null;
  rows: ImportRow[];
  skipped: number;
  setImport: (fileName: string, source: 'csv' | 'ofx', rows: ImportRow[], skipped: number) => void;
  toggleRow: (id: string) => void;
  selectAll: (selected: boolean) => void;
  updateRow: (id: string, patch: Partial<ImportRow>) => void;
  removeRow: (id: string) => void;
  clear: () => void;
  getSelected: () => ImportRow[];
}

export const useImportPreviewStore = create<ImportPreviewStore>((set, get) => ({
  fileName: null,
  source: null,
  rows: [],
  skipped: 0,

  setImport: (fileName, source, rows, skipped) => set({ fileName, source, rows, skipped }),

  toggleRow: (id) =>
    set((state) => ({
      rows: state.rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)),
    })),

  selectAll: (selected) =>
    set((state) => ({ rows: state.rows.map((r) => ({ ...r, selected })) })),

  updateRow: (id, patch) =>
    set((state) => ({
      rows: state.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  removeRow: (id) =>
    set((state) => ({ rows: state.rows.filter((r) => r.id !== id) })),

  clear: () => set({ fileName: null, source: null, rows: [], skipped: 0 }),

  getSelected: () => get().rows.filter((r) => r.selected),
}));
