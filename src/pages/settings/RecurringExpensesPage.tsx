import { useEffect, useState } from 'react';
import {
  useRecurrenceStore,
  Recurrence,
  Installment,
  getFrequencyLabel,
  getPaymentMethodLabel,
  getFrequencySummary,
} from '../../store/recurrenceStore';
import {
  Repeat, CreditCard, Plus, Trash2, CheckCircle2, AlertCircle,
  ChevronLeft, Loader2, Edit3, Car, Calendar, DollarSign,
  Clock, FileText, Tag, Activity, MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Modal de formulário ──────────────────────────────────────

interface RecurrenceFormData {
  description: string;
  category: string;
  type: 'vehicle' | 'family' | 'general';
  amount: string;
  frequency: string;
  day: string;
  next_due_date: string;
  vehicle_id: string;
  notes: string;
}

interface InstallmentFormData {
  description: string;
  category: string;
  total_amount: string;
  installment_amount: string;
  total_installments: string;
  start_date: string;
  due_day: string;
  payment_method: string;
  vehicle_id: string;
  notes: string;
}

const defaultRecurrence: RecurrenceFormData = {
  description: '',
  category: '',
  type: 'general',
  amount: '',
  frequency: 'monthly',
  day: '',
  next_due_date: new Date().toISOString().split('T')[0],
  vehicle_id: '',
  notes: '',
};

const defaultInstallment: InstallmentFormData = {
  description: '',
  category: '',
  total_amount: '',
  installment_amount: '',
  total_installments: '',
  start_date: new Date().toISOString().split('T')[0],
  due_day: '',
  payment_method: 'credit_card',
  vehicle_id: '',
  notes: '',
};

const CATEGORIES = [
  'Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação',
  'Assinatura', 'Seguro', 'Eletrônicos', 'Lazer', 'Cartão', 'Outros',
];

const FREQUENCIES = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quinzenal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'bimonthly', label: 'Bimestral' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' },
];

const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
  { value: 'bank_slip', label: 'Boleto' },
  { value: 'pix', label: 'PIX' },
  { value: 'other', label: 'Outro' },
];

interface AddRecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Recurrence, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'vehicle_name'>) => Promise<void>;
  vehicles: { id: string; name: string }[];
}

const AddRecurrenceModal = ({ isOpen, onClose, onSubmit, vehicles }: AddRecurrenceModalProps) => {
  const [form, setForm] = useState<RecurrenceFormData>({ ...defaultRecurrence });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        description: form.description,
        category: form.category,
        type: form.type,
        amount: parseFloat(form.amount),
        frequency: form.frequency as any,
        day: form.day ? parseInt(form.day) : null,
        next_due_date: form.next_due_date,
        vehicle_id: form.vehicle_id || null,
        active: true,
        notes: form.notes || null,
      });
      setForm({ ...defaultRecurrence });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1c1c1e] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto pb-safe-bottom">
        <div className="sticky top-0 bg-white dark:bg-[#1c1c1e] z-10 flex items-center justify-between p-4 border-b border-[var(--ios-separator)]">
          <button onClick={onClose} className="text-[var(--ios-blue)] font-medium">Cancelar</button>
          <h2 className="text-lg font-semibold text-[var(--ios-text)]">Nova Recorrência</h2>
          <div className="w-16" />
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Descrição *</label>
            <input
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              placeholder="Ex: Aluguel, Assinatura..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Valor *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              >
                <option value="">Selecione</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              >
                <option value="general">Geral</option>
                <option value="vehicle">Veículo</option>
                <option value="family">Família</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Frequência</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Dia vencimento</label>
              <input
                type="number"
                min="1"
                max="31"
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
                placeholder="Ex: 15"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Próximo vencimento *</label>
              <input
                required
                type="date"
                value={form.next_due_date}
                onChange={(e) => setForm({ ...form, next_due_date: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              />
            </div>
          </div>

          {form.type === 'vehicle' && (
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Veículo</label>
              <select
                value={form.vehicle_id}
                onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              >
                <option value="">Nenhum</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1 resize-none"
              rows={2}
              placeholder="Observações opcionais"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[var(--ios-blue)] text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Adicionar Recorrência'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface AddInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Installment, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'vehicle_name'>) => Promise<void>;
  vehicles: { id: string; name: string }[];
}

const AddInstallmentModal = ({ isOpen, onClose, onSubmit, vehicles }: AddInstallmentModalProps) => {
  const [form, setForm] = useState<InstallmentFormData>({ ...defaultInstallment });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const total = parseFloat(form.total_amount);
      const totalParcelas = parseInt(form.total_installments);
      const valorParcela = form.installment_amount ? parseFloat(form.installment_amount) : (total / totalParcelas);

      await onSubmit({
        description: form.description,
        category: form.category,
        total_amount: total,
        installment_amount: valorParcela,
        total_installments: totalParcelas,
        paid_installments: 0,
        start_date: form.start_date,
        due_day: parseInt(form.due_day),
        next_due_date: form.start_date,
        payment_method: form.payment_method as any,
        vehicle_id: form.vehicle_id || null,
        active: true,
        notes: form.notes || null,
      });
      setForm({ ...defaultInstallment });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1c1c1e] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto pb-safe-bottom">
        <div className="sticky top-0 bg-white dark:bg-[#1c1c1e] z-10 flex items-center justify-between p-4 border-b border-[var(--ios-separator)]">
          <button onClick={onClose} className="text-[var(--ios-blue)] font-medium">Cancelar</button>
          <h2 className="text-lg font-semibold text-[var(--ios-text)]">Novo Parcelamento</h2>
          <div className="w-16" />
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Descrição *</label>
            <input
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              placeholder="Ex: Notebook, Curso..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Valor Total *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0.01"
                value={form.total_amount}
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Valor Parcela</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.installment_amount}
                onChange={(e) => setForm({ ...form, installment_amount: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
                placeholder="Calculado automático"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Total Parcelas *</label>
              <input
                required
                type="number"
                min="2"
                max="120"
                value={form.total_installments}
                onChange={(e) => setForm({ ...form, total_installments: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
                placeholder="12"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Dia vencimento *</label>
              <input
                required
                type="number"
                min="1"
                max="31"
                value={form.due_day}
                onChange={(e) => setForm({ ...form, due_day: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
                placeholder="15"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Data início *</label>
              <input
                required
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--ios-text-secondary)]">Pagamento</label>
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
            >
              <option value="">Selecione</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Veículo (opcional)</label>
            <select
              value={form.vehicle_id}
              onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
              className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1"
            >
              <option value="">Nenhum</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--ios-text-secondary)]">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl px-4 py-3 text-[var(--ios-text)] outline-none mt-1 resize-none"
              rows={2}
              placeholder="Observações opcionais"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[var(--ios-blue)] text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? 'Salvando...' : 'Adicionar Parcelamento'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Card de Recorrência ──────────────────────────────────────

const RecurrenceCard = ({ item, onMarkPaid, onDelete }: {
  item: Recurrence;
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const isOverdue = new Date(item.next_due_date) < new Date(new Date().toDateString());

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[var(--ios-separator)]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[var(--ios-text)] font-semibold truncate">{item.description}</h3>
            {item.type === 'vehicle' && <Car className="w-3.5 h-3.5 text-[var(--ios-blue)] shrink-0" />}
          </div>
          <p className="text-sm text-[var(--ios-text-secondary)] mt-0.5">
            {item.category} · {getFrequencySummary(item.frequency, item.amount)}
          </p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-lg font-bold text-[var(--ios-text)]">
            R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--ios-separator)]">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--ios-text-secondary)]" />
          <span className={`text-sm ${isOverdue ? 'text-red-500 font-semibold' : 'text-[var(--ios-text-secondary)]'}`}>
            {isOverdue ? 'Vencido: ' : 'Vence: '}
            {new Date(item.next_due_date).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onMarkPaid(item.id)}
            className="p-2 rounded-xl bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/20 transition-colors"
            title="Marcar como pago"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Card de Parcelamento ─────────────────────────────────────

const InstallmentCard = ({ item, onMarkPaid, onDelete }: {
  item: Installment;
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const progress = Math.round((item.paid_installments / item.total_installments) * 100);
  const isOverdue = item.active && new Date(item.next_due_date) < new Date(new Date().toDateString());

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[var(--ios-separator)]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[var(--ios-text)] font-semibold truncate">{item.description}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--ios-blue)]/10 text-[var(--ios-blue)]">
              {getPaymentMethodLabel(item.payment_method)}
            </span>
          </div>
          <p className="text-sm text-[var(--ios-text-secondary)] mt-0.5">{item.category}</p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-lg font-bold text-[var(--ios-text)]">
            R$ {item.installment_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-[var(--ios-text-secondary)]">
            {item.paid_installments}/{item.total_installments}
          </p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mt-3">
        <div className="h-1.5 bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--ios-blue)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--ios-separator)]">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--ios-text-secondary)]" />
          <span className={`text-sm ${isOverdue ? 'text-red-500 font-semibold' : 'text-[var(--ios-text-secondary)]'}`}>
            {!item.active ? 'Finalizado' : isOverdue ? 'Vencido: ' : 'Próx: '}
            {item.active ? new Date(item.next_due_date).toLocaleDateString('pt-BR') : ''}
          </span>
        </div>
        {item.active && (
          <div className="flex gap-2">
            <button
              onClick={() => onMarkPaid(item.id)}
              className="p-2 rounded-xl bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/20 transition-colors"
              title="Marcar parcela como paga"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Página Principal ─────────────────────────────────────────

const RecurringExpensesPage = () => {
  const navigate = useNavigate();
  const {
    recurrences, recurrencesLoading,
    installments, installmentsLoading,
    fetchRecurrences, fetchInstallments,
    addRecurrence, deleteRecurrence, markRecurrenceAsPaid,
    addInstallment, deleteInstallment, markInstallmentAsPaid,
  } = useRecurrenceStore();

  const [showRecurrenceModal, setShowRecurrenceModal] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [tab, setTab] = useState<'recurrences' | 'installments'>('recurrences');
  const [vehicles, setVehicles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchRecurrences();
    fetchInstallments();
    // Carrega veículos para o select
    import('../../store/vehicleStore').then(({ useVehicleStore }) => {
      const store = useVehicleStore.getState();
      if (store.vehicles.length === 0) {
        store.fetchVehicles();
      }
      setVehicles(store.vehicles.map((v: any) => ({ id: v.id, name: v.name })));
    });
  }, []);

  const loading = recurrencesLoading || installmentsLoading;

  // Calcula total mensal estimado
  const totalMonthlyRecurrences = recurrences
    .filter((r) => r.active)
    .reduce((sum, r) => {
      const freqMap: Record<string, number> = {
        weekly: 4.33, biweekly: 2.17, monthly: 1,
        bimonthly: 0.5, quarterly: 0.33, semiannual: 0.17, annual: 0.083,
      };
      return sum + r.amount * (freqMap[r.frequency] || 1);
    }, 0);

  const totalMonthlyInstallments = installments
    .filter((i) => i.active)
    .reduce((sum, i) => sum + i.installment_amount, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/ajustes')}
          className="p-1 -ml-1 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-[var(--ios-blue)]" />
        </button>
        <h1 className="text-ios-title1 font-bold text-[var(--ios-text)]" style={{ letterSpacing: '-0.5px' }}>
          Despesas Fixas
        </h1>
      </div>

      {/* Resumo mensal */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[var(--ios-separator)]">
          <div className="flex items-center gap-2 text-sm text-[var(--ios-text-secondary)] mb-1">
            <Repeat className="w-4 h-4" />
            <span>Recorrências/mês</span>
          </div>
          <p className="text-xl font-bold text-[var(--ios-text)]">
            R$ {totalMonthlyRecurrences.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 border border-[var(--ios-separator)]">
          <div className="flex items-center gap-2 text-sm text-[var(--ios-text-secondary)] mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Parcelamentos/mês</span>
          </div>
          <p className="text-xl font-bold text-[var(--ios-text)]">
            R$ {totalMonthlyInstallments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-xl p-1">
        <button
          onClick={() => setTab('recurrences')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'recurrences'
              ? 'bg-white dark:bg-[#1c1c1e] text-[var(--ios-text)] shadow-sm'
              : 'text-[var(--ios-text-secondary)]'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Repeat className="w-4 h-4" />
            Recorrências
          </div>
        </button>
        <button
          onClick={() => setTab('installments')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'installments'
              ? 'bg-white dark:bg-[#1c1c1e] text-[var(--ios-text)] shadow-sm'
              : 'text-[var(--ios-text-secondary)]'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <CreditCard className="w-4 h-4" />
            Parcelamentos
          </div>
        </button>
      </div>

      {/* Conteúdo das abas */}
      {tab === 'recurrences' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider">
              {recurrences.filter((r) => r.active).length} ativas
            </h2>
            <button
              onClick={() => setShowRecurrenceModal(true)}
              className="flex items-center gap-1.5 text-sm text-[var(--ios-blue)] font-medium"
            >
              <Plus className="w-4 h-4" />
              Nova
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--ios-blue)]" />
            </div>
          ) : recurrences.filter((r) => r.active).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--ios-text-secondary)]">
              <Repeat className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">Nenhuma recorrência</p>
              <p className="text-sm mt-1">Adicione despesas que se repetem</p>
              <button
                onClick={() => setShowRecurrenceModal(true)}
                className="mt-4 px-6 py-2 bg-[var(--ios-blue)] text-white rounded-xl text-sm font-medium"
              >
                Adicionar
              </button>
            </div>
          ) : (
            recurrences
              .filter((r) => r.active)
              .sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime())
              .map((rec) => (
                <RecurrenceCard
                  key={rec.id}
                  item={rec}
                  onMarkPaid={markRecurrenceAsPaid}
                  onDelete={deleteRecurrence}
                />
              ))
          )}

          {/* Inativas */}
          {recurrences.filter((r) => !r.active).length > 0 && (
            <details className="mt-6">
              <summary className="text-sm text-[var(--ios-text-secondary)] cursor-pointer font-medium">
                {recurrences.filter((r) => !r.active).length} inativas
              </summary>
              <div className="space-y-3 mt-3 opacity-60">
                {recurrences
                  .filter((r) => !r.active)
                  .map((rec) => (
                    <RecurrenceCard
                      key={rec.id}
                      item={rec}
                      onMarkPaid={markRecurrenceAsPaid}
                      onDelete={deleteRecurrence}
                    />
                  ))}
              </div>
            </details>
          )}
        </div>
      )}

      {tab === 'installments' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[var(--ios-text-secondary)] uppercase tracking-wider">
              {installments.filter((i) => i.active).length} ativos
            </h2>
            <button
              onClick={() => setShowInstallmentModal(true)}
              className="flex items-center gap-1.5 text-sm text-[var(--ios-blue)] font-medium"
            >
              <Plus className="w-4 h-4" />
              Novo
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--ios-blue)]" />
            </div>
          ) : installments.filter((i) => i.active).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--ios-text-secondary)]">
              <CreditCard className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">Nenhum parcelamento</p>
              <p className="text-sm mt-1">Adicione compras ou despesas parceladas</p>
              <button
                onClick={() => setShowInstallmentModal(true)}
                className="mt-4 px-6 py-2 bg-[var(--ios-blue)] text-white rounded-xl text-sm font-medium"
              >
                Adicionar
              </button>
            </div>
          ) : (
            installments
              .filter((i) => i.active)
              .sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime())
              .map((inst) => (
                <InstallmentCard
                  key={inst.id}
                  item={inst}
                  onMarkPaid={markInstallmentAsPaid}
                  onDelete={deleteInstallment}
                />
              ))
          )}

          {/* Finalizados */}
          {installments.filter((i) => !i.active).length > 0 && (
            <details className="mt-6">
              <summary className="text-sm text-[var(--ios-text-secondary)] cursor-pointer font-medium">
                {installments.filter((i) => !i.active).length} finalizados
              </summary>
              <div className="space-y-3 mt-3 opacity-60">
                {installments
                  .filter((i) => !i.active)
                  .map((inst) => (
                    <InstallmentCard
                      key={inst.id}
                      item={inst}
                      onMarkPaid={markInstallmentAsPaid}
                      onDelete={deleteInstallment}
                    />
                  ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Modais */}
      <AddRecurrenceModal
        isOpen={showRecurrenceModal}
        onClose={() => setShowRecurrenceModal(false)}
        onSubmit={addRecurrence}
        vehicles={vehicles}
      />
      <AddInstallmentModal
        isOpen={showInstallmentModal}
        onClose={() => setShowInstallmentModal(false)}
        onSubmit={addInstallment}
        vehicles={vehicles}
      />
    </div>
  );
};

export default RecurringExpensesPage;