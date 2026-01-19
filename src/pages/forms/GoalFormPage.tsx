import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoalStore } from '../../store/goalStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FormPageLayout from '../../components/layouts/FormPageLayout';
import { Target, Hash, AlertTriangle, Edit3, RefreshCw, X } from 'lucide-react';
import FormSection from '../../components/forms/FormSection';
import FormInput from '../../components/forms/FormInput';
import MoneyInput from '../../components/forms/MoneyInput';
import FormSelect from '../../components/forms/FormSelect';
import { getWorkingWeeksInMonth } from '../../utils/dateHelpers';

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(2000, i), 'MMMM', { locale: ptBR }),
}));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + 5 - i);

// Modal de confirmação para meta duplicada
interface DuplicateModalProps {
  isOpen: boolean;
  monthName: string;
  year: number;
  onEdit: () => void;
  onOverwrite: () => void;
  onCancel: () => void;
}

function DuplicateModal({ isOpen, monthName, year, onEdit, onOverwrite, onCancel }: DuplicateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Meta já existe!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {monthName} de {year}
            </p>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Você já possui uma meta cadastrada para este mês. O que deseja fazer?
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-sm"
          >
            <Edit3 className="w-5 h-5" />
            Editar meta existente
          </button>

          <button
            onClick={onOverwrite}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition shadow-sm"
          >
            <RefreshCw className="w-5 h-5" />
            Sobrescrever com novos valores
          </button>

          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { goals, addGoal, updateGoal, getGoalByMonth } = useGoalStore();
  const goalToEdit = isEditing ? goals.find(g => g.id === id) : undefined;

  const [formData, setFormData] = useState({
    daysWorkedPerWeek: '5',
    year: currentYear.toString(),
    month: (new Date().getMonth() + 1).toString(),
    revenue: '',
    profit: '',
    expense: '',
    week: '0',
  });

  // Estado para o modal de duplicidade
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [existingGoalId, setExistingGoalId] = useState<string | null>(null);
  const [pendingGoalData, setPendingGoalData] = useState<any>(null);

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
      navigate('/metas');
    } else {
      // Check if goal already exists for this month/year
      const existingGoal = getGoalByMonth(goalData.year, goalData.month);
      if (existingGoal) {
        // Mostrar modal de confirmação
        setExistingGoalId(existingGoal.id);
        setPendingGoalData(goalData);
        setShowDuplicateModal(true);
        return;
      }
      addGoal(goalData);
      navigate('/metas');
    }
  };

  // Handlers do modal
  const handleEditExisting = () => {
    setShowDuplicateModal(false);
    if (existingGoalId) {
      navigate(`/metas/${existingGoalId}/editar`);
    }
  };

  const handleOverwrite = () => {
    setShowDuplicateModal(false);
    if (existingGoalId && pendingGoalData) {
      updateGoal(existingGoalId, pendingGoalData);
      navigate('/metas');
    }
  };

  const handleCancelModal = () => {
    setShowDuplicateModal(false);
    setExistingGoalId(null);
    setPendingGoalData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Lógica de cálculo automático para Lucro e Despesa
      const revenue = Number(newData.revenue) || 0;

      if (name === 'profit' && value !== '') {
        // Se preencheu Lucro, calcula Despesa automaticamente
        const profit = Number(value) || 0;
        newData.expense = revenue > 0 ? (revenue - profit).toString() : '';
      } else if (name === 'expense' && value !== '') {
        // Se preencheu Despesa, calcula Lucro automaticamente
        const expense = Number(value) || 0;
        newData.profit = revenue > 0 ? (revenue - expense).toString() : '';
      } else if (name === 'revenue') {
        // Se mudou Faturamento, recalcula baseado no que já está preenchido
        const newRevenue = Number(value) || 0;
        if (prev.profit !== '' && prev.expense === '') {
          // Lucro já está preenchido, recalcula Despesa
          const profit = Number(prev.profit) || 0;
          newData.expense = newRevenue > 0 ? (newRevenue - profit).toString() : '';
        } else if (prev.expense !== '' && prev.profit === '') {
          // Despesa já está preenchida, recalcula Lucro
          const expense = Number(prev.expense) || 0;
          newData.profit = newRevenue > 0 ? (newRevenue - expense).toString() : '';
        } else if (prev.profit !== '' && prev.expense !== '') {
          // Ambos preenchidos, mantém Lucro e recalcula Despesa
          const profit = Number(prev.profit) || 0;
          newData.expense = newRevenue > 0 ? (newRevenue - profit).toString() : '';
        }
      }

      return newData;
    });
  };

  const selectedMonthName = months.find(m => m.value === Number(formData.month))?.label || '';

  return (
    <>
      <DuplicateModal
        isOpen={showDuplicateModal}
        monthName={selectedMonthName}
        year={Number(formData.year)}
        onEdit={handleEditExisting}
        onOverwrite={handleOverwrite}
        onCancel={handleCancelModal}
      />

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

          <FormSection title="Valores da Meta Mensal">
            <MoneyInput
              id="revenue"
              name="revenue"
              label="Faturamento Mensal (R$)"
              value={formData.revenue}
              onChange={handleInputChange}
              placeholder="0,00"
              icon={<span className="text-sm font-semibold text-gray-500">R$</span>}
            />
            <MoneyInput
              id="profit"
              name="profit"
              label="Lucro Mensal (R$)"
              value={formData.profit}
              onChange={handleInputChange}
              placeholder="0,00"
              icon={<span className="text-sm font-semibold text-gray-500">R$</span>}
            />
            <MoneyInput
              id="expense"
              name="expense"
              label="Despesa Mensal (R$)"
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
    </>
  );
}

export default GoalFormPage;

