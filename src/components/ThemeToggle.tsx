import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
 const { theme, toggleTheme } = useTheme();

 return (
 <button
 id="theme-toggle-btn"
 onClick={toggleTheme}
 className="w-11 h-11 flex items-center justify-center rounded-full"
 style={{ color: 'var(--ios-accent)' }}
 aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
 >
 {theme === 'light' ? (
 <Moon className="h-5 w-5" strokeWidth={1.8} />
 ) : (
 <Sun className="h-5 w-5" strokeWidth={1.8} />
 )}
 </button>
 );
};

export default ThemeToggle;
