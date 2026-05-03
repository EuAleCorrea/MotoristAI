import { useNavigate } from 'react-router-dom';
import { Car, Users, ArrowLeft } from 'lucide-react';

/**
 * Tela de escolha: "Despesa do Veículo" ou "Despesa da Família"
 * Substitui o formulário genérico de "/despesas/nova"
 */
function NewExpenseChoice() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/despesas')}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--ios-fill)] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[var(--ios-accent)]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--ios-text)]">Nova Despesa</h1>
          <p className="mt-1 text-sm text-[var(--ios-text-secondary)]">
            Escolha o tipo de despesa que deseja registrar
          </p>
        </div>
      </div>

      {/* Vehicle Expense Card */}
      <button
        onClick={() => navigate('/despesas/veiculo/energia-combustivel')}
        className="w-full bg-[var(--ios-card)] rounded-2xl shadow-sm p-6 hover:opacity-80 transition-opacity text-left"
        style={{ borderLeft: '4px solid var(--ios-accent)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--ios-tint)' }}
          >
            <Car className="h-6 w-6" style={{ color: 'var(--ios-accent)' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--ios-text)]">Despesa do Veículo</h2>
            <p className="text-sm text-[var(--ios-text-secondary)] mt-1">
              Combustível, manutenção, pedágio, financiamento, depreciação
            </p>
          </div>
          <span className="text-2xl text-[var(--ios-text-tertiary)]">→</span>
        </div>
      </button>

      {/* Family Expense Card */}
      <button
        onClick={() => navigate('/despesas/familia/moradia')}
        className="w-full bg-[var(--ios-card)] rounded-2xl shadow-sm p-6 hover:opacity-80 transition-opacity text-left"
        style={{ borderLeft: '4px solid var(--ios-accent)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--ios-tint)' }}
          >
            <Users className="h-6 w-6" style={{ color: 'var(--ios-accent)' }} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--ios-text)]">Despesa da Família</h2>
            <p className="text-sm text-[var(--ios-text-secondary)] mt-1">
              Moradia, alimentação, saúde, educação, lazer, outras
            </p>
          </div>
          <span className="text-2xl text-[var(--ios-text-tertiary)]">→</span>
        </div>
      </button>

      {/* Hint */}
      <p className="text-center text-xs text-[var(--ios-text-tertiary)] pt-4">
        Você também pode acessar cada tipo diretamente pelos atalhos nas listagens
      </p>
    </div>
  );
}

export default NewExpenseChoice;
