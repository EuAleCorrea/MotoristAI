import { useState } from 'react';
import { X } from 'lucide-react';
import { useExpenseStore } from '../store/expenseStore';

interface ExpenseModalProps {
  expense?: any;
  onClose: () => void;
}

function ExpenseModal({ expense, onClose }: ExpenseModalProps) {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const updateExpense = useExpenseStore((state) => state.updateExpense);

  const [formData, setFormData] = useState({
    category: expense?.category || 'Combustível',
    description: expense?.description || '',
    amount: expense?.amount || '',
    date: expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount.toString()),
      date: new Date(formData.date).toISOString(),
    };

    if (expense) {
      updateExpense(expense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {expense ? 'Editar Despesa' : 'Nova Despesa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="Combustível">Combustível</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Estacionamento">Estacionamento</option>
              <option value="Pedágio">Pedágio</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Ex: Gasolina do posto X"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {expense ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseModal;
