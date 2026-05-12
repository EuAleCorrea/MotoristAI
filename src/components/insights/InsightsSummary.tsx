import { formatCurrency } from '../../utils/formatters';

interface Props {
  faturamento: number;
  despesas: number;
  lucro: number;
  rsHora: number;
}

export default function InsightsSummary({ faturamento, despesas, lucro, rsHora }: Props) {
  const fmt = (v: number) => formatCurrency(v);

  const items = [
    { label: 'Faturamento', value: fmt(faturamento), color: 'var(--sys-green)' },
    { label: 'Despesas', value: fmt(despesas), color: 'var(--sys-red)' },
    { label: 'Lucro', value: fmt(lucro), color: 'var(--sys-blue)' },
    { label: 'R$/Hora', value: fmt(rsHora), color: 'var(--sys-orange)' },
  ];

  return (
    <div className="flex" style={{ borderBottom: '0.5px solid var(--ios-separator)' }}>
      {items.map((item, i, arr) => (
        <div
          key={item.label}
          className="flex-1 px-3 py-3"
          style={{ borderRight: i < arr.length - 1 ? '0.5px solid var(--ios-separator)' : 'none' }}
        >
          <div className="text-xs font-normal uppercase tracking-wide" style={{ color: 'var(--ios-text-secondary)' }}>
            {item.label}
          </div>
          <div className="text-base font-semibold mt-0.5" style={{ color: item.color }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
