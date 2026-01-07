import { List, LayoutGrid } from 'lucide-react';

type View = 'list' | 'cards';

interface ViewToggleProps {
  view: View;
  setView: (view: View) => void;
}

const ViewToggle = ({ view, setView }: ViewToggleProps) => {
  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
      <button
        onClick={() => setView('list')}
        className={`px-3 py-1 rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        aria-label="Visualizar em lista"
      >
        <List className="h-5 w-5" />
      </button>
      <button
        onClick={() => setView('cards')}
        className={`px-3 py-1 rounded-md transition-colors ${view === 'cards' ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        aria-label="Visualizar em cards"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ViewToggle;
