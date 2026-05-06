import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Home, Utensils, Heart, GraduationCap, Palmtree, Info } from 'lucide-react';
import { useFamilyExpensesStore, FamilyExpense } from '../store/familyExpensesStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';

const categoryIcons: Record<string, any> = {
  Moradia: Home,
  Alimentação: Utensils,
  Saúde: Heart,
  Educação: GraduationCap,
  Lazer: Palmtree,
  Outras: Info,
};

const categoryRoutes: Record<string, string> = {
  Moradia: '/despesas/familia/moradia',
  Alimentação: '/despesas/familia/alimentacao',
  Saúde: '/despesas/familia/saude',
  Educação: '/despesas/familia/educacao',
  Lazer: '/despesas/familia/lazer',
  Outras: '/despesas/familia/outras',
};

import { useScrollReset } from '../hooks/useScrollReset';

function FamilyExpensesList() {
  const { expenses, deleteExpense, fetchExpenses } = useFamilyExpensesStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Reset scroll when category filter changes
  useScrollReset(categoryFilter);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.totalValue.toString().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    expenses.forEach((expense) => {
      const cat = expense.category || 'Outras';
      if (!stats[cat]) stats[cat] = { total: 0, count: 0 };
      stats[cat].total += expense.totalValue;
      stats[cat].count += 1;
    });
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalValue, 0);

  const handleEdit = (expense: FamilyExpense) => {
    const route = categoryRoutes[expense.category];
    if (route) {
      navigate(`${route}/${expense.id}/editar`);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      deleteExpense(id);
    }
  };

  const handleExportCSV = () => {
    const filtered = categoryFilter === 'all' ? expenses : expenses.filter(e => e.category === categoryFilter);
    exportToCsv(
      filtered,
      {
        date: 'Data',
        category: 'Categoria',
        description: 'Descrição',
        totalValue: 'Valor',
      },
      `despesas-familia-${new Date().toISOString().slice(0, 10)}`,
      {
        date: (v) => formatDateBR(v),
        totalValue: (v) => formatCurrencyBR(v),
      },
    );
  };

  return (
    <div className="max-w-lg mx-auto pb-20">
      {/* Header Section */}
      <div className="px-1 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ios-text)]">
            Família
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-full bg-[var(--ios-fill)] text-[var(--ios-accent)] hover:opacity-80 transition-opacity"
              title="Exportar CSV"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => navigate('/despesas/familia/moradia')}
              className="p-2 rounded-full bg-[var(--ios-accent)] text-white shadow-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <p className="text-[var(--ios-text-secondary)] text-sm">
          Controle centralizado dos gastos da casa
        </p>
      </div>

      {/* Horizontal Filter Stats */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar -mx-4 px-4">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`flex-shrink-0 px-5 py-3 rounded-2xl transition-all duration-200 border ${
            categoryFilter === 'all'
              ? 'bg-[var(--ios-accent)] border-[var(--ios-accent)] text-white shadow-md scale-105'
              : 'bg-[var(--ios-card)] border-[var(--ios-separator)] text-[var(--ios-text)]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">Todas</p>
          <p className="text-lg font-bold leading-none">{formatCurrency(totalExpenses)}</p>
          <p className="text-[10px] mt-1.5 font-medium opacity-70">{expenses.length} registros</p>
        </button>

        {categoryStats.map((stat) => (
          <button
            key={stat.name}
            onClick={() => setCategoryFilter(stat.name)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl transition-all duration-200 border ${
              categoryFilter === stat.name
                ? 'bg-[var(--ios-accent)] border-[var(--ios-accent)] text-white shadow-md scale-105'
                : 'bg-[var(--ios-card)] border-[var(--ios-separator)] text-[var(--ios-text)]'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">{stat.name}</p>
            <p className="text-lg font-bold leading-none">{formatCurrency(stat.total)}</p>
            <p className="text-[10px] mt-1.5 font-medium opacity-70">{stat.count} registros</p>
          </button>
        ))}
      </div>

      {/* Search Bar - Below Filters */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ios-text-tertiary)]" size={18} />
        <input
          type="text"
          placeholder="Buscar despesas da família..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--ios-card)] border-none rounded-2xl py-3.5 pl-11 pr-4 text-[17px] focus:ring-2 focus:ring-[var(--ios-accent)] shadow-sm text-[var(--ios-text)] placeholder:text-[var(--ios-text-tertiary)]"
        />
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => {
            const Icon = categoryIcons[expense.category] || Info;
            return (
              <div
                key={expense.id}
                className="bg-[var(--ios-card)] rounded-[20px] p-4 border border-[var(--ios-separator)] shadow-sm active:scale-[0.98] transition-transform"
              >
                {/* Line 1: Icon, Title, Actions */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--ios-fill)] text-[var(--ios-accent)]">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-semibold text-[var(--ios-text)] truncate">
                      {expense.description}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 rounded-full text-[var(--ios-text-secondary)] hover:bg-[var(--ios-fill)] active:bg-[var(--ios-fill)]"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 rounded-full text-ios-red hover:bg-ios-red/10 active:bg-ios-red/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Line 2: Date, Category, Value */}
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[13px] text-[var(--ios-text-tertiary)] font-medium">
                      {expense.date ? format(new Date(expense.date), "dd 'de' MMMM, yyyy", { locale: ptBR }) : '-'}
                    </p>
                    <p className="text-[14px] text-[var(--ios-text-secondary)]">
                      {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[19px] font-bold text-ios-red tracking-tight">
                      -{formatCurrency(expense.totalValue)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[var(--ios-card)] rounded-[32px] border border-dashed border-[var(--ios-separator)]">
            <div className="w-20 h-20 bg-[var(--ios-fill)] rounded-full flex items-center justify-center mb-6">
              <Home size={40} className="text-[var(--ios-text-tertiary)]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[var(--ios-text)] mb-2">Sem registros</h3>
            <p className="text-[var(--ios-text-secondary)] mb-8 max-w-[240px]">
              {expenses.length === 0
                ? 'Você ainda não registrou nenhuma despesa para sua família.'
                : 'Nenhuma despesa encontrada com os filtros atuais.'}
            </p>
            {expenses.length === 0 && (
              <button
                onClick={() => navigate('/despesas/familia/moradia')}
                className="flex items-center gap-2 bg-[var(--ios-accent)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
              >
                <Plus size={20} strokeWidth={3} />
                Registrar Despesa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Access Shortcuts */}
      {expenses.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {Object.entries(categoryRoutes).map(([category, route]) => (
            <button
              key={category}
              onClick={() => navigate(route)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[var(--ios-separator)] bg-[var(--ios-card)] text-[var(--ios-text-secondary)] hover:bg-[var(--ios-fill)] active:scale-95 transition-all"
            >
              + {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FamilyExpensesList;

