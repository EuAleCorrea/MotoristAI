import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export default function SplashHandler() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading && Capacitor.isNativePlatform()) {
      // Add a small delay to ensure React rendering is completely flushed to the screen
      setTimeout(() => {
        SplashScreen.hide({
          fadeOutDuration: 2000
        }).catch(console.error);
      }, 500);
    }
  }, [loading]);

  return null;
}
