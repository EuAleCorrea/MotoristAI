import { useState, useMemo } from 'react';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import { getMonthInterval, hhmmToHours } from '../../utils/dateHelpers';
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

  const entries = useEntryStore((state) => state.entries);
  const expenses = useExpenseStore((state) => state.expenses);
  const { getGoalByMonth } = useGoalStore();

  const monthlyData: PeriodData = useMemo(() => {
    const { start, end } = getMonthInterval(selectedYear, selectedMonth);
    
    const monthEntries = entries.filter(
      (entry) => new Date(entry.date) >= start && new Date(entry.date) <= end
    );
    const monthExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= start && new Date(expense.date) <= end
    );

    const revenue = monthEntries.reduce((sum, entry) => sum + entry.value, 0);
    const expenseTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = monthEntries.reduce((sum, entry) => sum + entry.tripCount, 0);
    const hoursWorked = monthEntries.reduce((sum, entry) => sum + hhmmToHours(entry.hoursWorked), 0);
    const kmDriven = monthEntries.reduce((sum, entry) => sum + entry.kmDriven, 0);
    
    const monthGoal = getGoalByMonth(selectedYear, selectedMonth);
    const periodGoal = monthGoal?.revenue || 0;
    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = monthEntries.reduce((acc, entry) => {
      if (!acc[entry.source]) acc[entry.source] = 0;
      acc[entry.source] += entry.value;
      return acc;
    }, {} as Record<string, number>);
    
    return { revenue, expenseTotal, balance, totalTrips, hoursWorked, kmDriven, periodGoal, performance, revenueByApp, periodExpenses: monthExpenses };
  }, [selectedYear, selectedMonth, entries, expenses, getGoalByMonth]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap justify-between md:justify-start items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Resumo</h2>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 h-10"
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 h-10"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <PeriodSummary periodData={monthlyData} />
    </div>
  );
}

export default MonthlyView;
