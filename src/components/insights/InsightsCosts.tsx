import { formatCurrency } from '../../utils/formatters';

interface Props {
  fuelCost: number; depCost: number; maintCost: number; otherCost: number;
  custoKm: number; despesas: number;
}

export default function InsightsCosts({ fuelCost, depCost, maintCost, otherCost, custoKm, despesas }: Props) {
  const total = despesas || 1;
  const items = [
    { label: '⛽ Combustível', value: fuelCost, color: 'var(--sys-red)' },
    { label: '📉 Depreciação', value: depCost, color: 'var(--sys-orange)' },
    { label: '🔧 Manutenção', value: maintCost, color: 'var(--sys-purple)' },
    { label: '📋 Outros', value: otherCost, color: 'var(--sys-gray)' },
  ].filter(i => i.value > 0);

  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Análise de custos</div>
      <div className="ios-card p-3">
        {items.length === 0 ? (
          <div className="text-sm text-center py-2" style={{ color: 'var(--ios-text-secondary)' }}>
            Nenhum custo registrado neste período.
          </div>
        ) : items.map((item, i) => {
          const pct = (item.value / total) * 100;
          return (
            <div key={item.label} className={i < items.length - 1 ? 'mb-3' : ''}>
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: 'var(--ios-text)' }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: item.color }}>{formatCurrency(item.value)}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--ios-fill)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: item.color }} />
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--ios-text-tertiary)' }}>{pct.toFixed(0)}% do total</div>
            </div>
          );
        })}
        {custoKm > 0 && (
          <>
            <div className="ios-separator my-2.5" />
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--ios-text-secondary)' }}>Custo real/km</span>
              <span className="font-medium" style={{ color: 'var(--ios-text)' }}>R$ {custoKm.toFixed(2).replace('.', ',')}/km</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
