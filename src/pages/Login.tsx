import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthCard } from '../components/ui/AuthCard';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();



  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isResettingPassword) {
        await handleResetPassword();
        return;
      }

      const { data, error: authError } = isRegistering
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      if (!isRegistering) {
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

      resetSent={resetSent}
    />
  );
}

export default Login;
