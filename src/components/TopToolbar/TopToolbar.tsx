import { Component } from 'solid-js/types'
import { usePrayerService } from '../../context/usePrayerService';
import { useSettingsService } from '../../context/useSettingsService';
import { useDailyVerseService } from '../../context/useDailyVerseService';
import { Screen } from '../../types/screen';
import { TestMode } from '../../types/testMode';
import styles from './TopToolbar.module.scss';

const VERSION = import.meta.env.VITE_APP_VERSION;
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

type TopToolbarProps = {
  toggleFullScreen: () => void;
}

const TopToolbar: Component<TopToolbarProps> = (props: TopToolbarProps) => {

  const { isOnline } = useDailyVerseService();
  const { mosqueName, latitude, longitude, locationName } = useSettingsService();
  const { setScreen, setTest } = usePrayerService();

  const homeTitle = `${mosqueName()}, ${locationName()} LAT:${latitude().toString()} LNG:${longitude().toString()}`;

  return (
    <div class={styles.container}>
      <div>{homeTitle} {isOnline() ? <span>ONLINE</span> : null}</div>
      <div class={styles.topButtons}>
        <button class={styles.btnDev} onClick={() => setScreen(Screen.DEFAULT)}>Home</button>
        <button class={styles.btnDev} onClick={() => setScreen(Screen.SETTINGS)}>Settings</button>
        <button class={styles.btnDev} onClick={() => props.toggleFullScreen()}>Fullscreen</button>
        <div class={styles.version}>Ver. {VERSION} {DEV_MODE ?
          (
            <div>
              <button class={styles.btnDev} onClick={() => setScreen(Screen.DEVELOPER)}>Developer</button>
              <button class={styles.btnDev} onClick={() => setTest(TestMode.TEST_SUBUH)}>T.Subuh</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
export default TopToolbar;