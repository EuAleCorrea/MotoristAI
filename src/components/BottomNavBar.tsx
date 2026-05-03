import { useLocation, useNavigate } from 'react-router-dom';
import { Home, DollarSign, Mic, Receipt, Settings } from 'lucide-react';

/*
 * BottomNavBar — iOS Tab Bar (flat, no elevated buttons)
 * - White/dark background, 0.33px top border
 * - 5 equal tabs with icon + label
 * - Active = accent color, Inactive = gray
 */

const tabs = [
  { path: '/dashboard', label: 'Início', icon: Home },
 { path: '/entradas', label: 'Receitas', icon: DollarSign },
 { path: '/ai', label: 'Insights', icon: Mic },
 { path: '/despesas', label: 'Despesas', icon: Receipt },
 { path: '/ajustes', label: 'Ajustes', icon: Settings },
];

const BottomNavBar = () => {
 const location = useLocation();
 const navigate = useNavigate();

 const isActive = (path: string) => {
  if (path === '/dashboard') return location.pathname === '/dashboard';
 return location.pathname.startsWith(path);
 };

 return (
 <nav
 className="fixed bottom-0 left-0 right-0 z-30"
 style={{
 backgroundColor: 'var(--ios-sheet-bg)',
 borderTop: '0.33px solid var(--ios-separator)',
 paddingBottom: 'env(safe-area-inset-bottom, 0px)',
 }}
 >
 <div className="flex items-end justify-around h-12 px-2">
 {tabs.map((tab) => {
 const active = isActive(tab.path);
 const Icon = tab.icon;
 return (
 <button
 key={tab.path}
 onClick={() => navigate(tab.path)}
 className="flex flex-col items-center justify-center gap-0.5 flex-1 pt-1.5"
 style={{
 color: active ? 'var(--ios-accent)' : 'var(--sys-gray)',
 minHeight: '44px',
 }}
 >
 <Icon className="h-6 w-6" strokeWidth={active ? 2 : 1.5} />
 <span className="text-ios-tab">{tab.label}</span>
 </button>
 );
 })}
 </div>
 </nav>
 );
};

export default BottomNavBar;
