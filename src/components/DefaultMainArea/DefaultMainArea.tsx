import { format } from 'date-fns';
import { createMemo } from 'solid-js';
import { toHijri } from "hijri-converter";
import { usePrayerService } from '../../context/usePrayerService';
import styles from './DefaultMainArea.module.scss';
import { AnalogClock } from '../AnalogClock/AnalogClock'

const DefaultMainArea = () => {
  const { currentTime } = usePrayerService();
  const memoizedCurrentTime = createMemo(() => currentTime());

  // Extract day, month, and year
  const day = createMemo(() => memoizedCurrentTime().getDate()); // Day of the month
  const month = createMemo(() => memoizedCurrentTime().getMonth() + 1); // Month (0-11, so add 1)
  const year = createMemo(() => memoizedCurrentTime().getFullYear()); // Year
  const hijri = toHijri(year(), month(), day());
  return (
    <div class={styles.container}>
      <div>
        <AnalogClock />
      </div>
      <div class={styles.dateContainer}>
        <div class={styles.gregorianDate}>
          {format(memoizedCurrentTime(), 'EEE dd, MMMM yyyy')}
        </div>
        <div class={styles.hijriDate}>
          {hijri.hd}-{hijri.hm}-{hijri.hy}H
        </div>
      </div>
    </div>
  );
};

export default DefaultMainArea; 