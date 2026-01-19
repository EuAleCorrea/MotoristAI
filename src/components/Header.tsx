import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Car, ArrowLeft, Menu, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { supabase } from '../services/supabase';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Defines paths that are considered form pages and should have a back button.
  const formPagePatterns = [
    /^\/entradas\/(nova|[\w-]+\/editar)$/,
    /^\/despesas\/(nova|[\w-]+\/editar)$/,
    /^\/metas$/,
    /^\/metas\/(nova|[\w-]+\/editar)$/,
    /^\/cadastros\/veiculos$/,
    /^\/cadastros\/plataformas$/,
    /^\/despesas\/veiculo\/.+$/,
    /^\/despesas\/familia\/.+$/,
    /^\/faq$/,
    /^\/suporte$/,
    /^\/relatorios$/,
    /^\/politicas\/.+$/,
  ];

  const isFormPage = formPagePatterns.some(pattern => pattern.test(location.pathname));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Left: Back Button or Spacer */}
          <div className="flex items-center w-12">
            {isFormPage && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Voltar para o Dashboard"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Center: Logo */}
          <div className="flex items-center absolute left-1/2 -translate-x-1/2">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MotoristAI</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Conta</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

