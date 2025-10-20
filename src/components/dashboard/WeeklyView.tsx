import { useState, useMemo } from 'react';
import { useEntryStore } from '../../store/entryStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import { getWeeklyIntervals, hhmmToHours } from '../../utils/dateHelpers';
import PeriodSummary, { PeriodData } from './PeriodSummary';
import WeekSelector from './WeekSelector';

interface Week {
  start: Date;
  end: Date;
}

function WeeklyView() {
  const entries = useEntryStore((state) => state.entries);
  const expenses = useExpenseStore((state) => state.expenses);
  const { getGoalByMonth } = useGoalStore();

  const weeklyIntervals = useMemo(() => getWeeklyIntervals(new Date(), 6), []);
  const [selectedWeek, setSelectedWeek] = useState<Week>(weeklyIntervals[0]);

  const weeklyData: PeriodData = useMemo(() => {
    if (!selectedWeek) {
      return { revenue: 0, expenseTotal: 0, balance: 0, totalTrips: 0, hoursWorked: 0, kmDriven: 0, periodGoal: 0, performance: 0, revenueByApp: {}, periodExpenses: [] };
    }
    
    const weekEntries = entries.filter(
      (entry) => new Date(entry.date) >= selectedWeek.start && new Date(entry.date) <= selectedWeek.end
    );
    const weekExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= selectedWeek.start && new Date(expense.date) <= selectedWeek.end
    );

    const revenue = weekEntries.reduce((sum, entry) => sum + entry.value, 0);
    const expenseTotal = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = weekEntries.reduce((sum, entry) => sum + entry.tripCount, 0);
    const hoursWorked = weekEntries.reduce((sum, entry) => sum + hhmmToHours(entry.hoursWorked), 0);
    const kmDriven = weekEntries.reduce((sum, entry) => sum + entry.kmDriven, 0);

    const monthGoal = getGoalByMonth(selectedWeek.start.getFullYear(), selectedWeek.start.getMonth() + 1);
    const periodGoal = monthGoal?.revenue ? (monthGoal.revenue / 4) : 0; // Simplified weekly goal
    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = weekEntries.reduce((acc, entry) => {
      if (!acc[entry.source]) acc[entry.source] = 0;
      acc[entry.source] += entry.value;
      return acc;
    }, {} as Record<string, number>);
    
    return { revenue, expenseTotal, balance, totalTrips, hoursWorked, kmDriven, periodGoal, performance, revenueByApp, periodExpenses: weekExpenses };
  }, [selectedWeek, entries, expenses, getGoalByMonth]);

  return (
    <div className="space-y-6">
      <WeekSelector
        weeks={weeklyIntervals}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />
      {selectedWeek && <PeriodSummary periodData={weeklyData} />}
    </div>
  );
}

export default WeeklyView;
