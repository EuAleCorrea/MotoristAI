import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleExpensesStore, FinanceExpense } from '../../../store/vehicleExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import MoneyInput from '../../../components/forms/MoneyInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { Landmark, Calendar, Paperclip, AlertTriangle, Building } from 'lucide-react';
import { isBefore, addDays, isToday, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FormPageLayout from '../../../components/layouts/FormPageLayout';
import VehicleSelector from '../../../components/forms/VehicleSelector';
import { formatCurrency } from '../../../utils/formatters';

type CostType = 'Financiamento' | 'Seguro' | 'IPVA' | 'Licenciamento' | 'Multa' | 'Outros';
type Status = 'Pago' | 'Pendente';

const VehicleFinanceFormPage: React.FC = () => {
 const navigate = useNavigate();
 const { id } = useParams<{ id: string }>();
 const isEditing = !!id;

 const { expenses, addExpense, updateExpense } = useVehicleExpensesStore();

 const [costType, setCostType] = useState<CostType>('Financiamento');
 const [vehicleId, setVehicleId] = useState('');
 const [provider, setProvider] = useState('');
 const [totalValue, setTotalValue] = useState('');
 const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
 const [status, setStatus] = useState<Status>('Pendente');
 const [notes, setNotes] = useState('');
 const [paymentProof, setPaymentProof] = useState<File | null>(null);

 useEffect(() => {
 if (isEditing) {
 const expenseToEdit = expenses.find(e => e.id === id && e.type === 'finance') as FinanceExpense | undefined;
 if (expenseToEdit) {
 setCostType(expenseToEdit.details.costType);
 setVehicleId(expenseToEdit.vehicleId || '');
 setProvider(expenseToEdit.details.description.split(' - ')[1] || '');
 setTotalValue(expenseToEdit.totalValue.toString());
 setDueDate(new Date(expenseToEdit.details.dueDate).toISOString().slice(0, 10));
 setStatus(expenseToEdit.details.status);
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
 return `${formatCurrency(value)} — ${costType} — ${status}`;;
 }, [totalValue, costType, status]);

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
  const expenseData: Omit<FinanceExpense, 'id' | 'createdAt' | 'updatedAt'> = {
 type: 'finance',
 vehicleId: vehicleId || undefined,
 date: new Date(dueDate + 'T12:00:00').toISOString(), // Usando dueDate como base para 'date' no registro principal
 totalValue: parseFloat(totalValue) || 0,
 notes: notes || undefined,
 details: {
 costType,
 description: `${costType} - ${provider}`,
 dueDate: new Date(dueDate + 'T12:00:00').toISOString(),
 status,
 }
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
 <VehicleSelector value={vehicleId} onChange={setVehicleId} />
 <FormSelect id="costType" name="costType" label="Tipo de Custo" value={costType} onChange={e => setCostType(e.target.value as CostType)}>
 <option>Financiamento</option>
 <option>Seguro</option>
 <option>IPVA</option>
 <option>Licenciamento</option>
 <option>Multa</option>
 <option>Outros</option>
 </FormSelect>
 <FormInput id="provider" name="provider" label="Instituição / Seguradora" type="text" placeholder="Ex: Banco XYZ" value={provider} onChange={e => setProvider(e.target.value)} required icon={<Building className="w-4 h-4 text-[var(--ios-text-tertiary)]" />} />
 <MoneyInput id="totalValue" name="totalValue" label="Valor (R$)" placeholder="0,00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<span className="text-sm font-semibold text-[var(--ios-text-secondary)]">R$</span>} />
 <FormInput id="dueDate" name="dueDate" label="Vencimento" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-[var(--ios-text-tertiary)]" />} />
 <FormSelect id="status" name="status" label="Situação" value={status} onChange={e => setStatus(e.target.value as Status)}>
 <option>Pendente</option>
 <option>Pago</option>
 </FormSelect>
 <div className="md:col-span-2">
 <label className="block text-sm font-medium text-[var(--ios-text)] mb-1.5">Comprovante (Opcional)</label>
 <label htmlFor="payment-proof-upload" className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-[var(--ios-separator)] rounded-lg cursor-pointer hover:border-[var(--ios-accent)] hover:bg-[var(--ios-fill)] dark:hover:bg-primary-900/10 transition">
 <Paperclip className="w-5 h-5 text-[var(--ios-text-secondary)]" />
 <span className="text-sm font-medium text-[var(--ios-text-secondary)] ml-2">{paymentProof ? paymentProof.name : 'Clique para anexar comprovante'}</span>
 </label>
 <input id="payment-proof-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
 <p className="text-xs text-[var(--ios-text-secondary)] mt-1">A funcionalidade de upload requer integração.</p>
 </div>
 <FormTextArea id="notes" name="notes" label="Observações (Opcional)" placeholder="Ex: Parcela 12 de 48." value={notes} onChange={e => setNotes(e.target.value)} />
 </FormSection>

 {dueDateAlert && (
 <div className={`flex items-center p-4 rounded-lg ${dueDateAlert.level === 'danger' ? 'bg-[rgba(255,59,48,0.08)] dark:bg-red-900 text-danger-700 dark:text-red-100' : 'bg-[rgba(255,204,0,0.08)] dark:bg-yellow-900 text-[var(--sys-yellow)] dark:text-yellow-100'}`}>
 <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
 <p className="text-sm font-medium">{dueDateAlert.message}</p>
 </div>
 )}

 <div className="bg-[var(--ios-fill)] border-l-4 border-[var(--ios-accent)] text-[var(--ios-text)] p-4 rounded-r-lg shadow-sm">
 <p className="font-semibold">Resumo</p>
 <p className="text-sm">{summary}</p>
 </div>

 <div className="pt-6 flex items-center gap-4">
 <button type="button" onClick={() => navigate(-1)} className="flex-1 ios-btn-tinted">Cancelar</button>
 <button type="submit" className="flex-1 ios-btn">Salvar</button>
 </div>
 </form>
 </FormPageLayout>
 );
};

export default VehicleFinanceFormPage;
