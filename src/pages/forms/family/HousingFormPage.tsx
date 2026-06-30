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
import { parseAmount } from '../../../utils/formatters';

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
 const value = parseAmount(totalValue);
 if (value === null || value <= 0) {
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
  <FormSelect
    id="expenseType"
    label="Tipo de Despesa"
    value={expenseType}
    onValueChange={setExpenseType}
    options={[
      { value: 'Aluguel', label: 'Aluguel' },
      { value: 'Financiamento', label: 'Financiamento' },
      { value: 'Condomínio', label: 'Condomínio' },
      { value: 'Energia', label: 'Energia' },
      { value: 'Água', label: 'Água' },
      { value: 'Internet', label: 'Internet' },
      { value: 'Manutenção', label: 'Manutenção' },
      { value: 'Outros', label: 'Outros' },
    ]}
  />
 <FormInput id="description" label="Descrição" type="text" placeholder="Ex: Conta de luz" value={description} onChange={e => setDescription(e.target.value)} required />
 <MoneyInput id="totalValue" label="Valor (R$)" placeholder="0,00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<span className="text-sm font-semibold text-[var(--ios-text-secondary)]">R$</span>} />
  <FormSelect
    id="recurrence"
    label="Recorrência"
    value={recurrence}
    onValueChange={setRecurrence}
    options={[
      { value: 'Única', label: 'Única' },
      { value: 'Mensal', label: 'Mensal' },
      { value: 'Anual', label: 'Anual' },
    ]}
  />
 </FormSection>

 <FormSection title="Pagamento e Prazos">
 <FormInput id="dueDate" label="Data de Vencimento" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-[var(--ios-text-tertiary)]" />} />
 <FormInput id="paymentDate" label="Data de Pagamento (Opcional)" type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} icon={<Calendar className="w-4 h-4 text-[var(--ios-text-tertiary)]" />} />
  <FormSelect
    id="status"
    label="Status"
    value={status}
    onValueChange={(val) => setStatus(val as Status)}
    options={[
      { value: 'Pendente', label: 'Pendente' },
      { value: 'Pago', label: 'Pago' },
    ]}
  />
  <FormSelect
    id="paymentMethod"
    label="Forma de Pagamento"
    value={paymentMethod}
    onValueChange={setPaymentMethod}
    options={[
      { value: 'Pix', label: 'Pix' },
      { value: 'Cartão', label: 'Cartão' },
      { value: 'Débito automático', label: 'Débito automático' },
      { value: 'Dinheiro', label: 'Dinheiro' },
    ]}
  />
 </FormSection>

 <FormSection title="Observações">
 <FormTextArea id="notes" label="Notas Adicionais" placeholder="Detalhes sobre a despesa..." value={notes} onChange={e => setNotes(e.target.value)} />
 </FormSection>

 <div className="pt-6 flex items-center gap-4">
 <button type="button" onClick={() => navigate(-1)} className="flex-1 ios-btn-tinted">Cancelar</button>
 <button type="submit" className="flex-1 ios-btn">Salvar</button>
 </div>
 </form>
 </FormPageLayout>
 );
};

export default HousingFormPage;
