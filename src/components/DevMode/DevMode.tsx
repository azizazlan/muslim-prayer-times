import { createMemo } from 'solid-js';
import { format } from 'date-fns';
import { DisplayMode } from '../../types/displaymode';
import styles from './DevMode.module.scss';

interface DevModeProps {
  toggleDisplayMode: (mode: DisplayMode) => void;
  toggleTestSubuh: () => void;
  toggleTestSyuruk: () => void;
  toggleRefetch: () => void;
  lastApiTimestamp: number;
}

const DevMode = (props: DevModeProps) => {

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(timezone); // This will log the system's timezone, e.g., "America/New_York"

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
        <hr />
        <div>Last fetch api timestamp: {lastApiTimestamp()}</div>
        <div>Formatted: {format(lastApiTimestamp() * 1000, 'dd/MM/yyyy')}</div>
      </div>
      <div class={styles.testButtonsContainer}>
        <button class={styles.testButton} onClick={() => props.toggleDisplayMode(DisplayMode.SETTINGS)}>Settings</button>
        <button class={styles.testButton} onClick={() => props.toggleDisplayMode(DisplayMode.PRAYER_TIMES)}>Prayer Times</button>
        <button class={styles.testButton} onClick={() => props.toggleTestSubuh()}>Test Subuh</button>
        <button class={styles.testButton} onClick={() => props.toggleTestSyuruk()}>Test Syuruk</button>
        <button class={styles.testButton} onClick={() => props.toggleRefetch()}>Refetch</button>
      </div>
    </div>
  );
};

export default DevMode;
