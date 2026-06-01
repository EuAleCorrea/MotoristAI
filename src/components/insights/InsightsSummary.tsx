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
    <div className="grid grid-cols-2 divide-x divide-y divide-[var(--ios-separator)] md:flex md:divide-y-0 md:divide-x md:divide-[var(--ios-separator)]" style={{ borderBottom: '0.5px solid var(--ios-separator)' }}>
      {items.map((item) => (
        <div
          key={item.label}
          className="px-4 py-3 md:flex-1"
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
