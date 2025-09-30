import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import SidebarLink from './SidebarLink.tsx';
import SidebarCollapsibleItem from './SidebarCollapsibleItem.tsx';
import { mainNavItems, secondaryNavItems } from './nav-items.ts';
import SidebarFooter from './SidebarFooter.tsx'; // Importação do SidebarFooter

interface MobileSidebarProps {
  onLinkClick?: () => void;
}

const MobileSidebar = ({ onLinkClick }: MobileSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold" onClick={onLinkClick}>
          <Car className="h-6 w-6" />
          <span>MotoristAI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2 text-lg font-medium">
          {mainNavItems.map((item) => (
            <SidebarLink key={item.href} {...item} isMobile onClick={onLinkClick} />
          ))}
          <div className="my-4 border-t border-border" />
          {secondaryNavItems.map((item) => (
            <SidebarCollapsibleItem key={item.label} {...item} isMobile />
          ))}
        </nav>
      </div>
      <SidebarFooter /> {/* Adicionando o SidebarFooter aqui */}
    </div>
  );
};

export default MobileSidebar;