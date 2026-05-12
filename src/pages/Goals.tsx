import { useState, useEffect } from 'react';
import { useGoalStore } from '../store/goalStore';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, DollarSign, TrendingUp, TrendingDown, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatters';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

import { useScrollReset } from '../hooks/useScrollReset';

function Goals() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeFilter, setActiveFilter] = useState('Mensal');

  // Reset scroll when year or filter changes
  useScrollReset(selectedYear);
  useScrollReset(activeFilter);

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
    <div className="max-w-lg mx-auto pb-20 px-1 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ios-text)]">Minhas Metas</h1>
          <p className="text-[var(--ios-text-secondary)] font-medium text-sm">Acompanhe seu progresso e objetivos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/metas/nova')}
            className="p-2.5 rounded-2xl bg-[var(--ios-accent)] text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Year Filter */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Calendar className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full pl-10 pr-8 py-2.5 border border-[var(--ios-separator)] rounded-xl bg-[var(--ios-card)] text-[var(--ios-text)] text-sm appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>Ano: {y}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
          <ChevronDown className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="relative flex rounded-ios p-0.5 mb-6" style={{ backgroundColor: 'var(--ios-fill)' }}>
        <div
          className="absolute top-0.5 bottom-0.5 rounded-ios transition-all duration-250 ease-out"
          style={{
            width: `${100 / 3}%`,
            left: `${(['Semanal', 'Mensal', 'Anual'].indexOf(activeFilter) / 3) * 100}%`,
            backgroundColor: 'var(--ios-accent)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}
        />
        {['Semanal', 'Mensal', 'Anual'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="relative z-10 flex-1 py-2 text-center transition-colors duration-150"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: activeFilter === filter ? '#FFFFFF' : 'var(--ios-text-secondary)',
              minHeight: '32px',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Subtotal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-[var(--ios-card)] rounded-2xl border border-[var(--ios-separator)] shadow-sm flex items-start space-x-3">
          <div className="bg-success-100 p-2 rounded-xl"><DollarSign className="h-5 w-5 text-success-600" /></div>
          <div>
            <p className="text-[12px] uppercase tracking-wider font-bold text-success-600 mb-1">Faturamento</p>
            <p className="text-[19px] font-bold text-[var(--ios-text)]">{formatCurrency(yearRevenue)}</p>
          </div>
        </div>
        <div className="p-4 bg-[var(--ios-card)] rounded-2xl border border-[var(--ios-separator)] shadow-sm flex items-start space-x-3">
          <div className="bg-[var(--ios-fill)] p-2 rounded-xl"><TrendingUp className="h-5 w-5 text-[var(--ios-accent)]" /></div>
          <div>
            <p className="text-[12px] uppercase tracking-wider font-bold text-[var(--ios-accent)] mb-1">Lucro</p>
            <p className="text-[19px] font-bold text-[var(--ios-text)]">{formatCurrency(yearProfit)}</p>
          </div>
        </div>
        <div className="p-4 bg-[var(--ios-card)] rounded-2xl border border-[var(--ios-separator)] shadow-sm flex items-start space-x-3">
          <div className="bg-danger-100 p-2 rounded-xl"><TrendingDown className="h-5 w-5 text-danger-600" /></div>
          <div>
            <p className="text-[12px] uppercase tracking-wider font-bold text-danger-600 mb-1">Despesa</p>
            <p className="text-[19px] font-bold text-[var(--ios-text)]">{formatCurrency(yearExpenseTotal)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Month Goal */}
        <div className="md:col-span-1 bg-[var(--ios-card)] rounded-2xl border border-[var(--ios-separator)] shadow-sm p-6 flex flex-col justify-center items-center text-center">
          <h3 className="font-semibold text-[var(--ios-text)] text-[17px]">Dias de Trabalho</h3>
          <p className="text-[13px] text-[var(--ios-text-secondary)] mt-1">Meta para o mês atual</p>
          <p className="text-5xl font-extrabold text-[var(--ios-accent)] mt-4">{currentMonthGoal?.daysWorkedPerWeek || '-'}</p>
        </div>

        {/* Goals List */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="font-semibold text-[var(--ios-text)] text-[17px] mb-2 px-1">Metas de {selectedYear}</h3>
          {yearGoals.length > 0 ? (
            yearGoals.map((goal) => (
              <div key={goal.id} className="bg-[var(--ios-card)] rounded-[20px] p-4 border border-[var(--ios-separator)] shadow-sm relative overflow-hidden group">
                {deleteConfirmId === goal.id && (
                  <div className="absolute inset-0 bg-[rgba(255,59,48,0.12)] backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 animate-in fade-in duration-200">
                    <span className="text-sm font-semibold text-red-600">Excluir meta?</span>
                    <div className="flex gap-2">
                      <button onClick={() => { deleteGoal(goal.id); setDeleteConfirmId(null); }} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-bold">Sim</button>
                      <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 bg-white/50 text-gray-700 rounded-lg text-sm font-bold">Não</button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-[17px] text-[var(--ios-text)] capitalize">
                    {format(new Date(goal.year, goal.month - 1), 'MMMM', { locale: ptBR })}
                  </h4>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/metas/${goal.id}/editar`)} className="p-2 rounded-full text-[var(--ios-text-secondary)] hover:bg-[var(--ios-fill)] transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirmId(goal.id)} className="p-2 rounded-full text-ios-red hover:bg-ios-red/10 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex flex-col bg-[var(--ios-fill)] p-2.5 rounded-xl">
                    <span className="text-[11px] font-semibold text-[var(--ios-text-tertiary)] uppercase tracking-wider">Faturamento</span>
                    <span className="text-[15px] font-bold text-success-600 mt-0.5">{goal.revenue ? formatCurrency(goal.revenue) : '-'}</span>
                  </div>
                  <div className="flex flex-col bg-[var(--ios-fill)] p-2.5 rounded-xl">
                    <span className="text-[11px] font-semibold text-[var(--ios-text-tertiary)] uppercase tracking-wider">Lucro</span>
                    <span className="text-[15px] font-bold text-[var(--ios-accent)] mt-0.5">{goal.profit ? formatCurrency(goal.profit) : '-'}</span>
                  </div>
                  <div className="flex flex-col bg-[var(--ios-fill)] p-2.5 rounded-xl">
                    <span className="text-[11px] font-semibold text-[var(--ios-text-tertiary)] uppercase tracking-wider">Despesa</span>
                    <span className="text-[15px] font-bold text-ios-red mt-0.5">{goal.expense ? formatCurrency(goal.expense) : '-'}</span>
                  </div>
                  <div className="flex flex-col bg-[var(--ios-fill)] p-2.5 rounded-xl">
                    <span className="text-[11px] font-semibold text-[var(--ios-text-tertiary)] uppercase tracking-wider">Dias/Sem</span>
                    <span className="text-[15px] font-bold text-[var(--ios-text)] mt-0.5">{goal.daysWorkedPerWeek || '-'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 bg-[var(--ios-card)] rounded-[20px] border border-dashed border-[var(--ios-separator)]">
              <Calendar className="h-10 w-10 text-[var(--ios-text-tertiary)] opacity-30 mb-4" />
              <h3 className="text-lg font-bold text-[var(--ios-text)] mb-2">Nenhuma meta</h3>
              <p className="text-[var(--ios-text-secondary)] text-sm">Não há metas para {selectedYear}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Goals;
