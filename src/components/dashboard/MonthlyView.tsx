import { useState, useMemo } from 'react';
import { useTripStore } from '../../store/tripStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import { getMonthInterval } from '../../utils/dateHelpers';
import PeriodSummary, { PeriodData } from './PeriodSummary';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(currentYear, i), 'MMMM', { locale: ptBR }),
}));

function MonthlyView() {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const trips = useTripStore((state) => state.trips);
  const expenses = useExpenseStore((state) => state.expenses);
  const { getGoalByMonth } = useGoalStore();

  const monthlyData: PeriodData = useMemo(() => {
    const { start, end } = getMonthInterval(selectedYear, selectedMonth);
    
    const monthTrips = trips.filter(
      (trip) => new Date(trip.date) >= start && new Date(trip.date) <= end
    );
    const monthExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= start && new Date(expense.date) <= end
    );

    const revenue = monthTrips.reduce((sum, trip) => sum + trip.amount, 0);
    const expenseTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = monthTrips.length;
    const hoursWorked = monthTrips.reduce((sum, trip) => sum + trip.duration, 0) / 60;
    const kmDriven = monthTrips.reduce((sum, trip) => sum + trip.distance, 0);
    
    const monthGoal = getGoalByMonth(selectedYear, selectedMonth);
    const periodGoal = monthGoal?.revenue || 0;
    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = monthTrips.reduce((acc, trip) => {
      if (!acc[trip.platform]) acc[trip.platform] = 0;
      acc[trip.platform] += trip.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return { revenue, expenseTotal, balance, totalTrips, hoursWorked, kmDriven, periodGoal, performance, revenueByApp, periodExpenses: monthExpenses };
  }, [selectedYear, selectedMonth, trips, expenses, getGoalByMonth]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4 items-center">
        <h2 className="text-lg font-semibold text-gray-800">Resumo Mensal</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <PeriodSummary periodData={monthlyData} />
    </div>
  );
}

export default MonthlyView;
