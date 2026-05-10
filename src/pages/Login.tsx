import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthCard } from '../components/ui/AuthCard';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

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
    biometricType,
    authenticateWithBiometric,
    saveSessionForBiometric,
  } = useBiometricAuth();

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
        // Salvar sessão para uso com biometria (só no Android)
        if (data.session && biometricAvailable) {
          saveSessionForBiometric(
            data.session.access_token,
            data.session.refresh_token,
            email
          );
        }
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

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (Capacitor.isNativePlatform()) {
        // Android nativo: abre o browser do sistema com o fluxo OAuth do Supabase.
        // O Supabase cuida de tudo (Google consent, token exchange).
        // Ao final, redireciona para com.motoristai.app://login-callback com os tokens.
        // O deep link é interceptado pelo App.tsx (appUrlOpen listener).
        const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'com.motoristai.app://login-callback',
            skipBrowserRedirect: true, // Não redirecionar automaticamente — nós abrimos o browser
          },
        });

        if (oauthError) throw oauthError;
        if (!data.url) throw new Error('URL de autenticação não gerada');

        // Abre o Chrome Custom Tab com a URL do OAuth.
        // NÃO usar windowName: '_self' — isso abriria no WebView, quebrando o deep link.
        await Browser.open({ url: data.url });
        
        // O retorno é tratado pelo listener de deep link no App.tsx
        // O browser será fechado automaticamente ao voltar para o app
        setIsLoading(false);
      } else {
        // Web: usa o fluxo OAuth nativo do Supabase (redirect para Google)
        const { error: authError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (authError) throw authError;
        // O redirect acontece automaticamente — não precisa de navigate
      }
    } catch (err: any) {
      console.error('[GoogleAuth] Erro:', err.message);
      
      const cancelled = err.message === 'popup_closed_by_user';
      if (!cancelled) {
        setError(err.message || 'Erro ao entrar com Google');
      }
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    setError(null);

    const result = await authenticateWithBiometric();

    if (!result.success) {
      if (result.error) setError(result.error);
      setIsLoading(false);
      return;
    }

    try {
      // Estratégia 1: renovar sessão usando o refresh_token (dura semanas)
      // O access_token expira em 1h, mas o refresh_token é durável
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: result.refreshToken!,
      });

      if (!refreshError && refreshData.session) {
        // Atualizar os tokens salvos com os novos (mantém a digital sempre funcionando)
        if (result.email) {
          saveSessionForBiometric(
            refreshData.session.access_token,
            refreshData.session.refresh_token,
            result.email
          );
        }
        navigate('/dashboard', { replace: true });
        return;
      }

      // Estratégia 2: tentar setSession diretamente (caso refresh falhe por outro motivo)
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: result.accessToken!,
        refresh_token: result.refreshToken!,
      });

      if (!sessionError) {
        navigate('/dashboard', { replace: true });
        return;
      }

      // Ambos falharam → refresh_token também expirou (isso é raro, leva meses)
      setError('Sessão expirada. Faça login com email uma vez para reativar a digital.');
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao restaurar sessão');
      setIsLoading(false);
    }
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
      onGoogleLogin={handleGoogleLogin}
      onBiometricLogin={biometricAvailable && biometricEnabled ? handleBiometricLogin : undefined}
      biometricType={biometricType}
      resetSent={resetSent}
    />
  );
}

export default Login;
