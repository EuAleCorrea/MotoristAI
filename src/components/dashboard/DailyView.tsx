import { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import PeriodSummary, { PeriodData } from './PeriodSummary';
import { hhmmToHours } from '../../utils/dateHelpers';

function DailyView() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const entries = useEntryStore((state) => state.entries);
  const expenses = useExpenseStore((state) => state.expenses);
  const { getGoalByMonth } = useGoalStore();

  const dailyData: PeriodData = useMemo(() => {
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    const dayEntries = entries.filter(
      (entry) => new Date(entry.date) >= dayStart && new Date(entry.date) <= dayEnd
    );
    const dayExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= dayStart && new Date(expense.date) <= dayEnd
    );

    const revenue = dayEntries.reduce((sum, entry) => sum + entry.value, 0);
    const expenseTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = dayEntries.reduce((sum, entry) => sum + entry.tripCount, 0);
    const hoursWorked = dayEntries.reduce((sum, entry) => sum + hhmmToHours(entry.hoursWorked), 0);
    const kmDriven = dayEntries.reduce((sum, entry) => sum + entry.kmDriven, 0);

    const currentMonthGoal = getGoalByMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
    const monthlyRevenueGoal = currentMonthGoal?.revenue || 0;
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const workingDaysInMonth = currentMonthGoal?.daysWorkedPerWeek ? (daysInMonth / 7) * currentMonthGoal.daysWorkedPerWeek : daysInMonth;
    const periodGoal = monthlyRevenueGoal > 0 ? (monthlyRevenueGoal / workingDaysInMonth) : 0;

    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = dayEntries.reduce((acc, entry) => {
      if (!acc[entry.source]) {
        acc[entry.source] = 0;
      }
      acc[entry.source] += entry.value;
      return acc;
    }, {} as Record<string, number>);

    return {
      revenue,
      expenseTotal,
      balance,
      totalTrips,
      hoursWorked,
      kmDriven,
      periodGoal,
      performance,
      revenueByApp,
      periodExpenses: dayExpenses,
    };
  }, [selectedDate, entries, expenses, getGoalByMonth]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-wrap justify-between md:justify-start items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Resumo</h2>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 h-10 bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>
      <PeriodSummary periodData={dailyData} />
    </div>
  );
}

export default DailyView;
