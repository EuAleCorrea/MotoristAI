import { useState } from 'react';
import DashboardTabs from '../components/dashboard/DashboardTabs';
import DailyView from '../components/dashboard/DailyView';
import WeeklyView from '../components/dashboard/WeeklyView';
import MonthlyView from '../components/dashboard/MonthlyView';
import AnnualView from '../components/dashboard/AnnualView';

type ViewType = 'Diário' | 'Semanal' | 'Mensal' | 'Anual';

function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('Diário');

  const renderView = () => {
    switch (activeView) {
      case 'Diário':
        return <DailyView />;
      case 'Semanal':
        return <WeeklyView />;
      case 'Mensal':
        return <MonthlyView />;
      case 'Anual':
        return <AnnualView />;
      default:
        return <DailyView />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-16 z-20 bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2">
        <DashboardTabs activeView={activeView} setActiveView={setActiveView} />
      </div>
      <div className="pt-2">
        {renderView()}
      </div>
    </div>
  );
}

export default Dashboard;
