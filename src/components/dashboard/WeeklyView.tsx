import { useState, useMemo } from 'react';
import { useTripStore } from '../../store/tripStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import { getWeeklyIntervals } from '../../utils/dateHelpers';
import PeriodSummary, { PeriodData } from './PeriodSummary';
import WeekSelector from './WeekSelector';

interface Week {
  start: Date;
  end: Date;
}

function WeeklyView() {
  const trips = useTripStore((state) => state.trips);
  const expenses = useExpenseStore((state) => state.expenses);
  const { getGoalByMonth } = useGoalStore();

  const weeklyIntervals = useMemo(() => getWeeklyIntervals(new Date(), 6), []);
  const [selectedWeek, setSelectedWeek] = useState<Week>(weeklyIntervals[0]);

  const weeklyData: PeriodData = useMemo(() => {
    if (!selectedWeek) {
      return { revenue: 0, expenseTotal: 0, balance: 0, totalTrips: 0, hoursWorked: 0, kmDriven: 0, periodGoal: 0, performance: 0, revenueByApp: {}, periodExpenses: [] };
    }
    
    const weekTrips = trips.filter(
      (trip) => new Date(trip.date) >= selectedWeek.start && new Date(trip.date) <= selectedWeek.end
    );
    const weekExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= selectedWeek.start && new Date(expense.date) <= selectedWeek.end
    );

    const revenue = weekTrips.reduce((sum, trip) => sum + trip.amount, 0);
    const expenseTotal = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = weekTrips.length;
    const hoursWorked = weekTrips.reduce((sum, trip) => sum + trip.duration, 0) / 60;
    const kmDriven = weekTrips.reduce((sum, trip) => sum + trip.distance, 0);

    const monthGoal = getGoalByMonth(selectedWeek.start.getFullYear(), selectedWeek.start.getMonth() + 1);
    const periodGoal = monthGoal?.revenue ? (monthGoal.revenue / 4) : 0; // Simplified weekly goal
    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = weekTrips.reduce((acc, trip) => {
      if (!acc[trip.platform]) acc[trip.platform] = 0;
      acc[trip.platform] += trip.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return { revenue, expenseTotal, balance, totalTrips, hoursWorked, kmDriven, periodGoal, performance, revenueByApp, periodExpenses: weekExpenses };
  }, [selectedWeek, trips, expenses, getGoalByMonth]);

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
