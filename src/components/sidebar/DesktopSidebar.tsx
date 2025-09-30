import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import SidebarLink from './SidebarLink.tsx';
import SidebarCollapsibleItem from './SidebarCollapsibleItem.tsx';
import { mainNavItems, secondaryNavItems } from './nav-items.ts';
import SidebarFooter from './SidebarFooter.tsx'; // Importação do SidebarFooter

const DesktopSidebar = () => {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6" />
            <span>MotoristAI</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {mainNavItems.map((item) => (
              <SidebarLink key={item.href} {...item} />
            ))}
            <div className="my-4 border-t border-border" />
            {secondaryNavItems.map((item) => (
              <SidebarCollapsibleItem key={item.label} {...item} />
            ))}
          </nav>
        </div>
        <SidebarFooter /> {/* Adicionando o SidebarFooter aqui */}
      </div>
    </aside>
  );
};

export default DesktopSidebar;