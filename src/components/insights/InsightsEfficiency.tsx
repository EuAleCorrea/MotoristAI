interface Props {
  corridasPorHora: number;
  tempoMedioCorrida: number;
  kmRodados: number;
}

export default function InsightsEfficiency({ corridasPorHora, tempoMedioCorrida }: Props) {
  const cells = [
    { label: 'Taxa de ocupação ⭐', value: '—', sub: 'sem dados', color: 'var(--ios-text-tertiary)' },
    { label: 'KM vazio ⭐', value: '—', sub: 'sem dados', color: 'var(--ios-text-tertiary)' },
    { label: 'Corridas/hora', value: corridasPorHora > 0 ? corridasPorHora.toFixed(1) : '—', sub: 'média', color: 'var(--sys-blue)' },
    { label: 'Tempo médio/corrida', value: tempoMedioCorrida > 0 ? `${Math.round(tempoMedioCorrida)} min` : '—', sub: 'aceite → desemb.', color: 'var(--ios-text)' },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Eficiência operacional</div>
      <div className="grid grid-cols-2 gap-2">
        {cells.map(c => (
          <div key={c.label} className="ios-card p-3">
            <div className="text-xs" style={{ color: 'var(--ios-text-secondary)' }}>{c.label}</div>
            <div className="text-base font-medium mt-0.5" style={{ color: c.color }}>{c.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--ios-text-tertiary)' }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] italic mt-1.5" style={{ color: 'var(--ios-text-tertiary)' }}>
        ⭐ dado ainda não disponível no sistema
      </div>
    </div>
  );
}
