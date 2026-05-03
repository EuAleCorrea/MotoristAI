import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavBar from './BottomNavBar';
import OnboardingTour from './OnboardingTour';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useGoalStore } from '../store/goalStore';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';

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

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate, location.pathname]);

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

 const isLoginPage = location.pathname === '/login';

 if (isLoginPage) {
 return <>{children}</>;
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
  </div>
  );
};

export default Layout;
