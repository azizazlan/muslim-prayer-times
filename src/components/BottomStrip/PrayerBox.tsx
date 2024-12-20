import { createMemo, createSignal, createEffect } from 'solid-js';
import { addSeconds } from 'date-fns';
import styles from './PrayerBox.module.scss';
import { PrayerMode, Prayer } from '../../types/prayer';
import { usePrayerService } from '../../contexts/usePrayerService';

interface PrayerBoxProps {
  prayer: Prayer;
}

const PrayerBox = (props: PrayerBoxProps) => {
  const { prayer } = props;
  const { currentTime, prayers } = usePrayerService();
  const memoizedCurrentTime = createMemo(() => currentTime());
  const memoizedPrayers = createMemo(() => prayers())
  const memoizedPrayer = createMemo(() => prayer)

  if (!memoizedPrayer()) return <div>Loading...</div>

  if (memoizedPrayer().mode === PrayerMode.IMMEDIATE_NEXT) {
    return (
      <div class={styles.nextPrayerContainer}>
        <div class={styles.name}>
          {prayer.name}
        </div>
        <div class={styles.time}>
          {prayer.time}
        </div>
      </div>
    );
  }
  return (
    <div class={`${styles.container} ${memoizedPrayer().mode === PrayerMode.ACTIVE ? styles.active : ''}`}>
      <div class={styles.name}>
        {prayer.name}
      </div>
      <div class={styles.time}>
        {prayer.time}
      </div>
    </div>
  );
};

export default PrayerBox;