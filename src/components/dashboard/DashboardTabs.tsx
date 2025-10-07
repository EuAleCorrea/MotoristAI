interface DashboardTabsProps {
  activeView: string;
  setActiveView: (view: 'Diário' | 'Semanal' | 'Mensal' | 'Anual') => void;
}

const tabs: ('Diário' | 'Semanal' | 'Mensal' | 'Anual')[] = ['Diário', 'Semanal', 'Mensal', 'Anual'];

function DashboardTabs({ activeView, setActiveView }: DashboardTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveView(tab)}
          className={`w-full py-2.5 text-sm font-semibold rounded-md transition-colors focus:outline-none ${
            activeView === tab
              ? 'bg-primary-600 text-white shadow'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default DashboardTabs;
