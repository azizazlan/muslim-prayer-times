import { Component, createMemo, createEffect } from 'solid-js';
import { differenceInSeconds, parse } from 'date-fns';
import styles from './Adhan.module.scss';
import PrayersCards from '../prayers/PrayersCards';
import { Countdown } from '../countdown';
import { getLeadPrayer } from '../../utils/prayers';

interface AdhanProps {
  currentTime: Date;
  timingConfig: {};
}

const Adhan: Component<AdhanProps> = (props) => {
  const { currentTime, timingConfig } = props;
  const leadPrayer = getLeadPrayer({ currentTime, timingConfig });

  const secondsLeft = createMemo(() => {
    const leadPrayerTime = parse(leadPrayer.time, 'HH:mm', props.currentTime);
    const secs = differenceInSeconds(leadPrayerTime, props.currentTime);
    if (secs > -1) return secs;
    else return 0;
  });

  return (
    <div class={styles.container}>
      <div class={styles.message}>
        {/* ADHAN {leadPrayer().name.toUpperCase()} {secondsLeft() < 3601 && secondsLeft() > 0 ? 'SEBENTAR LAGI' : ''} */}
        ADHAN {leadPrayer.name.toUpperCase()}
      </div>
      <div class={styles.countdown}>
        {/* <Countdown secondsLeft={secondsLeft()} /> */}
        countdown {secondsLeft()}
      </div>
    </div>
  );
};

export default Adhan;
