import { useState } from 'react';
import { X } from 'lucide-react';
import { useGoalStore, Goal } from '../store/goalStore';
import { format } from 'date-fns';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {goal ? 'Editar Meta' : 'Nova Meta'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
              <select name="year" value={formData.year} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
              <select name="month" value={formData.month} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dias trabalhados/semana</label>
              <input type="number" name="daysWorkedPerWeek" value={formData.daysWorkedPerWeek} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faturamento (R$)</label>
              <input type="number" step="0.01" name="revenue" value={formData.revenue} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lucro (R$)</label>
              <input type="number" step="0.01" name="profit" value={formData.profit} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Despesa (R$)</label>
              <input type="number" step="0.01" name="expense" value={formData.expense} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de semanas</label>
              <input type="number" name="numberOfWeeks" value={formData.numberOfWeeks} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semana</label>
              <input type="number" name="week" value={formData.week} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dia</label>
              <input type="number" name="day" value={formData.day} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div className="flex space-x-3 pt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalModal;
