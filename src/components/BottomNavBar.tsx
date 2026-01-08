import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, DollarSign, Wallet, Settings, Mic } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useEffect } from 'react';

const BottomNavBar = () => {
  const location = useLocation();
  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();

  const navItems = [
    { name: 'Início', href: '/', icon: LayoutDashboard },
    { name: 'Entradas', href: '/entradas', icon: DollarSign },
    { name: 'Despesas', href: '/despesas', icon: Wallet },
    { name: 'Ajustes', href: '/ajustes', icon: Settings },
  ];

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
      // TODO: Send audioBlob to API for processing
      console.log('Recording stopped, processing audio...');
    } else {
      startRecording();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-40">
      <div className="relative h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center">
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center w-1/5 transition-colors ${isActive(item.href) ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400 hover:text-primary-600'
              }`}
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}

        <div className="w-1/5" />

        {navItems.slice(2, 4).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center justify-center w-1/5 transition-colors ${isActive(item.href) ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400 hover:text-primary-600'
              }`}
          >
            <item.icon className="h-6 w-6 mb-0.5" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+4px)]">
          <button
            onClick={handleMicClick}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform hover:scale-110 ${isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-primary-600 hover:bg-primary-700'
              }`}
            aria-label={isRecording ? "Parar gravação" : "Iniciar gravação de voz"}
          >
            <Mic className={`h-7 w-7 ${isRecording ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
