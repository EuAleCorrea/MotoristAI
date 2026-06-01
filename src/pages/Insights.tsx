import { useState } from 'react';
import { useInsightsData, PeriodType } from '../hooks/useInsightsData';
import { Sparkles } from 'lucide-react';
import InsightsSummary from '../components/insights/InsightsSummary';
import InsightsAlerts from '../components/insights/InsightsAlerts';
import InsightsMeta from '../components/insights/InsightsMeta';
import PageHeader from '../components/PageHeader';
import InsightsDailyEvolution from '../components/insights/InsightsDailyEvolution';
import InsightsTrend from '../components/insights/InsightsTrend';
import InsightsEfficiency from '../components/insights/InsightsEfficiency';
import InsightsPlatforms from '../components/insights/InsightsPlatforms';
import InsightsCosts from '../components/insights/InsightsCosts';
import InsightsComparative from '../components/insights/InsightsComparative';
import { InsightsBreakeven, InsightsProjection, InsightsScore } from '../components/insights/InsightsExtra';

const PERIODS: { key: PeriodType; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
];

export default function Insights() {
  const [period, setPeriod] = useState<PeriodType>('mes');
  const data = useInsightsData(period);

  return (
    <div className="pb-20 min-h-[100dvh] bg-ios-bg text-ios-text" style={{ background: 'var(--ios-bg)', color: 'var(--ios-text)' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4" style={{
        background: 'var(--ios-header-bg)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '0.5px solid var(--ios-separator)',
      }}>
        <div className="flex flex-col gap-3 pb-3">
          {/* Top Line: Icon + Title + Description */}
          <div className="flex items-center gap-3 pt-2">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-ios flex-shrink-0"
              style={{ background: 'rgba(0, 136, 255, 0.12)' }}
            >
              <Sparkles className="h-5 w-5 text-[var(--ios-accent)]" strokeWidth={2} />
            </div>
            <div className="flex items-baseline gap-2">
              <h2
                className="text-ios-title3 font-semibold text-[var(--ios-text)]"
                style={{ letterSpacing: '-0.43px' }}
              >
                Insights
              </h2>
              <span className="text-xs font-normal" style={{ color: 'var(--ios-text-secondary)' }}>
                Análise de performance
              </span>
            </div>
          </div>

          {/* Bottom Line: Period selector */}
          <div className="flex w-full gap-0.5 p-0.5 rounded-lg" style={{ background: 'var(--ios-fill)', border: '0.5px solid var(--ios-separator)' }}>
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all text-center"
                style={{
                  background: period === p.key ? 'var(--sys-blue)' : 'transparent',
                  color: period === p.key ? '#fff' : 'var(--ios-text-secondary)',
                }}
              >{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <InsightsSummary
        faturamento={data.faturamento}
        despesas={data.despesas}
        lucro={data.lucro}
        rsHora={data.rsHora}
      />

      {!data.hasEnoughData ? (
        <div className="text-center py-12 px-6">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-base font-medium" style={{ color: 'var(--ios-text-secondary)' }}>Nenhum dado no período</div>
          <div className="text-sm mt-1.5" style={{ color: 'var(--ios-text-tertiary)' }}>Registre entradas para ver seus insights aqui.</div>
        </div>
      ) : (
        <div className="pb-8">
          <InsightsAlerts alertas={data.alertas} />
          <InsightsMeta
            monthLucro={data.monthLucro}
            metaMensal={data.metaMensal}
            metaPercentual={data.metaPercentual}
            necessarioDia={data.necessarioDia}
            projecaoMensal={data.projecaoMensal}
            diasRestantes={data.diasRestantes}
          />
          <InsightsDailyEvolution
            evolucaoDiaria={data.evolucaoDiaria}
            varLucro={data.varLucro}
            faturamento={data.faturamento}
          />
          <InsightsTrend tendencia={data.tendencia} rsHora={data.rsHora} />
          <InsightsEfficiency
            corridasPorHora={data.corridasPorHora}
            tempoMedioCorrida={data.tempoMedioCorrida}
            kmRodados={data.kmRodados}
          />
          <InsightsPlatforms plataformas={data.plataformas} totalFaturamento={data.faturamento} />
          <InsightsCosts
            fuelCost={data.fuelCost}
            depCost={data.depCost}
            maintCost={data.maintCost}
            otherCost={data.otherCost}
            custoKm={data.custoKm}
            despesas={data.despesas}
          />
          <InsightsComparative
            lucro={data.lucro} prevLucro={data.prevLucro} varLucro={data.varLucro}
            rsHora={data.rsHora} prevRsHora={data.prevRsHora} varRsHora={data.varRsHora}
            totalViagens={data.totalViagens} prevViagens={data.prevViagens} varViagens={data.varViagens}
            ticketMedio={data.ticketMedio} prevTicket={data.prevTicket} varTicket={data.varTicket}
            despesas={data.despesas} prevDespesas={data.prevDespesas} varDespesas={data.varDespesas}
          />
          <InsightsBreakeven breakEven={data.breakEven} lucroPorCorridaExtra={data.lucroPorCorridaExtra} />
          <InsightsProjection
            projecaoMensal={data.projecaoMensal}
            metaMensal={data.metaMensal}
            diasRestantes={data.diasRestantes}
            diasPlanejados={data.diasPlanejados}
          />
          <InsightsScore score={data.score} scoreClass={data.scoreClass} scoreTags={data.scoreTags} />
        </div>
      )}
    </div>
  );
}
