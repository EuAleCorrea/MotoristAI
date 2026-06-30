import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { markLogoutAsInactivity } from '../services/supabase';

const INACTIVITY_MS = 5 * 60 * 1000;

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'] as const;

export function useInactivityLogout() {
  const { session, signOut } = useAuth();
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    clearTimers();
    markLogoutAsInactivity();
    await signOut();
  }, [signOut, clearTimers]);

  const resetTimer = useCallback(() => {
    clearTimers();
    inactivityTimerRef.current = setTimeout(() => {
      void handleLogout();
    }, INACTIVITY_MS);
  }, [clearTimers, handleLogout]);

  useEffect(() => {
    if (!session) {
      clearTimers();
      return;
    }

    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimers();
    };
  }, [session, resetTimer, clearTimers]);
}
