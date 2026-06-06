import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../services/supabase';
import { secureGet, secureSet, secureRemove } from '../lib/secureStorage';

const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

export interface BiometricState {
  isAvailable: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  biometricType: string;
  hasCredentials: boolean;
}

export function useBiometricAuth() {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    isEnabled: false,
    isLoading: true,
    biometricType: 'Biometria',
    hasCredentials: false,
  });

  const isNative = Capacitor.isNativePlatform();

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
      const enabledFlag = await secureGet(BIOMETRIC_ENABLED_KEY);
      const credentials = await secureGet(BIOMETRIC_CREDENTIALS_KEY);
      const isEnabled = enabledFlag === 'true';
      const hasCredentials = !!credentials;
      console.log(`[BiometricAuth] secureGet: enabledFlag=${enabledFlag}, credentials.length=${credentials?.length ?? 0}`);

      console.log(`[BiometricAuth] available=${available}, isEnabled=${isEnabled}, hasCredentials=${hasCredentials}, type=${biometricType}`);

      setState({
        isAvailable: available,
        isEnabled: available && isEnabled && hasCredentials,
        isLoading: false,
        biometricType,
        hasCredentials,
      });
    } catch (err: any) {
      console.error('[BiometricAuth] Erro ao verificar biometria:', err?.message ?? err);
      setState({ isAvailable: false, isEnabled: false, isLoading: false, biometricType: 'Biometria', hasCredentials: false });
    }
  }, [isNative]);

  useEffect(() => {
    checkBiometricAvailability();
  }, [checkBiometricAvailability]);

  const authenticateWithBiometric = useCallback(async (): Promise<{
    success: boolean;
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

      console.log('[BiometricAuth] Biometria confirmada — restaurando sessão');

      const credentialsJson = await secureGet(BIOMETRIC_CREDENTIALS_KEY);
      if (!credentialsJson) {
        return { success: false, error: 'Nenhuma credencial salva. Faça login com email primeiro.' };
      }

      const { email, password } = JSON.parse(credentialsJson);
      if (!email || !password) {
        return { success: false, error: 'Credenciais salvas estão corrompidas. Faça login com email.' };
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        const isInvalidCredentials =
          signInError.message?.toLowerCase().includes('invalid login') ||
          signInError.message?.toLowerCase().includes('invalid credentials');
        if (isInvalidCredentials) {
          console.warn('[BiometricAuth] Credenciais biométricas expiradas — limpando');
          await secureRemove(BIOMETRIC_CREDENTIALS_KEY);
          await secureRemove(BIOMETRIC_ENABLED_KEY);
          setState(prev => ({ ...prev, isEnabled: false }));
          return { success: false, error: 'Sua senha foi alterada. Entre com email para reativar a digital.' };
        }
        console.error('[BiometricAuth] Erro no signInWithPassword:', signInError.message);
        return { success: false, error: signInError.message };
      }

      console.log('[BiometricAuth] Sessão restaurada com sucesso');
      return { success: true };
    } catch (err: any) {
      console.log('[BiometricAuth] Erro na autenticação:', err?.code, err?.message);
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

  const saveSessionForBiometric = useCallback(async (email: string, password: string) => {
    if (!isNative) {
      console.warn('[BiometricAuth] saveSessionForBiometric ignorado: plataforma não nativa');
      return;
    }
    console.log(`[BiometricAuth] Salvando credenciais para ${email}...`);
    await secureSet(BIOMETRIC_CREDENTIALS_KEY, JSON.stringify({ email, password }));
    await secureSet(BIOMETRIC_ENABLED_KEY, 'true');
    console.log('[BiometricAuth] Credenciais salvas com sucesso');
    setState(prev => ({ ...prev, isEnabled: true, hasCredentials: true }));
  }, [isNative]);

  const clearBiometricSession = useCallback(async () => {
    await secureRemove(BIOMETRIC_CREDENTIALS_KEY);
    await secureRemove(BIOMETRIC_ENABLED_KEY);
    setState(prev => ({ ...prev, isEnabled: false }));
  }, []);

  const toggleBiometric = useCallback(async (enabled: boolean) => {
    if (enabled) {
      await secureSet(BIOMETRIC_ENABLED_KEY, 'true');
    } else {
      await secureRemove(BIOMETRIC_ENABLED_KEY);
      await secureRemove(BIOMETRIC_CREDENTIALS_KEY);
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

function getBiometricTypeName(types: readonly number[]): string {
  if (!types || types.length === 0) return 'Biometria';
  if (types.includes(3)) return 'Digital';
  if (types.includes(1)) return 'Digital';
  if (types.includes(2)) return 'Face ID';
  if (types.includes(4)) return 'Rosto';
  if (types.includes(5)) return 'Íris';
  return 'Biometria';
}
