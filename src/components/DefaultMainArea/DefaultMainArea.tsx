import { format } from 'date-fns';
import { ms } from 'date-fns/locale';
import { createMemo } from 'solid-js';
import { toHijri } from "hijri-converter";
import { usePrayerService } from '../../context/usePrayerService';
import styles from './DefaultMainArea.module.scss';
import { AnalogClock } from '../AnalogClock/AnalogClock'
import { getHijriMonthName } from '../../utils/formatter';
import caligraphy from '../../assets/images/white-clock-logo.png'

const DefaultMainArea = () => {
  const { currentTime, timeWarp } = usePrayerService();
  const memoizedCurrentTime = createMemo(() => currentTime());
  const memoizedTimeWarp = createMemo(() => timeWarp());

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
        <div class={styles.caligraphy}>
          <img class={styles.caligraphyImg} src={caligraphy} />
        </div>
        {/* <div class={styles.mosqueName}>Surau <i>De Rozelle</i></div> */}
        <div class={styles.gregorianDate}>
          {format(memoizedCurrentTime(), 'EEEE dd, MMMM yyyy', { locale: ms })}
        </div>
        <div class={styles.hijriDate}>
          {format(memoizedCurrentTime(), 'EEEE', { locale: ms })} {hijri.hd}, {getHijriMonthName(hijri.hm)} {hijri.hy}H
        </div>
      </div>
    </div>
  );
};

export default DefaultMainArea; 