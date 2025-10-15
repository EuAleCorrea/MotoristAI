import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Wallet, Plus, Settings } from 'lucide-react';
import { useModalStore } from '../store/modalStore';

const BottomNavBar = () => {
  const location = useLocation();
  const { openModal } = useModalStore();

  const navItems = [
    { name: 'Início', href: '/', icon: LayoutDashboard },
    { name: 'Corridas', href: '/corridas', icon: Car },
    { name: 'Despesas', href: '/despesas', icon: Wallet },
    { name: 'Ajustes', href: '/ajustes', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-40">
      <div className="relative h-16 bg-white rounded-2xl shadow-lg border border-gray-200 flex justify-around items-center">
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center w-1/4 transition-colors ${
              isActive(item.href) ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
            }`}
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
        
        <div className="w-0" /> 

        {navItems.slice(2, 4).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center w-1/4 transition-colors ${
              isActive(item.href) ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
            }`}
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+8px)]">
           <button
            onClick={() => openModal('add-choice')}
            className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-all transform hover:scale-110"
            aria-label="Adicionar novo"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
