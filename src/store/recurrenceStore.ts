import { create } from 'zustand';
import { supabase } from '../services/supabase';

// ── Interfaces ──────────────────────────────────────────

export interface Recurrence {
  id: string;
  user_id: string;
  description: string;
  category: string;
  type: 'vehicle' | 'family' | 'general';
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';
  day: number | null;
  next_due_date: string;
  vehicle_id: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  vehicle_name?: string;
}

export interface Installment {
  id: string;
  user_id: string;
  description: string;
  category: string;
  total_amount: number;
  installment_amount: number;
  total_installments: number;
  paid_installments: number;
  start_date: string;
  due_day: number;
  next_due_date: string;
  payment_method: 'credit_card' | 'debit_card' | 'bank_slip' | 'pix' | 'other';
  vehicle_id: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  vehicle_name?: string;
}

// ── Helpers ─────────────────────────────────────────────

const FREQUENCY_MAP: Record<string, { label: string; months: number }> = {
  weekly: { label: 'Semanal', months: 0.25 },
  biweekly: { label: 'Quinzenal', months: 0.5 },
  monthly: { label: 'Mensal', months: 1 },
  bimonthly: { label: 'Bimestral', months: 2 },
  quarterly: { label: 'Trimestral', months: 3 },
  semiannual: { label: 'Semestral', months: 6 },
  annual: { label: 'Anual', months: 12 },
};

export function getFrequencyLabel(freq: string): string {
  return FREQUENCY_MAP[freq]?.label ?? freq;
}

export function getPaymentMethodLabel(method: string): string {
  const map: Record<string, string> = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    bank_slip: 'Boleto',
    pix: 'PIX',
    other: 'Outro',
  };
  return map[method] ?? method;
}

/**
 * Calcula a próxima data de vencimento a partir de uma data base,
 * pulando o número de meses da frequência.
 */
export function calculateNextDueDate(currentDue: string, frequency: string): string {
  const freq = FREQUENCY_MAP[frequency];
  if (!freq) return currentDue;

  const date = new Date(currentDue);
  const months = Math.round(freq.months * 30); // aproximação em dias
  date.setDate(date.getDate() + months);
  return date.toISOString().split('T')[0];
}

/**
 * Retorna o label para exibição da frequência + valor mensal equivalente
 */
export function getFrequencySummary(frequency: string, amount: number): string {
  const freq = FREQUENCY_MAP[frequency];
  if (!freq) return `${getFrequencyLabel(frequency)}`;
  if (freq.months >= 1) {
    return `${getFrequencyLabel(frequency)}`;
  }
  // Frequências menores que mensal: mostra o valor mensal equivalente
  const monthlyAmount = amount / freq.months;
  return `${getFrequencyLabel(frequency)} (~R$ ${monthlyAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês)`;
}

// ── Store ───────────────────────────────────────────────

interface RecurrenceStore {
  // Recorrências
  recurrences: Recurrence[];
  recurrencesLoading: boolean;
  recurrencesError: string | null;
  fetchRecurrences: () => Promise<void>;
  addRecurrence: (data: Omit<Recurrence, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'vehicle_name'>) => Promise<void>;
  updateRecurrence: (id: string, data: Partial<Recurrence>) => Promise<void>;
  deleteRecurrence: (id: string) => Promise<void>;
  markRecurrenceAsPaid: (id: string) => Promise<void>;

  // Parcelamentos
  installments: Installment[];
  installmentsLoading: boolean;
  installmentsError: string | null;
  fetchInstallments: () => Promise<void>;
  addInstallment: (data: Omit<Installment, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'vehicle_name'>) => Promise<void>;
  updateInstallment: (id: string, data: Partial<Installment>) => Promise<void>;
  deleteInstallment: (id: string) => Promise<void>;
  markInstallmentAsPaid: (id: string) => Promise<void>;
}

export const useRecurrenceStore = create<RecurrenceStore>((set, get) => ({
  // ── Recorrências ──

  recurrences: [],
  recurrencesLoading: false,
  recurrencesError: null,

  fetchRecurrences: async () => {
    set({ recurrencesLoading: true, recurrencesError: null });
    try {
      const { data, error } = await supabase
        .from('recurrences')
        .select('*, vehicles(name)')
        .order('next_due_date', { ascending: true });

      if (error) throw error;

      const mapped: Recurrence[] = (data || []).map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        description: r.description,
        category: r.category,
        type: r.type,
        amount: Number(r.amount),
        frequency: r.frequency,
        day: r.day,
        next_due_date: r.next_due_date,
        vehicle_id: r.vehicle_id,
        active: r.active,
        notes: r.notes,
        created_at: r.created_at,
        updated_at: r.updated_at,
        vehicle_name: r.vehicles?.name,
      }));

      set({ recurrences: mapped });
    } catch (error: any) {
      set({ recurrencesError: error.message });
    } finally {
      set({ recurrencesLoading: false });
    }
  },

  addRecurrence: async (data) => {
    set({ recurrencesLoading: true, recurrencesError: null });
    try {
      // Calcula next_due_date se não veio preenchida
      const payload = {
        ...data,
        next_due_date: data.next_due_date || new Date().toISOString().split('T')[0],
      };

      const { data: inserted, error } = await supabase
        .from('recurrences')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      await get().fetchRecurrences();
    } catch (error: any) {
      set({ recurrencesError: error.message });
    } finally {
      set({ recurrencesLoading: false });
    }
  },

  updateRecurrence: async (id, data) => {
    set({ recurrencesLoading: true, recurrencesError: null });
    try {
      const { error } = await supabase
        .from('recurrences')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await get().fetchRecurrences();
    } catch (error: any) {
      set({ recurrencesError: error.message });
    } finally {
      set({ recurrencesLoading: false });
    }
  },

  deleteRecurrence: async (id) => {
    set({ recurrencesLoading: true, recurrencesError: null });
    try {
      const { error } = await supabase
        .from('recurrences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        recurrences: state.recurrences.filter((r) => r.id !== id),
      }));
    } catch (error: any) {
      set({ recurrencesError: error.message });
    } finally {
      set({ recurrencesLoading: false });
    }
  },

  markRecurrenceAsPaid: async (id) => {
    const recurrence = get().recurrences.find((r) => r.id === id);
    if (!recurrence) return;

    const nextDue = calculateNextDueDate(recurrence.next_due_date, recurrence.frequency);

    set({ recurrencesLoading: true, recurrencesError: null });
    try {
      const { error } = await supabase
        .from('recurrences')
        .update({ next_due_date: nextDue })
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        recurrences: state.recurrences.map((r) =>
          r.id === id ? { ...r, next_due_date: nextDue } : r
        ),
      }));
    } catch (error: any) {
      set({ recurrencesError: error.message });
    } finally {
      set({ recurrencesLoading: false });
    }
  },

  // ── Parcelamentos ──

  installments: [],
  installmentsLoading: false,
  installmentsError: null,

  fetchInstallments: async () => {
    set({ installmentsLoading: true, installmentsError: null });
    try {
      const { data, error } = await supabase
        .from('installments')
        .select('*, vehicles(name)')
        .order('next_due_date', { ascending: true });

      if (error) throw error;

      const mapped: Installment[] = (data || []).map((i: any) => ({
        id: i.id,
        user_id: i.user_id,
        description: i.description,
        category: i.category,
        total_amount: Number(i.total_amount),
        installment_amount: Number(i.installment_amount),
        total_installments: i.total_installments,
        paid_installments: i.paid_installments,
        start_date: i.start_date,
        due_day: i.due_day,
        next_due_date: i.next_due_date,
        payment_method: i.payment_method,
        vehicle_id: i.vehicle_id,
        active: i.active,
        notes: i.notes,
        created_at: i.created_at,
        updated_at: i.updated_at,
        vehicle_name: i.vehicles?.name,
      }));

      set({ installments: mapped });
    } catch (error: any) {
      set({ installmentsError: error.message });
    } finally {
      set({ installmentsLoading: false });
    }
  },

  addInstallment: async (data) => {
    set({ installmentsLoading: true, installmentsError: null });
    try {
      const payload = {
        ...data,
        next_due_date: data.next_due_date || data.start_date,
      };

      const { data: inserted, error } = await supabase
        .from('installments')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      await get().fetchInstallments();
    } catch (error: any) {
      set({ installmentsError: error.message });
    } finally {
      set({ installmentsLoading: false });
    }
  },

  updateInstallment: async (id, data) => {
    set({ installmentsLoading: true, installmentsError: null });
    try {
      const { error } = await supabase
        .from('installments')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await get().fetchInstallments();
    } catch (error: any) {
      set({ installmentsError: error.message });
    } finally {
      set({ installmentsLoading: false });
    }
  },

  deleteInstallment: async (id) => {
    set({ installmentsLoading: true, installmentsError: null });
    try {
      const { error } = await supabase
        .from('installments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        installments: state.installments.filter((i) => i.id !== id),
      }));
    } catch (error: any) {
      set({ installmentsError: error.message });
    } finally {
      set({ installmentsLoading: false });
    }
  },

  markInstallmentAsPaid: async (id) => {
    const installment = get().installments.find((i) => i.id === id);
    if (!installment) return;

    const newPaid = installment.paid_installments + 1;
    const isFinished = newPaid >= installment.total_installments;

    // Calcula a próxima data (próximo mês no mesmo dia)
    const nextDate = new Date(installment.next_due_date);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextDue = nextDate.toISOString().split('T')[0];

    set({ installmentsLoading: true, installmentsError: null });
    try {
      const updateData: any = {
        paid_installments: newPaid,
        next_due_date: isFinished ? null : nextDue,
      };
      if (isFinished) {
        updateData.active = false;
      }

      const { error } = await supabase
        .from('installments')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await get().fetchInstallments();
    } catch (error: any) {
      set({ installmentsError: error.message });
    } finally {
      set({ installmentsLoading: false });
    }
  },
}));