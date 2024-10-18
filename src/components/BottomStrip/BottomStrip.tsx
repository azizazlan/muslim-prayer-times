import { Component, For, createMemo, createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { format, addSeconds } from 'date-fns';
import styles from './BottomStrip.module.scss';
import borderImage from '../../assets/images/lantern.png';
import { Prayer } from '../../types/prayer';
import Clock from '../Clock/Clock';
import PrayerBox from './PrayerBox';
import { TestMode } from '../../types/testMode';
import { usePrayerService } from '../../context/usePrayerService';

interface BottomStripProps {
}

const BottomStrip: Component<BottomStripProps> = (props) => {

  const { currentTime, prayers, test } = usePrayerService();
  const memoizedCurrentTime = createMemo(() => new Date(currentTime()));
  const memoizedPrayers = createMemo(() => prayers());
  const memoizedTest = createMemo(() => test());

  createEffect(() => {
    memoizedCurrentTime();
    memoizedPrayers();
    memoizedTest();
  });

  return (
    <div class={styles.container}>
      <div class={styles.topBorder}></div>
      <div class={styles.content}>
        <div class={styles.clock}>
          <div class={styles.clockTime}>
            {format(memoizedCurrentTime(), 'HH')}
            <span class={styles.blinkingSeparator}>:</span>
            {format(memoizedCurrentTime(), 'mm')}
          </div>
          <div class={styles.clockDate}>
            {format(memoizedCurrentTime(), 'dd.MM.yyyy')}
          </div>
        </div>
        <div class={styles.horizontalContainer}>
          <For each={memoizedPrayers()}>
            {(prayer, index) => (
              <>
                <div class={styles.prayerBoxWrapper}>
                  <PrayerBox prayer={prayer} />
                </div>
                {/* {index() < prayers().length - 1 && (
                  <div class={styles.borderImageWrapper}>
                    <img src={borderImage} alt="Prayer separator" class={styles.borderImage} />
                  </div>
                )} */}
              </>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default BottomStrip;