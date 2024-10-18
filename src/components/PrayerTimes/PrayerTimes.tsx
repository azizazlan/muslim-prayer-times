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
      <div class={styles.rowContainer}>
        <div class={styles.prayerName}>{subuh.name}</div>
        <div class={styles.prayerTime}>{subuh.time}</div>
        <div class={styles.decorationSunrise}></div>
        <div class={styles.prayerName}>{syuruk.name}</div>
        <div class={styles.prayerTime}>{syuruk.time}</div>
      </div>
      <div class={styles.rowContainer}>
        <div class={styles.prayerName}>{zohor.name}</div>
        <div class={styles.prayerTime}>{zohor.time}</div>
        <div class={styles.decorationSun}></div>
        <div class={styles.prayerName}>{asar.name}</div>
        <div class={styles.prayerTime}>{asar.time}</div>
      </div>
      <div class={styles.rowContainer}>
        <div class={styles.prayerName}>{maghrib.name}</div>
        <div class={styles.prayerTime}>{maghrib.time}</div>
        <div class={styles.decorationMoon}></div>
        <div class={styles.prayerName}>{isyak.name}</div>
        <div class={styles.prayerTime}>{isyak.time}</div>
      </div>
    </div>
  );
};

export default PrayerTimes;