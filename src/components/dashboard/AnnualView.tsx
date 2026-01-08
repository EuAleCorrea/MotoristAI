import { useState, useMemo } from 'react';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import { getYearInterval, hhmmToHours } from '../../utils/dateHelpers';
import PeriodSummary, { PeriodData } from './PeriodSummary';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

function AnnualView() {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const entries = useEntryStore((state) => state.entries);
  const expenses = useExpenseStore((state) => state.expenses);
  const goals = useGoalStore((state) => state.goals);

  const annualData: PeriodData = useMemo(() => {
    const { start, end } = getYearInterval(selectedYear);

    const yearEntries = entries.filter(
      (entry) => new Date(entry.date) >= start && new Date(entry.date) <= end
    );
    const yearExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= start && new Date(expense.date) <= end
    );
    const yearGoals = goals.filter(g => g.year === selectedYear);

    const revenue = yearEntries.reduce((sum, entry) => sum + entry.value, 0);
    const expenseTotal = yearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = yearEntries.reduce((sum, entry) => sum + entry.tripCount, 0);
    const hoursWorked = yearEntries.reduce((sum, entry) => sum + hhmmToHours(entry.hoursWorked), 0);
    const kmDriven = yearEntries.reduce((sum, entry) => sum + entry.kmDriven, 0);

    const periodGoal = yearGoals.reduce((sum, goal) => sum + (goal.revenue || 0), 0);
    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = yearEntries.reduce((acc, entry) => {
      if (!acc[entry.source]) acc[entry.source] = 0;
      acc[entry.source] += entry.value;
      return acc;
    }, {} as Record<string, number>);

    return { revenue, expenseTotal, balance, totalTrips, hoursWorked, kmDriven, periodGoal, performance, revenueByApp, periodExpenses: yearExpenses };
  }, [selectedYear, entries, expenses, goals]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-wrap justify-between md:justify-start items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Resumo Anual</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 h-10 bg-white dark:bg-gray-700 dark:text-white"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <PeriodSummary periodData={annualData} />
    </div>
  );
}

export default AnnualView;
