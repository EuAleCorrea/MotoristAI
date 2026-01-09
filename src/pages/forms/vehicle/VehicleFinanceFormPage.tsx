import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleExpensesStore, FinanceExpense } from '../../../store/vehicleExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { Landmark, Calendar, DollarSign, Paperclip, AlertTriangle, Building } from 'lucide-react';
import { isBefore, addDays, isToday, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

type CostType = 'Financiamento' | 'Seguro' | 'IPVA' | 'Licenciamento' | 'Outros';
type Status = 'Pago' | 'Em aberto';

const VehicleFinanceFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useVehicleExpensesStore();

  const [costType, setCostType] = useState<CostType>('Financiamento');
  const [provider, setProvider] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<Status>('Em aberto');
  const [notes, setNotes] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.type === 'finance') as FinanceExpense | undefined;
      if (expenseToEdit) {
        setCostType(expenseToEdit.costType);
        setProvider(expenseToEdit.description.split(' - ')[1] || '');
        setTotalValue(expenseToEdit.totalValue.toString());
        setDueDate(new Date(expenseToEdit.dueDate).toISOString().slice(0, 10));
        setStatus(expenseToEdit.status);
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  const dueDateAlert = useMemo(() => {
    if (status === 'Pago' || !dueDate) return null;
    const due = new Date(dueDate + 'T23:59:59'); // Compare with end of day
    const sevenDaysFromNow = addDays(new Date(), 7);
    if (isToday(due)) {
      return { message: 'Vence hoje!', level: 'danger' };
    }
    if (isBefore(due, new Date())) {
      return { message: `Vencido há ${formatDistanceToNow(due, { locale: ptBR, addSuffix: true })}.`, level: 'danger' };
    }
    if (isBefore(due, sevenDaysFromNow)) {
      return { message: `Vence em ${formatDistanceToNow(due, { locale: ptBR })}.`, level: 'warning' };
    }
    return null;
  }, [dueDate, status]);

  const summary = useMemo(() => {
    const value = parseFloat(totalValue) || 0;
    if (value === 0) return "Preencha os campos para ver o resumo.";
    return `R$ ${value.toFixed(2)} — ${costType} — ${status}`;
  }, [totalValue, costType, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData: Omit<FinanceExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      type: 'finance',
      vehicleId: 'default',
      costType,
      description: `${costType} - ${provider}`,
      totalValue: parseFloat(totalValue) || 0,
      dueDate,
      status,
      notes: notes || undefined,
    };

    if (isEditing && id) {
      updateExpense(id, expenseData);
    } else {
      addExpense(expenseData);
    }
    navigate(-1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Custo Financeiro' : 'Financeiro do Veículo'} icon={Landmark}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes do Custo">
          <FormSelect id="costType" name="costType" label="Tipo de Custo" value={costType} onChange={e => setCostType(e.target.value as CostType)}>
            <option>Financiamento</option>
            <option>Seguro</option>
            <option>IPVA</option>
            <option>Licenciamento</option>
            <option>Outros</option>
          </FormSelect>
          <FormInput id="provider" name="provider" label="Instituição / Seguradora" type="text" placeholder="Ex: Banco XYZ" value={provider} onChange={e => setProvider(e.target.value)} required icon={<Building className="w-4 h-4 text-gray-400" />} />
          <FormInput id="totalValue" name="totalValue" label="Valor (R$)" type="number" step="0.01" placeholder="1200.00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
          <FormInput id="dueDate" name="dueDate" label="Vencimento" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <FormSelect id="status" name="status" label="Situação" value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option>Em aberto</option>
            <option>Pago</option>
          </FormSelect>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Comprovante (Opcional)</label>
            <label htmlFor="payment-proof-upload" className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition">
              <Paperclip className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">{paymentProof ? paymentProof.name : 'Clique para anexar comprovante'}</span>
            </label>
            <input id="payment-proof-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">A funcionalidade de upload requer integração.</p>
          </div>
          <FormTextArea id="notes" name="notes" label="Observações (Opcional)" placeholder="Ex: Parcela 12 de 48." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

        {dueDateAlert && (
          <div className={`flex items-center p-4 rounded-lg ${dueDateAlert.level === 'danger' ? 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-200' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200'}`}>
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium">{dueDateAlert.message}</p>
          </div>
        )}

        <div className="bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 text-primary-800 dark:text-primary-200 p-4 rounded-r-lg shadow-sm">
          <p className="font-semibold">Resumo</p>
          <p className="text-sm">{summary}</p>
        </div>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default VehicleFinanceFormPage;
