import { createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import styles from './PrayerTimes.module.scss';
import { usePrayerService } from '../../../contexts/usePrayerService';
import { PrayerName } from '../../../types/prayer'

const PrayerTimes: Component = () => {
  const { prayers, leadPrayer } = usePrayerService();
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
            <td class={leadPrayer()?.name === PrayerName.SUBUH ? styles.wideNext : styles.wide}>{subuh.name}</td>
            <td class={leadPrayer()?.name === PrayerName.SUBUH ? styles.wideTimeNext : styles.wideTime}>{subuh.time}</td>
            <td class={`${styles.narrow} ${styles.decorationSunrise}`}></td>
            <td class={styles.wide}>{syuruk.name}</td>
            <td class={styles.wideTime}>{syuruk.time}</td>
          </tr>
          <tr>
            <td class={leadPrayer()?.name === PrayerName.ZOHOR ? styles.wideNext : styles.wide}>{zohor.name}</td>
            <td class={leadPrayer()?.name === PrayerName.ZOHOR ? styles.wideTimeNext : styles.wideTime}>{zohor.time}</td>
            <td class={`${styles.narrow} ${styles.decorationSun}`}></td>
            <td class={leadPrayer()?.name === PrayerName.ASAR ? styles.wideNext : styles.wide}>{asar.name}</td>
            <td class={leadPrayer()?.name === PrayerName.ASAR ? styles.wideTimeNext : styles.wideTime}>{asar.time}</td>
          </tr>
          <tr>
            <td class={leadPrayer()?.name === PrayerName.MAGHRIB ? styles.wideNext : styles.wide}>{maghrib.name}</td>
            <td class={leadPrayer()?.name === PrayerName.MAGHRIB ? styles.wideTimeNext : styles.wideTime}>{maghrib.time}</td>
            <td class={`${styles.narrow} ${styles.decorationMoon}`}></td>
            <td class={leadPrayer()?.name === PrayerName.ISYAK ? styles.wideNext : styles.wide}>{isyak.name}</td>
            <td class={leadPrayer()?.name === PrayerName.ISYAK ? styles.wideTimeNext : styles.wideTime}>{isyak.time}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrayerTimes;