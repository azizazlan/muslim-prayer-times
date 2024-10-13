import { Component, For, createMemo } from 'solid-js';
import { format } from 'date-fns';
import styles from './BottomStrip.module.scss';
import borderImage from '../../assets/images/lantern.png';
import { Prayer } from '../../types/prayer';
import Clock from '../Clock';
import PrayerBox from './PrayerBox';
interface BottomStripProps {
  prayers: Prayer[];
  currentTime: Date;
  isTestMode: boolean;
}

const BottomStrip: Component<BottomStripProps> = (props) => {
  const currentTime = createMemo(() => props.currentTime);
  const prayers = createMemo(() => props.prayers);

  return (
    <div class={styles.container}>
      <div class={styles.topBorder}></div>
      <div class={styles.content}>
        <Clock isTestMode={props.isTestMode} time={currentTime()} />
        <div class={styles.horizontalContainer}>
          <For each={prayers()}>
            {(prayer, index) => (
              <>
                <div class={styles.prayerBoxWrapper}>
                  <PrayerBox prayer={prayer} />
                </div>
                {index() < props.prayers.length - 1 && (
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