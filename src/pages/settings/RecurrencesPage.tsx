import { useEffect, useState } from 'react';
import { useRecurrenceStore, Recurrence, Installment, getFrequencyLabel, getPaymentMethodLabel } from '../../../store/recurrenceStore';

type Tab = 'recurrences' | 'installments';

// ── Modal base ──
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[var(--ios-card)] rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--ios-border)]">
          <h2 className="text-lg font-semibold text-[var(--ios-text)]">{title}</h2>
          <button onClick={onClose} className="text-[var(--ios-blue)] text-sm font-medium">Fechar</button>
        </div>
        <div className="p-4 space-y-4">{children}</div>
      </div>
    </div>
  );
}

// ── Input helper ──
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-[var(--ios-text-secondary)] mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full px-3 py-2 rounded-lg border border-[var(--ios-border)] bg-[var(--ios-bg)] text-[var(--ios-text)] placeholder:text-[var(--ios-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
      {...props}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full px-3 py-2 rounded-lg border border-[var(--ios-border)] bg-[var(--ios-bg)] text-[var(--ios-text)] focus:outline-none focus:ring-2 focus:ring-[var(--ios-blue)]"
      {...props}
    />
  );
}

// ── Recurrence Form ──
function RecurrenceForm({ initial, onSave, onCancel }: { initial?: Partial<Recurrence>; onSave: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    description: initial?.description || '',
    category: initial?.category || 'Outros',
    type: initial?.type || 'general',
    amount: initial?.amount || 0,
    frequency: initial?.frequency || 'monthly',
    day: initial?.day || 1,
    next_due_date: initial?.next_due_date || '',
    vehicle_id: initial?.vehicle_id || null,
    active: initial?.active ?? true,
    notes: initial?.notes || '',
  });

  const handleSave = () => {
    if (!form.description || !form.amount || !form.next_due_date) return;
    onSave(form);
  };

  return (
    <>
      <Field label="Descrição">
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Aluguel" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoria">
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="Moradia">Moradia</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Saúde">Saúde</option>
            <option value="Transporte">Transporte</option>
            <option value="Assinatura">Assinatura</option>
            <option value="Seguro">Seguro</option>
            <option value="Lazer">Lazer</option>
            <option value="Outros">Outros</option>
          </Select>
        </Field>
        <Field label="Tipo">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
            <option value="vehicle">Veicular</option>
            <option value="family">Família</option>
            <option value="general">Geral</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Valor (R$)">
          <Input type="number" step="0.01" min="0" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
        </Field>
        <Field label="Frequência">
          <Select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as any })}>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quinzenal</option>
            <option value="monthly">Mensal</option>
            <option value="bimonthly">Bimestral</option>
            <option value="quarterly">Trimestral</option>
            <option value="semiannual">Semestral</option>
            <option value="annual">Anual</option>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Dia vencimento">
          <Input type="number" min="1" max="31" value={form.day || ''} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })} />
        </Field>
        <Field label="Próximo vencimento">
          <Input type="date" value={form.next_due_date} onChange={(e) => setForm({ ...form, next_due_date: e.target.value })} />
        </Field>
      </div>
      <Field label="Observações">
        <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Opcional" />
      </Field>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-[var(--ios-border)] text-[var(--ios-text)] font-medium">Cancelar</button>
        <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-[var(--ios-blue)] text-white font-medium">Salvar</button>
      </div>
    </>
  );
}

// ── Installment Form ──
function InstallmentForm({ initial, onSave, onCancel }: { initial?: Partial<Installment>; onSave: (data: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    description: initial?.description || '',
    category: initial?.category || 'Outros',
    total_amount: initial?.total_amount || 0,
    installment_amount: initial?.installment_amount || 0,
    total_installments: initial?.total_installments || 2,
    paid_installments: initial?.paid_installments || 0,
    start_date: initial?.start_date || '',
    due_day: initial?.due_day || 5,
    next_due_date: initial?.next_due_date || '',
    payment_method: initial?.payment_method || 'credit_card',
    vehicle_id: initial?.vehicle_id || null,
    active: initial?.active ?? true,
    notes: initial?.notes || '',
  });

  // Auto-calc installment amount
  const handleCalc = () => {
    if (form.total_amount > 0 && form.total_installments > 0 && !initial?.installment_amount) {
      setForm((f) => ({ ...f, installment_amount: Math.round((f.total_amount / f.total_installments) * 100) / 100 }));
    }
  };

  const handleSave = () => {
    if (!form.description || !form.total_amount || !form.start_date) return;
    onSave(form);
  };

  return (
    <>
      <Field label="Descrição">
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Notebook parcelado" />
      </Field>
      <Field label="Categoria">
        <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Móveis">Móveis</option>
          <option value="Curso">Curso</option>
          <option value="Cartão">Cartão</option>
          <option value="Outros">Outros</option>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Valor total (R$)">
          <Input type="number" step="0.01" min="0" value={form.total_amount || ''} onChange={(e) => setForm({ ...form, total_amount: Number(e.target.value) })} onBlur={handleCalc} />
        </Field>
        <Field label="Valor parcela (R$)">
          <Input type="number" step="0.01" min="0" value={form.installment_amount || ''} onChange={(e) => setForm({ ...form, installment_amount: Number(e.target.value) })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Total de parcelas">
          <Input type="number" min="2" max="120" value={form.total_installments} onChange={(e) => setForm({ ...form, total_installments: Number(e.target.value) })} onBlur={handleCalc} />
        </Field>
        <Field label="Parcelas pagas">
          <Input type="number" min="0" value={form.paid_installments} onChange={(e) => setForm({ ...form, paid_installments: Number(e.target.value) })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Data início">
          <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
        </Field>
        <Field label="Dia vencimento">
          <Input type="number" min="1" max="31" value={form.due_day} onChange={(e) => setForm({ ...form, due_day: Number(e.target.value) })} />
        </Field>
      </div>
      <Field label="Forma de pagamento">
        <Select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value as any })}>
          <option value="credit_card">Cartão de Crédito</option>
          <option value="debit_card">Cartão de Débito</option>
          <option value="bank_slip">Boleto</option>
          <option value="pix">PIX</option>
          <option value="other">Outro</option>
        </Select>
      </Field>
      <Field label="Observações">
        <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Opcional" />
      </Field>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-[var(--ios-border)] text-[var(--ios-text)] font-medium">Cancelar</button>
        <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-[var(--ios-blue)] text-white font-medium">Salvar</button>
      </div>
    </>
  );
}

// ── Confirm dialog ──
function ConfirmDialog({ open, onClose, onConfirm, title, message }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[var(--ios-card)] rounded-2xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-[var(--ios-text)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--ios-text-secondary)] mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[var(--ios-border)] text-[var(--ios-text)] font-medium">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

// ── Recurrence Card ──
function RecurrenceCard({ item, onEdit, onDelete, onPay }: { item: Recurrence; onEdit: () => void; onDelete: () => void; onPay: () => void }) {
  const dueDate = new Date(item.next_due_date);
  const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntil < 0;

  return (
    <div className="bg-[var(--ios-card)] rounded-xl p-4 space-y-2 shadow-sm border border-[var(--ios-border)]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--ios-text)] truncate">{item.description}</h3>
          <p className="text-xs text-[var(--ios-text-secondary)]">{item.category} · {getFrequencyLabel(item.frequency)}</p>
        </div>
        <div className="text-right ml-3 flex-shrink-0">
          <p className="font-bold text-lg text-[var(--ios-text)]">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-[var(--ios-text-secondary)]'}`}>
            {isOverdue ? `${Math.abs(daysUntil)} dias atrasado` : daysUntil === 0 ? 'Vence hoje' : `Vence em ${daysUntil} dias`}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {item.type === 'vehicle' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Veículo</span>}
          {item.type === 'family' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Família</span>}
          {item.vehicle_name && <span className="text-xs text-[var(--ios-text-secondary)]">{item.vehicle_name}</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={onPay} className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors">
            Pagar
          </button>
          <button onClick={onEdit} className="px-3 py-1 text-xs rounded-lg bg-[var(--ios-blue)] text-white font-medium hover:opacity-80 transition-colors">
            Editar
          </button>
          <button onClick={onDelete} className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Installment Card ──
function InstallmentCard({ item, onEdit, onDelete, onPay }: { item: Installment; onEdit: () => void; onDelete: () => void; onPay: () => void }) {
  const progress = item.total_installments > 0 ? Math.round((item.paid_installments / item.total_installments) * 100) : 0;
  const dueDate = new Date(item.next_due_date);
  const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntil < 0;

  return (
    <div className="bg-[var(--ios-card)] rounded-xl p-4 space-y-3 shadow-sm border border-[var(--ios-border)]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--ios-text)] truncate">{item.description}</h3>
          <p className="text-xs text-[var(--ios-text-secondary)]">{item.category} · {getPaymentMethodLabel(item.payment_method)}</p>
        </div>
        <div className="text-right ml-3 flex-shrink-0">
          <p className="font-bold text-lg text-[var(--ios-text)]">R$ {item.installment_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-[var(--ios-text-secondary)]">{item.paid_installments}/{item.total_installments} parcelas</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[var(--ios-blue)] rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-[var(--ios-text-secondary)]'}`}>
          Total: R$ {item.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          {isOverdue ? ` · ${Math.abs(daysUntil)} dias atrasado` : daysUntil === 0 ? ' · Vence hoje' : ` · Vence em ${daysUntil} dias`}
        </span>
        <div className="flex gap-2">
          <button onClick={onPay} className="px-3 py-1 text-xs rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors">
            Pagar parcela
          </button>
          <button onClick={onEdit} className="px-3 py-1 text-xs rounded-lg bg-[var(--ios-blue)] text-white font-medium hover:opacity-80 transition-colors">
            Editar
          </button>
          <button onClick={onDelete} className="px-3 py-1 text-xs rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ──
function EmptyState({ message, onAdd }: { message: string; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[var(--ios-card)] flex items-center justify-center mb-4 border border-[var(--ios-border)]">
        <svg className="w-8 h-8 text-[var(--ios-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
        </svg>
      </div>
      <p className="text-[var(--ios-text-secondary)] text-center mb-4">{message}</p>
      <button onClick={onAdd} className="px-6 py-2 rounded-lg bg-[var(--ios-blue)] text-white font-medium text-sm">
        Adicionar
      </button>
    </div>
  );
}

// ── Main Page ──
export default function RecurrencesPage() {
  const {
    recurrences, recurrencesLoading,
    installments, installmentsLoading,
    fetchRecurrences, fetchInstallments,
    addRecurrence, updateRecurrence, deleteRecurrence, markRecurrenceAsPaid,
    addInstallment, updateInstallment, deleteInstallment, markInstallmentAsPaid,
  } = useRecurrenceStore();

  const [tab, setTab] = useState<Tab>('recurrences');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecurrence, setEditingRecurrence] = useState<Recurrence | null>(null);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'recurrence' | 'installment'; id: string } | null>(null);

  useEffect(() => {
    fetchRecurrences();
    fetchInstallments();
  }, []);

  // ── Handlers Recorrências ──

  const openAddRecurrence = () => {
    setEditingRecurrence(null);
    setEditingInstallment(null);
    setModalOpen(true);
  };

  const openEditRecurrence = (r: Recurrence) => {
    setEditingRecurrence(r);
    setEditingInstallment(null);
    setModalOpen(true);
  };

  const handleSaveRecurrence = (data: any) => {
    if (editingRecurrence) {
      updateRecurrence(editingRecurrence.id, data);
    } else {
      addRecurrence(data);
    }
    setModalOpen(false);
    setEditingRecurrence(null);
  };

  const handleDeleteRecurrence = (id: string) => {
    deleteRecurrence(id);
    setConfirmDelete(null);
  };

  // ── Handlers Parcelamentos ──

  const openAddInstallment = () => {
    setEditingInstallment(null);
    setEditingRecurrence(null);
    setModalOpen(true);
  };

  const openEditInstallment = (i: Installment) => {
    setEditingInstallment(i);
    setEditingRecurrence(null);
    setModalOpen(true);
  };

  const handleSaveInstallment = (data: any) => {
    if (editingInstallment) {
      updateInstallment(editingInstallment.id, data);
    } else {
      addInstallment(data);
    }
    setModalOpen(false);
    setEditingInstallment(null);
  };

  const handleDeleteInstallment = (id: string) => {
    deleteInstallment(id);
    setConfirmDelete(null);
  };

  // ── Loading ──
  const isLoading = tab === 'recurrences' ? recurrencesLoading : installmentsLoading;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--ios-text)]">Recorrências e Parcelas</h1>
        <p className="text-sm text-[var(--ios-text-secondary)] mt-1">
          Gerencie despesas recorrentes e parcelamentos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--ios-card)] rounded-xl p-1 border border-[var(--ios-border)]">
        <button
          onClick={() => setTab('recurrences')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'recurrences'
              ? 'bg-[var(--ios-blue)] text-white shadow-sm'
              : 'text-[var(--ios-text-secondary)] hover:text-[var(--ios-text)]'
          }`}
        >
          Recorrências
        </button>
        <button
          onClick={() => setTab('installments')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === 'installments'
              ? 'bg-[var(--ios-blue)] text-white shadow-sm'
              : 'text-[var(--ios-text-secondary)] hover:text-[var(--ios-text)]'
          }`}
        >
          Parcelamentos
        </button>
      </div>

      {/* Summary */}
      {tab === 'recurrences' && recurrences.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--ios-card)] rounded-xl p-3 border border-[var(--ios-border)] text-center">
            <p className="text-2xl font-bold text-[var(--ios-text)]">{recurrences.length}</p>
            <p className="text-xs text-[var(--ios-text-secondary)]">Ativas</p>
          </div>
          <div className="bg-[var(--ios-card)] rounded-xl p-3 border border-[var(--ios-border)] text-center">
            <p className="text-2xl font-bold text-red-500">
              {recurrences.filter((r) => new Date(r.next_due_date) < new Date()).length}
            </p>
            <p className="text-xs text-[var(--ios-text-secondary)]">Atrasadas</p>
          </div>
          <div className="bg-[var(--ios-card)] rounded-xl p-3 border border-[var(--ios-border)] text-center">
            <p className="text-2xl font-bold text-[var(--ios-blue)]">
              R$ {recurrences.reduce((s, r) => s + r.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-[var(--ios-text-secondary)]">Total/mês</p>
          </div>
        </div>
      )}

      {tab === 'installments' && installments.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--ios-card)] rounded-xl p-3 border border-[var(--ios-border)] text-center">
            <p className="text-2xl font-bold text-[var(--ios-text)]">{installments.length}</p>
            <p className="text-xs text-[var(--ios-text-secondary)]">Ativos</p>
          </div>
          <div className="bg-[var(--ios-card)] rounded-xl p-3 border border-[var(--ios-border)] text-center">
            <p className="text-2xl font-bold text-[var(--ios-blue)]">
              R$ {installments.reduce((s, i) => s + i.installment_amount * (i.total_installments - i.paid_installments), 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-[var(--ios-text-secondary)]">Restante</p>
          </div>
          <div className="bg-[var(--ios-card)] rounded-xl p-3 border border-[var(--ios-border)] text-center">
            <p className="text-2xl font-bold text-green-500">
              {installments.reduce((s, i) => s + i.paid_installments, 0)}/{installments.reduce((s, i) => s + i.total_installments, 0)}
            </p>
            <p className="text-xs text-[var(--ios-text-secondary)]">Parcelas pagas</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[var(--ios-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Lista de Recorrências */}
      {tab === 'recurrences' && !recurrencesLoading && (
        <>
          {recurrences.length === 0 ? (
            <EmptyState message="Nenhuma recorrência cadastrada. Adicione despesas que se repetem mensalmente." onAdd={openAddRecurrence} />
          ) : (
            <div className="space-y-3">
              {recurrences.map((r) => (
                <RecurrenceCard
                  key={r.id}
                  item={r}
                  onEdit={() => openEditRecurrence(r)}
                  onDelete={() => setConfirmDelete({ type: 'recurrence', id: r.id })}
                  onPay={() => markRecurrenceAsPaid(r.id)}
                />
              ))}
              <button
                onClick={openAddRecurrence}
                className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--ios-border)] text-[var(--ios-blue)] font-medium text-sm hover:bg-[var(--ios-card)] transition-colors"
              >
                + Nova Recorrência
              </button>
            </div>
          )}
        </>
      )}

      {/* Lista de Parcelamentos */}
      {tab === 'installments' && !installmentsLoading && (
        <>
          {installments.length === 0 ? (
            <EmptyState message="Nenhum parcelamento cadastrado. Adicione despesas parceladas." onAdd={openAddInstallment} />
          ) : (
            <div className="space-y-3">
              {installments.map((i) => (
                <InstallmentCard
                  key={i.id}
                  item={i}
                  onEdit={() => openEditInstallment(i)}
                  onDelete={() => setConfirmDelete({ type: 'installment', id: i.id })}
                  onPay={() => markInstallmentAsPaid(i.id)}
                />
              ))}
              <button
                onClick={openAddInstallment}
                className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--ios-border)] text-[var(--ios-blue)] font-medium text-sm hover:bg-[var(--ios-card)] transition-colors"
              >
                + Novo Parcelamento
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Add/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingRecurrence(null); setEditingInstallment(null); }}
        title={tab === 'recurrences'
          ? (editingRecurrence ? 'Editar Recorrência' : 'Nova Recorrência')
          : (editingInstallment ? 'Editar Parcelamento' : 'Novo Parcelamento')
        }
      >
        {tab === 'recurrences' ? (
          <RecurrenceForm
            initial={editingRecurrence || undefined}
            onSave={handleSaveRecurrence}
            onCancel={() => { setModalOpen(false); setEditingRecurrence(null); }}
          />
        ) : (
          <InstallmentForm
            initial={editingInstallment || undefined}
            onSave={handleSaveInstallment}
            onCancel={() => { setModalOpen(false); setEditingInstallment(null); }}
          />
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete?.type === 'recurrence') handleDeleteRecurrence(confirmDelete.id);
          else if (confirmDelete?.type === 'installment') handleDeleteInstallment(confirmDelete.id);
        }}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      />
    </div>
  );
}