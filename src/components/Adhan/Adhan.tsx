import { Component, createMemo, createEffect } from 'solid-js';
import styles from './Adhan.module.scss';
import Countdown from '../Countdown/Countdown';
import { usePrayerService } from '../../context/usePrayerService';


const Adhan: Component = () => {
  const { leadPrayer, secsUntilNextPrayer } = usePrayerService();

  return (
    <div class={styles.container}>
      <div class={styles.message}>
        ADHAN {leadPrayer()?.name.toUpperCase()} {secsUntilNextPrayer() < 3601 && secsUntilNextPrayer() > 0 ? 'SEBENTAR LAGI' : ''}
      </div>
      <div class={styles.countdown}>
        <Countdown secondsLeft={secsUntilNextPrayer()} />
      </div>
    </div>
  );
};

export default Adhan;
