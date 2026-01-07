import { useState } from 'react';
import MetricCard from './MetricCard';
import ProgressBar from './ProgressBar';
import ViewToggle from './ViewToggle';
import { Target, TrendingDown, Wallet, Car, Clock, Route, DollarSign, BarChart, Shield, Sparkles, Award } from 'lucide-react';

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
    { icon: Clock, label: "Horas Trabalhadas", value: `${hoursWorked.toFixed(1)}h` },
    { icon: Route, label: "KM Rodados", value: `${kmDriven.toFixed(1)}km` },
    { icon: DollarSign, label: "Fat. por Viagem", value: `R$ ${(totalTrips > 0 ? revenue / totalTrips : 0).toFixed(2)}` },
    { icon: BarChart, label: "Fat. Médio / Hora", value: `R$ ${(hoursWorked > 0 ? revenue / hoursWorked : 0).toFixed(2)}` },
    { icon: Shield, label: "Fat. Médio / KM", value: `R$ ${(kmDriven > 0 ? revenue / kmDriven : 0).toFixed(2)}` },
    { icon: TrendingDown, label: "Custo por Viagem", value: `R$ ${(totalTrips > 0 ? expenseTotal / totalTrips : 0).toFixed(2)}` },
    { icon: Wallet, label: "Custo por Hora", value: `R$ ${(hoursWorked > 0 ? expenseTotal / hoursWorked : 0).toFixed(2)}` },
    { icon: Sparkles, label: "Custo por KM", value: `R$ ${(kmDriven > 0 ? expenseTotal / kmDriven : 0).toFixed(2)}` },
    { icon: Award, label: "Lucro por Viagem", value: `R$ ${(totalTrips > 0 ? balance / totalTrips : 0).toFixed(2)}` },
    { icon: Target, label: "Lucro por Hora", value: `R$ ${(hoursWorked > 0 ? balance / hoursWorked : 0).toFixed(2)}` },
    { icon: Sparkles, label: "Lucro por KM", value: `R$ ${(kmDriven > 0 ? balance / kmDriven : 0).toFixed(2)}` },
  ];

  const listMetrics = [
    { icon: Car, label: "Total de Viagens", value: totalTrips.toString() },
    { icon: DollarSign, label: "Fat. por Viagem", value: `R$ ${(totalTrips > 0 ? revenue / totalTrips : 0).toFixed(2)}` },
    { icon: TrendingDown, label: "Custo por Viagem", value: `R$ ${(totalTrips > 0 ? expenseTotal / totalTrips : 0).toFixed(2)}` },
    { icon: Award, label: "Lucro por Viagem", value: `R$ ${(totalTrips > 0 ? balance / totalTrips : 0).toFixed(2)}` },
    { icon: Clock, label: "Horas Trabalhadas", value: `${hoursWorked.toFixed(1)}h` },
    { icon: BarChart, label: "Fat. Médio / Hora", value: `R$ ${(hoursWorked > 0 ? revenue / hoursWorked : 0).toFixed(2)}` },
    { icon: Wallet, label: "Custo por Hora", value: `R$ ${(hoursWorked > 0 ? expenseTotal / hoursWorked : 0).toFixed(2)}` },
    { icon: Target, label: "Lucro por Hora", value: `R$ ${(hoursWorked > 0 ? balance / hoursWorked : 0).toFixed(2)}` },
    { icon: Route, label: "KM Rodados", value: `${kmDriven.toFixed(1)}km` },
    { icon: Shield, label: "Fat. Médio / KM", value: `R$ ${(kmDriven > 0 ? revenue / kmDriven : 0).toFixed(2)}` },
    { icon: Sparkles, label: "Custo por KM", value: `R$ ${(kmDriven > 0 ? expenseTotal / kmDriven : 0).toFixed(2)}` },
    { icon: Sparkles, label: "Lucro por KM", value: `R$ ${(kmDriven > 0 ? balance / kmDriven : 0).toFixed(2)}` },
  ];

  const appColors: Record<string, string> = {
    Uber: 'bg-green-500',
    '99': 'bg-yellow-400',
    iFood: 'bg-red-500',
    Rappi: 'bg-orange-500',
    Outros: 'bg-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{performance.toFixed(0)}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Meta do Período</p>
          <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">R$ {periodGoal.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span className="text-gray-700 dark:text-gray-300">Faturamento: R$ {revenue.toFixed(2)}</span>
        </div>
        <ProgressBar value={revenue} max={periodGoal} color="bg-green-500" />
        <div className="flex justify-end text-sm font-medium mt-1">
          <span className="text-gray-500 dark:text-gray-400">Pendente: R$ {Math.max(0, periodGoal - revenue).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
        <p className="text-md font-medium text-gray-600 dark:text-gray-400">Faturamento Total</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">R$ {revenue.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-danger-50 dark:bg-danger-900/30 rounded-lg">
          <p className="text-sm font-medium text-danger-600 dark:text-danger-400">Despesas</p>
          <p className="text-xl sm:text-2xl font-bold text-danger-700 dark:text-danger-300">R$ {expenseTotal.toFixed(2)}</p>
        </div>
        <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Saldo</p>
          <p className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-300">R$ {balance.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-end mb-4">
          <ViewToggle view={metricsView} setView={setMetricsView} />
        </div>
        {metricsView === 'cards' ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {cardMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} showIcon={false} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y dark:divide-gray-700">
            {listMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <metric.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Faturamento por Aplicativo</h3>
        <div className="space-y-3">
          {Object.keys(revenueByApp).length > 0 ? Object.entries(revenueByApp).map(([app, amount]) => (
            <div key={app}>
              <div className="flex justify-between text-sm font-medium">
                <span className="dark:text-gray-300">{app}</span>
                <span className="dark:text-gray-300">R$ {amount.toFixed(2)}</span>
              </div>
              <ProgressBar value={amount} max={revenue} color={appColors[app] || 'bg-gray-400'} />
            </div>
          )) : <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">Nenhuma corrida no período.</p>}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white">Despesas</h3>
          <div className="flex items-center">
            <label htmlFor="expense-toggle" className="text-sm text-gray-600 dark:text-gray-400 mr-2">Todas</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="expense-toggle" className="sr-only peer" checked={showNonZeroExpenses} onChange={e => setShowNonZeroExpenses(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
        <div className="p-4">
          {expensesToDisplay.length > 0 ? (
            <ul className="space-y-3">
              {expensesToDisplay.map(expense => (
                <li key={expense.id} className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{expense.category}</p>
                  <p className="font-semibold text-danger-600 dark:text-danger-400">- R$ {expense.amount.toFixed(2)}</p>
                </li>
              ))}
              <li className="flex justify-between font-bold border-t dark:border-gray-700 pt-3 mt-3 text-gray-900 dark:text-white">
                <span>Total</span>
                <span>R$ {expenseTotal.toFixed(2)}</span>
              </li>
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">Nenhuma despesa no período.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PeriodSummary;
