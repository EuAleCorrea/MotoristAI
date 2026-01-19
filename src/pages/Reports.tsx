import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useVehicleExpensesStore } from '../store/vehicleExpensesStore';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PieChart, Gauge, Layers3, FileText, Calendar, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatNumber, formatInteger, formatChartCurrency } from '../utils/formatters';

type ViewType = 'category' | 'km_energy' | 'platforms' | 'monthly';

const viewConfig: Record<ViewType, { title: string; icon: React.ElementType; description: string }> = {
  category: { title: 'Custos por Categoria', icon: PieChart, description: 'Visualize como suas despesas estão distribuídas por categoria' },
  km_energy: { title: 'Custo por Km e Energia', icon: Gauge, description: 'Analise o custo por quilômetro rodado e consumo de energia' },
  platforms: { title: 'Plataformas e Categorias', icon: Layers3, description: 'Compare receitas entre diferentes plataformas de trabalho' },
  monthly: { title: 'Resumo Mensal', icon: FileText, description: 'Visão consolidada mensal de receitas, despesas e lucro' },
};

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const viewParam = searchParams.get('view') as ViewType | null;
  const [activeView, setActiveView] = useState<ViewType>(viewParam || 'category');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const entries = useEntryStore((state) => state.entries);
  const expenses = useExpenseStore((state) => state.expenses);
  const vehicleExpenses = useVehicleExpensesStore((state) => state.expenses);

  useEffect(() => {
    if (viewParam && viewParam !== activeView) {
      setActiveView(viewParam);
    }
  }, [viewParam]);

  const handleTabChange = (view: ViewType) => {
    setActiveView(view);
    setSearchParams({ view });
  };

  const getMonthsData = () => {
    const periods: Record<string, number> = { '3months': 3, '6months': 6, '12months': 12 };
    const monthsCount = periods[selectedPeriod] || 6;
    const endDate = new Date();
    const startDate = subMonths(endDate, monthsCount - 1);
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthEntries = entries.filter(
        (entry) => new Date(entry.date) >= monthStart && new Date(entry.date) <= monthEnd
      );
      const monthExpenses = expenses.filter(
        (expense) => new Date(expense.date) >= monthStart && new Date(expense.date) <= monthEnd
      );

      const revenue = monthEntries.reduce((sum, entry) => sum + entry.value, 0);
      const expenseTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const tripCount = monthEntries.reduce((sum, entry) => sum + entry.tripCount, 0);
      const kmTotal = monthEntries.reduce((sum, entry) => sum + (entry.km || 0), 0);

      return {
        month: format(month, 'MMM/yy', { locale: ptBR }),
        revenue,
        expenses: expenseTotal,
        profit: revenue - expenseTotal,
        trips: tripCount,
        km: kmTotal,
      };
    });
  };

  const monthsData = getMonthsData();

  // --- Category View ---
  const expensesByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) acc[expense.category] = 0;
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  const categoryChartOption = {
    tooltip: { trigger: 'item', formatter: (params: any) => `${params.name}: ${formatChartCurrency(params.value)} (${params.percent}%)` },
    series: [{
      name: 'Despesas', type: 'pie', radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: Object.entries(expensesByCategory).map(([name, value]) => ({ name, value })),
    }],
  };

  // --- Km/Energy View ---
  const kmEnergyData = useMemo(() => {
    const fuelExpenses = vehicleExpenses.filter(e => e.type === 'fuel');
    const totalFuelCost = fuelExpenses.reduce((sum, e) => sum + e.totalValue, 0);
    const totalKm = monthsData.reduce((sum, d) => sum + d.km, 0);
    const costPerKm = totalKm > 0 ? totalFuelCost / totalKm : 0;
    return { totalFuelCost, totalKm, costPerKm };
  }, [vehicleExpenses, monthsData]);

  // --- Platforms View ---
  const revenueByPlatform = useMemo(() => {
    return entries.reduce((acc, entry) => {
      const platform = entry.platform || 'Outros';
      if (!acc[platform]) acc[platform] = 0;
      acc[platform] += entry.value;
      return acc;
    }, {} as Record<string, number>);
  }, [entries]);

  const platformChartOption = {
    tooltip: { trigger: 'item', formatter: (params: any) => `${params.name}: ${formatChartCurrency(params.value)} (${params.percent}%)` },
    series: [{
      name: 'Receita', type: 'pie', radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data: Object.entries(revenueByPlatform).map(([name, value]) => ({ name, value })),
    }],
  };

  // --- Monthly View ---
  const monthlyChartOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Receita', 'Despesas', 'Lucro'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: monthsData.map((d) => d.month) },
    yAxis: { type: 'value', axisLabel: { formatter: (value: number) => formatChartCurrency(value) } },
    series: [
      { name: 'Receita', type: 'bar', data: monthsData.map((d) => d.revenue), itemStyle: { color: '#22c55e' } },
      { name: 'Despesas', type: 'bar', data: monthsData.map((d) => d.expenses), itemStyle: { color: '#ef4444' } },
      { name: 'Lucro', type: 'line', data: monthsData.map((d) => d.profit), itemStyle: { color: '#3b82f6' }, smooth: true },
    ],
  };

  const ActiveIcon = viewConfig[activeView].icon;

  const renderContent = () => {
    switch (activeView) {
      case 'category':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Despesas por Categoria</h2>
            {Object.keys(expensesByCategory).length > 0 ? (
              <ReactECharts option={categoryChartOption} style={{ height: '350px' }} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">Nenhuma despesa registrada</div>
            )}
          </div>
        );
      case 'km_energy':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Gasto (Combustível/Energia)</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">{formatCurrency(kmEnergyData.totalFuelCost)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Km Rodados (Período)</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatInteger(kmEnergyData.totalKm)} km</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Custo por Km</p>
                <p className="text-3xl font-bold text-success-600 mt-2">{formatNumber(kmEnergyData.costPerKm)}/km</p>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Para dados mais precisos, certifique-se de registrar a quilometragem em cada lançamento de receita.</p>
            </div>
          </div>
        );
      case 'platforms':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receita por Plataforma</h2>
            {Object.keys(revenueByPlatform).length > 0 ? (
              <ReactECharts option={platformChartOption} style={{ height: '350px' }} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">Nenhuma receita registrada</div>
            )}
          </div>
        );
      case 'monthly':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receita, Despesas e Lucro Mensal</h2>
              <ReactECharts option={monthlyChartOption} style={{ height: '400px' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-success-50 dark:bg-success-900/30 rounded-lg">
                <p className="text-sm text-success-600 dark:text-success-400 font-medium">Receita Total</p>
                <p className="mt-2 text-2xl font-bold text-success-700 dark:text-success-300">{formatCurrency(monthsData.reduce((sum, d) => sum + d.revenue, 0))}</p>
              </div>
              <div className="p-4 bg-danger-50 dark:bg-danger-900/30 rounded-lg">
                <p className="text-sm text-danger-600 dark:text-danger-400 font-medium">Despesas Totais</p>
                <p className="mt-2 text-2xl font-bold text-danger-700 dark:text-danger-300">{formatCurrency(monthsData.reduce((sum, d) => sum + d.expenses, 0))}</p>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">Lucro Total</p>
                <p className="mt-1 text-2xl font-bold text-primary-700 dark:text-primary-300">{formatCurrency(monthsData.reduce((sum, d) => sum + d.profit, 0))}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total de Viagens</p>
                <p className="mt-2 text-2xl font-bold text-gray-700 dark:text-gray-200">{monthsData.reduce((sum, d) => sum + d.trips, 0)}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ActiveIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{viewConfig[activeView].title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{viewConfig[activeView].description}</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="3months">Últimos 3 meses</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="12months">Últimos 12 meses</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        {(Object.keys(viewConfig) as ViewType[]).map((view) => {
          const Icon = viewConfig[view].icon;
          return (
            <button
              key={view}
              onClick={() => handleTabChange(view)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === view
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{viewConfig[view].title}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default Reports;
