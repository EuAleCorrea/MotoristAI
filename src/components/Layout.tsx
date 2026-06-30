import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import OnboardingTour from './OnboardingTour';
import FloatingButton from './FloatingButton';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useGoalStore } from '../store/goalStore';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';

const PUBLIC_POLICY_PATHS = ['/politicas/privacidade', '/politicas/termos', '/politicas/lgpd'];

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { fetchEntries } = useEntryStore();
  const { fetchExpenses } = useExpenseStore();
  const { fetchGoals } = useGoalStore();

  const onboarding = useOnboarding();

  const isPolicyPage = PUBLIC_POLICY_PATHS.includes(location.pathname);
  const isLoginPage = location.pathname === '/login';

  // Redirecionar para login se não estiver autenticado (exceto páginas públicas)
  useEffect(() => {
    if (!authLoading && !user && !isLoginPage && !isPolicyPage) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate, isLoginPage, isPolicyPage]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchEntries(), fetchExpenses(), fetchGoals()]);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [fetchEntries, fetchExpenses, fetchGoals, user]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Páginas públicas sem login
  if (isPolicyPage && !user) {
    return (
      <div className="h-screen-safe flex flex-col" style={{ backgroundColor: 'var(--ios-bg)' }}>
        <PublicHeader />
        <main className="flex-1 overflow-y-auto overscroll-y-contain px-4 pt-6 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-lg mx-auto">
            {children}
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Mostrar loading enquanto verifica autenticação
  if (authLoading || (!user && isLoading)) {
    return (
      <div className="h-screen-safe flex items-center justify-center" style={{ backgroundColor: 'var(--ios-bg)' }}>
        <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--ios-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  // Se não está na página de login e não tem usuário, não renderiza nada (o redirect cuida)
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen-safe flex flex-col" style={{ backgroundColor: 'var(--ios-bg)' }}>
      <Header />
      <main className="flex-1 overflow-y-auto overscroll-y-contain px-4 pb-28 pt-2" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>
      <BottomNavBar />

      {/* Onboarding para novos usuários */}
      {!isLoading && onboarding.showOnboarding && !onboarding.isLoading && (
        <OnboardingTour
          steps={onboarding.steps}
          currentStep={onboarding.currentStep}
          totalSteps={onboarding.totalSteps}
          onNext={onboarding.nextStep}
          onPrev={onboarding.prevStep}
          onComplete={onboarding.completeOnboarding}
          onSkip={onboarding.skipOnboarding}
        />
      )}

      {/* Botão flutuante arrastável */}
      <FloatingButton />
    </div>
  );
};

export default Layout;
