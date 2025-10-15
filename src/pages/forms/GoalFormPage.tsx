import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoalStore } from '../../store/goalStore';
import { format } from 'date-fns';

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(0, i), 'MMMM'),
}));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

function GoalFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { goals, addGoal, updateGoal } = useGoalStore();
  const goalToEdit = isEditing ? goals.find(g => g.id === id) : undefined;

  const [formData, setFormData] = useState({
    year: currentYear,
    month: new Date().getMonth() + 1,
    daysWorkedPerWeek: '',
    revenue: '',
    profit: '',
    expense: '',
    numberOfWeeks: '',
    week: '',
    day: '',
  });

  useEffect(() => {
    if (isEditing && goalToEdit) {
      setFormData({
        year: goalToEdit.year,
        month: goalToEdit.month,
        daysWorkedPerWeek: goalToEdit.daysWorkedPerWeek?.toString() || '',
        revenue: goalToEdit.revenue?.toString() || '',
        profit: goalToEdit.profit?.toString() || '',
        expense: goalToEdit.expense?.toString() || '',
        numberOfWeeks: goalToEdit.numberOfWeeks?.toString() || '',
        week: goalToEdit.week?.toString() || '',
        day: goalToEdit.day?.toString() || '',
      });
    } else if (isEditing && !goalToEdit) {
      navigate('/metas');
    }
  }, [id, isEditing, goalToEdit, navigate]);

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

    if (isEditing && id) {
      updateGoal(id, goalData);
    } else {
      addGoal(goalData);
    }
    navigate('/metas');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default GoalFormPage;
