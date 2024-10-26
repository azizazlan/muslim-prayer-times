import { Component, For, createMemo, createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { format, addSeconds } from 'date-fns';
import { ms } from 'date-fns/locale';
import styles from './BottomStrip.module.scss';
import borderImage from '../../assets/images/lantern.png';
import { Prayer } from '../../types/prayer';
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
      <div class={styles.clock}>
        <div class={styles.clockTime}>
          {format(memoizedCurrentTime(), 'HH')}
          <span class={styles.blinkingSeparator}>:</span>
          {format(memoizedCurrentTime(), 'mm')}
        </div>
        <div class={styles.clockDate}>
          {format(memoizedCurrentTime(), 'EEEE dd MMM yyyy', { locale: ms })}
        </div>
      </div>
      <div class={styles.prayerBoxesContainer}>
        <For each={memoizedPrayers()}>
          {(prayer, index) => (
            <PrayerBox prayer={prayer} />
          )}
        </For>
      </div>
    </div>
  );
};

export default BottomStrip;