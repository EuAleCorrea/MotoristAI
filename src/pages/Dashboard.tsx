import { useState, useEffect } from 'react';
import DashboardTabs from '../components/dashboard/DashboardTabs';
import DashboardHome from '../components/dashboard/DashboardHome';
import DailyView from '../components/dashboard/DailyView';
import WeeklyView from '../components/dashboard/WeeklyView';
import MonthlyView from '../components/dashboard/MonthlyView';
import AnnualView from '../components/dashboard/AnnualView';
import VehicleFilter from '../components/dashboard/VehicleFilter';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useGoalStore } from '../store/goalStore';
import { useSettingsFilterStore } from '../store/settingsFilterStore';

type ViewType = 'Hoje' | 'Diário' | 'Semanal' | 'Mensal' | 'Anual';

function Dashboard() {
 const [activeView, setActiveView] = useState<ViewType>('Hoje');
 const { fetchEntries } = useEntryStore();
 const { fetchExpenses } = useExpenseStore();
 const { fetchGoals } = useGoalStore();
 const selectedVehicle = useSettingsFilterStore((state) => state.selectedVehicle);

 useEffect(() => {
 fetchEntries();
 fetchExpenses();
 fetchGoals();
 }, [fetchEntries, fetchExpenses, fetchGoals]);

 const renderView = () => {
 const vehicleFilter = selectedVehicle || undefined;
 switch (activeView) {
 case 'Hoje': return <DashboardHome selectedVehicleId={vehicleFilter} />;
 case 'Diário': return <DailyView selectedVehicleId={vehicleFilter} />;
 case 'Semanal': return <WeeklyView selectedVehicleId={vehicleFilter} />;
 case 'Mensal': return <MonthlyView selectedVehicleId={vehicleFilter} />;
 case 'Anual': return <AnnualView selectedVehicleId={vehicleFilter} />;
 default: return <DashboardHome selectedVehicleId={vehicleFilter} />;
 }
 };

 return (
 <div className="space-y-5">
 {/* iOS Large Title */}
 <h1 className="text-ios-large-title font-bold" style={{ color: 'var(--ios-text)', letterSpacing: '0.37px' }}>
 Início
 </h1>

 {/* Vehicle Filter */}
 <div className="px-2">
 <VehicleFilter />
 </div>

 {/* Segmented Control */}
 <DashboardTabs activeView={activeView} setActiveView={setActiveView} />

 {/* Content */}
 {renderView()}
 </div>
 );
}

export default Dashboard;
