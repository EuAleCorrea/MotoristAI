import { useLocation, useNavigate } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Defines paths that are considered form pages and should have a back button.
  const formPagePatterns = [
    /^\/corridas\/(nova|[\w-]+\/editar)$/,
    /^\/despesas\/(nova|[\w-]+\/editar)$/,
    /^\/metas\/(nova|[\w-]+\/editar)$/,
    /^\/cadastros\/veiculos$/,
    /^\/despesas\/veiculo\/.+$/,
    /^\/despesas\/familia\/.+$/,
  ];

  const isFormPage = formPagePatterns.some(pattern => pattern.test(location.pathname));

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-slate-50/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-16">
          {isFormPage && (
            <button 
              onClick={() => navigate(-1)} 
              className="absolute left-0 flex items-center text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <div className="flex items-center">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">MotoristAI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
