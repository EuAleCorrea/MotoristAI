import { useState } from 'react';
import { useGoalStore } from '../store/goalStore';
import { useTripStore } from '../store/tripStore';
import { useExpenseStore } from '../store/expenseStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, DollarSign, TrendingUp, TrendingDown, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

function Goals() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeFilter, setActiveFilter] = useState('Mensal');
  
  const allGoals = useGoalStore((state) => state.goals);
  const trips = useTripStore((state) => state.trips);
  const expenses = useExpenseStore((state) => state.expenses);
  const navigate = useNavigate();

  const yearTrips = trips.filter(trip => new Date(trip.date).getFullYear() === selectedYear);
  const yearExpenses = expenses.filter(expense => new Date(expense.date).getFullYear() === selectedYear);

  const yearRevenue = yearTrips.reduce((sum, trip) => sum + trip.amount, 0);
  const yearExpenseTotal = yearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const yearProfit = yearRevenue - yearExpenseTotal;

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthGoal = allGoals.find(g => g.year === selectedYear && g.month === currentMonth);

  const yearGoals = allGoals.filter(g => g.year === selectedYear);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Metas</h1>
          <p className="mt-1 text-sm text-gray-600">Acompanhe seu progresso e defina novos objetivos</p>
        </div>
        <button
          onClick={() => navigate('/metas/nova')}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Meta
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['Semanal', 'Mensal', 'Anual'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${activeFilter === filter ? 'bg-white text-primary-600 shadow' : 'text-gray-600'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subtotal de {selectedYear}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-success-50 rounded-lg flex items-start space-x-4">
            <div className="bg-success-100 p-2 rounded-full"><DollarSign className="h-6 w-6 text-success-600" /></div>
            <div>
              <p className="text-sm text-success-600 font-medium">Faturamento</p>
              <p className="mt-1 text-2xl font-bold text-success-700">R$ {yearRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg flex items-start space-x-4">
            <div className="bg-primary-100 p-2 rounded-full"><TrendingUp className="h-6 w-6 text-primary-600" /></div>
            <div>
              <p className="text-sm text-primary-600 font-medium">Lucro</p>
              <p className="mt-1 text-2xl font-bold text-primary-700">R$ {yearProfit.toFixed(2)}</p>
            </div>
          </div>
          <div className="p-4 bg-danger-50 rounded-lg flex items-start space-x-4">
            <div className="bg-danger-100 p-2 rounded-full"><TrendingDown className="h-6 w-6 text-danger-600" /></div>
            <div>
              <p className="text-sm text-danger-600 font-medium">Despesa</p>
              <p className="mt-1 text-2xl font-bold text-danger-700">R$ {yearExpenseTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900">Dias trabalhados na semana</h3>
          <p className="text-sm text-gray-500">Meta para o mês atual</p>
          <p className="text-5xl font-bold text-primary-600 mt-4">{currentMonthGoal?.daysWorkedPerWeek || '-'}</p>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 p-6 border-b">Metas de {selectedYear}</h3>
          {yearGoals.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {yearGoals.map(goal => (
                <div key={goal.id} className="p-4 hover:bg-gray-50 group relative">
                  <p className="font-semibold text-primary-700">{format(new Date(goal.year, goal.month - 1), 'MMMM', { locale: ptBR })}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mt-2">
                    <p className="text-gray-600">Faturamento: <span className="font-medium text-gray-800">R$ {goal.revenue?.toFixed(2) || 'N/A'}</span></p>
                    <p className="text-gray-600">Lucro: <span className="font-medium text-gray-800">R$ {goal.profit?.toFixed(2) || 'N/A'}</span></p>
                    <p className="text-gray-600">Despesa: <span className="font-medium text-gray-800">R$ {goal.expense?.toFixed(2) || 'N/A'}</span></p>
                    <p className="text-gray-600">Dias/Semana: <span className="font-medium text-gray-800">{goal.daysWorkedPerWeek || 'N/A'}</span></p>
                  </div>
                   <button onClick={() => navigate(`/metas/${goal.id}/editar`)} className="absolute top-4 right-4 text-gray-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 className="h-4 w-4" />
                   </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <p className="text-gray-500">Nenhuma meta cadastrada para o ano selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Goals;
