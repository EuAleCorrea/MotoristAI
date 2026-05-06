import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Fuel, Wrench, Utensils, Info, Home, Heart, GraduationCap, Palmtree, MapPin } from 'lucide-react';
import { useExpenseStore } from '../store/expenseStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useScrollReset } from '../hooks/useScrollReset';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';

const categoryIcons: Record<string, any> = {
  Combustível: Fuel,
  Manutenção: Wrench,
  Alimentação: Utensils,
  Moradia: Home,
  Saúde: Heart,
  Educação: GraduationCap,
  Lazer: Palmtree,
  'Pedágio/Estacionamento': MapPin,
  Outros: Info,
};

function Expenses() {
  const expenses = useExpenseStore((state) => state.expenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { fetchExpenses } = useExpenseStore();

  // Reset scroll when filter changes
  useScrollReset(categoryFilter);

  useEffect(() => {
    fetchExpenses();
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    }
  }, [fetchExpenses, searchParams]);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    expenses.forEach((expense) => {
      const cat = expense.category || 'Outros';
      if (!stats[cat]) stats[cat] = { total: 0, count: 0 };
      stats[cat].total += expense.amount;
      stats[cat].count += 1;
    });
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleEdit = (id: string) => {
    navigate(`/despesas/${id}/editar`);
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
        amount: 'Valor',
      },
      `despesas-${new Date().toISOString().slice(0, 10)}`,
      {
        date: (v) => formatDateBR(v),
        amount: (v) => formatCurrencyBR(v),
      },
    );
  };

  return (
    <div className="max-w-lg mx-auto pb-20 px-1">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ios-text)]">Despesas</h1>
          <p className="text-[var(--ios-text-secondary)] font-medium text-sm">Gastos operacionais</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-2xl bg-[var(--ios-fill)] text-[var(--ios-accent)] hover:opacity-80 transition-all active:scale-90"
            title="Exportar CSV"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate('/despesas/nova')}
            className="p-2.5 rounded-2xl bg-[var(--ios-accent)] text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
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
          <p className="text-lg font-bold leading-none">{formatCurrency(totalExpensesAmount)}</p>
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
          placeholder="Buscar despesas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--ios-card)] border-none rounded-2xl py-3.5 pl-11 pr-4 text-[17px] focus:ring-2 focus:ring-[var(--ios-accent)] shadow-sm text-[var(--ios-text)] placeholder:text-[var(--ios-text-tertiary)]"
        />
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => {
            const Icon = categoryIcons[expense.category] || Info;
            return (
              <div
                key={expense.id}
                className="bg-[var(--ios-card)] rounded-[20px] p-4 border border-[var(--ios-separator)] shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--ios-fill)] text-[var(--ios-accent)] shrink-0">
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-semibold text-[var(--ios-text)] truncate">
                      {expense.description}
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(expense.id)}
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

                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[13px] text-[var(--ios-text-tertiary)] font-medium">
                      {format(new Date(expense.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </p>
                    <p className="text-[14px] text-[var(--ios-text-secondary)]">
                      {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[19px] font-bold text-ios-red tracking-tight">
                      -{formatCurrency(expense.amount)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-[var(--ios-card)] rounded-[32px] border border-dashed border-[var(--ios-separator)]">
            <div className="w-20 h-20 bg-[var(--ios-fill)] rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-[var(--ios-text-tertiary)] opacity-30" />
            </div>
            <h3 className="text-xl font-bold text-[var(--ios-text)] mb-2">Nada por aqui</h3>
            <p className="text-[var(--ios-text-secondary)] font-medium">
              Não encontramos despesas para os filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;
