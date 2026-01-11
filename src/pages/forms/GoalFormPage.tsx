import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoalStore } from '../../store/goalStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FormPageLayout from '../../components/layouts/FormPageLayout';
import { Target, Hash } from 'lucide-react';
import FormSection from '../../components/forms/FormSection';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import { getWorkingWeeksInMonth } from '../../utils/dateHelpers';

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(2000, i), 'MMMM', { locale: ptBR }),
}));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + 5 - i);

function GoalFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { goals, addGoal, updateGoal } = useGoalStore();
  const goalToEdit = isEditing ? goals.find(g => g.id === id) : undefined;

  const [formData, setFormData] = useState({
    daysWorkedPerWeek: '5',
    year: currentYear.toString(),
    month: (new Date().getMonth() + 1).toString(),
    revenue: '',
    profit: '',
    expense: '',
    week: '0', // This will be the calculated field
  });

  useEffect(() => {
    if (isEditing && goalToEdit) {
      setFormData({
        daysWorkedPerWeek: goalToEdit.daysWorkedPerWeek?.toString() || '5',
        year: goalToEdit.year.toString(),
        month: goalToEdit.month.toString(),
        revenue: goalToEdit.revenue?.toString() || '',
        profit: goalToEdit.profit?.toString() || '',
        expense: goalToEdit.expense?.toString() || '',
        week: goalToEdit.week?.toString() || '0',
      });
    } else if (isEditing && !goalToEdit) {
      navigate('/metas');
    }
  }, [id, isEditing, goalToEdit, navigate]);

  useEffect(() => {
    const yearNum = Number(formData.year);
    const monthNum = Number(formData.month);

    if (yearNum && monthNum) {
      const calculatedWeeks = getWorkingWeeksInMonth(yearNum, monthNum);
      setFormData(prev => ({ ...prev, week: calculatedWeeks.toString() }));
    } else {
      setFormData(prev => ({ ...prev, week: '0' }));
    }
  }, [formData.year, formData.month]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalData = {
      year: Number(formData.year),
      month: Number(formData.month),
      daysWorkedPerWeek: formData.daysWorkedPerWeek ? Number(formData.daysWorkedPerWeek) : undefined,
      revenue: formData.revenue ? Number(formData.revenue) : undefined,
      profit: formData.profit ? Number(formData.profit) : undefined,
      expense: formData.expense ? Number(formData.expense) : undefined,
      week: formData.week ? Number(formData.week) : undefined,
    };

    if (isEditing && id) {
      updateGoal(id, goalData);
    } else {
      addGoal(goalData);
    }
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Meta' : 'Nova Meta'} icon={Target}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Período e Parâmetros">
          <FormInput
            id="daysWorkedPerWeek"
            name="daysWorkedPerWeek"
            label="Dias trabalhados na semana"
            type="number"
            value={formData.daysWorkedPerWeek}
            onChange={handleInputChange}
          />
          <FormSelect id="year" name="year" label="Ano" value={formData.year} onChange={handleInputChange}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </FormSelect>
          <FormSelect id="month" name="month" label="Mês" value={formData.month} onChange={handleInputChange}>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </FormSelect>
          <FormInput
            id="week"
            name="week"
            label="Semanas no mês"
            type="number"
            value={formData.week}
            readOnly
            disabled
            icon={<Hash className="w-4 h-4 text-gray-400" />}
          />
        </FormSection>

        <FormSection title="Valores da Meta">
          <FormInput
            id="revenue"
            name="revenue"
            label="Faturamento (R$)"
            type="number"
            step="0.01"
            value={formData.revenue}
            onChange={handleInputChange}
            placeholder="0,00"
            icon={<span className="text-sm font-semibold text-gray-500">R$</span>}
          />
          <FormInput
            id="profit"
            name="profit"
            label="Lucro (R$)"
            type="number"
            step="0.01"
            value={formData.profit}
            onChange={handleInputChange}
            placeholder="0,00"
            icon={<span className="text-sm font-semibold text-gray-500">R$</span>}
          />
          <FormInput
            id="expense"
            name="expense"
            label="Despesa (R$)"
            type="number"
            step="0.01"
            value={formData.expense}
            onChange={handleInputChange}
            placeholder="0,00"
            icon={<span className="text-sm font-semibold text-gray-500">R$</span>}
          />
        </FormSection>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
}

export default GoalFormPage;
