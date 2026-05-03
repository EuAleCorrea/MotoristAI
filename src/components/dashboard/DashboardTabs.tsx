/*
 * DashboardTabs — iOS Segmented Control
 * Pill-style background with sliding indicator
 */

type ViewType = 'Hoje' | 'Diário' | 'Semanal' | 'Mensal' | 'Anual';

interface Props {
 activeView: ViewType;
 setActiveView: (view: ViewType) => void;
}

const views: ViewType[] = ['Hoje', 'Diário', 'Semanal', 'Mensal', 'Anual'];

function DashboardTabs({ activeView, setActiveView }: Props) {
 const activeIndex = views.indexOf(activeView);

 return (
 <div
 className="relative flex rounded-ios p-0.5"
 style={{ backgroundColor: 'var(--ios-fill)' }}
 >
 {/* Sliding indicator */}
 <div
 className="absolute top-0.5 bottom-0.5 rounded-ios transition-all duration-250 ease-out"
 style={{
 width: `${100 / views.length}%`,
 left: `${(activeIndex / views.length) * 100}%`,
 backgroundColor: 'var(--ios-accent)',
 boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
 }}
 />

 {views.map((view) => (
 <button
 key={view}
 onClick={() => setActiveView(view)}
 className="relative z-10 flex-1 py-2 text-center transition-colors duration-150"
 style={{
 fontSize: '13px',
 fontWeight: 600,
 color: activeView === view ? '#FFFFFF' : 'var(--ios-text-secondary)',
 minHeight: '32px',
 }}
 >
 {view}
 </button>
 ))}
 </div>
 );
}

export default DashboardTabs;
