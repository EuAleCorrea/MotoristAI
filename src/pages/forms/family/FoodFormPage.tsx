import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFamilyExpensesStore, FoodExpense } from '../../../store/familyExpensesStore';
import FormSection from '../../../components/forms/FormSection';
import FormInput from '../../../components/forms/FormInput';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import { ShoppingCart, Calendar, DollarSign, MapPin } from 'lucide-react';
import FormPageLayout from '../../../components/layouts/FormPageLayout';

const FoodFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { expenses, addExpense, updateExpense } = useFamilyExpensesStore();

  const [expenseType, setExpenseType] = useState('Supermercado');
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cartão');
  const [recurrence, setRecurrence] = useState('Única');
  const [productList, setProductList] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isEditing) {
      const expenseToEdit = expenses.find(e => e.id === id && e.category === 'Alimentação') as FoodExpense | undefined;
      if (expenseToEdit) {
        setExpenseType(expenseToEdit.expenseType);
        setDescription(expenseToEdit.description);
        setTotalValue(expenseToEdit.totalValue.toString());
        setPurchaseDate(new Date(expenseToEdit.purchaseDate).toISOString().slice(0, 10));
        setLocation(expenseToEdit.location);
        setPaymentMethod(expenseToEdit.paymentMethod);
        setRecurrence(expenseToEdit.recurrence);
        setProductList(expenseToEdit.productList || '');
        setNotes(expenseToEdit.notes || '');
      }
    }
  }, [id, isEditing, expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(totalValue);
    if (isNaN(value) || value <= 0) {
      alert('O valor da despesa deve ser um número positivo.');
      return;
    }

    const expenseData: Omit<FoodExpense, 'id' | 'createdAt' | 'updatedAt'> = {
      category: 'Alimentação',
      expenseType: expenseType as FoodExpense['expenseType'],
      description,
      totalValue: value,
      purchaseDate,
      location,
      paymentMethod,
      recurrence: recurrence as FoodExpense['recurrence'],
      productList: productList || undefined,
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
    <FormPageLayout title={isEditing ? 'Editar Despesa de Alimentação' : 'Despesa de Alimentação'} icon={ShoppingCart}>
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        <FormSection title="Detalhes da Compra">
          <FormSelect id="expenseType" label="Tipo de Despesa" value={expenseType} onChange={e => setExpenseType(e.target.value)}>
            <option>Supermercado</option>
            <option>Delivery</option>
            <option>Restaurante</option>
            <option>Alimentação escolar</option>
            <option>Assinaturas</option>
            <option>Outros</option>
          </FormSelect>
          <FormInput id="description" label="Descrição" type="text" placeholder="Ex: Compras do mês" value={description} onChange={e => setDescription(e.target.value)} required />
          <FormInput id="location" label="Local / Estabelecimento" type="text" placeholder="Ex: Supermercado Central" value={location} onChange={e => setLocation(e.target.value)} required icon={<MapPin className="w-4 h-4 text-gray-400" />} />
          <FormInput id="purchaseDate" label="Data da Compra" type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required icon={<Calendar className="w-4 h-4 text-gray-400" />} />
        </FormSection>

        <FormSection title="Valores e Pagamento">
          <FormInput id="totalValue" label="Valor Total (R$)" type="number" step="0.01" placeholder="450.75" value={totalValue} onChange={e => setTotalValue(e.target.value)} required icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
          <FormSelect id="paymentMethod" label="Forma de Pagamento" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option>Cartão</option>
            <option>Pix</option>
            <option>Dinheiro</option>
            <option>Vale-alimentação</option>
          </FormSelect>
          <FormSelect id="recurrence" label="Recorrência" value={recurrence} onChange={e => setRecurrence(e.target.value)}>
            <option>Única</option>
            <option>Semanal</option>
            <option>Mensal</option>
          </FormSelect>
        </FormSection>

        <FormSection title="Itens e Observações">
          {expenseType === 'Supermercado' && (
            <FormTextArea id="productList" label="Lista de Produtos (Opcional)" placeholder="Ex: Arroz, feijão, macarrão..." value={productList} onChange={e => setProductList(e.target.value)} />
          )}
          <FormTextArea id="notes" label="Observações Adicionais" placeholder="Detalhes sobre a compra..." value={notes} onChange={e => setNotes(e.target.value)} />
        </FormSection>

        <div className="pt-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm">Salvar</button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default FoodFormPage;
