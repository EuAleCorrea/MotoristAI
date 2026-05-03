import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protege rotas que exigem autenticação.
 * Redireciona para /login se o usuário não estiver logado.
 * Enquanto loading, não renderiza nada (evita flash).
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // ou um spinner futuramente
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}