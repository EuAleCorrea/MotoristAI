import { formatCurrency } from '../../utils/formatters';

interface Props {
  monthLucro: number;
  metaMensal: number;
  metaPercentual: number;
  necessarioDia: number;
  projecaoMensal: number;
  diasRestantes: number;
}

export default function InsightsMeta({ monthLucro, metaMensal, metaPercentual, necessarioDia, projecaoMensal, diasRestantes }: Props) {
  const pct = Math.min(100, Math.max(0, metaPercentual));
  let badge = { label: 'No ritmo', color: 'var(--sys-green)', bg: 'rgba(48,209,88,0.13)' };
  if (metaPercentual < 40) badge = { label: 'Abaixo do ritmo', color: 'var(--sys-orange)', bg: 'rgba(255,159,10,0.13)' };
  else if (metaPercentual >= 100) badge = { label: 'Meta atingida!', color: 'var(--sys-green)', bg: 'rgba(48,209,88,0.13)' };

  if (metaMensal === 0) {
    return (
      <div className="px-4 pt-4">
        <div className="ios-section-header mb-2">Progresso da meta</div>
        <div className="ios-card p-3 text-center">
          <div className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>Nenhuma meta definida para este mês.</div>
          <div className="text-xs mt-1" style={{ color: 'var(--ios-text-tertiary)' }}>Cadastre uma meta em Metas para ver o progresso.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Progresso da meta</div>
      <div className="ios-card p-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs" style={{ color: 'var(--ios-text-secondary)' }}>
              {formatCurrency(monthLucro)} de {formatCurrency(metaMensal)}
            </div>
            <div className="text-xl font-semibold mt-0.5" style={{ color: pct >= 100 ? 'var(--sys-green)' : 'var(--sys-orange)' }}>
              {pct.toFixed(1)}% concluído
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: badge.bg, color: badge.color }}>
            {badge.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--ios-fill)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--sys-blue), var(--sys-green))' }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs">
          <span style={{ color: 'var(--ios-text-tertiary)' }}>
            Faltam <span className="font-medium" style={{ color: 'var(--sys-orange)' }}>{formatCurrency(Math.max(0, metaMensal - monthLucro))}</span>
          </span>
          <span style={{ color: 'var(--ios-text-tertiary)' }}>{diasRestantes} dias restantes</span>
        </div>

        <div className="ios-separator my-2.5" />

        <div className="flex gap-4 text-sm">
          <span style={{ color: 'var(--ios-text-secondary)' }}>
            Necessário/dia: <strong style={{ color: 'var(--ios-text)' }}>{formatCurrency(necessarioDia)}</strong>
          </span>
          <span style={{ color: 'var(--ios-text-secondary)' }}>
            Projeção: <strong style={{ color: projecaoMensal >= metaMensal ? 'var(--sys-green)' : 'var(--sys-orange)' }}>{formatCurrency(projecaoMensal)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
