import { createMemo } from 'solid-js';
import { format } from 'date-fns';
import { DisplayMode } from '../../types/displaymode';
import styles from './DevMode.module.scss';
import { TestMode } from '../../types/testMode';
import { usePrayerService } from '../../context/usePrayerService';

interface DevModeProps {
  toggleDisplayMode: (mode: DisplayMode) => void;
  toggleTest: () => void;
}

const DevMode = (props: DevModeProps) => {
  const { clear, timingConfig, setTimingConfig } = usePrayerService();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const toggleTestContext = () => {
    setTimingConfig(
      { "fajr": 7.7, "dhuhr": 1.2, "maghrib": 1.1, "isha": 18.3 }
    );
  }

  const lastApiTimestamp = createMemo(() => props.lastApiTimestamp);
  return (
    <div class={styles.container}>
      <div class={styles.paramsContainer}>
        <h4>Production params</h4>
        <div>System's timezone {timezone}</div>
        <div>VITE_ADHAN_LEAD_MINS: {import.meta.env.VITE_ADHAN_LEAD_MINS}</div>
        <div>VITE_IQAMAH_INTERVAL_MS: {import.meta.env.VITE_IQAMAH_INTERVAL_MS}
          ({parseFloat(import.meta.env.VITE_IQAMAH_INTERVAL_MS) / (1000 * 60)} mins)</div>
        <hr />
        <h4>Dev params</h4>
        <div>VITE_ADHAN_LEAD_MINS_TEST: {import.meta.env.VITE_ADHAN_LEAD_MINS_TEST}</div>
        <div>VITE_IQAMAH_INTERVAL_MS_TEST: {import.meta.env.VITE_IQAMAH_INTERVAL_MS_TEST}
          ({parseFloat(import.meta.env.VITE_IQAMAH_INTERVAL_MS_TEST) / 1000} secs)
        </div>
        <div>VITE_LATITUDE: {import.meta.env.VITE_LATITUDE}</div>
        <div>VITE_LONGTITUDE: {import.meta.env.VITE_LONGITUDE}</div>
        <div>
          {JSON.stringify(timingConfig())}
        </div>
      </div>
      <div class={styles.testButtonsContainer}>
        <button class={styles.testButton} onClick={() => props.toggleDisplayMode(DisplayMode.SETTINGS)}>Settings</button>
        <button class={styles.testButton} onClick={() => props.toggleDisplayMode(DisplayMode.PRAYER_TIMES)}>Prayer Times</button>
        <button class={styles.testButton} onClick={() => props.toggleTest(TestMode.TEST_SUBUH)}>Test Subuh</button>
        <button class={styles.testButton} onClick={() => props.toggleTest(TestMode.TEST_SYURUK)}>Test Syuruk</button>
        <button class={styles.testButton} onClick={() => toggleTestContext()}>Test Context</button>
      </div>
    </div>
  );
};

export default DevMode;
