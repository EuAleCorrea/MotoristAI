import { formatCurrency } from '../../utils/formatters';

interface Platform {
  nome: string; cor: string;
  faturamento: number; rsHora: number;
  corridas: number; corridasPorHora: number;
}
interface Props { plataformas: Platform[]; totalFaturamento: number }

export default function InsightsPlatforms({ plataformas, totalFaturamento }: Props) {
  if (plataformas.length === 0) return null;
  const best = [...plataformas].sort((a, b) => b.rsHora - a.rsHora)[0];

  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Por plataforma</div>
      <div className="ios-card p-3">
        {plataformas.map((p, i) => {
          const pct = totalFaturamento > 0 ? (p.faturamento / totalFaturamento) * 100 : 0;
          const isBest = best.nome === p.nome && plataformas.length > 1;
          return (
            <div key={p.nome} className={i < plataformas.length - 1 ? 'mb-3' : ''}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: p.cor }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--ios-text)' }}>{p.nome}</span>
                  {isBest && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(48,209,88,0.15)', color: 'var(--sys-green)' }}>
                      Mais eficiente
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--ios-text)' }}>{formatCurrency(p.faturamento)}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--ios-fill)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: p.cor }} />
              </div>
              <div className="flex gap-3 mt-1 text-xs" style={{ color: 'var(--ios-text-secondary)' }}>
                <span>R$ {p.rsHora.toFixed(2).replace('.', ',')}/h</span>
                <span>{p.corridas} corridas</span>
                <span>{pct.toFixed(0)}% do total</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
