import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isMobile?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ href, label, icon: Icon, isMobile = false, onClick }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
        isActive ? 'bg-muted text-primary' : 'text-muted-foreground',
        isMobile && 'mx-[-0.65rem]', // Adjust margin for mobile drawer
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

export default SidebarLink;