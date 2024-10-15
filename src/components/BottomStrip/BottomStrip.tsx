import { Component, For, createMemo, createEffect, createSignal, onCleanup } from 'solid-js';
import { format, addSeconds } from 'date-fns';
import styles from './BottomStrip.module.scss';
import borderImage from '../../assets/images/lantern.png';
import { Prayer } from '../../types/prayer';
import Clock from '../Clock';
import PrayerBox from './PrayerBox';
import { getPrayers } from '../../utils/prayers';
import { TestMode } from '../../types/testMode';

interface BottomStripProps {
  currentTime: Date;
  timingConfig: {};
  testMode: TestMode;
}

const BottomStrip: Component<BottomStripProps> = (props) => {
  const timingConfig = createMemo(() => props.timingConfig);

  const prayers = createMemo(() => getPrayers({ currentTime: props.currentTime, timingConfig }));


  return (
    <div class={styles.container}>
      <div class={styles.topBorder}></div>
      <div class={styles.content}>
        {props.testMode} <br />
        {`${props.currentTime}`}
        <div class={styles.horizontalContainer}>
          <For each={prayers()}>
            {(prayer, index) => (
              <>
                <div class={styles.prayerBoxWrapper}>
                  <PrayerBox currentTime={props.currentTime} prayer={prayer} timingConfig={timingConfig()} />
                </div>
                {index() < prayers.length - 1 && (
                  <div class={styles.borderImageWrapper}>
                    <img src={borderImage} alt="Prayer separator" class={styles.borderImage} />
                  </div>
                )}
              </>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default BottomStrip;