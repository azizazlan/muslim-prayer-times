import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { Badge, Card } from 'solid-bootstrap';
import styles from './Iqamah.module.scss';
import { Countdown } from '../countdown';
// 720000 MS = 12 mins
const IQAMAH_INTERVAL_MS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MS || '720000', 10);
const IQAMAH_INTERVAL_MS_TEST = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MS_TEST || '3000', 10);
const IS_DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

const INTERVAL_MS = IS_DEV_MODE ? IQAMAH_INTERVAL_MS_TEST : IQAMAH_INTERVAL_MS;

interface IqamahProps {
  initialSeconds: number; // The initial countdown duration in seconds
}

const Iqamah: Component<IqamahProps> = () => {
  const [timeLeft, setTimeLeft] = createSignal(INTERVAL_MS / 1000);

  // Start the countdown immediately when the component mounts
  const interval = setInterval(() => {
    setTimeLeft(prev => {
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
      {timeLeft() === 0 ? <div class={styles.iqamahContainer}><div class={styles.safMessage}>
        LURUSKAN DAN RAPATKAN SAF
      </div></div> :
        <div class={styles.iqamahContainer} style={{ textAlign: 'center' }}>
          <div class={styles.iqamahMessage}>
            IQAMAH SEBENTAR LAGI
          </div>
          <div class={styles.countdown}>
            <Countdown secondsLeft={timeLeft()} />
          </div>
        </div>}
    </div>
  );
};

export default Iqamah;
