import { useState, useEffect } from 'react';
import DashboardTabs from '../components/dashboard/DashboardTabs';
import DashboardHome from '../components/dashboard/DashboardHome';
import DailyView from '../components/dashboard/DailyView';
import WeeklyView from '../components/dashboard/WeeklyView';
import MonthlyView from '../components/dashboard/MonthlyView';
import AnnualView from '../components/dashboard/AnnualView';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useGoalStore } from '../store/goalStore';

type ViewType = 'Hoje' | 'Diário' | 'Semanal' | 'Mensal' | 'Anual';

function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('Hoje');
  const { fetchEntries } = useEntryStore();
  const { fetchExpenses } = useExpenseStore();
  const { fetchGoals } = useGoalStore();

  useEffect(() => {
    fetchEntries();
    fetchExpenses();
    fetchGoals();
  }, [fetchEntries, fetchExpenses, fetchGoals]);

  const renderView = () => {
    switch (activeView) {
      case 'Hoje':
        return <DashboardHome />;
      case 'Diário':
        return <DailyView />;
      case 'Semanal':
        return <WeeklyView />;
      case 'Mensal':
        return <MonthlyView />;
      case 'Anual':
        return <AnnualView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-16 z-20 bg-slate-50 dark:bg-gray-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2">
        <DashboardTabs activeView={activeView} setActiveView={setActiveView} />
      </div>
      <div className="pt-2">
        {renderView()}
      </div>
    </div>
  );
}

export default Dashboard;

