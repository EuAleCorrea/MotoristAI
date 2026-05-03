import { useState } from 'react';
import MetricCard from './MetricCard';
import ProgressBar from './ProgressBar';
import ViewToggle from './ViewToggle';
import { Target, TrendingDown, Wallet, Car, Clock, Route, DollarSign, BarChart, Shield, Sparkles, Award } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

export interface PeriodData {
 revenue: number;
 expenseTotal: number;
 balance: number;
 totalTrips: number;
 hoursWorked: number;
 kmDriven: number;
 periodGoal: number;
 performance: number;
 revenueByApp: Record<string, number>;
 periodExpenses: any[];
}

interface PeriodSummaryProps {
 periodData: PeriodData;
}

function PeriodSummary({ periodData }: PeriodSummaryProps) {
 const [metricsView, setMetricsView] = useState<'cards' | 'list'>('cards');
 const [showNonZeroExpenses, setShowNonZeroExpenses] = useState(false);

 const {
 revenue,
 expenseTotal,
 balance,
 totalTrips,
 hoursWorked,
 kmDriven,
 periodGoal,
 performance,
 revenueByApp,
 periodExpenses,
 } = periodData;

 const expensesToDisplay = showNonZeroExpenses ? periodExpenses.filter(e => e.amount > 0) : periodExpenses;

 const cardMetrics = [
 { icon: Car, label: "Total de Viagens", value: totalTrips.toString() },
 { icon: Clock, label: "Horas Trabalhadas", value: `${formatNumber(hoursWorked, 1)}h` },
 { icon: Route, label: "KM Rodados", value: `${formatNumber(kmDriven, 1)}km` },
 { icon: DollarSign, label: "Fat. por Viagem", value: formatCurrency(totalTrips > 0 ? revenue / totalTrips : 0) },
 { icon: BarChart, label: "Fat. Médio / Hora", value: formatCurrency(hoursWorked > 0 ? revenue / hoursWorked : 0) },
 { icon: Shield, label: "Fat. Médio / KM", value: formatCurrency(kmDriven > 0 ? revenue / kmDriven : 0) },
 { icon: TrendingDown, label: "Custo por Viagem", value: formatCurrency(totalTrips > 0 ? expenseTotal / totalTrips : 0) },
 { icon: Wallet, label: "Custo por Hora", value: formatCurrency(hoursWorked > 0 ? expenseTotal / hoursWorked : 0) },
 { icon: Sparkles, label: "Custo por KM", value: formatCurrency(kmDriven > 0 ? expenseTotal / kmDriven : 0) },
 { icon: Award, label: "Lucro por Viagem", value: formatCurrency(totalTrips > 0 ? balance / totalTrips : 0) },
 { icon: Target, label: "Lucro por Hora", value: formatCurrency(hoursWorked > 0 ? balance / hoursWorked : 0) },
 { icon: Sparkles, label: "Lucro por KM", value: formatCurrency(kmDriven > 0 ? balance / kmDriven : 0) },
 ];

 const listMetrics = [
 { icon: Car, label: "Total de Viagens", value: totalTrips.toString() },
 { icon: DollarSign, label: "Fat. por Viagem", value: formatCurrency(totalTrips > 0 ? revenue / totalTrips : 0) },
 { icon: TrendingDown, label: "Custo por Viagem", value: formatCurrency(totalTrips > 0 ? expenseTotal / totalTrips : 0) },
 { icon: Award, label: "Lucro por Viagem", value: formatCurrency(totalTrips > 0 ? balance / totalTrips : 0) },
 { icon: Clock, label: "Horas Trabalhadas", value: `${formatNumber(hoursWorked, 1)}h` },
 { icon: BarChart, label: "Fat. Médio / Hora", value: formatCurrency(hoursWorked > 0 ? revenue / hoursWorked : 0) },
 { icon: Wallet, label: "Custo por Hora", value: formatCurrency(hoursWorked > 0 ? expenseTotal / hoursWorked : 0) },
 { icon: Target, label: "Lucro por Hora", value: formatCurrency(hoursWorked > 0 ? balance / hoursWorked : 0) },
 { icon: Route, label: "KM Rodados", value: `${formatNumber(kmDriven, 1)}km` },
 { icon: Shield, label: "Fat. Médio / KM", value: formatCurrency(kmDriven > 0 ? revenue / kmDriven : 0) },
 { icon: Sparkles, label: "Custo por KM", value: formatCurrency(kmDriven > 0 ? expenseTotal / kmDriven : 0) },
 { icon: Sparkles, label: "Lucro por KM", value: formatCurrency(kmDriven > 0 ? balance / kmDriven : 0) },
 ];

 const appColors: Record<string, string> = {
 Uber: 'bg-[rgba(52,199,89,0.08)]0',
 '99': 'bg-yellow-400',
 iFood: 'bg-[rgba(255,59,48,0.08)]0',
 Rappi: 'bg-orange-500',
 Outros: 'bg-gray-400',
 };

 return (
 <div className="space-y-6">
 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm p-4 flex justify-between items-center">
 <div>
 <p className="text-sm font-medium text-[var(--ios-text-secondary)]">Performance</p>
 <p className="text-2xl font-bold text-[var(--ios-accent)] ">{formatPercent(performance)}</p>
 </div>
 <div className="text-right">
 <p className="text-sm font-medium text-[var(--ios-text-secondary)]">Meta do Período</p>
 <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">{formatCurrency(periodGoal)}</p>
 </div>
 </div>

 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm p-4">
 <div className="flex justify-between text-sm font-medium mb-1">
 <span className="text-[var(--ios-text)] ">Faturamento: {formatCurrency(revenue)}</span>
 </div>
 <ProgressBar value={revenue} max={periodGoal} color="bg-[rgba(52,199,89,0.08)]0" />
 <div className="flex justify-end text-sm font-medium mt-1">
 <span className="text-[var(--ios-text-secondary)]">Pendente: {formatCurrency(Math.max(0, periodGoal - revenue))}</span>
 </div>
 </div>

 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm p-6 text-center">
 <p className="text-md font-medium text-[var(--ios-text-secondary)]">Faturamento Total</p>
 <p className="text-4xl font-bold text-[var(--ios-text)] mt-1">{formatCurrency(revenue)}</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="text-center p-4 bg-[rgba(255,59,48,0.08)] rounded-lg">
 <p className="text-sm font-medium text-danger-600 dark:text-danger-400">Despesas</p>
 <p className="text-xl sm:text-2xl font-bold text-danger-700 dark:text-danger-300">{formatCurrency(expenseTotal)}</p>
 </div>
 <div className="text-center p-4 bg-[var(--ios-fill)] rounded-lg">
 <p className="text-sm font-medium text-[var(--ios-accent)] ">Saldo</p>
 <p className="text-xl sm:text-2xl font-bold text-[var(--ios-accent)] ">{formatCurrency(balance)}</p>
 </div>
 </div>

 <div>
 <div className="flex justify-end mb-4">
 <ViewToggle view={metricsView} setView={setMetricsView} />
 </div>
 {metricsView === 'cards' ? (
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
 {cardMetrics.map((metric) => (
 <MetricCard key={metric.label} {...metric} showIcon={false} />
 ))}
 </div>
 ) : (
 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm divide-y ">
 {listMetrics.map((metric) => (
 <div key={metric.label} className="flex items-center justify-between p-3">
 <div className="flex items-center gap-3">
 <metric.icon className="h-5 w-5 text-[var(--ios-accent)] " />
 <span className="text-sm text-[var(--ios-text-secondary)]">{metric.label}</span>
 </div>
 <span className="text-sm font-bold text-[var(--ios-text)] ">{metric.value}</span>
 </div>
 ))}
 </div>
 )}
 </div>

 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm p-4">
 <h3 className="text-md font-semibold text-[var(--ios-text)] mb-3">Faturamento por Aplicativo</h3>
 <div className="space-y-3">
 {Object.keys(revenueByApp).length > 0 ? Object.entries(revenueByApp).map(([app, amount]) => (
 <div key={app}>
 <div className="flex justify-between text-sm font-medium">
 <span className="">{app}</span>
 <span className="">{formatCurrency(amount)}</span>
 </div>
 <ProgressBar value={amount} max={revenue} color={appColors[app] || 'bg-gray-400'} />
 </div>
 )) : <p className="text-center text-[var(--ios-text-secondary)] text-sm py-4">Nenhuma corrida no período.</p>}
 </div>
 </div>

 <div className="bg-[var(--ios-card)] rounded-lg shadow-sm">
 <div className="flex justify-between items-center p-4 border-b ">
 <h3 className="text-md font-semibold text-[var(--ios-text)] ">Despesas</h3>
 <div className="flex items-center">
 <label htmlFor="expense-toggle" className="text-sm text-[var(--ios-text-secondary)] mr-2">Todas</label>
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" id="expense-toggle" className="sr-only peer" checked={showNonZeroExpenses} onChange={e => setShowNonZeroExpenses(e.target.checked)} />
 <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--ios-card)] after:border-[var(--ios-separator)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--ios-accent)]"></div>
 </label>
 </div>
 </div>
 <div className="p-4">
 {expensesToDisplay.length > 0 ? (
 <ul className="space-y-3">
 {expensesToDisplay.map(expense => (
 <li key={expense.id} className="flex items-center justify-between">
 <p className="font-medium text-[var(--ios-text)]">{expense.category}</p>
 <p className="font-semibold text-danger-600 dark:text-danger-400">- {formatCurrency(expense.amount)}</p>
 </li>
 ))}
 <li className="flex justify-between font-bold border-t pt-3 mt-3 text-[var(--ios-text)]">
 <span>Total</span>
 <span>{formatCurrency(expenseTotal)}</span>
 </li>
 </ul>
 ) : (
 <p className="text-center text-[var(--ios-text-secondary)] text-sm py-4">Nenhuma despesa no período.</p>
 )}
 </div>
 </div>
 </div>
 );
}

export default PeriodSummary;
