import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTripStore } from '../store/tripStore';
import { useExpenseStore } from '../store/expenseStore';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

function Analytics() {
  const trips = useTripStore((state) => state.trips);
  const expenses = useExpenseStore((state) => state.expenses);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const getMonthsData = () => {
    const periods: Record<string, number> = {
      '3months': 3,
      '6months': 6,
      '12months': 12,
    };

    const monthsCount = periods[selectedPeriod] || 6;
    const endDate = new Date();
    const startDate = subMonths(endDate, monthsCount - 1);

    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTrips = trips.filter(
        (trip) => new Date(trip.date) >= monthStart && new Date(trip.date) <= monthEnd
      );
      const monthExpenses = expenses.filter(
        (expense) => new Date(expense.date) >= monthStart && new Date(expense.date) <= monthEnd
      );

      const revenue = monthTrips.reduce((sum, trip) => sum + trip.amount, 0);
      const expenseTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      return {
        month: format(month, 'MMM/yy', { locale: ptBR }),
        revenue,
        expenses: expenseTotal,
        profit: revenue - expenseTotal,
        trips: monthTrips.length,
      };
    });
  };

  const monthsData = getMonthsData();

  const monthlyRevenueOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `${params[0].axisValue}<br/>
                Receita: R$ ${params[0].value.toFixed(2)}<br/>
                Despesas: R$ ${params[1].value.toFixed(2)}<br/>
                Lucro: R$ ${params[2].value.toFixed(2)}`;
      },
    },
    legend: {
      data: ['Receita', 'Despesas', 'Lucro'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: monthsData.map((d) => d.month),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: 'R$ {value}',
      },
    },
    series: [
      {
        name: 'Receita',
        type: 'bar',
        data: monthsData.map((d) => d.revenue),
        itemStyle: { color: '#22c55e' },
      },
      {
        name: 'Despesas',
        type: 'bar',
        data: monthsData.map((d) => d.expenses),
        itemStyle: { color: '#ef4444' },
      },
      {
        name: 'Lucro',
        type: 'line',
        data: monthsData.map((d) => d.profit),
        itemStyle: { color: '#3b82f6' },
        smooth: true,
      },
    ],
  };

  const tripsCountOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: monthsData.map((d) => d.month),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Corridas',
        type: 'line',
        smooth: true,
        data: monthsData.map((d) => d.trips),
        itemStyle: { color: '#3b82f6' },
        areaStyle: { opacity: 0.3 },
      },
    ],
  };

  // Expense categories breakdown
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseCategoryOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: R$ {c} ({d}%)',
    },
    series: [
      {
        name: 'Despesas por Categoria',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: Object.entries(expensesByCategory).map(([name, value]) => ({
          name,
          value,
        })),
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análise Financeira</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visualize tendências e padrões nos seus ganhos
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="3months">Últimos 3 meses</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="12months">Últimos 12 meses</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Receita, Despesas e Lucro Mensal
        </h2>
        <ReactECharts option={monthlyRevenueOption} style={{ height: '400px' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Número de Corridas por Mês
          </h2>
          <ReactECharts option={tripsCountOption} style={{ height: '300px' }} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Despesas por Categoria
          </h2>
          {Object.keys(expensesByCategory).length > 0 ? (
            <ReactECharts option={expenseCategoryOption} style={{ height: '300px' }} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Nenhuma despesa registrada
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Período</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-success-600 font-medium">Receita Total</p>
            <p className="mt-2 text-2xl font-bold text-success-700">
              R$ {monthsData.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-danger-50 rounded-lg">
            <p className="text-sm text-danger-600 font-medium">Despesas Totais</p>
            <p className="mt-2 text-2xl font-bold text-danger-700">
              R$ {monthsData.reduce((sum, d) => sum + d.expenses, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-600 font-medium">Lucro Total</p>
            <p className="mt-2 text-2xl font-bold text-primary-700">
              R$ {monthsData.reduce((sum, d) => sum + d.profit, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Total de Corridas</p>
            <p className="mt-2 text-2xl font-bold text-gray-700">
              {monthsData.reduce((sum, d) => sum + d.trips, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
