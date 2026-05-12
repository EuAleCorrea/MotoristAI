import { formatCurrency } from '../../utils/formatters';

interface Props {
  lucro: number; prevLucro: number; varLucro: number;
  rsHora: number; prevRsHora: number; varRsHora: number;
  totalViagens: number; prevViagens: number; varViagens: number;
  ticketMedio: number; prevTicket: number; varTicket: number;
  despesas: number; prevDespesas: number; varDespesas: number;
}

function Row({ label, atual, anterior, variacao, isCurrency = true, invertColor = false }: {
  label: string; atual: number | string; anterior: number | string;
  variacao: number; isCurrency?: boolean; invertColor?: boolean;
}) {
  const up = variacao > 0;
  const goodColor = invertColor ? 'var(--sys-red)' : 'var(--sys-green)';
  const badColor = invertColor ? 'var(--sys-green)' : 'var(--sys-red)';
  const color = variacao === 0 ? 'var(--ios-text-tertiary)' : up ? goodColor : badColor;
  const fmt = (v: number | string) => typeof v === 'number' && isCurrency ? formatCurrency(v) : String(v);

  return (
    <div className="flex items-center py-2" style={{ borderBottom: '0.5px solid var(--ios-separator)' }}>
      <div className="flex-1 text-sm" style={{ color: 'var(--ios-text-secondary)' }}>{label}</div>
      <div className="text-sm font-medium min-w-[70px] text-right" style={{ color: 'var(--ios-text)' }}>{fmt(atual)}</div>
      <div className="text-xs min-w-[60px] text-right" style={{ color: 'var(--ios-text-tertiary)' }}>{fmt(anterior)}</div>
      <div className="text-xs font-medium min-w-[55px] text-right" style={{ color }}>
        {variacao > 0 ? '+' : ''}{typeof variacao === 'number' && Math.abs(variacao) < 999 ? variacao.toFixed(0) + '%' : String(variacao)}
      </div>
    </div>
  );
}

export default function InsightsComparative(props: Props) {
  return (
    <div className="px-4 pt-4">
      <div className="ios-section-header mb-2">Comparativo de período</div>
      <div className="ios-card px-3 pt-0.5 pb-1">
        <div className="flex py-1.5" style={{ borderBottom: '0.5px solid var(--ios-separator)' }}>
          <div className="flex-1 text-[10px] uppercase" style={{ color: 'var(--ios-text-tertiary)' }}>Métrica</div>
          <div className="text-[10px] min-w-[70px] text-right" style={{ color: 'var(--ios-text-tertiary)' }}>Atual</div>
          <div className="text-[10px] min-w-[60px] text-right" style={{ color: 'var(--ios-text-tertiary)' }}>Anterior</div>
          <div className="text-[10px] min-w-[55px] text-right" style={{ color: 'var(--ios-text-tertiary)' }}>Var.</div>
        </div>
        <Row label="Lucro líquido" atual={props.lucro} anterior={props.prevLucro} variacao={props.varLucro} />
        <Row label="R$/hora" atual={`R$${props.rsHora.toFixed(0)}/h`} anterior={`R$${props.prevRsHora.toFixed(0)}/h`} variacao={props.varRsHora} isCurrency={false} />
        <Row label="Viagens" atual={props.totalViagens} anterior={props.prevViagens} variacao={props.varViagens} isCurrency={false} />
        <Row label="Ticket médio" atual={props.ticketMedio} anterior={props.prevTicket} variacao={props.varTicket} />
        <Row label="Despesas" atual={props.despesas} anterior={props.prevDespesas} variacao={props.varDespesas} invertColor />
      </div>
    </div>
  );
}
