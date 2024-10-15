import { createMemo, createSignal, createEffect } from 'solid-js';
import { addSeconds } from 'date-fns';
import { Prayer } from '../../types';
import styles from './PrayerBox.module.scss';
import { PrayerMode } from '../../types/prayer';
import { modeSelector } from '../../utils/prayers';

interface PrayerBoxProps {
  prayer: Prayer;
  currentTime: Date;
  timingConfig: {};
}

const PrayerBox = (props: PrayerBoxProps) => {
  const { prayer, timingConfig } = props;
  const currentTime = createMemo(() => props.currentTime);
  // Create a memoized value for mode that updates when currentTime changes
  const mode = createMemo(() => modeSelector({ prayer, currentTime: currentTime(), timingConfig }));

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