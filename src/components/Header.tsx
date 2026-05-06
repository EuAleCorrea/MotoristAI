import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Ellipsis, LogOut, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { supabase } from '../services/supabase';

/*
 * Header — iOS Navigation Bar (clean, no colored background)
 * - Transparent/blurred background that matches iOS nav bar
 * - Title centered, back button left, actions right
 */

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainTabs = ['/dashboard', '/entradas', '/ai', '/despesas', '/ajustes', '/login', '/'];
  const isMainPage = mainTabs.includes(location.pathname);
  const showBackButton = !isMainPage;

  const handleLogout = async () => {
    setIsMenuOpen(false);
    // scope: 'local' — não revoga refresh_token para manter biometria funcionando
    await supabase.auth.signOut({ scope: 'local' });
    window.location.href = '/';
  };

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        backgroundColor: 'var(--ios-bg)',
        borderBottom: '0.33px solid var(--ios-separator)',
      }}
    >
      {/* Nav bar — 44pt height (iOS standard) */}
      <div className="h-11 flex items-center justify-between px-4">
        
        {/* Left: Back */}
        <div className="flex items-center min-w-[80px]">
          {showBackButton && (
            <button
              id="header-back-btn"
              onClick={() => navigate(-1)}
              className="flex items-center gap-0.5 -ml-1"
              style={{ color: 'var(--ios-accent)', minHeight: '44px' }}
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
              <span className="text-sm font-medium">Voltar</span>
            </button>
          )}
        </div>

        {/* Center: title */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-ios-headline font-semibold select-none"
          style={{ color: 'var(--ios-text)' }}
        >
          MotoristAI
        </span>

        {/* Right: theme + notifications + menu */}
        <div className="flex items-center gap-1 min-w-[80px] justify-end">
          <ThemeToggle />
          
          <button
            id="header-notifications-btn"
            className="w-10 h-11 flex items-center justify-center rounded-full"
            style={{ color: 'var(--ios-accent)' }}
            aria-label="Alertas"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              id="header-menu-btn"
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="w-10 h-11 flex items-center justify-center rounded-full"
              style={{ color: 'var(--ios-accent)' }}
              aria-label="Mais opções"
            >
              <Ellipsis className="h-5 w-5" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-48 overflow-hidden rounded-ios-lg animate-fade-in shadow-2xl z-50"
                style={{
                  backgroundColor: 'var(--ios-sheet-bg)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  border: '0.33px solid var(--ios-separator)',
                }}
              >
                <div className="px-4 py-2.5" style={{ borderBottom: '0.33px solid var(--ios-separator)', backgroundColor: 'var(--ios-fill)' }}>
                  <p className="text-ios-caption2 uppercase font-bold" style={{ color: 'var(--ios-text-secondary)' }}>
                    Conta
                  </p>
                </div>
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3"
                  style={{ color: 'var(--sys-red)', fontSize: '16px' }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair da conta</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
