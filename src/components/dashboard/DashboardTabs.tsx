interface DashboardTabsProps {
  activeView: string;
  setActiveView: (view: 'Hoje' | 'Diário' | 'Semanal' | 'Mensal' | 'Anual') => void;
}

const tabs: ('Hoje' | 'Diário' | 'Semanal' | 'Mensal' | 'Anual')[] = ['Hoje', 'Diário', 'Semanal', 'Mensal', 'Anual'];

function DashboardTabs({ activeView, setActiveView }: DashboardTabsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 flex space-x-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveView(tab)}
          className={`flex-1 min-w-fit py-2.5 px-3 text-sm font-semibold rounded-md transition-colors focus:outline-none whitespace-nowrap ${activeView === tab
            ? 'bg-primary-600 text-white shadow'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default DashboardTabs;

