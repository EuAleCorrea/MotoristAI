import { List, LayoutGrid } from 'lucide-react';

type View = 'list' | 'cards';

interface ViewToggleProps {
  view: View;
  setView: (view: View) => void;
}

const ViewToggle = ({ view, setView }: ViewToggleProps) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setView('list')}
        className={`px-3 py-1 rounded-md transition-colors ${
          view === 'list' ? 'bg-white text-primary-600 shadow' : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Visualizar em lista"
      >
        <List className="h-5 w-5" />
      </button>
      <button
        onClick={() => setView('cards')}
        className={`px-3 py-1 rounded-md transition-colors ${
          view === 'cards' ? 'bg-white text-primary-600 shadow' : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Visualizar em cards"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ViewToggle;
