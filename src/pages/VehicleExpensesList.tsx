import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Download, Car } from 'lucide-react';
import { useVehicleExpensesStore, AnyVehicleExpense } from '../store/vehicleExpensesStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';

const typeLabels: Record<string, string> = {
  fuel: 'Combustível',
  maintenance: 'Manutenção',
  toll_parking: 'Pedágio/Estacionamento',
  finance: 'Financeiro',
  depreciation: 'Depreciação',
};

const typeColors: Record<string, string> = {
  fuel: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300',
  maintenance: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
  toll_parking: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
  finance: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
  depreciation: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
};

const typeRoutes: Record<string, string> = {
  fuel: '/despesas/veiculo/energia-combustivel',
  maintenance: '/despesas/veiculo/manutencao',
  toll_parking: '/despesas/veiculo/pedagio-estacionamento',
  finance: '/despesas/veiculo/financeiro',
  depreciation: '/despesas/veiculo/depreciacao',
};

function VehicleExpensesList() {
  const { expenses, deleteExpense, fetchExpenses } = useVehicleExpensesStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      (expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      expense.totalValue.toString().includes(searchTerm);
    const matchesType = typeFilter === 'all' || expense.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const types = Array.from(new Set(expenses.map((expense) => expense.type)));

  const typeStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    expenses.forEach((expense) => {
      const t = expense.type || 'Outros';
      if (!stats[t]) stats[t] = { total: 0, count: 0 };
      stats[t].total += expense.totalValue;
      stats[t].count += 1;
    });
    return Object.entries(stats)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.totalValue, 0);

  const handleEdit = (expense: AnyVehicleExpense) => {
    const route = typeRoutes[expense.type];
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
    const filtered = typeFilter === 'all' ? expenses : expenses.filter(e => e.type === typeFilter);
    exportToCsv(
      filtered,
      {
        date: 'Data',
        type: 'Tipo',
        notes: 'Observação',
        totalValue: 'Valor',
      },
      `despesas-veiculo-${new Date().toISOString().slice(0, 10)}`,
      {
        date: (v) => formatDateBR(v),
        type: (v) => typeLabels[v] || v,
        totalValue: (v) => formatCurrencyBR(v),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ios-text)]">Despesas do Veículo</h1>
          <p className="mt-1 text-sm text-[var(--ios-text-secondary)]">
            Todos os gastos com seu veículo em um só lugar
          </p>
        </div>
        <button
          onClick={() => navigate('/despesas/veiculo/energia-combustivel')}
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

      {/* Summary Cards by Type */}
      {typeStats.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
              typeFilter === 'all'
                ? 'bg-[var(--ios-accent)] text-white'
                : 'bg-[var(--ios-fill)] text-[var(--ios-text)] hover:bg-[var(--ios-fill)]'
            }`}
          >
            <p className="text-xs font-medium">Todas</p>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs opacity-70">{expenses.length} registros</p>
          </button>
          {typeStats.map((stat) => (
            <button
              key={stat.type}
              onClick={() => setTypeFilter(stat.type)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                typeFilter === stat.type
                  ? 'bg-[var(--ios-accent)] text-white'
                  : 'bg-[var(--ios-fill)] text-[var(--ios-text)] hover:bg-[var(--ios-fill)]'
              }`}
            >
              <p className="text-xs font-medium">{typeLabels[stat.type] || stat.type}</p>
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
              placeholder="Buscar despesas do veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-[var(--ios-card)]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--ios-text-tertiary)]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--ios-separator)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-[var(--ios-card)]"
            >
              <option value="all">Todos os Tipos</option>
              {types.map((type) => (
                <option key={type} value={type}>{typeLabels[type] || type}</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Observação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--ios-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--ios-card)] divide-y divide-[var(--ios-separator)]">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-[var(--ios-bg)]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--ios-text)]">
                    {format(new Date(expense.date), "dd/MM/yy", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColors[expense.type] || 'bg-[var(--ios-fill)] text-[var(--ios-text)]'}`}>
                      {typeLabels[expense.type] || expense.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--ios-text-secondary)] max-w-[200px] truncate">
                    {expense.notes || '-'}
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
            <Car className="h-12 w-12 mx-auto mb-4 text-[var(--ios-text-tertiary)]" />
            <p className="text-[var(--ios-text-secondary)]">
              {expenses.length === 0
                ? 'Nenhuma despesa veicular registrada ainda.'
                : 'Nenhuma despesa encontrada para este filtro.'}
            </p>
            {expenses.length === 0 && (
              <button
                onClick={() => navigate('/despesas/veiculo/energia-combustivel')}
                className="mt-4 ios-btn"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar primeira despesa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Type Shortcuts */}
      {expenses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(typeRoutes).map(([type, route]) => (
            <button
              key={type}
              onClick={() => navigate(route)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-[var(--ios-separator)] bg-[var(--ios-card)] text-[var(--ios-text)] hover:bg-[var(--ios-bg)] transition-colors"
            >
              {typeLabels[type] || type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default VehicleExpensesList;
