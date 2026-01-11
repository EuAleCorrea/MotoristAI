import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleExpensesStore, DepreciationExpense } from '../../../store/vehicleExpensesStore';
import FormInput from '../../../components/forms/FormInput';
import FormTextArea from '../../../components/forms/FormTextArea';
import { TrendingDown, Calendar } from 'lucide-react';
import FormPageLayout from '../../../components/layouts/FormPageLayout';
import { formatCurrency, formatNumber } from '../../../utils/formatHelpers';

const DepreciationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useVehicleExpensesStore();

  const [purchaseValue, setPurchaseValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.type === 'depreciation') as DepreciationExpense | undefined;
      if (expenseToEdit && expenseToEdit.details) {
        setPurchaseValue(expenseToEdit.details.purchaseValue?.toString() || '');
        setPurchaseDate(expenseToEdit.details.purchaseDate ? new Date(expenseToEdit.details.purchaseDate).toISOString().slice(0, 10) : '');
        setCurrentValue(expenseToEdit.details.currentValue?.toString() || '');
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  const depreciationPercentage = useMemo(() => {
    const pValue = parseFloat(purchaseValue);
    const cValue = parseFloat(currentValue);

    if (isNaN(pValue) || isNaN(cValue) || pValue <= 0) {
      return 0;
    }

    return ((pValue - cValue) / pValue) * 100;
  }, [purchaseValue, currentValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData: Omit<DepreciationExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      type: 'depreciation',
      vehicleId: 'default',
      date: new Date().toISOString(),
      totalValue: (parseFloat(purchaseValue) || 0) - (parseFloat(currentValue) || 0),
      notes: notes || undefined,
      details: {
        purchaseValue: parseFloat(purchaseValue) || 0,
        currentValue: parseFloat(currentValue) || 0,
        purchaseDate,
        evaluationDate: new Date().toISOString(),
        depreciationPercentage,
      }
    };

    if (isEditing && id) {
      updateExpense(id, expenseData);
    } else {
      addExpense(expenseData);
    }
    navigate(-1);
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Depreciação' : 'Cálculo de Depreciação'} icon={TrendingDown}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 space-y-6">
          <FormInput id="purchaseValue" name="purchaseValue" label="Valor de Compra (R$)" type="number" step="0.01" placeholder="0,00" value={purchaseValue} onChange={e => setPurchaseValue(e.target.value)} required icon={<span className="text-sm font-semibold text-gray-500 dark:text-gray-400">R$</span>} />
          <FormInput id="purchaseDate" name="purchaseDate" label="Data de Compra" type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <FormInput id="currentValue" name="currentValue" label="Valor Atual Estimado (R$)" type="number" step="0.01" placeholder="0,00" value={currentValue} onChange={e => setCurrentValue(e.target.value)} required icon={<span className="text-sm font-semibold text-gray-500 dark:text-gray-400">R$</span>} />
          <FormTextArea id="notes" name="notes" label="Observações (Opcional)" placeholder="Ex: Valor baseado na tabela FIPE." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center shadow-inner">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
            Desvalorização Estimada
          </span>
          <div className="relative">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
              {formatNumber(depreciationPercentage, 2)}%
            </div>
            <div className="absolute -right-8 -top-2">
              <TrendingDown className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-sm text-gray-400 dark:text-gray-500">Valor depreciado:</span>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
              {formatCurrency((parseFloat(purchaseValue) || 0) - (parseFloat(currentValue) || 0))}
            </span>
          </div>
        </div>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default DepreciationFormPage;
