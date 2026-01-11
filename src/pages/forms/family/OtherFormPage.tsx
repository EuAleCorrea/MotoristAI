import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamilyExpensesStore, OtherExpense } from '../../../store/familyExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { MoreHorizontal, Tag, Calendar } from 'lucide-react';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

const OtherFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useFamilyExpensesStore();

  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [recurrence, setRecurrence] = useState('Única');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.category === 'Outras') as OtherExpense | undefined;
      if (expenseToEdit) {
        setCustomCategory(expenseToEdit.customCategory);
        setDescription(expenseToEdit.description);
        setTotalValue(expenseToEdit.totalValue.toString());
        setDate(new Date(expenseToEdit.date).toISOString().slice(0, 10));
        setPaymentMethod(expenseToEdit.paymentMethod);
        setRecurrence(expenseToEdit.recurrence);
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(totalValue);
    if (!customCategory.trim()) {
      alert('O campo "Categoria Personalizada" é obrigatório.');
      return;
    }
    if (isNaN(value) || value <= 0) {
      alert('O valor da despesa deve ser um número positivo.');
      return;
    }

    const expenseData: Omit<OtherExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      category: 'Outras',
      customCategory,
      description,
      totalValue: value,
      date,
      paymentMethod,
      recurrence: recurrence as OtherExpense['recurrence'],
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
    <FormPageLayout title={isEditing ? 'Editar Outra Despesa' : 'Outra Despesa'} icon={MoreHorizontal}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes da Despesa">
          <FormInput id="customCategory" label="Categoria Personalizada" type="text" placeholder="Ex: Doação, Presente" value={customCategory} onChange={e => setCustomCategory(e.target.value)} required icon={<Tag className="w-4 h-4 text-gray-400" />} />
          <FormInput id="description" label="Descrição" type="text" placeholder="Ex: Presente de aniversário para..." value={description} onChange={e => setDescription(e.target.value)} required />
          <FormInput id="totalValue" label="Valor (R$)" type="number" step="0.01" placeholder="0,00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
          <FormInput id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
        </FormSection>

        <FormSection title="Pagamento e Recorrência">
          <FormSelect id="paymentMethod" label="Forma de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option>Pix</option>
            <option>Cartão</option>
            <option>Dinheiro</option>
            <option>Outro</option>
          </FormSelect>
          <FormSelect id="recurrence" label="Recorrência" value={recurrence} onChange={e => setRecurrence(e.target.value)}>
            <option>Única</option>
            <option>Mensal</option>
            <option>Anual</option>
          </FormSelect>
        </FormSection>

        <FormSection title="Observações">
          <FormTextArea id="notes" label="Notas Adicionais" placeholder="Detalhes sobre a despesa..." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default OtherFormPage;
