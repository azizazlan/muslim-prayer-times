import { createSignal, createMemo, createEffect, onCleanup } from 'solid-js';
import { format } from 'date-fns';
import styles from './Countdown.module.scss';

const IQAMAH_INTERVAL_MINS = parseInt(import.meta.env.VITE_IQAMAH_INTERVAL_MINS || '12', 10);

interface CountdownProps {
  secondsLeft: number;
}

const Countdown: Component<CountdownProps> = (props) => {
  const secondsLeft = createMemo(() => props.secondsLeft);
  const [timeLeft, setTimeLeft] = createSignal(secondsLeft());

  createEffect(() => {
    // Update timeLeft when secondsLeft changes
    setTimeLeft(secondsLeft());

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

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (timeLeft() <= 0) {
    return (
      <div class={styles.container} />
    );
  }

  return (
    <div class={styles.container}>
      <div class={styles.countdown}>
        {formatTime(timeLeft())}
      </div>
    </div>
  );
};

export default Countdown;
