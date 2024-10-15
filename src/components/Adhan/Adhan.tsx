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
    if (leadPrayer) {
      const leadPrayerTime = parse(leadPrayer.time, 'HH:mm', props.currentTime);
      const secs = differenceInSeconds(leadPrayerTime, props.currentTime);
      if (secs > -1) return secs;
      else return 0;
    }
  });

  if (!leadPrayer) {
    return <div>display iqamah</div>
  }

  if (secondsLeft() === 0 || !leadPrayer) {
    return (
      <div class={styles.container}>
        <div class={styles.message}>
          IQAMAH
        </div>
        <div class={styles.countdown}>
          <Countdown secondsLeft={15} />
        </div>
      </div>
    )
  }

  return (
    <div class={styles.container}>
      <div class={styles.message}>
        ADHAN {leadPrayer.name.toUpperCase()} {secondsLeft() < 3601 && secondsLeft() > 0 ? 'SEBENTAR LAGI' : ''}
      </div>
      <div class={styles.countdown}>
        <Countdown secondsLeft={secondsLeft()} />
      </div>
    </div>
  );
};

export default Adhan;
