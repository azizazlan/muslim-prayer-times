import { Component } from 'solid-js/types'
import { usePrayerService } from '../../context/usePrayerService';
import { Screen } from '../../types/screen';
import { TestMode } from '../../types/testMode';
import styles from './TopToolbar.module.scss';

const VERSION = import.meta.env.VITE_APP_VERSION;
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

const TopToolbar: Component = () => {

  const { setScreen, setTest } = usePrayerService();

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div class={styles.topButtons}>
      <button class={styles.btnDev} onClick={() => setScreen(Screen.DEFAULT)}>Home</button>
      <button class={styles.btnDev} onClick={() => setScreen(Screen.SETTINGS)}>Settings</button>
      <button class={styles.btnDev} onClick={() => handleReload()}>Reload</button>
      <button class={styles.btnDev} onClick={() => setTest(TestMode.TEST_SUBUH)}>T.Subuh</button>
      {/* <button class={styles.btnDev} onClick={() => setScreen(Screen.DEV)}>Dev</button> */}
      <div class={styles.version}>Ver.{VERSION} ({DEV_MODE ? <button class={styles.btnDev} onClick={() => setScreen(Screen.DEV)}>Dev</button> : "R"})</div>
    </div>
  )
}
export default TopToolbar;