import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import styles from './Iqamah.module.scss';
import Countdown from '../Countdown/Countdown';
import { useSettingsService } from '../../context/useSettingsService';

interface IqamahProps {
}

const Iqamah: Component<IqamahProps> = () => {
  const { iqamahIntervalMins } = useSettingsService();
  const [secondsLeft, setSecondsLeft] = createSignal(iqamahIntervalMins() * 60);

  // Start the countdown immediately when the component mounts
  const interval = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 0) {
        clearInterval(interval); // Clear the interval when countdown reaches 0
        return 0;
      }
      return prev - 1; // Decrease timeLeft by 1 second
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
