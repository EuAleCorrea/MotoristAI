import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamilyExpensesStore, LeisureExpense } from '../../../store/familyExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import MoneyInput from '../../../components/forms/MoneyInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { Drama, Calendar, MapPin, Users, Plane, Film, Utensils, Mountain, Tv, Dumbbell, MoreHorizontal, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

const LeisureFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useFamilyExpensesStore();

  const [expenseType, setExpenseType] = useState('Passeio');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('Cartão');
  const [participants, setParticipants] = useState('');
  const [notes, setNotes] = useState('');

  // Conditional fields
  const [periodicity, setPeriodicity] = useState<'Mensal' | 'Anual'>('Mensal');
  const [destination, setDestination] = useState('');
  const [durationInDays, setDurationInDays] = useState('');

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.category === 'Lazer') as LeisureExpense | undefined;
      if (expenseToEdit) {
        setExpenseType(expenseToEdit.expenseType);
        setDescription(expenseToEdit.description);
        setLocation(expenseToEdit.location);
        setTotalValue(expenseToEdit.totalValue.toString());
        setDate(new Date(expenseToEdit.date).toISOString().slice(0, 10));
        setPaymentMethod(expenseToEdit.paymentMethod);
        setParticipants(expenseToEdit.participants || '');
        setNotes(expenseToEdit.notes || '');
        // Conditional fields
        setPeriodicity(expenseToEdit.periodicity || 'Mensal');
        setDestination(expenseToEdit.destination || '');
        setDurationInDays(expenseToEdit.durationInDays?.toString() || '');
      }
    }
  }, [id, isEditing, expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(totalValue);
    if (isNaN(value) || value <= 0) {
      alert('O valor da despesa deve ser positivo.');
      return;
    }

    const expenseData: Omit<LeisureExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      category: 'Lazer',
      expenseType: expenseType as LeisureExpense['expenseType'],
      description,
      location,
      totalValue: value,
      date: new Date(date + 'T12:00:00').toISOString(),
      paymentMethod,
      participants: participants || undefined,
      notes: notes || undefined,
      periodicity: expenseType === 'Streaming' ? periodicity : undefined,
      destination: expenseType === 'Viagem' ? destination : undefined,
      durationInDays: expenseType === 'Viagem' ? (parseInt(durationInDays) || undefined) : undefined,
    };

    if (isEditing && id) {
      updateExpense(id, expenseData);
    } else {
      addExpense(expenseData);
    }
    navigate(-1);
  };

  const expenseTypeOptions = [
    { value: 'Viagem', label: 'Viagem', icon: Plane },
    { value: 'Cinema', label: 'Cinema', icon: Film },
    { value: 'Restaurante', label: 'Restaurante', icon: Utensils },
    { value: 'Passeio', label: 'Passeio', icon: Mountain },
    { value: 'Streaming', label: 'Streaming', icon: Tv },
    { value: 'Academia', label: 'Academia', icon: Dumbbell },
    { value: 'Outros', label: 'Outros', icon: MoreHorizontal },
  ];

  return (
    <FormPageLayout title={isEditing ? 'Editar Despesa de Lazer' : 'Despesa de Lazer'} icon={Drama}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes da Despesa">
          <FormSelect id="expenseType" label="Tipo de Despesa" value={expenseType} onChange={e => setExpenseType(e.target.value)}>
            {expenseTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </FormSelect>
          <FormInput id="description" label="Descrição" type="text" placeholder="Ex: Jantar de aniversário" value={description} onChange={e => setDescription(e.target.value)} required />
          <FormInput id="location" label="Local / Serviço" type="text" placeholder="Ex: Restaurante Sabor Divino" value={location} onChange={e => setLocation(e.target.value)} required icon={<MapPin className="w-4 h-4 text-gray-400" />} />
          <FormInput id="date" label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
        </FormSection>

        <AnimatePresence>
          {(expenseType === 'Streaming' || expenseType === 'Viagem') && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <FormSection title="Detalhes Específicos">
                {expenseType === 'Streaming' && (
                  <FormSelect id="periodicity" label="Periodicidade" value={periodicity} onChange={e => setPeriodicity(e.target.value as 'Mensal' | 'Anual')}>
                    <option value="Mensal">Mensal</option>
                    <option value="Anual">Anual</option>
                  </FormSelect>
                )}
                {expenseType === 'Viagem' && (
                  <>
                    <FormInput id="destination" label="Destino" type="text" placeholder="Ex: Praia Grande, SP" value={destination} onChange={e => setDestination(e.target.value)} icon={<MapPin className="w-4 h-4 text-gray-400" />} />
                    <FormInput id="durationInDays" label="Duração (dias)" type="number" placeholder="7" value={durationInDays} onChange={e => setDurationInDays(e.target.value)} icon={<Clock className="w-4 h-4 text-gray-400" />} />
                  </>
                )}
              </FormSection>
            </motion.div>
          )}
        </AnimatePresence>

        <FormSection title="Valores e Participantes">
          <MoneyInput id="totalValue" label="Valor Total (R$)" placeholder="0,00" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<span className="text-sm font-semibold text-gray-500">R$</span>} />
          <FormSelect id="paymentMethod" label="Forma de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option>Cartão</option>
            <option>Pix</option>
            <option>Dinheiro</option>
          </FormSelect>
          <div className="md:col-span-2">
            <FormInput id="participants" label="Participantes (Opcional)" type="text" placeholder="Ex: Família toda, Casal" value={participants} onChange={e => setParticipants(e.target.value)} icon={<Users className="w-4 h-4 text-gray-400" />} />
          </div>
        </FormSection>

        <FormSection title="Observações">
          <FormTextArea id="notes" label="Notas Adicionais" placeholder="Detalhes sobre a atividade..." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default LeisureFormPage;
