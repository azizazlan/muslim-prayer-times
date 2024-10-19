/* @refresh reload */
import { render } from 'solid-js/web';
import { PrayerServiceProvider } from './context/usePrayerService';
import { SettingsServiceProvider } from './context/useSettingsService';

import './index.css';
import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <SettingsServiceProvider>
    <PrayerServiceProvider>
      <App />
    </PrayerServiceProvider>
  </SettingsServiceProvider>
), root!);
