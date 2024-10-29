import { createMemo } from 'solid-js';
import { format } from 'date-fns';
import styles from './Developer.module.scss';
import { usePrayerService } from '../../../context/usePrayerService';
import { Screen } from '../../../types/screen'
import { TestMode } from '../../../types/testMode';

// Developer screen
const Developer = () => {
  const { setScreen, clear, timingConfig, setTimingConfig, test, setTest } = usePrayerService();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div class={styles.container}>
      <div class={styles.testButtonsContainer}>
        <button class={styles.testButton} onClick={() => setScreen(Screen.DEFAULT)}>Default</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.DAILY_VERSE)}>Daily Verse</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.DAILY_HADITH)}>Daily Hadith</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.NOTICE)}>Notice</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.PRAYER_TIMES)}>Prayer Times</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.HOURS_BEFORE_ADHAN)}>Adhan</button>
        <button class={styles.testButton} onClick={() => setScreen(Screen.IQAMAH)}>Iqamah</button>
        <button class={styles.testButton} onClick={() => setTest(TestMode.TEST_SUBUH)}>Test Subuh</button>
      </div>
    </div>
  );
};

export default Developer;
