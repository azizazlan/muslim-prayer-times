import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import styles from './Iqamah.module.scss';
import Countdown from '../../Countdown/Countdown';
import { useSettingsService } from '../../../contexts/useSettingsService';


const Iqamah: Component = () => {
  const { iqamahIntervalMins } = useSettingsService();
  const [secondsLeft, setSecondsLeft] = createSignal(iqamahIntervalMins() * 60);

  const interval = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 0) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  onCleanup(() => clearInterval(interval));

  return (
    <div class={styles.container}>
      {secondsLeft() === 0 ? <div class={styles.iqamahContainer}><div class={styles.safMessage}>
        LURUS DAN RAPATKAN SAF
      </div></div> :
        <div class={styles.iqamahContainer}>
          <div class={styles.iqamahMessage}>
            IQAMAH
          </div>
          <div class={styles.countdown}>
            <Countdown secondsLeft={secondsLeft()} />
          </div>
        </div>}
    </div>
  );
};

export default Iqamah;
