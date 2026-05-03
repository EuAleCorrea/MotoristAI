import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingDown, ArrowRight } from 'lucide-react';
import { useVehicleExpensesStore, DepreciationExpense } from '../../../store/vehicleExpensesStore';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

const DepreciationPage = () => {
  const { expenses, isLoading, error, fetchExpenses, deleteExpense } = useVehicleExpensesStore();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Filtra apenas despesas de depreciação
  const depreciationExpenses = expenses.filter(
    (e) => e.type === 'depreciation'
  ) as DepreciationExpense[];

  const handleEdit = (id: string) => {
    navigate(`/despesas/veiculo/depreciacao/${id}/editar`);
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    setDeleteConfirm(null);
  };

  if (isLoading && depreciationExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ios-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ios-text)]">Depreciação do Veículo</h1>
          <p className="text-sm text-[var(--ios-text-secondary)] mt-1">
            Acompanhe a desvalorização do seu veículo ao longo do tempo
          </p>
        </div>
        <button
          onClick={() => navigate('/despesas/veiculo/depreciacao')}
          className="bg-[var(--ios-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Depreciação
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Resumo */}
      {depreciationExpenses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--ios-card-bg)] rounded-xl p-4 border border-[var(--ios-card-border)]">
            <p className="text-sm text-[var(--ios-text-secondary)]">Última Avaliação</p>
            <p className="text-xl font-bold text-[var(--ios-text)]">
              {formatCurrency(depreciationExpenses[0].details.currentValue)}
            </p>
            <p className="text-xs text-[var(--ios-text-tertiary)]">
              em {format(new Date(depreciationExpenses[0].details.evaluationDate), "MMM/yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="bg-[var(--ios-card-bg)] rounded-xl p-4 border border-[var(--ios-card-border)]">
            <p className="text-sm text-[var(--ios-text-secondary)]">Valor de Compra</p>
            <p className="text-xl font-bold text-[var(--ios-text)]">
              {formatCurrency(depreciationExpenses[depreciationExpenses.length - 1].details.purchaseValue)}
            </p>
          </div>
          <div className="bg-[var(--ios-card-bg)] rounded-xl p-4 border border-[var(--ios-card-border)]">
            <p className="text-sm text-[var(--ios-text-secondary)]">Depreciação Total</p>
            <p className="text-xl font-bold text-red-500">
              -{formatNumber(
                ((depreciationExpenses[0].details.purchaseValue - depreciationExpenses[0].details.currentValue) /
                  depreciationExpenses[0].details.purchaseValue) * 100,
                1
              )}%
            </p>
          </div>
        </div>
      )}

      {/* Lista */}
      {depreciationExpenses.length === 0 ? (
        <div className="text-center py-12">
          <TrendingDown className="h-16 w-16 mx-auto mb-4 text-[var(--ios-text-tertiary)]" />
          <p className="text-[var(--ios-text-secondary)]">Nenhum registro de depreciação</p>
          <p className="text-sm text-[var(--ios-text-tertiary)] mt-1">
            Registre avaliações periódicas para acompanhar a desvalorização
          </p>
          <button
            onClick={() => navigate('/despesas/veiculo/depreciacao')}
            className="mt-4 bg-[var(--ios-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Primeira Avaliação
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {depreciationExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-[var(--ios-card-bg)] rounded-xl p-4 border border-[var(--ios-card-border)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-[var(--ios-text)]">
                      {format(new Date(expense.details.evaluationDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                    {expense.notes && (
                      <span className="text-xs text-[var(--ios-text-tertiary)] italic">
                        — {expense.notes}
                      </span>
                    )}
                  </div>

                  {/* Linha do tempo de valores */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="bg-[var(--ios-bg)] rounded-lg px-3 py-2">
                      <p className="text-xs text-[var(--ios-text-tertiary)]">Compra</p>
                      <p className="text-sm font-semibold text-[var(--ios-text)]">
                        {formatCurrency(expense.details.purchaseValue)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--ios-text-tertiary)]" />
                    <div className="bg-[var(--ios-bg)] rounded-lg px-3 py-2">
                      <p className="text-xs text-[var(--ios-text-tertiary)]">Atual</p>
                      <p className="text-sm font-semibold text-[var(--ios-text)]">
                        {formatCurrency(expense.details.currentValue)}
                      </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                      <p className="text-xs text-red-500">Depreciação</p>
                      <p className="text-sm font-semibold text-red-500">
                        -{formatNumber(expense.details.depreciationPercentage, 2)}%
                      </p>
                    </div>
                  </div>

                  {/* Data de compra */}
                  {expense.details.purchaseDate && (
                    <p className="text-xs text-[var(--ios-text-tertiary)] mt-2">
                      Comprado em {format(new Date(expense.details.purchaseDate), "dd/MM/yyyy", { locale: ptBR })}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default DepreciationPage;