import { useState } from 'react';
import { X } from 'lucide-react';
import { useExpenseStore } from '../store/expenseStore';

/*
 * ExpenseModal — Apple HIG Bottom Sheet
 * Ref: hig-foundations/references/materials.md - glass-thick
 * Ref: hig-foundations/references/motion.md - sheet-up
 * Ref: hig-foundations/references/typography.md - form labels (subhead)
 * Ref: hig-foundations/references/layout.md - inset grouped list for forms
 */

interface ExpenseModalProps {
 expense?: any;
 onClose: () => void;
}

function ExpenseModal({ expense, onClose }: ExpenseModalProps) {
 const addExpense = useExpenseStore((state) => state.addExpense);
 const updateExpense = useExpenseStore((state) => state.updateExpense);

 const [formData, setFormData] = useState({
 category: expense?.category || 'Combustível',
 description: expense?.description || '',
 amount: expense?.amount || '',
 date: expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
 });

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();

 const expenseData = {
 category: formData.category,
 description: formData.description,
 amount: parseFloat(formData.amount.toString()),
 date: new Date(formData.date).toISOString(),
 };

 if (expense) {
 updateExpense(expense.id, expenseData);
 } else {
 addExpense(expenseData);
 }

 onClose();
 };

 // Shared input class — Apple HIG style
 const inputClass = `ios-input`;
 const selectClass = `ios-input`;
 const labelClass = `block text-ios-subhead font-medium text-[var(--ios-text-secondary)] mb-1.5`;

 return (
 /* Backdrop */
 <div
 className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
 style={{ background: 'rgba(0, 0, 0, 0.32)' }}
 onClick={onClose}
 >
 {/* Sheet */}
 <div
 className="w-full max-w-md glass-thick animate-sheet-up pb-safe"
 style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Drag handle */}
 <div className="flex justify-center pt-3 pb-2">
 <div className="w-9 h-1 rounded-full bg-label-quaternary dark:bg-label-quaternary-dark" />
 </div>

 {/* Header */}
 <div className="flex items-center justify-between px-5 pb-3">
 <h2 className="text-ios-title3 font-semibold text-[var(--ios-text)]" style={{ letterSpacing: '-0.43px' }}>
 {expense ? 'Editar Despesa' : 'Nova Despesa'}
 </h2>
 <button
 id="expense-modal-close"
 onClick={onClose}
 className="btn-icon text-[var(--ios-text-tertiary)] hover:bg-fill-tertiary dark:hover:bg-fill-tertiary-dark"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 {/* Form — inset grouped style */}
 <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-4">
 <div>
 <label className={labelClass}>Categoria</label>
 <select
 id="expense-category"
 value={formData.category}
 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
 className={selectClass}
 required
 >
 <option value="Combustível">Combustível</option>
 <option value="Manutenção">Manutenção</option>
 <option value="Alimentação">Alimentação</option>
 <option value="Estacionamento">Estacionamento</option>
 <option value="Pedágio">Pedágio</option>
 <option value="Outros">Outros</option>
 </select>
 </div>

 <div>
 <label className={labelClass}>Descrição</label>
 <input
 id="expense-description"
 type="text"
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 className={inputClass}
 placeholder="Ex: Gasolina do posto X"
 required
 />
 </div>

 <div>
 <label className={labelClass}>Valor (R$)</label>
 <input
 id="expense-amount"
 type="number"
 step="0.01"
 value={formData.amount}
 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
 className={inputClass}
 required
 />
 </div>

 <div>
 <label className={labelClass}>Data</label>
 <input
 id="expense-date"
 type="date"
 value={formData.date}
 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
 className={inputClass}
 required
 />
 </div>

 {/* Actions — ref: layout.md "button stack" */}
 <div className="flex gap-3 pt-3">
 <button
 type="button"
 onClick={onClose}
 className="flex-1 ios-btn-tinted"
 >
 Cancelar
 </button>
 <button
 type="submit"
 className="flex-1 ios-btn"
 >
 {expense ? 'Salvar' : 'Adicionar'}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}

export default ExpenseModal;
