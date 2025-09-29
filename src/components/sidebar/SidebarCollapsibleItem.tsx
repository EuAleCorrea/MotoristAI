import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SidebarLink from './SidebarLink.tsx'; // Importação corrigida

interface SubItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarCollapsibleItemProps {
  label: string;
  icon: LucideIcon;
  subItems: SubItem[];
  isMobile?: boolean;
}

const SidebarCollapsibleItem = ({ label, icon: Icon, subItems, isMobile = false }: SidebarCollapsibleItemProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(subItems.some(item => location.pathname === item.href));

  // Determine if any sub-item is active to keep the collapsible open
  const hasActiveSubItem = subItems.some(item => location.pathname === item.href);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-between flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
            hasActiveSubItem ? 'bg-muted text-primary' : 'text-muted-foreground',
            isMobile && 'mx-[-0.65rem]',
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="grid gap-2 pl-8 py-2">
          {subItems.map((item) => (
            <SidebarLink key={item.href} {...item} isMobile={isMobile} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarCollapsibleItem;