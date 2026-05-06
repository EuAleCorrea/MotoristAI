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
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#0A0F1C',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '582220214551-frqr12ie4oev83mlurp12in7qmfni08l.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
