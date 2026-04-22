import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Capacitor core
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';

// Initialize Capacitor plugins
const initCapacitor = async () => {
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#06060f' });
  } catch (e) {
    // Not running in Capacitor (web browser)
  }

  try {
    await SplashScreen.hide({ fadeOutDuration: 500 });
  } catch (e) {}

  try {
    Keyboard.setAccessoryBarVisible({ isVisible: false });
  } catch (e) {}

  // Handle Android back button
  try {
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapApp.exitApp();
      } else {
        window.history.back();
      }
    });
  } catch (e) {}
};

initCapacitor();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
