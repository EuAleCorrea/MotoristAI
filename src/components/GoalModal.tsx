import { useState } from 'react';
import { X } from 'lucide-react';
import { useGoalStore, Goal } from '../store/goalStore';
import { format } from 'date-fns';

/*
 * GoalModal — Apple HIG Bottom Sheet
 * Ref: hig-foundations/references/materials.md - glass-thick
 * Ref: hig-foundations/references/motion.md - sheet-up
 * Ref: hig-foundations/references/typography.md - form labels
 */

interface GoalModalProps {
 goal?: Goal;
 onClose: () => void;
}

const months = Array.from({ length: 12 }, (_, i) => ({
 value: i + 1,
 label: format(new Date(0, i), 'MMMM'),
}));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

function GoalModal({ goal, onClose }: GoalModalProps) {
 const addGoal = useGoalStore((state) => state.addGoal);

 const [formData, setFormData] = useState({
 year: goal?.year || currentYear,
 month: goal?.month || new Date().getMonth() + 1,
 daysWorkedPerWeek: goal?.daysWorkedPerWeek || '',
 revenue: goal?.revenue || '',
 profit: goal?.profit || '',
 expense: goal?.expense || '',
 numberOfWeeks: goal?.numberOfWeeks || '',
 week: goal?.week || '',
 day: goal?.day || '',
 });

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();

 const goalData = {
 year: Number(formData.year),
 month: Number(formData.month),
 daysWorkedPerWeek: formData.daysWorkedPerWeek ? Number(formData.daysWorkedPerWeek) : undefined,
 revenue: formData.revenue ? Number(formData.revenue) : undefined,
 profit: formData.profit ? Number(formData.profit) : undefined,
 expense: formData.expense ? Number(formData.expense) : undefined,
 numberOfWeeks: formData.numberOfWeeks ? Number(formData.numberOfWeeks) : undefined,
 week: formData.week ? Number(formData.week) : undefined,
 day: formData.day ? Number(formData.day) : undefined,
 };

 addGoal(goalData);
 onClose();
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const inputClass = `ios-input`;
 const selectClass = `ios-input`;
 const labelClass = `block text-ios-subhead font-medium text-[var(--ios-text-secondary)] mb-1.5`;

 return (
 <div
 className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
 style={{ background: 'rgba(0, 0, 0, 0.32)' }}
 onClick={onClose}
 >
 <div
 className="w-full max-w-2xl glass-thick animate-sheet-up pb-safe overflow-y-auto"
 style={{
 borderTopLeftRadius: '20px',
 borderTopRightRadius: '20px',
 maxHeight: '85dvh',
 }}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Drag handle */}
 <div className="flex justify-center pt-3 pb-2 sticky top-0 glass-thick z-10" style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
 <div className="w-9 h-1 rounded-full bg-label-quaternary dark:bg-label-quaternary-dark" />
 </div>

 {/* Header */}
 <div className="flex items-center justify-between px-5 pb-3 sticky top-7 glass-thick z-10">
 <h2 className="text-ios-title3 font-semibold text-[var(--ios-text)]" style={{ letterSpacing: '-0.43px' }}>
 {goal ? 'Editar Meta' : 'Nova Meta'}
 </h2>
 <button
 id="goal-modal-close"
 onClick={onClose}
 className="btn-icon text-[var(--ios-text-tertiary)] hover:bg-fill-tertiary dark:hover:bg-fill-tertiary-dark"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="px-4 pb-6">
 {/* Section: Período */}
 <p className="ios-section-header">Período</p>
 <div className="grid grid-cols-2 gap-3 mb-6">
 <div>
 <label className={labelClass}>Ano</label>
 <select id="goal-year" name="year" value={formData.year} onChange={handleInputChange} className={selectClass}>
 {years.map(y => <option key={y} value={y}>{y}</option>)}
 </select>
 </div>
 <div>
 <label className={labelClass}>Mês</label>
 <select id="goal-month" name="month" value={formData.month} onChange={handleInputChange} className={selectClass}>
 {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
 </select>
 </div>
 </div>

 {/* Section: Metas Financeiras */}
 <p className="ios-section-header">Metas Financeiras</p>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
 <div>
 <label className={labelClass}>Faturamento (R$)</label>
 <input id="goal-revenue" type="number" step="0.01" name="revenue" value={formData.revenue} onChange={handleInputChange} className={inputClass} />
 </div>
 <div>
 <label className={labelClass}>Lucro (R$)</label>
 <input id="goal-profit" type="number" step="0.01" name="profit" value={formData.profit} onChange={handleInputChange} className={inputClass} />
 </div>
 <div>
 <label className={labelClass}>Despesa (R$)</label>
 <input id="goal-expense" type="number" step="0.01" name="expense" value={formData.expense} onChange={handleInputChange} className={inputClass} />
 </div>
 </div>

 {/* Section: Planejamento */}
 <p className="ios-section-header">Planejamento</p>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
 <div>
 <label className={labelClass}>Dias/semana</label>
 <input id="goal-days-week" type="number" name="daysWorkedPerWeek" value={formData.daysWorkedPerWeek} onChange={handleInputChange} className={inputClass} />
 </div>
 <div>
 <label className={labelClass}>Nº semanas</label>
 <input id="goal-weeks" type="number" name="numberOfWeeks" value={formData.numberOfWeeks} onChange={handleInputChange} className={inputClass} />
 </div>
 <div>
 <label className={labelClass}>Semana</label>
 <input id="goal-week" type="number" name="week" value={formData.week} onChange={handleInputChange} className={inputClass} />
 </div>
 <div>
 <label className={labelClass}>Dia</label>
 <input id="goal-day" type="number" name="day" value={formData.day} onChange={handleInputChange} className={inputClass} />
 </div>
 </div>

 {/* Actions */}
 <div className="flex gap-3 pt-2">
 <button type="button" onClick={onClose} className="flex-1 ios-btn-tinted">
 Cancelar
 </button>
 <button type="submit" className="flex-1 ios-btn">
 Salvar
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}

export default GoalModal;
