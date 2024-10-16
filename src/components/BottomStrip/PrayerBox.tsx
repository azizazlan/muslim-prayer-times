import { createMemo, createSignal, createEffect } from 'solid-js';
import { addSeconds } from 'date-fns';
import { Prayer } from '../../types';
import styles from './PrayerBox.module.scss';
import { PrayerMode } from '../../types/prayer';
import { modeSelector } from '../../utils/prayers';
import { usePrayerService } from '../../context/usePrayerService';

interface PrayerBoxProps {
  prayer: Prayer;
}

const PrayerBox = (props: PrayerBoxProps) => {
  const { prayer } = props;
  const { currentTime, prayers } = usePrayerService();
  const memoizedPrayers = createMemo(() => prayers())

  if (!prayer) {
    return <div>Loading...</div>
  }

  const mode = createMemo(() => modeSelector({ prayer, prayers: memoizedPrayers(), currentTime: currentTime() }));


  if (mode() === PrayerMode.IMMEDIATE_NEXT) {
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
    <div class={`${styles.container} ${mode() === PrayerMode.ACTIVE ? styles.active : ''}`}>
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