import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';

export function PublicHeader() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-12">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">MotoristAI</span>
        </div>
      </div>
    </header>
  );
}
