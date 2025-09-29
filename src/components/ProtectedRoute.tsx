import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // ATENÇÃO: Este é um bypass temporário para desenvolvimento.
  // Para produção, remova esta linha e use a lógica de autenticação abaixo.
  return <Outlet />;

  // Lógica original de proteção de rota:
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="flex flex-col space-y-3">
  //         <Skeleton className="h-[125px] w-[250px] rounded-xl" />
  //         <div className="space-y-2">
  //           <Skeleton className="h-4 w-[250px]" />
  //           <Skeleton className="h-4 w-[200px]" />
  //         </div>
  //       </div>
  //     );
  //   }
  //
  //   return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;