import { Component, For, createMemo, createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { format, addSeconds } from 'date-fns';
import styles from './BottomStrip.module.scss';
import borderImage from '../../assets/images/lantern.png';
import { Prayer } from '../../types/prayer';
import Clock from '../Clock';
import PrayerBox from './PrayerBox';
import { getPrayers } from '../../utils/prayers';
import { TestMode } from '../../types/testMode';
import { usePrayerService } from '../../context/usePrayerService';

interface BottomStripProps {
}

const BottomStrip: Component<BottomStripProps> = (props) => {

  const { currentTime, prayers, test } = usePrayerService();
  const memoizedCurrentTime = createMemo(() => new Date(currentTime()));
  const memoizedPrayers = createMemo(() => prayers());
  const memoizedTest = createMemo(() => test());

  if (memoizedPrayers().length === 0 || !memoizedPrayers()) {
    return <div>Loading...</div>
  }

  return (
    <div class={styles.container}>
      <div class={styles.topBorder}></div>
      <div class={styles.content}>
        <div class={styles.clock}>
          <div>
            {format(memoizedCurrentTime(), 'HH:mm:ss')}
          </div>
          <div>
            {format(memoizedCurrentTime(), 'dd/MM/yyyy')}
          </div>
          <div>
            {memoizedTest()}
          </div>
        </div>
        <div class={styles.horizontalContainer}>
          <Show when={memoizedPrayers().length > 0} fallback="Loading...">
            <For each={memoizedPrayers()}>
              {(prayer, index) => (
                <>
                  <div class={styles.prayerBoxWrapper}>
                    <PrayerBox prayer={prayer} />
                  </div>
                  {index() < prayers().length - 1 && (
                    <div class={styles.borderImageWrapper}>
                      <img src={borderImage} alt="Prayer separator" class={styles.borderImage} />
                    </div>
                  )}
                </>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default BottomStrip;