import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthCard } from '../components/ui/AuthCard';
import { useBiometricAuth } from '../hooks/useBiometricAuth';

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
  const {
    isAvailable: biometricAvailable,
    isEnabled: biometricEnabled,
    isLoading: biometricLoading,
    biometricType,
    authenticateWithBiometric,
    saveSessionForBiometric,
  } = useBiometricAuth();
  const autoTriggeredRef = useRef(false);
  const biometricStartedRef = useRef(false);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    sessionStorage.removeItem('session_expired_reason');
  }, []);

  useEffect(() => {
    if (biometricLoading) return;
    if (!biometricEnabled) return;
    if (autoTriggeredRef.current) return;
    if (userInteractedRef.current) return;

    autoTriggeredRef.current = true;
    biometricStartedRef.current = true;

    const timer = setTimeout(() => {
      if (!userInteractedRef.current) {
        void handleBiometricLogin();
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricLoading, biometricEnabled]);

  useEffect(() => {
    if (email.length > 0) {
      userInteractedRef.current = true;
      biometricStartedRef.current = false;
    }
  }, [email]);

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
        biometricStartedRef.current = false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showBiometricSplash =
    biometricLoading || (biometricEnabled && biometricStartedRef.current && !user);

  if (showBiometricSplash) {
    return <BiometricSplash />;
  }

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

function BiometricSplash() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: 'var(--ios-bg, #0A0F1C)' }}
    >
      <img
        src="/assets/img/login_logo.png"
        alt="MotoristAI"
        className="w-32 h-32 animate-pulse"
      />
    </div>
  );
}

export default Login;
