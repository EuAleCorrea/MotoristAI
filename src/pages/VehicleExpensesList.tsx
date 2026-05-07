import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Car, Fuel, Wrench, MapPin, CreditCard, TrendingDown, Info, ChevronRight } from 'lucide-react';
import { useVehicleExpensesStore, AnyVehicleExpense } from '../store/vehicleExpensesStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useScrollReset } from '../hooks/useScrollReset';
import { formatCurrency } from '../utils/formatters';
import { exportToCsv, formatDateBR, formatCurrencyBR } from '../utils/exportCsv';
import ConfirmModal from '../components/ui/ConfirmModal';

const typeLabels: Record<string, string> = {
  fuel: 'Combustível',
  maintenance: 'Manutenção',
  toll_parking: 'Pedágio/Estacionamento',
  finance: 'Financeiro',
  depreciation: 'Depreciação',
};

const typeIcons: Record<string, any> = {
  fuel: Fuel,
  maintenance: Wrench,
  toll_parking: MapPin,
  finance: CreditCard,
  depreciation: TrendingDown,
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Reset scroll when filter changes
  useScrollReset(typeFilter);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      (expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      expense.totalValue.toString().includes(searchTerm) ||
      (typeLabels[expense.type]?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType = typeFilter === 'all' || expense.type === typeFilter;
    return matchesSearch && matchesType;
  });

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

  const handleDelete = () => {
    if (deletingId) {
      deleteExpense(deletingId);
      setDeletingId(null);
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
    <div className="max-w-lg mx-auto pb-20">
      {/* Header Section */}
      <div className="px-1 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--ios-text)]">
            Veículo
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
              onClick={() => navigate('/despesas/veiculo/energia-combustivel')}
              className="p-2 rounded-full bg-[var(--ios-accent)] text-white shadow-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <p className="text-[var(--ios-text-secondary)] text-sm">
          Gerenciamento total de gastos veiculares
        </p>
      </div>

      {/* Horizontal Filter Stats */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar -mx-4 px-4">
        <button
          onClick={() => setTypeFilter('all')}
          className={`flex-shrink-0 px-5 py-3 rounded-2xl transition-all duration-200 border ${
            typeFilter === 'all'
              ? 'bg-[var(--ios-accent)] border-[var(--ios-accent)] text-white shadow-md scale-105'
              : 'bg-[var(--ios-card)] border-[var(--ios-separator)] text-[var(--ios-text)]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">Todas</p>
          <p className="text-lg font-bold leading-none">{formatCurrency(totalExpenses)}</p>
          <p className="text-[10px] mt-1.5 font-medium opacity-70">{expenses.length} registros</p>
        </button>

        {typeStats.map((stat) => (
          <button
            key={stat.type}
            onClick={() => setTypeFilter(stat.type)}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl transition-all duration-200 border ${
              typeFilter === stat.type
                ? 'bg-[var(--ios-accent)] border-[var(--ios-accent)] text-white shadow-md scale-105'
                : 'bg-[var(--ios-card)] border-[var(--ios-separator)] text-[var(--ios-text)]'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">
              {typeLabels[stat.type] || stat.type}
            </p>
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
          placeholder="Buscar despesas do veículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--ios-card)] border-none rounded-2xl py-3.5 pl-11 pr-4 text-[17px] focus:ring-2 focus:ring-[var(--ios-accent)] shadow-sm text-[var(--ios-text)] placeholder:text-[var(--ios-text-tertiary)]"
        />
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => {
            const Icon = typeIcons[expense.type] || Info;
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
                      {typeLabels[expense.type] || 'Despesa'}
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
                      onClick={() => setDeletingId(expense.id)}
                      className="p-2 rounded-full text-ios-red hover:bg-ios-red/10 active:bg-ios-red/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Line 2: Date, Notes/Tag, Value */}
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[13px] text-[var(--ios-text-tertiary)] font-medium">
                      {format(new Date(expense.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                    {expense.notes && (
                      <p className="text-[14px] text-[var(--ios-text-secondary)] line-clamp-1 max-w-[200px]">
                        {expense.notes}
                      </p>
                    )}
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
              <Car size={40} className="text-[var(--ios-text-tertiary)]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[var(--ios-text)] mb-2">Sem registros</h3>
            <p className="text-[var(--ios-text-secondary)] mb-8 max-w-[240px]">
              {expenses.length === 0
                ? 'Você ainda não registrou nenhuma despesa para seu veículo.'
                : 'Nenhuma despesa encontrada com os filtros atuais.'}
            </p>
            {expenses.length === 0 && (
              <button
                onClick={() => navigate('/despesas/veiculo/energia-combustivel')}
                className="flex items-center gap-2 bg-[var(--ios-accent)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
              >
                <Plus size={20} strokeWidth={3} />
                Registrar Despesa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Access Floating Footer or Shortcut */}
      {expenses.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {Object.entries(typeRoutes).map(([type, route]) => (
            <button
              key={type}
              onClick={() => navigate(route)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[var(--ios-separator)] bg-[var(--ios-card)] text-[var(--ios-text-secondary)] hover:bg-[var(--ios-fill)] active:scale-95 transition-all"
            >
              + {typeLabels[type] || type}
            </button>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Excluir Despesa"
        message="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default VehicleExpensesList;
