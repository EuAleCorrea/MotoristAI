import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Landmark, Calendar, CheckCircle2, Clock, AlertTriangle, Banknote } from 'lucide-react';
import { useVehicleExpensesStore, FinanceExpense } from '../../../store/vehicleExpensesStore';
import { useNavigate } from 'react-router-dom';
import { format, isBefore, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { formatCurrency } from '../../../utils/formatters';

const costTypeColors: Record<string, string> = {
  'Financiamento': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Seguro': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'IPVA': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'Licenciamento': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  'Multa': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'Outros': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
};

const VehicleFinancePage = () => {
  const { expenses, isLoading, error, fetchExpenses, deleteExpense } = useVehicleExpensesStore();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pago' | 'Pendente'>('all');
  const [costTypeFilter, setCostTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Filtra apenas despesas financeiras
  const financeExpenses = expenses.filter(
    (e) => e.type === 'finance'
  ) as FinanceExpense[];

  // Extrai tipos de custo únicos
  const costTypes = Array.from(new Set(financeExpenses.map((e) => e.details.costType)));

  // Aplica filtros
  const filteredExpenses = financeExpenses.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.details.status === statusFilter;
    const matchesCostType = costTypeFilter === 'all' || e.details.costType === costTypeFilter;
    return matchesStatus && matchesCostType;
  });

  const handleEdit = (id: string) => {
    navigate(`/despesas/veiculo/financeiro/${id}/editar`);
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    setDeleteConfirm(null);
  };

  if (isLoading && financeExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ios-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ios-text)]">Financeiro do Veículo</h1>
          <p className="text-sm text-[var(--ios-text-secondary)] mt-1">
            Custos fixos e obrigações do veículo
          </p>
        </div>
        <button
          onClick={() => navigate('/despesas/veiculo/financeiro')}
          className="bg-[var(--ios-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Custo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Resumo */}
      {financeExpenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--ios-card-bg)] rounded-xl p-4 border border-[var(--ios-card-border)]">
            <p className="text-sm text-[var(--ios-text-secondary)]">Total Pendente</p>
            <p className="text-xl font-bold text-red-500">
              {formatCurrency(
                financeExpenses
                  .filter((e) => e.details.status === 'Pendente')
                  .reduce((s, e) => s + e.totalValue, 0)
              )}
            </p>
            <p className="text-xs text-[var(--ios-text-tertiary)]">
              {financeExpenses.filter((e) => e.details.status === 'Pendente').length} pendentes
            </p>
          </div>
          <div className="bg-[var(--ios-card-bg)] rounded-xl p-4 border border-[var(--ios-card-border)]">
            <p className="text-sm text-[var(--ios-text-secondary)]">Total Pago</p>
            <p className="text-xl font-bold text-green-500">
              {formatCurrency(
                financeExpenses
                  .filter((e) => e.details.status === 'Pago')
                  .reduce((s, e) => s + e.totalValue, 0)
              )}
            </p>
            <p className="text-xs text-[var(--ios-text-tertiary)]">
              {financeExpenses.filter((e) => e.details.status === 'Pago').length} pagos
            </p>
          </div>
          <div className="bg-[var(--ios-card-bg)] rounded-xl p-4 border border-[var(--ios-card-border)]">
            <p className="text-sm text-[var(--ios-text-secondary)]">Total Geral</p>
            <p className="text-xl font-bold text-[var(--ios-text)]">
              {formatCurrency(financeExpenses.reduce((s, e) => s + e.totalValue, 0))}
            </p>
            <p className="text-xs text-[var(--ios-text-tertiary)]">
              {financeExpenses.length} registros
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      {financeExpenses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-[var(--ios-card-bg)] rounded-lg border border-[var(--ios-card-border)] p-1">
            {(['all', 'Pendente', 'Pago'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-[var(--ios-blue)] text-white'
                    : 'text-[var(--ios-text-secondary)] hover:text-[var(--ios-text)]'
                }`}
              >
                {status === 'all' ? 'Todos' : status}
              </button>
            ))}
          </div>
          <select
            value={costTypeFilter}
            onChange={(e) => setCostTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--ios-card-border)] bg-[var(--ios-card-bg)] text-sm text-[var(--ios-text)]"
          >
            <option value="all">Todos os tipos</option>
            {costTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {/* Lista */}
      {financeExpenses.length === 0 ? (
        <div className="text-center py-12">
          <Landmark className="h-16 w-16 mx-auto mb-4 text-[var(--ios-text-tertiary)]" />
          <p className="text-[var(--ios-text-secondary)]">Nenhum custo financeiro registrado</p>
          <p className="text-sm text-[var(--ios-text-tertiary)] mt-1">
            Adicione financiamentos, seguros, IPVA e outros custos
          </p>
          <button
            onClick={() => navigate('/despesas/veiculo/financeiro')}
            className="mt-4 bg-[var(--ios-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Primeiro Custo
          </button>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[var(--ios-text-secondary)]">Nenhum custo encontrado para este filtro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {
            const dueDate = parseISO(expense.details.dueDate);
            const isOverdue = isBefore(dueDate, new Date()) && expense.details.status === 'Pendente';
            const isDueToday = isToday(dueDate) && expense.details.status === 'Pendente';

            return (
              <div
                key={expense.id}
                className={`bg-[var(--ios-card-bg)] rounded-xl p-4 border ${
                  isOverdue
                    ? 'border-red-300 dark:border-red-700'
                    : isDueToday
                    ? 'border-yellow-300 dark:border-yellow-700'
                    : 'border-[var(--ios-card-border)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        costTypeColors[expense.details.costType] || costTypeColors['Outros']
                      }`}>
                        {expense.details.costType}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        expense.details.status === 'Pago'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {expense.details.status === 'Pago' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {expense.details.status}
                      </span>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Vencido
                        </span>
                      )}
                      {isDueToday && (
                        <span className="inline-flex items-center gap-1 text-xs text-orange-500 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Vence hoje
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
                        <span className="text-sm text-[var(--ios-text)]">
                          Vence {format(dueDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Banknote className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
                        <span className="text-sm font-semibold text-[var(--ios-text)]">
                          {formatCurrency(expense.totalValue)}
                        </span>
                      </div>
                    </div>

                    {(expense.details.description || expense.notes) && (
                      <p className="text-xs text-[var(--ios-text-tertiary)] mt-1.5 truncate">
                        {expense.details.description || expense.notes}
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(expense.id)}
                      className="text-[var(--ios-blue)] hover:opacity-80 p-1"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {deleteConfirm === expense.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium"
                        >
                          Excluir
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-[var(--ios-text-secondary)] px-2 py-1 rounded text-xs border border-[var(--ios-card-border)]"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(expense.id)}
                        className="text-red-500 hover:opacity-80 p-1"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VehicleFinancePage;