import { createSignal, onCleanup, Component, createMemo } from 'solid-js';
import { format } from 'date-fns';
import styles from './Clock.module.scss';

interface ClockProps {
  time: Date,
  isTestMode: boolean,
}

const Clock: Component<ClockProps> = (props) => {
  const time = createMemo(() => props.time);
  const isTestMode = createMemo(() => props.isTestMode);

  const format24Hour = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEE dd MMM yyyy');
  };

  return (
    <div class={isTestMode() ? styles.testClock : styles.clock}>
      <div class={styles.time}>
        {format24Hour(time())}
      </div>
      <div class={styles.date}>
        {formatDate(time())}
      </div>
    </div>
  );
};

export default Clock;
