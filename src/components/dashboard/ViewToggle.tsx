import { List, LayoutGrid } from 'lucide-react';

/*
 * ViewToggle — Apple HIG Segmented Control (Compact)
 * Ref: hig-foundations/references/color.md - fill colors
 * Ref: hig-foundations/references/layout.md - segmented controls
 */

type View = 'list' | 'cards';

interface ViewToggleProps {
 view: View;
 setView: (view: View) => void;
}

const ViewToggle = ({ view, setView }: ViewToggleProps) => {
 return (
 <div
 className="flex p-0.5 rounded-ios-sm"
 style={{ background: 'rgba(118, 118, 128, 0.12)' }}
 >
 <button
 id="view-toggle-list"
 onClick={() => setView('list')}
 className={`px-3 py-1.5 rounded-[7px] transition-all duration-200
 ${view === 'list'
 ? 'bg-surface-primary text-[var(--ios-accent)] shadow-ios-card-sm'
 : 'text-[var(--ios-text-secondary)]'
 }`}
 aria-label="Visualizar em lista"
 >
 <List className="h-4.5 w-4.5" style={{ width: '18px', height: '18px' }} />
 </button>
 <button
 id="view-toggle-cards"
 onClick={() => setView('cards')}
 className={`px-3 py-1.5 rounded-[7px] transition-all duration-200
 ${view === 'cards'
 ? 'bg-surface-primary text-[var(--ios-accent)] shadow-ios-card-sm'
 : 'text-[var(--ios-text-secondary)]'
 }`}
 aria-label="Visualizar em cards"
 >
 <LayoutGrid className="h-4.5 w-4.5" style={{ width: '18px', height: '18px' }} />
 </button>
 </div>
 );
};

export default ViewToggle;
