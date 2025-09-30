import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import MobileSidebar from './sidebar/MobileSidebar.tsx';
import { ThemeToggle } from './ThemeToggle'; // Importação do ThemeToggle

const Header = () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetClose asChild>
            <MobileSidebar onLinkClick={() => {}} />
          </SheetClose>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* Can add a search bar here later */}
      </div>
      <ThemeToggle /> {/* Adicionando o ThemeToggle aqui */}
    </header>
  );
};

export default Header;