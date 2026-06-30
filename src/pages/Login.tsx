import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthCard } from '../components/ui/AuthCard';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { Clock, LogIn } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [expiredReason, setExpiredReason] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isAvailable: biometricAvailable,
    isEnabled: biometricEnabled,
    isLoading: biometricLoading,
    biometricType,
    authenticateWithBiometric,
    saveSessionForBiometric,
  } = useBiometricAuth();

  useEffect(() => {
    if (user && !expiredReason) navigate('/dashboard', { replace: true });
  }, [user, expiredReason, navigate]);

  useEffect(() => {
    const reason = sessionStorage.getItem('session_expired_reason');
    if (reason) {
      setExpiredReason(reason);
    }
  }, []);

  const handleExpiredLogin = () => {
    sessionStorage.removeItem('session_expired_reason');
    setExpiredReason(null);
  };

  if (expiredReason) {
    const message =
      expiredReason === '24h_limit'
        ? 'Sua sessão expirou após 24 horas.'
        : 'Sua sessão expirou por inatividade.';

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-xl p-8 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4">
              <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Sessão expirada</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-muted-foreground">Faça login novamente para continuar.</p>
          </div>
          <button
            type="button"
            onClick={handleExpiredLogin}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 font-medium transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Fazer login
          </button>
        </div>
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isResettingPassword) {
        await handleResetPassword();
        return;
      }

      const { error: authError } = isRegistering
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      if (!isRegistering) {
        await saveSessionForBiometric(email, password);
        navigate('/dashboard', { replace: true });
      } else {
        setError('Verifique seu email para confirmar o cadastro.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Digite seu email para receber o link de redefinição.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de redefinição.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    if (isResettingPassword) {
      setIsResettingPassword(false);
      setResetSent(false);
    } else {
      setIsRegistering(!isRegistering);
    }
    setError(null);
  };

  const handleForgotPassword = () => {
    setIsResettingPassword(true);
    setError(null);
  };

  const handleBiometricLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await authenticateWithBiometric();
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else if (result.error) {
        setError(result.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showBiometricButton = !biometricLoading && biometricAvailable && biometricEnabled;

  return (
    <AuthCard
      type={isResettingPassword ? 'reset' : isRegistering ? 'register' : 'login'}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      isLoading={isLoading}
      onSubmit={handleAuth}
      error={error}
      onToggleMode={handleToggleMode}
      onForgotPassword={handleForgotPassword}
      onBiometricLogin={showBiometricButton ? handleBiometricLogin : undefined}
      biometricType={biometricType}
      resetSent={resetSent}
    />
  );
}

export default Login;
