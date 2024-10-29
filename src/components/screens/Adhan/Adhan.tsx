import { Component, createMemo, createEffect } from 'solid-js';
import styles from './Adhan.module.scss';
import Countdown from '../../Countdown/Countdown';
import { usePrayerService } from '../../../contexts/usePrayerService';

const ADHAN_LEAD_MINS = parseInt(import.meta.env.VITE_ADHAN_LEAD_MINS || '15', 10);

const Adhan: Component = () => {
  const { leadPrayer, secsUntilNextPrayer } = usePrayerService();

  return (
    <div class={styles.container}>
      <div class={styles.message}>
        AZAN {leadPrayer()?.name.toUpperCase()}
      </div>
      <div class={styles.countdown}>
        <Countdown secondsLeft={secsUntilNextPrayer()} />
      </div>
    </div>
  );
};

export default Adhan;
