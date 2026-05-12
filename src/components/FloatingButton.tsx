import { useRef, useState, useCallback, useEffect } from 'react';
import { X, Mic } from 'lucide-react';

/**
 * VoiceModal — Modal de escuta falso/simulado para a gravação de voz.
 */
const VoiceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 350); // Tempo ligeiramente menor que os 0.4s para garantir que não pisque antes de desmontar
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm ${isClosing ? 'animate-fade-out-overlay' : 'animate-fade-in-overlay'}`}>
      <div className={`bg-[var(--ios-bg)] w-full sm:w-[400px] h-[350px] sm:h-auto sm:rounded-2xl rounded-t-2xl p-6 flex flex-col items-center justify-between shadow-2xl ${isClosing ? 'animate-slide-down-curtain' : 'animate-slide-up-curtain'}`}>
        <div className="w-full flex justify-end">
          <button onClick={onClose} className="p-2 rounded-full bg-[var(--ios-surface)] text-[var(--ios-text-secondary)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Mic size={28} className="text-white" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-[var(--ios-text)]">Ouvindo...</h3>
            <p className="text-[var(--ios-text-secondary)] text-sm px-4">
              Diga algo como "Gastei 50 reais de gasolina hoje"
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 mt-4 bg-[var(--ios-surface)] text-[var(--ios-text)] font-medium rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-[var(--ios-border)]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

/**
 * FloatingButton — Botão flutuante arrastável.
 * Pode ser segurado e movido pela tela (touch + mouse).
 * Ao soltar, permanece na posição onde foi solto.
 */
const BUTTON_SIZE = 56;

const FloatingButton = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const isDragging = useRef(false);
  const dragStarted = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Posição inicial: recupera do localStorage se existir, senão usa padrão
  const [pos, setPos] = useState(() => {
    const defaultPos = { x: window.innerWidth - BUTTON_SIZE - 16, y: window.innerHeight - 160 };
    try {
      const savedPos = localStorage.getItem('floatingButtonPos');
      if (savedPos) {
        return JSON.parse(savedPos);
      }
    } catch (e) {
      console.error('Erro ao ler a posição do botão flutuante:', e);
    }
    return defaultPos;
  });

  // Persistir a posição sempre que ela mudar
  useEffect(() => {
    localStorage.setItem('floatingButtonPos', JSON.stringify(pos));
  }, [pos]);

  const clamp = useCallback((x: number, y: number) => {
    // Margens de segurança para não ultrapassar Header e NavBar
    const SAFE_MARGIN_TOP = 64;
    const SAFE_MARGIN_BOTTOM = 70;

    const minX = 0;
    const maxX = window.innerWidth - BUTTON_SIZE;
    const minY = SAFE_MARGIN_TOP;
    const maxY = window.innerHeight - BUTTON_SIZE - SAFE_MARGIN_BOTTOM;

    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    };
  }, []);

  // ── Touch handlers ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    isDragging.current = true;
    dragStarted.current = false;
    setIsActive(true);
    offset.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y,
    };
  }, [pos]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    dragStarted.current = true;
    const touch = e.touches[0];
    const newPos = clamp(touch.clientX - offset.current.x, touch.clientY - offset.current.y);
    setPos(newPos);
  }, [clamp]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    setIsActive(false);
  }, []);

  // ── Mouse handlers ──
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStarted.current = false;
    setIsActive(true);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  }, [pos]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    dragStarted.current = true;
    const newPos = clamp(e.clientX - offset.current.x, e.clientY - offset.current.y);
    setPos(newPos);
  }, [clamp]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    setIsActive(false);
  }, []);

  // Registrar listeners globais (move/up fora do botão)
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // Recalcular posição no resize (e na inicialização) para não ficar fora da tela
  useEffect(() => {
    const onResize = () => {
      setPos(prev => clamp(prev.x, prev.y));
    };
    onResize(); // Garante o clamp inicial
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clamp]);

  const handleClick = useCallback(() => {
    if (!dragStarted.current) {
      setIsModalOpen(true);
    }
    dragStarted.current = false;
  }, []);

  return (
    <>
      <button
        ref={btnRef}
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
        onClick={handleClick}
        aria-label="Botão flutuante"
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: '50%',
          border: 'none',
          background: isActive 
            ? 'linear-gradient(135deg, #005ecb 0%, #004494 100%)' // Cor mais escura quando pressionado
            : 'linear-gradient(135deg, var(--ios-accent) 0%, #005ecb 100%)',
          boxShadow: isActive 
            ? '0 2px 8px rgba(0, 122, 255, 0.6), 0 1px 3px rgba(0, 0, 0, 0.3)' // Sombra reduzida para efeito de afundar
            : '0 4px 14px rgba(0, 122, 255, 0.45), 0 2px 6px rgba(0, 0, 0, 0.2)',
          transform: isActive ? 'scale(0.92)' : 'scale(1)', // Efeito de apertar (escala)
          cursor: isDragging.current ? 'grabbing' : 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          transition: isDragging.current ? 'none' : 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, box-shadow 0.2s ease',
          willChange: 'left, top, transform',
        }}
      >
        {/* Ícone de microfone */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.2s ease', transform: isActive ? 'scale(0.95)' : 'scale(1)' }}>
          <rect x="9" y="2" width="6" height="12" rx="3" stroke="white" strokeWidth="2" />
          <path d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 18V22M12 22H9M12 22H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Modal de Escuta */}
      <VoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FloatingButton;
