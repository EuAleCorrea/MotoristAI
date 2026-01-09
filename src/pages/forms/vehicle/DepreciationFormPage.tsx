import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleExpensesStore, DepreciationExpense } from '../../../store/vehicleExpensesStore';
import FormInput from '../../../components/forms/FormInput';
import FormTextArea from '../../../components/forms/FormTextArea';
import { TrendingDown, Calendar, DollarSign } from 'lucide-react';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

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
      if (expenseToEdit) {
        setPurchaseValue(expenseToEdit.purchaseValue.toString());
        setPurchaseDate(new Date(expenseToEdit.purchaseDate).toISOString().slice(0, 10));
        setCurrentValue(expenseToEdit.currentValue.toString());
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
      purchaseValue: parseFloat(purchaseValue) || 0,
      currentValue: parseFloat(currentValue) || 0,
      purchaseDate,
      evaluationDate: new Date().toISOString(),
      depreciationPercentage,
      notes: notes || undefined,
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
          <FormInput id="purchaseValue" name="purchaseValue" label="Valor de Compra (R$)" type="number" step="0.01" placeholder="75000.00" value={purchaseValue} onChange={e => setPurchaseValue(e.target.value)} required icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
          <FormInput id="purchaseDate" name="purchaseDate" label="Data de Compra" type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <FormInput id="currentValue" name="currentValue" label="Valor Atual Estimado (R$)" type="number" step="0.01" placeholder="60000.00" value={currentValue} onChange={e => setCurrentValue(e.target.value)} required icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
          <FormTextArea id="notes" name="notes" label="Observações (Opcional)" placeholder="Ex: Valor baseado na tabela FIPE." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <div className="bg-danger-50 dark:bg-red-900 border-l-4 border-danger-500 text-danger-800 dark:text-red-100 p-4 rounded-r-lg shadow-sm text-center">
          <p className="font-semibold text-lg">Desvalorização</p>
          <p className="text-4xl font-bold mt-1">{depreciationPercentage.toFixed(2)}%</p>
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
