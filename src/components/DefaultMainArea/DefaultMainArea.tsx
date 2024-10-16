import { createMemo } from 'solid-js';
import { usePrayerService } from '../../context/usePrayerService';
import styles from './DefaultMainArea.module.scss';

const DefaultMainArea = () => {
  const { currentTime } = usePrayerService();
  const memoizedCurrentTime = createMemo(() => currentTime());
  return (
    <div class={styles.container}>
      <div>Default Main Area</div>
      <div>
        {JSON.stringify(memoizedCurrentTime())}
      </div>
    </div>
  );
};

export default DefaultMainArea; 