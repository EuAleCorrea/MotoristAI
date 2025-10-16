import { useState, useMemo } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { useTripStore } from '../../store/tripStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import PeriodSummary, { PeriodData } from './PeriodSummary';

function DailyView() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const trips = useTripStore((state) => state.trips);
  const expenses = useExpenseStore((state) => state.expenses);
  const { getGoalByMonth } = useGoalStore();

  const dailyData: PeriodData = useMemo(() => {
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    const dayTrips = trips.filter(
      (trip) => new Date(trip.date) >= dayStart && new Date(trip.date) <= dayEnd
    );
    const dayExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= dayStart && new Date(expense.date) <= dayEnd
    );

    const revenue = dayTrips.reduce((sum, trip) => sum + trip.amount, 0);
    const expenseTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = dayTrips.length;
    const hoursWorked = dayTrips.reduce((sum, trip) => sum + trip.duration, 0) / 60;
    const kmDriven = dayTrips.reduce((sum, trip) => sum + trip.distance, 0);

    const currentMonthGoal = getGoalByMonth(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
    const monthlyRevenueGoal = currentMonthGoal?.revenue || 0;
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const workingDaysInMonth = currentMonthGoal?.daysWorkedPerWeek ? (daysInMonth / 7) * currentMonthGoal.daysWorkedPerWeek : daysInMonth;
    const periodGoal = monthlyRevenueGoal > 0 ? (monthlyRevenueGoal / workingDaysInMonth) : 0;

    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = dayTrips.reduce((acc, trip) => {
      if (!acc[trip.platform]) {
        acc[trip.platform] = 0;
      }
      acc[trip.platform] += trip.amount;
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
  }, [selectedDate, trips, expenses, getGoalByMonth]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap justify-between md:justify-start items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Resumo</h2>
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 h-10"
        />
      </div>
      <PeriodSummary periodData={dailyData} />
    </div>
  );
}

export default DailyView;
