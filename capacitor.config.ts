import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stockiq.analyzer',
  appName: 'StockIQ',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['api.anthropic.com']
  },
  android: {
    minSdkVersion: 24,
    targetSdkVersion: 34,
    buildToolsVersion: '34.0.0',
    allowMixedContent: true,
    backgroundColor: '#06060f',
    useLegacyBridge: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#06060f',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#00ffcc',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#06060f',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
};

export default config;
