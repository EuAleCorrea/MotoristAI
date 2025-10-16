import { useState, useMemo } from 'react';
import { useTripStore } from '../../store/tripStore';
import { useExpenseStore } from '../../store/expenseStore';
import { useGoalStore } from '../../store/goalStore';
import { getYearInterval } from '../../utils/dateHelpers';
import PeriodSummary, { PeriodData } from './PeriodSummary';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

function AnnualView() {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const trips = useTripStore((state) => state.trips);
  const expenses = useExpenseStore((state) => state.expenses);
  const goals = useGoalStore((state) => state.goals);

  const annualData: PeriodData = useMemo(() => {
    const { start, end } = getYearInterval(selectedYear);
    
    const yearTrips = trips.filter(
      (trip) => new Date(trip.date) >= start && new Date(trip.date) <= end
    );
    const yearExpenses = expenses.filter(
      (expense) => new Date(expense.date) >= start && new Date(expense.date) <= end
    );
    const yearGoals = goals.filter(g => g.year === selectedYear);

    const revenue = yearTrips.reduce((sum, trip) => sum + trip.amount, 0);
    const expenseTotal = yearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = revenue - expenseTotal;
    const totalTrips = yearTrips.length;
    const hoursWorked = yearTrips.reduce((sum, trip) => sum + trip.duration, 0) / 60;
    const kmDriven = yearTrips.reduce((sum, trip) => sum + trip.distance, 0);
    
    const periodGoal = yearGoals.reduce((sum, goal) => sum + (goal.revenue || 0), 0);
    const performance = periodGoal > 0 ? (revenue / periodGoal) * 100 : 0;

    const revenueByApp = yearTrips.reduce((acc, trip) => {
      if (!acc[trip.platform]) acc[trip.platform] = 0;
      acc[trip.platform] += trip.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return { revenue, expenseTotal, balance, totalTrips, hoursWorked, kmDriven, periodGoal, performance, revenueByApp, periodExpenses: yearExpenses };
  }, [selectedYear, trips, expenses, goals]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap justify-between md:justify-start items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Resumo</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 h-10"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <PeriodSummary periodData={annualData} />
    </div>
  );
}

export default AnnualView;
