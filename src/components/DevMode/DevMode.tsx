import { createMemo } from 'solid-js';
import { format } from 'date-fns';
import { Screen } from '../../types/screen';
import styles from './DevMode.module.scss';
import { TestMode } from '../../types/testMode';
import { usePrayerService } from '../../context/usePrayerService';

interface DevModeProps {
}

const DevMode = (props: DevModeProps) => {
  const { setScreen, clear, timingConfig, setTimingConfig, test, setTest } = usePrayerService();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div class={styles.container}>
      <div class={styles.testButtonsContainer}>
        <button class={styles.testButton} onClick={() => setScreen(Screen.EVENT)}>Event</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.PRAYER_TIMES)}>Prayer Times</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.DAILY_VERSE)}>Daily Verse</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.HOURS_BEFORE_ADHAN)}>Adhan</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.IQAMAH)}>Iqamah</button>
        <button class={styles.testButton} onClick={() => setTest(TestMode.TEST_SUBUH)}>Test Subuh</button>
      </div>
    </div>
  );
};

export default DevMode;
