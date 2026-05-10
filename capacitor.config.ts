import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.motoristai.app',
  appName: 'MotoristAI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#0A0F1C',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      launchShowDuration: 3000,
      backgroundColor: '#0A0F1C',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '582220214551-hg82u3ns7rrf9r1e0hpgeeq3oh8q27.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
