import { formatCurrency } from '../../utils/formatters';

interface ScoreTag { texto: string; tipo: 'positivo' | 'atencao' | 'negativo' }
interface BreakevenProps { breakEven: number; lucroPorCorridaExtra: number }
interface ProjectionProps { projecaoMensal: number; metaMensal: number; diasRestantes: number; diasPlanejados: number }
interface ScoreProps { score: number; scoreClass: string; scoreTags: ScoreTag[] }

export function InsightsBreakeven({ breakEven, lucroPorCorridaExtra }: BreakevenProps) {
  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Ponto de equilíbrio</div>
      <div className="ios-card p-3 flex gap-2">
        <div className="flex-1 pr-2" style={{ borderRight: '0.5px solid var(--ios-separator)' }}>
          <div className="text-xs" style={{ color: 'var(--ios-text-secondary)' }}>Coberto hoje</div>
          <div className="text-[17px] font-semibold mt-1" style={{ color: 'var(--sys-orange)' }}>{formatCurrency(breakEven)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--ios-text-tertiary)' }}>Total de custos do dia</div>
        </div>
        <div className="flex-1 pl-1">
          <div className="text-xs" style={{ color: 'var(--ios-text-secondary)' }}>Lucro/corrida extra</div>
          <div className="text-[17px] font-semibold mt-1" style={{ color: 'var(--sys-green)' }}>{formatCurrency(lucroPorCorridaExtra)}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--ios-text-tertiary)' }}>após cobrir break-even</div>
        </div>
      </div>
    </div>
  );
}

export function InsightsProjection({ projecaoMensal, metaMensal, diasRestantes, diasPlanejados }: ProjectionProps) {
  const ok = projecaoMensal >= metaMensal;
  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Projeção mensal</div>
      <div className="ios-card p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--ios-text-secondary)' }}>Se mantiver o ritmo atual</div>
            <div className="text-[22px] font-semibold" style={{ color: ok ? 'var(--sys-green)' : 'var(--sys-orange)' }}>
              {formatCurrency(projecaoMensal)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--ios-text-secondary)' }}>Meta</div>
            <div className="text-base font-medium" style={{ color: 'var(--sys-purple)' }}>{formatCurrency(metaMensal)}</div>
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 text-xs" style={{ borderTop: '0.5px solid var(--ios-separator)', color: 'var(--ios-text-secondary)' }}>
          <span>Com <strong style={{ color: 'var(--ios-text)' }}>{diasPlanejados} dias</strong> planejados, restam <strong style={{ color: 'var(--ios-text)' }}>{diasRestantes} dias</strong>. </span>
          {ok
            ? <span style={{ color: 'var(--sys-green)' }}>✓ Você deve superar a meta em {formatCurrency(projecaoMensal - metaMensal)}.</span>
            : <span style={{ color: 'var(--sys-orange)' }}>⚠ Projeção abaixo da meta em {formatCurrency(metaMensal - projecaoMensal)}.</span>
          }
        </div>
      </div>
    </div>
  );
}

export function InsightsScore({ score, scoreClass, scoreTags }: ScoreProps) {
  const tagColors = { positivo: 'var(--sys-green)', atencao: 'var(--sys-orange)', negativo: 'var(--sys-red)' };
  const tagBg = { positivo: 'rgba(48,209,88,0.13)', atencao: 'rgba(255,159,10,0.13)', negativo: 'rgba(255,69,58,0.13)' };

  const scoreColor = score >= 86 ? 'var(--sys-green)' : score >= 66 ? 'var(--sys-purple)' : score >= 41 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const radius = 36, stroke = 7;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;

  return (
    <div className="px-4 pt-4 mb-4">
      <div className="ios-section-header mb-2">Score do motorista</div>
      <div className="ios-card p-3">
        <div className="flex items-center gap-4">
          <svg width={92} height={92} viewBox="0 0 92 92" className="flex-shrink-0">
            <circle cx={46} cy={46} r={radius} fill="none" stroke="var(--ios-separator)" strokeWidth={stroke} />
            <circle
              cx={46} cy={46} r={radius} fill="none"
              stroke={scoreColor} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 46 46)"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            <text x={46} y={43} textAnchor="middle" fill={scoreColor} fontSize={18} fontWeight={700}>{score}</text>
            <text x={46} y={57} textAnchor="middle" fill="var(--ios-text-secondary)" fontSize={9}>{scoreClass}</text>
          </svg>
          <div className="flex-1">
            <div className="text-sm mb-2" style={{ color: 'var(--ios-text-secondary)' }}>
              Heurística baseada em R$/hora, corridas/hora, consistência e progresso de meta.
            </div>
            <div className="flex flex-wrap gap-1.5">
              {scoreTags.length === 0 && (
                <span className="text-xs" style={{ color: 'var(--ios-text-tertiary)' }}>Registre mais dados para tags de análise.</span>
              )}
              {scoreTags.map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: tagBg[t.tipo], color: tagColors[t.tipo],
                }}>{t.texto}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
