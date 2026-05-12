import { formatCurrency } from '../../utils/formatters';

interface DayData { dia: string; lucro: number; faturamento: number; realizado: boolean }

interface Props {
  evolucaoDiaria: DayData[];
  varLucro: number;
  faturamento: number;
}

export default function InsightsDailyEvolution({ evolucaoDiaria, varLucro, faturamento }: Props) {
  const maxLucro = Math.max(...evolucaoDiaria.map(d => Math.abs(d.lucro)), 1);
  const realizados = evolucaoDiaria.filter(d => d.realizado && d.lucro > 0);
  const melhorDia = realizados.length > 0 ? Math.max(...realizados.map(d => d.lucro)) : 0;

  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Evolução diária</div>
      <div className="ios-card p-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs" style={{ color: 'var(--ios-text-secondary)' }}>Lucro líquido por dia</div>
            <div className="text-[17px] font-semibold mt-0.5" style={{ color: 'var(--sys-green)' }}>
              {formatCurrency(faturamento)} este período
            </div>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: varLucro >= 0 ? 'rgba(48,209,88,0.13)' : 'rgba(255,69,58,0.13)',
              color: varLucro >= 0 ? 'var(--sys-green)' : 'var(--sys-red)',
            }}
          >
            {varLucro >= 0 ? '+' : ''}{varLucro.toFixed(0)}% vs ant.
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-[3px] overflow-x-auto scrollbar-hide" style={{ height: 72 }}>
          {evolucaoDiaria.map((d, i) => {
            const h = d.lucro !== 0 ? Math.max(10, Math.abs(d.lucro) / maxLucro * 100) : 6;
            const isBest = d.realizado && d.lucro === melhorDia && melhorDia > 0;
            const isNeg = d.lucro < 0;
            return (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[12px]">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${h}%`,
                    background: d.realizado
                      ? (isBest ? 'var(--sys-green)' : isNeg ? 'var(--sys-red)' : 'var(--ios-accent)')
                      : 'transparent',
                    border: !d.realizado ? '1px dashed var(--ios-text-tertiary)' : 'none',
                    opacity: d.realizado ? 1 : 0.5,
                  }}
                />
                <div
                  className="text-[9px] mt-1 text-center truncate w-full"
                  style={{
                    color: isBest ? 'var(--sys-green)' : d.realizado ? 'var(--ios-text-tertiary)' : 'var(--ios-text-tertiary)',
                    fontWeight: isBest ? 600 : 400,
                  }}
                >{d.dia}</div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-2 text-xs" style={{ color: 'var(--ios-text-tertiary)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'var(--ios-accent)' }} />Realizado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ border: '1px dashed var(--ios-text-tertiary)' }} />Projetado
          </span>
        </div>
      </div>
    </div>
  );
}
