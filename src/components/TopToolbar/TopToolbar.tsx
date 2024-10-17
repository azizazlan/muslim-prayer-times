import { usePrayerService } from '../../context/usePrayerService';
import { Screen } from '../../types/screen';
import { TestMode } from '../../types/testMode';
import styles from './TopToolbar.module.scss';

const TopToolbar: Component = () => {

  const { setScreen, setTest } = usePrayerService();

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div class={styles.topButtons}>
      <button class={styles.btnDev} onClick={() => setScreen(Screen.DEFAULT)}>Home</button>
      <button class={styles.btnDev} onClick={() => handleReload()}>Reload</button>
      <button class={styles.btnDev} onClick={() => setTest(TestMode.TEST_SUBUH)}>Test Subuh</button>
      <button class={styles.btnDev} onClick={() => setScreen(Screen.DEV)}>Dev</button>
      <div class={styles.version}>Ver 1.0.0</div>
    </div>
  )
}
export default TopToolbar;