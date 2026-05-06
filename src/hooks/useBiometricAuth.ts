import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

// Chaves para armazenar sessão no localStorage (simulando Keystore seguro)
const BIOMETRIC_SESSION_KEY = 'motoristai_biometric_session';
const BIOMETRIC_EMAIL_KEY = 'motoristai_biometric_email';
const BIOMETRIC_ENABLED_KEY = 'motoristai_biometric_enabled';

export interface BiometricState {
  isAvailable: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  biometricType: string;
}

export function useBiometricAuth() {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    isEnabled: false,
    isLoading: true,
    biometricType: 'Biometria',
  });

  const isNative = Capacitor.isNativePlatform();

  // Verifica disponibilidade de biometria no dispositivo
  const checkBiometricAvailability = useCallback(async () => {
    if (!isNative) {
      console.log('[BiometricAuth] Plataforma não nativa — ignorando');
      setState(prev => ({ ...prev, isAvailable: false, isLoading: false }));
      return;
    }

    try {
      console.log('[BiometricAuth] Verificando disponibilidade...');
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');
      const info = await BiometricAuth.checkBiometry();

      console.log('[BiometricAuth] checkBiometry resultado:', JSON.stringify(info));

      const available = info.isAvailable;
      const biometricType = getBiometricTypeName(info.biometryTypes);
      const isEnabled = localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true';
      const hasSession = !!localStorage.getItem(BIOMETRIC_SESSION_KEY);

      console.log(`[BiometricAuth] available=${available}, isEnabled=${isEnabled}, hasSession=${hasSession}, type=${biometricType}`);

      setState({
        isAvailable: available,
        isEnabled: available && isEnabled,
        isLoading: false,
        biometricType,
      });
    } catch (err: any) {
      console.error('[BiometricAuth] Erro ao verificar biometria:', err?.message ?? err);
      setState({ isAvailable: false, isEnabled: false, isLoading: false, biometricType: 'Biometria' });
    }
  }, [isNative]);

  useEffect(() => {
    checkBiometricAvailability();
  }, [checkBiometricAvailability]);

  // Autentica com biometria e retorna a sessão salva
  const authenticateWithBiometric = useCallback(async (): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    error?: string;
  }> => {
    if (!isNative) return { success: false, error: 'Não disponível na web' };

    try {
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth');

      await BiometricAuth.authenticate({
        reason: 'Confirme sua identidade para acessar o MotoristAI',
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Usar senha',
        androidTitle: 'Autenticação MotoristAI',
        androidSubtitle: 'Use sua digital para entrar',
      });

      // Biometria OK — recuperar sessão salva
      const savedSession = localStorage.getItem(BIOMETRIC_SESSION_KEY);
      const savedEmail = localStorage.getItem(BIOMETRIC_EMAIL_KEY);

      if (!savedSession) {
        return { success: false, error: 'Nenhuma sessão salva. Faça login com email primeiro.' };
      }

      const { accessToken, refreshToken } = JSON.parse(savedSession);
      return { success: true, accessToken, refreshToken, email: savedEmail ?? undefined };
    } catch (err: any) {
      console.log('[BiometricAuth] Erro na autenticação:', err?.code, err?.message);
      // Usuário cancelou — silencioso
      const cancelCodes = ['userCancel', 'appCancel', 'systemCancel'];
      if (err?.code && cancelCodes.includes(err.code)) {
        return { success: false, error: '' };
      }
      if (err?.message?.toLowerCase().includes('cancel')) {
        return { success: false, error: '' };
      }
      return { success: false, error: err?.message ?? 'Erro na autenticação biométrica' };
    }
  }, [isNative]);

  // Salva a sessão do Supabase para uso futuro com biometria
  const saveSessionForBiometric = useCallback((accessToken: string, refreshToken: string, email: string) => {
    if (!isNative) return;
    localStorage.setItem(BIOMETRIC_SESSION_KEY, JSON.stringify({ accessToken, refreshToken }));
    localStorage.setItem(BIOMETRIC_EMAIL_KEY, email);
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
    setState(prev => ({ ...prev, isEnabled: true }));
  }, [isNative]);

  // Limpa dados biométricos (logout)
  const clearBiometricSession = useCallback(() => {
    localStorage.removeItem(BIOMETRIC_SESSION_KEY);
    localStorage.removeItem(BIOMETRIC_EMAIL_KEY);
    localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    setState(prev => ({ ...prev, isEnabled: false }));
  }, []);

  // Habilita ou desabilita biometria (nas configurações)
  const toggleBiometric = useCallback((enabled: boolean) => {
    if (enabled) {
      localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
    } else {
      localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
      localStorage.removeItem(BIOMETRIC_SESSION_KEY);
    }
    setState(prev => ({ ...prev, isEnabled: enabled }));
  }, []);

  return {
    ...state,
    authenticateWithBiometric,
    saveSessionForBiometric,
    clearBiometricSession,
    toggleBiometric,
    checkBiometricAvailability,
  };
}

// Determina o nome amigável do tipo de biometria
// BiometryType enum (v10): 0=none, 1=touchId, 2=faceId, 3=fingerprintAuthentication, 4=faceAuthentication, 5=irisAuthentication
function getBiometricTypeName(types: readonly number[]): string {
  if (!types || types.length === 0) return 'Biometria';
  // Android fingerprint = 3, iOS TouchID = 1
  if (types.includes(3)) return 'Digital';
  if (types.includes(1)) return 'Digital'; // iOS Touch ID
  if (types.includes(2)) return 'Face ID'; // iOS Face ID
  if (types.includes(4)) return 'Rosto';   // Android face
  if (types.includes(5)) return 'Íris';    // Android iris
  return 'Biometria';
}
