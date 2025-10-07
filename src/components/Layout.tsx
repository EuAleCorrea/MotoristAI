import { useModalStore } from '../store/modalStore';
import AddChoiceModal from './AddChoiceModal';
import BottomNavBar from './BottomNavBar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { modalType } = useModalStore();

  return (
    <div className="min-h-screen bg-slate-50">
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
