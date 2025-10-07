import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Sparkles, Settings } from 'lucide-react';

const BottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Início', href: '/', icon: LayoutDashboard },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
    { name: 'IA', href: '/ia', icon: Sparkles },
    { name: 'Ajustes', href: '/configuracoes', icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white z-40 border-t border-gray-200">
      <div className="max-w-7xl mx-auto h-full flex justify-around items-center">
        {navItems.map((item) => (
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
      </div>
    </nav>
  );
};

export default BottomNavBar;
