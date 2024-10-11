import { createMemo } from 'solid-js';
import { Prayer } from '../../types';
import styles from './PrayerBox.module.scss';
import { PrayerMode } from '../../types/prayermode';

interface PrayerBoxProps {
  prayer: Prayer;
}

const PrayerBox = (props: PrayerBoxProps) => {
  const prayer = createMemo(() => props.prayer);

  if (prayer().mode === PrayerMode.IMMEDIATE_NEXT) {
    return (
      <div class={styles.nextPrayerContainer}>
        <div class={styles.name}>
          {prayer().name}
        </div>
        <div class={styles.time}>
          {prayer().time}
        </div>
      </div>
    );
  }
  return (
    <div class={`${styles.container} ${prayer().mode === PrayerMode.ACTIVE ? styles.active : ''}`}>
      <div class={styles.name}>
        {prayer().name}
      </div>
      <div class={styles.time}>
        {prayer().time}
      </div>
    </div>
  );
};

export default PrayerBox;