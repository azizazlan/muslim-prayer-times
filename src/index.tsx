/* @refresh reload */
import { render } from 'solid-js/web';
import { PrayerServiceProvider } from './context/usePrayerService';
import { SettingsServiceProvider } from './context/useSettingsService';
import { ThemeServiceProvider } from './context/useThemeService';

import './index.scss';
import App from './App';
import { DailyVerseServiceProvider } from './context/useDailyVerseService';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <SettingsServiceProvider>
    <DailyVerseServiceProvider>
      <PrayerServiceProvider>
        <ThemeServiceProvider>
          <App />
        </ThemeServiceProvider>
      </PrayerServiceProvider>
    </DailyVerseServiceProvider>
  </SettingsServiceProvider>
), root!);
