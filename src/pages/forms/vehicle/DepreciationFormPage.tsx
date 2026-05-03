import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleExpensesStore, DepreciationExpense } from '../../../store/vehicleExpensesStore';
import FormInput from '../../../components/forms/FormInput';
import MoneyInput from '../../../components/forms/MoneyInput';
import FormTextArea from '../../../components/forms/FormTextArea';
import { TrendingDown, Calendar } from 'lucide-react';
import FormPageLayout from '../../../components/layouts/FormPageLayout';
import VehicleSelector from '../../../components/forms/VehicleSelector';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

const DepreciationFormPage: React.FC = () => {
 const navigate = useNavigate();
 const { id } = useParams<{ id: string }>();
 const isEditing = !!id;

 const { expenses, addExpense, updateExpense } = useVehicleExpensesStore();

 const [purchaseValue, setPurchaseValue] = useState('');
 const [vehicleId, setVehicleId] = useState('');
 const [purchaseDate, setPurchaseDate] = useState('');
 const [currentValue, setCurrentValue] = useState('');
 const [notes, setNotes] = useState('');

 useEffect(() => {
 if (isEditing) {
 const expenseToEdit = expenses.find(e => e.id === id && e.type === 'depreciation') as DepreciationExpense | undefined;
 if (expenseToEdit && expenseToEdit.details) {
 setPurchaseValue(expenseToEdit.details.purchaseValue?.toString() || '');
 setVehicleId(expenseToEdit.vehicleId || '');
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
 vehicleId: vehicleId || undefined,
 date: new Date().toISOString().split('T')[0] + 'T12:00:00',
 totalValue: (parseFloat(purchaseValue) || 0) - (parseFloat(currentValue) || 0),
 notes: notes || undefined,
 details: {
 purchaseValue: parseFloat(purchaseValue) || 0,
 currentValue: parseFloat(currentValue) || 0,
 purchaseDate: purchaseDate + 'T12:00:00',
 evaluationDate: new Date().toISOString().split('T')[0] + 'T12:00:00',
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
 <div className="bg-[var(--ios-card)] rounded-xl shadow-sm p-4 sm:p-6 space-y-6">
 <VehicleSelector value={vehicleId} onChange={setVehicleId} />
 <MoneyInput id="purchaseValue" name="purchaseValue" label="Valor de Compra (R$)" placeholder="0,00" value={purchaseValue} onChange={e => setPurchaseValue(e.target.value)} required icon={<span className="text-sm font-semibold text-[var(--ios-text-secondary)]">R$</span>} />
 <FormInput id="purchaseDate" name="purchaseDate" label="Data de Compra" type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-[var(--ios-text-tertiary)]" />} />
 <MoneyInput id="currentValue" name="currentValue" label="Valor Atual Estimado (R$)" placeholder="0,00" value={currentValue} onChange={e => setCurrentValue(e.target.value)} required icon={<span className="text-sm font-semibold text-[var(--ios-text-secondary)]">R$</span>} />
 <FormTextArea id="notes" name="notes" label="Observações (Opcional)" placeholder="Ex: Valor baseado na tabela FIPE." value={notes} onChange={e => setNotes(e.target.value)} />
 </div>

 <div className="bg-gradient-to-br from-[var(--ios-bg)] to-[var(--ios-bg)] border border-[var(--ios-separator)] rounded-2xl p-8 flex flex-col items-center justify-center shadow-inner">
 <span className="text-xs font-bold uppercase tracking-widest text-[var(--ios-text-secondary)] mb-2">
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
 <span className="text-sm text-[var(--ios-text-tertiary)]">Valor depreciado:</span>
 <span className="text-lg font-bold text-[var(--ios-text)] ">
 {formatCurrency((parseFloat(purchaseValue) || 0) - (parseFloat(currentValue) || 0))}
 </span>
 </div>
 </div>

 <div className="pt-6 flex items-center gap-4">
 <button type="button" onClick={() => navigate(-1)} className="flex-1 ios-btn-tinted">Cancelar</button>
 <button type="submit" className="flex-1 ios-btn">Salvar</button>
 </div>
 </form>
 </FormPageLayout>
 );
};

export default DepreciationFormPage;
