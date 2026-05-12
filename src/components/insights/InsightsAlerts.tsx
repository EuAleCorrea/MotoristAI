interface Alert {
  titulo: string;
  descricao: string;
  tipo: 'sucesso' | 'atencao' | 'perigo' | 'info';
  emoji: string;
}

const COLORS = {
  sucesso: { bg: 'rgba(48,209,88,0.12)', border: 'rgba(48,209,88,0.25)', text: 'var(--sys-green)' },
  atencao: { bg: 'rgba(255,159,10,0.12)', border: 'rgba(255,159,10,0.25)', text: 'var(--sys-orange)' },
  perigo: { bg: 'rgba(255,69,58,0.1)', border: 'rgba(255,69,58,0.2)', text: 'var(--sys-red)' },
  info: { bg: 'rgba(10,132,255,0.1)', border: 'rgba(10,132,255,0.2)', text: 'var(--sys-blue)' },
};

interface Props { alertas: Alert[] }

export default function InsightsAlerts({ alertas }: Props) {
  if (alertas.length === 0) return null;
  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Alertas inteligentes</div>
      <div className="flex flex-col gap-2">
        {alertas.map((a, i) => {
          const c = COLORS[a.tipo];
          return (
            <div key={i} className="ios-card p-3 flex gap-3 items-start" style={{ borderColor: c.border }}>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                style={{ background: c.bg }}
              >{a.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--ios-text)' }}>{a.titulo}</div>
                <div className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--ios-text-secondary)' }}>{a.descricao}</div>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{ background: c.bg, color: c.text }}
              >{a.tipo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
