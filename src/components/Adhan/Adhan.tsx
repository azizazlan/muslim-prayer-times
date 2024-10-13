import { Component, createMemo, createEffect } from 'solid-js';
import { differenceInSeconds, parse } from 'date-fns';
import styles from './Adhan.module.scss';
import PrayersCards from '../prayers/PrayersCards';
import { Countdown } from '../countdown';

interface AdhanProps {
  leadPrayer: Prayer;
  currentTime: Date;
}

const Adhan: Component<AdhanProps> = (props) => {
  const currentTime = createMemo(() => props.currentTime);
  const leadPrayer = createMemo(() => props.leadPrayer);

  const secondsLeft = createMemo(() => {
    const leadPrayerTime = parse(leadPrayer().time, 'HH:mm', currentTime());
    return differenceInSeconds(leadPrayerTime, currentTime());
  });

  createEffect(() => {
    //console.log(`secondsLeft: ${secondsLeft()}`);
    secondsLeft();
  });

  return (
    <div class={styles.container}>
      <div class={styles.message}>
        ADHAN {leadPrayer().name.toUpperCase()} {secondsLeft() < 3601 && secondsLeft() > 0 ? 'SEBENTAR LAGI' : ''}
      </div>
      <div class={styles.countdown}>
        <Countdown secondsLeft={secondsLeft()} />
      </div>
    </div>
  );
};

export default Adhan;
