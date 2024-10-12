import type { Component } from 'solid-js';
import styles from './PrayerTimes.module.scss';
import { Prayer } from '../../types/prayer';

interface PrayerTimesProps {
  prayers: Prayer[];
}

const PrayerTimes: Component<PrayerTimesProps> = (props) => {
  return (
    <div class={styles.container}>
      <div class={styles.rowContainer}>
        <div class={styles.prayerName}>{props.prayers[0].name}</div>
        <div class={styles.prayerTime}>{props.prayers[0].time}</div>
        <div class={styles.decorationSun}></div>
        <div class={styles.prayerName}>{props.prayers[1].name}</div>
        <div class={styles.prayerTime}>{props.prayers[1].time}</div>
      </div>
      <div class={styles.rowContainer}>
        <div class={styles.prayerName}>{props.prayers[2].name}</div>
        <div class={styles.prayerTime}>{props.prayers[2].time}</div>
        <div class={styles.emptyDecoration}></div>
        <div class={styles.prayerName}>{props.prayers[3].name}</div>
        <div class={styles.prayerTime}>{props.prayers[3].time}</div>
      </div>
      <div class={styles.rowContainer}>
        <div class={styles.prayerName}>{props.prayers[4].name}</div>
        <div class={styles.prayerTime}>{props.prayers[4].time}</div>
        <div class={styles.decoration}></div>
        <div class={styles.prayerName}>{props.prayers[5].name}</div>
        <div class={styles.prayerTime}>{props.prayers[5].time}</div>
      </div>
    </div>
  );
};

export default PrayerTimes;