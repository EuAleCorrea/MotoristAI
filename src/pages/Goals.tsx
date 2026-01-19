import { useState, useEffect } from 'react';
import { useGoalStore } from '../store/goalStore';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, DollarSign, TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatters';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

function Goals() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeFilter, setActiveFilter] = useState('Mensal');

  const { goals: allGoals, fetchGoals, deleteGoal } = useGoalStore();
  const { entries, fetchEntries } = useEntryStore();
  const { expenses, fetchExpenses } = useExpenseStore();
  const navigate = useNavigate();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
    fetchEntries();
    fetchExpenses();
  }, [fetchGoals, fetchEntries, fetchExpenses]);

  const yearEntries = entries.filter(entry => new Date(entry.date).getFullYear() === selectedYear);
  const yearExpenses = expenses.filter(expense => new Date(expense.date).getFullYear() === selectedYear);

  const yearRevenue = yearEntries.reduce((sum, entry) => sum + entry.value, 0);
  const yearExpenseTotal = yearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const yearProfit = yearRevenue - yearExpenseTotal;

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthGoal = allGoals.find(g => g.year === selectedYear && g.month === currentMonth);

  const yearGoals = allGoals.filter(g => g.year === selectedYear);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Metas</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Acompanhe seu progresso e defina novos objetivos</p>
        </div>
        <button
          onClick={() => navigate('/metas/nova')}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Meta
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {['Semanal', 'Mensal', 'Anual'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${activeFilter === filter ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subtotal de {selectedYear}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-success-50 rounded-lg flex items-start space-x-4">
            <div className="bg-success-100 p-2 rounded-full"><DollarSign className="h-6 w-6 text-success-600" /></div>
            <div>
              <p className="text-sm text-success-600 font-medium">Faturamento</p>
              <p className="mt-1 text-2xl font-bold text-success-700">{formatCurrency(yearRevenue)}</p>
            </div>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg flex items-start space-x-4">
            <div className="bg-primary-100 p-2 rounded-full"><TrendingUp className="h-6 w-6 text-primary-600" /></div>
            <div>
              <p className="text-sm text-primary-600 font-medium">Lucro</p>
              <p className="mt-1 text-2xl font-bold text-primary-700">{formatCurrency(yearProfit)}</p>
            </div>
          </div>
          <div className="p-4 bg-danger-50 rounded-lg flex items-start space-x-4">
            <div className="bg-danger-100 p-2 rounded-full"><TrendingDown className="h-6 w-6 text-danger-600" /></div>
            <div>
              <p className="text-sm text-danger-600 font-medium">Despesa</p>
              <p className="mt-1 text-2xl font-bold text-danger-700">{formatCurrency(yearExpenseTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Dias trabalhados na semana</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta para o mês atual</p>
          <p className="text-5xl font-bold text-primary-600 dark:text-primary-400 mt-4">{currentMonthGoal?.daysWorkedPerWeek || '-'}</p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white p-6 border-b dark:border-gray-700">Metas de {selectedYear}</h3>
          {yearGoals.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {yearGoals.map(goal => (
                <div key={goal.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 group relative">
                  <p className="font-semibold text-primary-700 dark:text-primary-400">{format(new Date(goal.year, goal.month - 1), 'MMMM', { locale: ptBR })}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mt-2">
                    <p className="text-gray-600 dark:text-gray-400">Faturamento: <span className="font-medium text-gray-800 dark:text-gray-200">{goal.revenue ? formatCurrency(goal.revenue) : 'N/A'}</span></p>
                    <p className="text-gray-600 dark:text-gray-400">Lucro: <span className="font-medium text-gray-800 dark:text-gray-200">{goal.profit ? formatCurrency(goal.profit) : 'N/A'}</span></p>
                    <p className="text-gray-600 dark:text-gray-400">Despesa: <span className="font-medium text-gray-800 dark:text-gray-200">{goal.expense ? formatCurrency(goal.expense) : 'N/A'}</span></p>
                    <p className="text-gray-600 dark:text-gray-400">Dias/Semana: <span className="font-medium text-gray-800 dark:text-gray-200">{goal.daysWorkedPerWeek || 'N/A'}</span></p>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/metas/${goal.id}/editar`)} className="text-gray-400 hover:text-primary-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(goal.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {deleteConfirmId === goal.id && (
                    <div className="absolute inset-0 bg-red-50 dark:bg-red-900/30 flex items-center justify-center gap-4 rounded-lg">
                      <span className="text-sm text-red-700 dark:text-red-300 font-medium">Excluir esta meta?</span>
                      <button
                        onClick={() => { deleteGoal(goal.id); setDeleteConfirmId(null); }}
                        className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        Não
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <p className="text-gray-500 dark:text-gray-400">Nenhuma meta cadastrada para o ano selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Goals;
