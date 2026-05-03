import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Download, Home } from 'lucide-react';
import { useFamilyExpensesStore, FamilyExpense } from '../store/familyExpensesStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';

const categoryColors: Record<string, string> = {
  Moradia: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300',
  Alimentação: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
  Saúde: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300',
  Educação: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300',
  Lazer: 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300',
  Outras: 'bg-[var(--ios-fill)] text-[var(--ios-text)]',
};

const categoryRoutes: Record<string, string> = {
  Moradia: '/despesas/familia/moradia',
  Alimentação: '/despesas/familia/alimentacao',
  Saúde: '/despesas/familia/saude',
  Educação: '/despesas/familia/educacao',
  Lazer: '/despesas/familia/lazer',
  Outras: '/despesas/familia/outras',
};

function FamilyExpensesList() {
  const { expenses, deleteExpense, fetchExpenses } = useFamilyExpensesStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.totalValue.toString().includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(expenses.map((expense) => expense.category)));

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ios-text)]">Despesas da Família</h1>
          <p className="mt-1 text-sm text-[var(--ios-text-secondary)]">
            Controle os gastos da sua casa e família
          </p>
        </div>
        <button
          onClick={() => navigate('/despesas/familia/moradia')}
          className="ios-btn"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Despesa
        </button>
        <button
          onClick={handleExportCSV}
          className="ios-btn-tinted ml-2"
          title="Exportar CSV"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      {/* Summary Cards by Category */}
      {categoryStats.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
              categoryFilter === 'all'
                ? 'bg-[var(--ios-accent)] text-white'
                : 'bg-[var(--ios-fill)] text-[var(--ios-text)] hover:bg-[var(--ios-fill)]'
            }`}
          >
            <p className="text-xs font-medium">Todas</p>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs opacity-70">{expenses.length} registros</p>
          </button>
          {categoryStats.map((stat) => (
            <button
              key={stat.name}
              onClick={() => setCategoryFilter(stat.name)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                categoryFilter === stat.name
                  ? 'bg-[var(--ios-accent)] text-white'
                  : 'bg-[var(--ios-fill)] text-[var(--ios-text)] hover:bg-[var(--ios-fill)]'
              }`}
            >
              <p className="text-xs font-medium">{stat.name}</p>
              <p className="text-lg font-bold">{formatCurrency(stat.total)}</p>
              <p className="text-xs opacity-70">{stat.count} registros</p>
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-[var(--ios-card)] rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--ios-text-tertiary)]" />
            <input
              type="text"
              placeholder="Buscar despesas da família..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-[var(--ios-card)]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--ios-text-tertiary)]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-[var(--ios-card)]"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[var(--ios-card)] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--ios-separator)]">
            <thead className="bg-[var(--ios-bg)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--ios-card)] divide-y divide-[var(--ios-separator)]">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-[var(--ios-bg)]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--ios-text)]">
                    {expense.date ? format(new Date(expense.date), "dd/MM/yy", { locale: ptBR }) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--ios-text)] max-w-[200px] truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColors[expense.category] || categoryColors.Outras}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-danger-600 dark:text-danger-400">
                    {formatCurrency(expense.totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-[var(--ios-accent)] hover:text-primary-900 dark:hover:text-primary-300 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-danger-600 dark:text-danger-400 hover:text-danger-900 dark:hover:text-danger-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-12 w-12 mx-auto mb-4 text-[var(--ios-text-tertiary)]" />
            <p className="text-[var(--ios-text-secondary)]">
              {expenses.length === 0
                ? 'Nenhuma despesa familiar registrada ainda.'
                : 'Nenhuma despesa encontrada para este filtro.'}
            </p>
            {expenses.length === 0 && (
              <button
                onClick={() => navigate('/despesas/familia/moradia')}
                className="mt-4 ios-btn"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar primeira despesa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Category Shortcuts */}
      {expenses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryRoutes).map(([category, route]) => (
            <button
              key={category}
              onClick={() => navigate(route)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--ios-separator)] bg-[var(--ios-card)] text-[var(--ios-text)] hover:bg-[var(--ios-bg)] transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FamilyExpensesList;
