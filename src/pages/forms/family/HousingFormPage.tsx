import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamilyExpensesStore, HousingExpense } from '../../../store/familyExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import MoneyInput from '../../../components/forms/MoneyInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { Home, Calendar } from 'lucide-react';
import { isBefore, startOfToday } from 'date-fns';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

type Status = 'Pago' | 'Pendente';

const HousingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useFamilyExpensesStore();

  const [expenseType, setExpenseType] = useState('Aluguel');
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentDate, setPaymentDate] = useState('');
  const [status, setStatus] = useState<Status>('Pendente');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [recurrence, setRecurrence] = useState('Única');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.category === 'Moradia') as HousingExpense | undefined;
      if (expenseToEdit) {
        setExpenseType(expenseToEdit.expenseType);
        setDescription(expenseToEdit.description);
        setTotalValue(expenseToEdit.totalValue.toString());
        setDueDate(new Date(expenseToEdit.dueDate).toISOString().slice(0, 10));
        setPaymentDate(expenseToEdit.paymentDate ? new Date(expenseToEdit.paymentDate).toISOString().slice(0, 10) : '');
        setStatus(expenseToEdit.status);
        setPaymentMethod(expenseToEdit.paymentMethod);
        setRecurrence(expenseToEdit.recurrence);
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  useEffect(() => {
    if (!paymentDate && dueDate && isBefore(new Date(dueDate), startOfToday())) {
      setStatus('Pendente'); // Should be 'Vencido' but we only have Pendente/Pago
    } else if (paymentDate) {
      setStatus('Pago');
    } else {
      setStatus('Pendente');
    }
  }, [paymentDate, dueDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(totalValue);
    if (isNaN(value) || value <= 0) {
      alert('O valor da despesa deve ser um número positivo.');
      return;
    }

    const expenseData: Omit<HousingExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      category: 'Moradia',
      expenseType: expenseType as HousingExpense['expenseType'],
      description,
      totalValue: value,
      dueDate: new Date(dueDate + 'T12:00:00').toISOString(),
      paymentDate: paymentDate ? new Date(paymentDate + 'T12:00:00').toISOString() : undefined,
      status,
      paymentMethod,
      recurrence: recurrence as HousingExpense['recurrence'],
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
    <FormPageLayout title={isEditing ? 'Editar Despesa de Moradia' : 'Despesa de Moradia'} icon={Home}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes da Despesa">
          <FormSelect id="expenseType" label="Tipo de Despesa" value={expenseType} onChange={e => setExpenseType(e.target.value)}>
            <option>Aluguel</option>
            <option>Financiamento</option>
            <option>Condomínio</option>
            <option>Energia</option>
            <option>Água</option>
            <option>Internet</option>
            <option>Manutenção</option>
            <option>Outros</option>
          </FormSelect>
          <FormInput id="description" label="Descrição" type="text" placeholder="Ex: Conta de luz" value={description} onChange={e => setDescription(e.target.value)} required />
          <MoneyInput id="totalValue" label="Valor (R$)" placeholder="0,00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
          <FormSelect id="recurrence" label="Recorrência" value={recurrence} onChange={e => setRecurrence(e.target.value)}>
            <option>Única</option>
            <option>Mensal</option>
            <option>Anual</option>
          </FormSelect>
        </FormSection>

        <FormSection title="Pagamento e Prazos">
          <FormInput id="dueDate" label="Data de Vencimento" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <FormInput id="paymentDate" label="Data de Pagamento (Opcional)" type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <FormSelect id="status" label="Status" value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option>Pendente</option>
            <option>Pago</option>
          </FormSelect>
          <FormSelect id="paymentMethod" label="Forma de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option>Pix</option>
            <option>Cartão</option>
            <option>Débito automático</option>
            <option>Dinheiro</option>
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

export default HousingFormPage;
