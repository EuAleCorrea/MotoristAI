import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVehicleExpensesStore, TollParkingExpense } from '../../../store/vehicleExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import MoneyInput from '../../../components/forms/MoneyInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { ParkingCircle, Calendar, MapPin, Route, Clock } from 'lucide-react';
import FormPageLayout from '../../../components/layouts/FormPageLayout';
import { formatCurrency } from '../../../utils/formatters';

type ExpenseType = 'Pedágio' | 'Estacionamento';

const TollParkingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useVehicleExpensesStore();

  const [expenseType, setExpenseType] = useState<ExpenseType>('Pedágio');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalValue, setTotalValue] = useState('');
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tag');
  const [highway, setHighway] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.type === 'toll_parking') as TollParkingExpense | undefined;
      if (expenseToEdit) {
        setExpenseType(expenseToEdit.details.expenseType);
        setDate(new Date(expenseToEdit.date).toISOString().slice(0, 10));
        setTotalValue(expenseToEdit.totalValue.toString());
        setLocation(expenseToEdit.details.location || '');
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  const summary = useMemo(() => {
    const value = parseFloat(totalValue) || 0;
    if (value === 0 && !location) return "Preencha os campos para ver o resumo.";
    return `${formatCurrency(value)} em ${expenseType} — ${location || 'Local não informado'}`;;
  }, [totalValue, expenseType, location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData: Omit<TollParkingExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      type: 'toll_parking',
      vehicleId: 'default',
      date: new Date(date + 'T12:00:00').toISOString(),
      totalValue: parseFloat(totalValue) || 0,
      notes: notes || undefined,
      details: {
        expenseType,
        description: `${expenseType} - ${location}`,
        chargeType: 'Avulso',
        location: location || undefined,
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
    <FormPageLayout title={isEditing ? 'Editar Pedágio / Estacionamento' : 'Pedágio / Estacionamento'} icon={ParkingCircle}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes do Lançamento">
          <FormSelect id="expenseType" name="expenseType" label="Tipo" value={expenseType} onChange={e => setExpenseType(e.target.value as ExpenseType)}>
            <option>Pedágio</option>
            <option>Estacionamento</option>
          </FormSelect>
          <FormInput id="date" name="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
          <MoneyInput id="totalValue" name="totalValue" label="Valor Pago (R$)" placeholder="0,00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
          <FormInput id="location" name="location" label="Local" type="text" placeholder={expenseType === 'Pedágio' ? "Ex: Praça de Itatiba" : "Ex: Shopping Central"} value={location} onChange={e => setLocation(e.target.value)} required icon={<MapPin className="w-4 h-4 text-gray-400" />} />

          {expenseType === 'Pedágio' && (
            <FormInput id="highway" name="highway" label="Rodovia (Opcional)" type="text" placeholder="Ex: SP-330" value={highway} onChange={e => setHighway(e.target.value)} icon={<Route className="w-4 h-4 text-gray-400" />} />
          )}
          {expenseType === 'Estacionamento' && (
            <FormInput id="duration" name="duration" label="Permanência (minutos)" type="number" placeholder="120" value={duration} onChange={e => setDuration(e.target.value)} icon={<Clock className="w-4 h-4 text-gray-400" />} />
          )}

          <div className={expenseType === 'Pedágio' ? 'md:col-start-2' : ''}>
            <FormSelect id="paymentMethod" name="paymentMethod" label="Meio de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option>Tag</option>
              <option>Dinheiro</option>
              <option>Cartão</option>
              <option>App</option>
            </FormSelect>
          </div>

          <FormTextArea id="notes" name="notes" label="Observações (Opcional)" placeholder="Detalhes adicionais sobre o gasto." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

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

export default TollParkingFormPage;
