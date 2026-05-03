import { useState, useEffect, useCallback, useRef } from 'react';

export interface ReminderSettings {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
  daysOfWeek: number[]; // 0=domingo, 1=segunda... 6=sábado
  lastShownDate: string | null; // YYYY-MM-DD para evitar múltiplas notifs no mesmo dia
}

const STORAGE_KEY = 'motoristai_reminder_settings';

const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: false,
  hour: 19,
  minute: 0,
  daysOfWeek: [1, 2, 3, 4, 5], // segunda a sexta
  lastShownDate: null,
};

export function useNotificationReminder() {
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [permission, setPermission] = useState<NotificationPermission>(
    () => ('Notification' in window ? Notification.permission : 'denied')
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Persistir configurações
  const updateSettings = useCallback((partial: Partial<ReminderSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Solicitar permissão
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch {
      return false;
    }
  }, []);

  // Tipo estendido para ServiceWorkerNotification (aceita vibrate, requireInteraction)
  interface SWNotificationOptions extends NotificationOptions {
    vibrate?: number[];
    requireInteraction?: boolean;
    tag?: string;
    badge?: string;
  }

  // Mostrar notificação
  const showNotification = useCallback((title: string, body: string) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    // Se o service worker estiver registrado, usa ele para mostrar
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        const options: SWNotificationOptions = {
          body,
          icon: 'https://i.ibb.co/C7dMhXv/motoristai-192.png',
          badge: 'https://i.ibb.co/C7dMhXv/motoristai-192.png',
          tag: 'motoristai-reminder',
          vibrate: [200, 100, 200],
          requireInteraction: true,
        };
        reg.showNotification(title, options);
      });
    } else {
      // Fallback: Notification API direta
      new Notification(title, {
        body,
        icon: 'https://i.ibb.co/C7dMhXv/motoristai-192.png',
      });
    }
  }, []);

  // Verificar se deve mostrar notificação agora
  const checkAndNotify = useCallback(() => {
    const s = settingsRef.current;
    if (!s.enabled) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay(); // 0=domingo
    const today = now.toISOString().split('T')[0];

    // Verificar se já mostrou hoje
    if (s.lastShownDate === today) return;

    // Verificar se é dia da semana configurado
    if (!s.daysOfWeek.includes(currentDay)) return;

    // Verificar se está no horário (janela de 1 minuto)
    if (currentHour === s.hour && currentMinute === s.minute) {
      showNotification(
        '📋 Hora de registrar suas corridas!',
        'Não esqueça de lançar as corridas de hoje no MotoristAI.'
      );

      updateSettings({ lastShownDate: today });
    }
  }, [showNotification, updateSettings]);

  // Timer que verifica a cada 30 segundos
  useEffect(() => {
    if (!settings.enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Verificar imediatamente ao ativar
    checkAndNotify();

    timerRef.current = setInterval(checkAndNotify, 30_000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [settings.enabled, checkAndNotify]);

  // Registrar service worker para push notifications
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        // Verificar se já tem inscrição push
        reg.pushManager.getSubscription().then(sub => {
          // Aqui poderíamos enviar a inscrição para o Supabase
          // para disparar notificações mesmo com o app fechado
          if (sub) {
            console.log('[Push] Já inscrito:', sub.endpoint);
          }
        });
      });
    }
  }, []);

  // Resetar lastShownDate quando desativar/ativar
  const resetToday = useCallback(() => {
    updateSettings({ lastShownDate: null });
  }, [updateSettings]);

  return {
    settings,
    permission,
    updateSettings,
    requestPermission,
    showNotification,
    resetToday,
  };
}