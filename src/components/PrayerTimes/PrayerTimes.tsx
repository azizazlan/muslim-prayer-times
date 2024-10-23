import { createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import styles from './PrayerTimes.module.scss';
import { Prayer } from '../../types/prayer';
import { usePrayerService } from '../../context/usePrayerService';

interface PrayerTimesProps {
}

const PrayerTimes: Component<PrayerTimesProps> = (props) => {
  const { prayers } = usePrayerService();
  const memoizedPrayers = createMemo(() => prayers());
  const subuh = memoizedPrayers()[0];
  const syuruk = memoizedPrayers()[1];
  const zohor = memoizedPrayers()[2];
  const asar = memoizedPrayers()[3];
  const maghrib = memoizedPrayers()[4];
  const isyak = memoizedPrayers()[5];
  return (
    <div class={styles.container}>
      <table class={styles.table}>
        <tbody>
          <tr>
            <td class={styles.wide}>{subuh.name}</td>
            <td class={styles.wideTime}>{subuh.time}</td>
            <td class={`${styles.narrow} ${styles.decorationSunrise}`}></td>
            <td class={styles.wide}>{syuruk.name}</td>
            <td class={styles.wideTime}>{syuruk.time}</td>
          </tr>
          <tr>
            <td class={styles.wide}>{zohor.name}</td>
            <td class={styles.wideTime}>{zohor.time}</td>
            <td class={`${styles.narrow} ${styles.decorationSun}`}></td>
            <td class={styles.wide}>{asar.name}</td>
            <td class={styles.wideTime}>{asar.time}</td>
          </tr>
          <tr>
            <td class={styles.wide}>{maghrib.name}</td>
            <td class={styles.wideTime}>{maghrib.time}</td>
            <td class={`${styles.narrow} ${styles.decorationMoon}`}></td>
            <td class={styles.wide}>{isyak.name}</td>
            <td class={styles.wideTime}>{isyak.time}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrayerTimes;