import { format } from 'date-fns';
import { ms } from 'date-fns/locale';
import { createMemo, createSignal, onCleanup } from 'solid-js';
import { toHijri } from "hijri-converter";
import { usePrayerService } from '../../context/usePrayerService';
import styles from './DefaultMainArea.module.scss';
import { AnalogClock } from '../AnalogClock/AnalogClock'
import { getHijriMonthName } from '../../utils/formatter';
import caligraphy from '../../assets/images/white-clock-logo.png'

const DefaultDisplay = () => {
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
        <div class={styles.gregorianDay}>
          {format(memoizedCurrentTime(), 'EEEE', { locale: ms })}
        </div>
        <div class={styles.gregorianDate}>
          {format(memoizedCurrentTime(), 'dd, MMM yyyy', { locale: ms })}
        </div>
        <div class={styles.hijriDate}>
          {hijri.hd}, {getHijriMonthName(hijri.hm)} {hijri.hy}
        </div>
      </div>
    </div>
  )
}

const DefaultMainArea = () => {
  return <DefaultDisplay />
};

export default DefaultMainArea; 