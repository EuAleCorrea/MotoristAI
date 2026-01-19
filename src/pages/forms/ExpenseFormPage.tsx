import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useExpenseStore } from '../../store/expenseStore';
import FormPageLayout from '../../components/layouts/FormPageLayout';
import MoneyInput from '../../components/forms/MoneyInput';
import { Wallet } from 'lucide-react';

function ExpenseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);

  const { expenses, addExpense, updateExpense } = useExpenseStore();
  const expenseToEdit = isEditing ? expenses.find(e => e.id === id) : undefined;
  const prefilledCategory = location.state?.category;

  const [formData, setFormData] = useState({
    category: prefilledCategory || 'Combustível',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (isEditing && expenseToEdit) {
      setFormData({
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        amount: expenseToEdit.amount.toString(),
        date: new Date(expenseToEdit.date).toISOString().slice(0, 10),
      });
    } else if (isEditing && !expenseToEdit) {
      navigate('/despesas');
    }
  }, [id, isEditing, expenseToEdit, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date + 'T12:00:00').toISOString(),
    };

    if (isEditing && id) {
      updateExpense(id, expenseData);
    } else {
      addExpense(expenseData);
    }

    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <FormPageLayout title={isEditing ? 'Editar Despesa' : 'Nova Despesa'} icon={Wallet}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="Combustível">Combustível</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Pedágio/Estacionamento">Pedágio/Estacionamento</option>
              <option value="Moradia">Moradia</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Lazer">Lazer</option>
              <option value="Outras">Outras</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Gasolina do posto X"
              required
            />
          </div>

          <div>
            <MoneyInput
              id="amount"
              name="amount"
              label="Valor (R$)"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0,00"
              required
              icon={<span className="text-sm font-semibold text-gray-500">R$</span>}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </FormPageLayout>
  );
}

export default ExpenseFormPage;
