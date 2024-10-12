import { createSignal, createMemo, createEffect, onCleanup } from 'solid-js';
import styles from './Countdown.module.scss';

const IQAMAH_INTERVAL_MINS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MINS || '12', 10);

interface CountdownProps {
  secondsLeft: number;
}

const Countdown: Component<CountdownProps> = (props) => {
  const [timeLeft, setTimeLeft] = createSignal(props.secondsLeft);

  createEffect(() => {
    // Update timeLeft when props.secondsLeft changes
    setTimeLeft(props.secondsLeft);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    onCleanup(() => clearInterval(timer));
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: remainingSeconds.toString().padStart(2, '0')
    };
  };

  const formattedTime = createMemo(() => formatTime(timeLeft()));

  if (timeLeft() <= 0) {
    return <div class={styles.container} />;
  }

  return (
    <div class={styles.container}>
      <div class={styles.countdown}>
        <div class={styles.timeUnit}>
          <span class={styles.digits}>{formattedTime().hours}</span>
          <span class={styles.label}>JAM</span>
        </div>
        <span class={styles.separator}>:</span>
        <div class={styles.timeUnit}>
          <span class={styles.digits}>{formattedTime().minutes}</span>
          <span class={styles.label}>MINIT</span>
        </div>
        <span class={styles.separator}>:</span>
        <div class={styles.timeUnit}>
          <span class={styles.digits}>{formattedTime().seconds}</span>
          <span class={styles.label}>SAAT</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
