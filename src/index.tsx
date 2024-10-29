/* @refresh reload */
import { render } from 'solid-js/web';
import { PrayerServiceProvider } from './contexts/usePrayerService';
import { SettingsServiceProvider } from './contexts/useSettingsService';
import { ThemeServiceProvider } from './contexts/useThemeService';
import { DailyVerseServiceProvider } from './contexts/useDailyVerseService';
import { NoticeServiceProvider } from './contexts/useNoticeService';
import { DailyHadithServiceProvider } from './contexts/useDailyHadithService';

import './index.scss';
import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <SettingsServiceProvider>
    <NoticeServiceProvider>
      <DailyVerseServiceProvider>
        <DailyHadithServiceProvider>
          <PrayerServiceProvider>
            <ThemeServiceProvider>
              <App />
            </ThemeServiceProvider>
          </PrayerServiceProvider>
        </DailyHadithServiceProvider>
      </DailyVerseServiceProvider>
    </NoticeServiceProvider>
  </SettingsServiceProvider>
), root!);
