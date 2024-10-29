import { format } from 'date-fns';
import { ms } from 'date-fns/locale';
import { createMemo, createSignal, onCleanup } from 'solid-js';
import { toHijri } from "hijri-converter";
import { usePrayerService } from '../../../context/usePrayerService';
import styles from './Default.module.scss';
import { getHijriMonthName } from '../../../utils/formatter';

// Default screen
const Default = () => {
  const { currentTime } = usePrayerService();
  const memoizedCurrentTime = createMemo(() => currentTime());

  const format24Hour = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const day = createMemo(() => memoizedCurrentTime().getDate()); // Day of the month
  const month = createMemo(() => memoizedCurrentTime().getMonth() + 1); // Month (0-11, so add 1)
  const year = createMemo(() => memoizedCurrentTime().getFullYear()); // Year
  const hijri = toHijri(year(), month(), day());

  return (
    <div class={styles.container}>
      <div class={styles.clockContainer}>
        <div>{format(memoizedCurrentTime(), 'HH')}</div>
        <div class={styles.blinkingSeparator}>:</div>
        <div>{format(memoizedCurrentTime(), 'mm')}</div>
      </div>
      <div class={styles.dateContainer}>
        <div class={styles.gregorianDate}>
          {format(memoizedCurrentTime(), 'EEEE, dd MMM yyyy', { locale: ms })}
        </div>
        <div class={styles.hijriDate}>
          {format(memoizedCurrentTime(), 'EEEE', { locale: ms })} {hijri.hd}, {getHijriMonthName(hijri.hm)} {hijri.hy}
        </div>
      </div>
    </div>
  )
}
export default Default; 