import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamilyExpensesStore, HealthExpense } from '../../../store/familyExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import MoneyInput from '../../../components/forms/MoneyInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { HeartPulse, Calendar, Building } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import FormPageLayout from '../../../components/layouts/FormPageLayout';
import { formatCurrency } from '../../../utils/formatters';

const HealthFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useFamilyExpensesStore();

  const [expenseType, setExpenseType] = useState('Consulta');
  const [provider, setProvider] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Cartão');
  const [hasReimbursement, setHasReimbursement] = useState(false);
  const [reimbursementValue, setReimbursementValue] = useState('');
  const [reimbursementDate, setReimbursementDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.category === 'Saúde') as HealthExpense | undefined;
      if (expenseToEdit) {
        setExpenseType(expenseToEdit.expenseType);
        setProvider(expenseToEdit.provider);
        setTotalValue(expenseToEdit.totalValue.toString());
        setDate(new Date(expenseToEdit.date).toISOString().slice(0, 10));
        setPaymentMethod(expenseToEdit.paymentMethod);
        setHasReimbursement(expenseToEdit.hasReimbursement);
        setReimbursementValue(expenseToEdit.reimbursementValue?.toString() || '');
        setReimbursementDate(expenseToEdit.reimbursementDate ? new Date(expenseToEdit.reimbursementDate).toISOString().slice(0, 10) : '');
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  const netValue = useMemo(() => {
    const total = parseFloat(totalValue) || 0;
    const reimbursement = hasReimbursement ? (parseFloat(reimbursementValue) || 0) : 0;
    return total - reimbursement;
  }, [totalValue, reimbursementValue, hasReimbursement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(totalValue);
    if (isNaN(value) || value <= 0) {
      alert('O valor da despesa deve ser um número positivo.');
      return;
    }
    if (netValue < 0) {
      alert('O valor líquido (Valor - Reembolso) não pode ser negativo.');
      return;
    }

    const expenseData: Omit<HealthExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      category: 'Saúde',
      expenseType: expenseType as HealthExpense['expenseType'],
      provider,
      description: `${expenseType} - ${provider}`,
      totalValue: value,
      date: new Date(date + 'T12:00:00').toISOString(),
      paymentMethod,
      hasReimbursement,
      reimbursementValue: hasReimbursement ? (parseFloat(reimbursementValue) || undefined) : undefined,
      reimbursementDate: hasReimbursement ? (reimbursementDate ? new Date(reimbursementDate + 'T12:00:00').toISOString() : undefined) : undefined,
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
    <FormPageLayout title={isEditing ? 'Editar Despesa de Saúde' : 'Despesa de Saúde'} icon={HeartPulse}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes da Despesa">
          <FormSelect id="expenseType" label="Tipo de Despesa" value={expenseType} onChange={e => setExpenseType(e.target.value)}>
            <option>Plano de Saúde</option>
            <option>Consulta</option>
            <option>Exame</option>
            <option>Medicamento</option>
            <option>Odontologia</option>
            <option>Academia</option>
            <option>Outros</option>
          </FormSelect>
          <FormInput id="provider" label="Profissional / Clínica / Farmácia" type="text" placeholder="Ex: Dr. João Silva" value={provider} onChange={e => setProvider(e.target.value)} required icon={<Building className="w-4 h-4 text-gray-400" />} />
          <MoneyInput id="totalValue" label="Valor (R$)" placeholder="0,00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
          <FormInput id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
        </FormSection>

        <FormSection title="Pagamento e Reembolso">
          <FormSelect id="paymentMethod" label="Forma de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option>Pix</option>
            <option>Cartão</option>
            <option>Convênio</option>
            <option>Dinheiro</option>
          </FormSelect>
          <div className="flex items-center justify-between col-span-1 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Possui reembolso?</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={hasReimbursement} onChange={() => setHasReimbursement(!hasReimbursement)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <AnimatePresence>
            {hasReimbursement && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
              >
                <MoneyInput id="reimbursementValue" label="Valor do Reembolso (R$)" placeholder="0,00" value={reimbursementValue} onChange={e => setReimbursementValue(e.target.value)} icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
                <FormInput id="reimbursementDate" label="Data do Reembolso" type="date" value={reimbursementDate} onChange={e => setReimbursementDate(e.target.value)} icon={<Calendar className="w-4 h-4 text-gray-400" />} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Valor Líquido (Custo Efetivo)</p>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(netValue)}</p>
          </div>
        </FormSection>

        <FormSection title="Observações">
          <FormTextArea id="notes" label="Notas Adicionais" placeholder="Detalhes sobre a consulta, exame, etc." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default HealthFormPage;
