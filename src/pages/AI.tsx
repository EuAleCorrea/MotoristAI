import { useMemo } from 'react';
import { Sparkles, TrendingUp, Lightbulb, Target, Calculator, Clock, Gauge, DollarSign } from 'lucide-react';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useGoalStore } from '../store/goalStore';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { formatCurrency, formatNumber } from '../utils/formatters';

function AIAssistant() {
  const entries = useEntryStore((state) => state.entries);
  const expenses = useExpenseStore((state) => state.expenses);
  const { getGoalByMonth } = useGoalStore();

  const todayInsight = useMemo(() => {
    const today = new Date();
    const dayStart = startOfDay(today);
    const dayEnd = endOfDay(today);

    const todayEntries = entries.filter(
      (entry) => new Date(entry.date) >= dayStart && new Date(entry.date) <= dayEnd
    );

    const revenue = todayEntries.reduce((sum, entry) => sum + entry.value, 0);
    const km = todayEntries.reduce((sum, e) => sum + (e.kmDriven || 0), 0);
    const hours = todayEntries.reduce((sum, e) => {
      const [h, m] = (e.hoursWorked || '0:00').split(':').map(Number);
      return sum + h + (m || 0) / 60;
    }, 0);
    const trips = todayEntries.reduce((sum, e) => sum + (e.tripCount || 0), 0);

    const currentMonthGoal = getGoalByMonth(today.getFullYear(), today.getMonth() + 1);
    const monthlyRevenueGoal = currentMonthGoal?.revenue || 0;
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const workingDaysInMonth = currentMonthGoal?.daysWorkedPerWeek
      ? (daysInMonth / 7) * currentMonthGoal.daysWorkedPerWeek
      : daysInMonth;
    const dailyGoal = monthlyRevenueGoal > 0 ? (monthlyRevenueGoal / workingDaysInMonth) : 0;

    return { revenue, km, hours, trips, dailyGoal };
  }, [entries, getGoalByMonth]);

  const weekMetrics = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const weekEntries = entries.filter((e) => {
      const d = new Date(e.date);
      return d >= weekStart && d <= weekEnd;
    });

    const revenue = weekEntries.reduce((sum, e) => sum + e.value, 0);
    const km = weekEntries.reduce((sum, e) => sum + (e.kmDriven || 0), 0);
    const hours = weekEntries.reduce((sum, e) => {
      const [h, m] = (e.hoursWorked || '0:00').split(':').map(Number);
      return sum + h + (m || 0) / 60;
    }, 0);
    const trips = weekEntries.reduce((sum, e) => sum + (e.tripCount || 0), 0);
    const expenseTotal = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      revenue,
      km,
      hours,
      trips,
      expenseTotal,
      profit: revenue - expenseTotal,
      revenuePerHour: hours > 0 ? revenue / hours : 0,
      revenuePerKm: km > 0 ? revenue / km : 0,
      revenuePerTrip: trips > 0 ? revenue / trips : 0,
    };
  }, [entries, expenses]);

  const dicas = [
    {
      title: 'Meta Diária',
      desc: todayInsight.dailyGoal > 0
        ? `Sua meta hoje é de ${formatCurrency(todayInsight.dailyGoal)}. Faltam ${formatCurrency(Math.max(0, todayInsight.dailyGoal - todayInsight.revenue))} para bater.`
        : 'Defina uma meta mensal para acompanhar seu progresso diário.',
      icon: Target,
      color: 'var(--sys-blue)',
      bg: 'rgba(0, 122, 255, 0.1)',
    },
    {
      title: 'Ticket Médio',
      desc: todayInsight.trips > 0
        ? `Você está ganhando ${formatCurrency(todayInsight.revenue / todayInsight.trips)} por viagem em média hoje.`
        : 'Acompanhe seu ticket médio registrando suas corridas.',
      icon: DollarSign,
      color: 'var(--sys-purple)',
      bg: 'rgba(175, 82, 222, 0.1)',
    },
    {
      title: 'Eficiência',
      desc: todayInsight.hours > 0
        ? `R$ ${formatNumber(todayInsight.revenue / todayInsight.hours, 2)}/hora — ${todayInsight.revenue / todayInsight.hours > 25 ? 'Excelente! 🚀' : 'Tente otimizar seu tempo.'}`
        : 'Registre suas horas trabalhadas para ver sua eficiência.',
      icon: Clock,
      color: 'var(--sys-green)',
      bg: 'rgba(52, 199, 89, 0.1)',
    },
    {
      title: 'Custo por KM',
      desc: todayInsight.km > 0
        ? `R$ ${formatNumber(todayInsight.revenue / todayInsight.km, 2)}/km rodado.`
        : 'Quanto maior o R$/km, melhor sua rentabilidade.',
      icon: Gauge,
      color: 'var(--sys-orange)',
      bg: 'rgba(255, 149, 0, 0.1)',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-ios flex items-center justify-center"
          style={{ background: 'rgba(175, 82, 222, 0.12)', color: 'var(--sys-purple)' }}
        >
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--ios-text)]">Assistente MotoristAI</h1>
          <p className="text-sm text-[var(--ios-text-secondary)]">
            Análises inteligentes para otimizar seus ganhos
          </p>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="ios-card p-4">
        <h2 className="text-ios-subhead font-semibold text-[var(--ios-text)] mb-3">
          Resumo da Semana
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}>
            <p className="text-xs text-[var(--ios-text-secondary)]">Faturamento</p>
            <p className="text-lg font-bold" style={{ color: 'var(--sys-green)' }}>
              {formatCurrency(weekMetrics.revenue)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)' }}>
            <p className="text-xs text-[var(--ios-text-secondary)]">Despesas</p>
            <p className="text-lg font-bold" style={{ color: 'var(--sys-red)' }}>
              {formatCurrency(weekMetrics.expenseTotal)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}>
            <p className="text-xs text-[var(--ios-text-secondary)]">Lucro</p>
            <p className="text-lg font-bold" style={{ color: weekMetrics.profit >= 0 ? 'var(--sys-blue)' : 'var(--sys-red)' }}>
              {formatCurrency(weekMetrics.profit)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)' }}>
            <p className="text-xs text-[var(--ios-text-secondary)]">R$/Hora</p>
            <p className="text-lg font-bold" style={{ color: 'var(--sys-orange)' }}>
              {formatCurrency(weekMetrics.revenuePerHour)}
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <h2 className="text-ios-subhead font-semibold text-[var(--ios-text)] px-1">
          Insights de Hoje
        </h2>
        {dicas.map((dica, index) => {
          const Icon = dica.icon;
          return (
            <div
              key={index}
              className="ios-card p-4 flex gap-3 items-start"
              style={{ borderLeft: `3px solid ${dica.color}` }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-ios flex items-center justify-center"
                style={{ backgroundColor: dica.bg, color: dica.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-ios-headline font-semibold mb-0.5" style={{ color: 'var(--ios-text)' }}>
                  {dica.title}
                </h4>
                <p className="text-ios-subhead" style={{ color: 'var(--ios-text-secondary)' }}>
                  {dica.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Metrics */}
      <div className="ios-card p-4">
        <h2 className="text-ios-subhead font-semibold text-[var(--ios-text)] mb-3">
          Métricas da Semana (calculadas)
        </h2>
        <div className="space-y-3">
          {[
            { label: 'R$ / Hora', value: formatCurrency(weekMetrics.revenuePerHour), sub: `${formatNumber(weekMetrics.hours, 1)}h trabalhadas`, color: 'var(--sys-green)' },
            { label: 'R$ / KM', value: formatCurrency(weekMetrics.revenuePerKm), sub: `${formatNumber(weekMetrics.km, 0)} km rodados`, color: 'var(--sys-blue)' },
            { label: 'R$ / Viagem', value: formatCurrency(weekMetrics.revenuePerTrip), sub: `${weekMetrics.trips} viagens`, color: 'var(--sys-orange)' },
            { label: 'KM / Hora', value: `${formatNumber(weekMetrics.hours > 0 ? weekMetrics.km / weekMetrics.hours : 0, 1)} km`, sub: 'Produtividade', color: 'var(--sys-purple)' },
            { label: 'Lucro Líquido', value: formatCurrency(weekMetrics.profit), sub: `Faturamento - Despesas`, color: weekMetrics.profit >= 0 ? 'var(--sys-green)' : 'var(--sys-red)' },
          ].map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: 'var(--ios-fill)' }}
            >
              <div>
                <p className="text-ios-subhead font-medium" style={{ color: 'var(--ios-text)' }}>
                  {metric.label}
                </p>
                <p className="text-ios-caption2" style={{ color: 'var(--ios-text-secondary)' }}>
                  {metric.sub}
                </p>
              </div>
              <p className="text-ios-headline font-bold" style={{ color: metric.color }}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state call to action */}
      {entries.length === 0 && (
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-[var(--ios-text-tertiary)]" />
          <h3 className="text-lg font-semibold text-[var(--ios-text)] mb-2">
            Comece a registrar seus dados!
          </h3>
          <p className="text-sm text-[var(--ios-text-secondary)]">
            Adicione suas receitas e despesas para receber insights personalizados sobre seu desempenho.
          </p>
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
