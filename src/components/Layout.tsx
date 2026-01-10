import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useModalStore } from '../store/modalStore';
import { useFamilyExpensesStore } from '../store/familyExpensesStore';
import { useVehicleExpensesStore } from '../store/vehicleExpensesStore';
import { useAuth } from '../contexts/AuthContext';
import AddChoiceModal from './AddChoiceModal';
import BottomNavBar from './BottomNavBar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { modalType } = useModalStore();
  const { user, loading } = useAuth();
  const { fetchExpenses: fetchFamilyExpenses } = useFamilyExpensesStore();
  const { fetchExpenses: fetchVehicleExpenses } = useVehicleExpensesStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, loading, navigate, location.pathname]);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchFamilyExpenses();
      fetchVehicleExpenses();
    }
  }, [user, fetchFamilyExpenses, fetchVehicleExpenses]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't show layout elements on login page
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        {children}
      </main>

      <BottomNavBar />

      {modalType === 'add-choice' && <AddChoiceModal />}
    </div>
  );
}

export default Layout;
