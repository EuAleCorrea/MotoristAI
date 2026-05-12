interface TendPoint { dia: string; rsHora: number }
interface Props { tendencia: TendPoint[]; rsHora: number }

export default function InsightsTrend({ tendencia, rsHora }: Props) {
  if (tendencia.length < 2) return null;

  const min = Math.min(...tendencia.map(t => t.rsHora));
  const max = Math.max(...tendencia.map(t => t.rsHora), 1);
  const W = 320, H = 50, PAD = 4;

  const pts = tendencia.map((t, i) => {
    const x = PAD + (i / (tendencia.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((t.rsHora - min) / (max - min || 1)) * (H - PAD * 2);
    return { x, y };
  });

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`;

  const first = tendencia[0].rsHora;
  const last = tendencia[tendencia.length - 1].rsHora;
  const slope = last - first;
  const badge = slope > 2
    ? { label: '↗ Melhorando', color: 'var(--sys-green)', bg: 'rgba(48,209,88,0.13)' }
    : slope < -2
    ? { label: '↘ Caindo', color: 'var(--sys-red)', bg: 'rgba(255,69,58,0.13)' }
    : { label: '→ Estável', color: 'var(--sys-orange)', bg: 'rgba(255,159,10,0.13)' };

  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Tendência de performance</div>
      <div className="ios-card p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-xs" style={{ color: 'var(--ios-text-secondary)' }}>R$/hora ao longo do período</div>
            <div className="text-xl font-semibold mt-0.5" style={{ color: 'var(--sys-purple)' }}>
              R$ {rsHora.toFixed(2).replace('.', ',')}
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: badge.bg, color: badge.color }}>
            {badge.label}
          </span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} aria-label="Sparkline R$/hora">
          <defs>
            <linearGradient id="tg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BF5AF2" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#BF5AF2" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#tg1)" />
          <path d={line} fill="none" stroke="#BF5AF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3.5" fill="#BF5AF2" />
        </svg>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--ios-text-tertiary)' }}>
          <span>Início: <span style={{ color: 'var(--ios-text-secondary)' }}>R${first.toFixed(0)}/h</span></span>
          <span>Atual: <span className="font-medium" style={{ color: 'var(--sys-purple)' }}>R${last.toFixed(0)}/h</span></span>
        </div>
      </div>
    </div>
  );
}
